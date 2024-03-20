"use strict";

const crypto = require("crypto");
const _ = require("lodash");
const utils = require("../../../node_modules/@strapi/utils");
const { getService } = require("../../../node_modules/@strapi/plugin-users-permissions/server/utils");
const { validateForgotPasswordBody } = require("../../../node_modules/@strapi/plugin-users-permissions/server/controllers/validation/auth");

const { getAbsoluteAdminUrl, getAbsoluteServerUrl, sanitize } = utils;
const { rateLimit } = require("express-rate-limit");
const { errors } = require("@strapi/utils");
const { formatError } = require("graphql");
const { PolicyError } = errors;

const fiveReqLimits = rateLimit({
  windowMs: 24 * 60 * 60 * 1000, // 1 day,
  max: 1, // 5 requests,
  // get ip address of user since it is required
  message: "Too many requests, please try again later.",
  statusCode: 429, // 429 status = Too Many Requests (RFC 6585)
  headers: true, //Send custom rate limit header with limit and remaining
  skipFailedRequests: false, // Do not count failed requests (status >= 400)
  skipSuccessfulRequests: false, // Do not count successful requests (status < 400)
  // allows to create custom keys (by default user IP is used)
  keyGenerator: (request, response) => {
    return request.ip;
  },
  handler: async (request, response, next) => {
    const ctx = strapi.requestContext.get();

    throw new PolicyError("You have exhausted your 5 requests for the day. Please check back tomorrow.");
    // console.log("xdxddxxdxddxdxxdxddxxddxddx");

    // ctx.status = 403;

    // ctx.body = {
    //   message: "You have exhausted your 5 requests for the day. Please check back tomorrow.",
    //   policy: "rate-limit",
    // };
  },
});
module.exports = (plugin) => {
  const sanitizeOutput = (user) => {
    const { password, resetPasswordToken, confirmationToken, ...sanitizedUser } = user; // be careful, you need to omit other private attributes yourself
    return sanitizedUser;
  };

  plugin.controllers.user.me = async (ctx) => {
    if (!ctx.state.user) {
      return ctx.unauthorized();
    }
    const user = await strapi.entityService.findOne("plugin::users-permissions.user", ctx.state.user.id, { populate: ["current_world"] });
    const { toEntityResponse } = strapi.plugin("graphql").service("format").returnTypes;

    ctx.body = sanitizeOutput({
      ...user,
      current_world: {
        data: {
          id: user.current_world.id,
          attributes: user.current_world,
        },
      },
    });
  };

  plugin.controllers.user.find = async (ctx) => {
    const users = await strapi.entityService.findMany("plugin::users-permissions.user", { ...ctx.params, populate: ["current_world"] });

    ctx.body = users.map((user) => sanitizeOutput(user));
  };

  plugin.policies["rate-limit"] = async (ctx) => {
    const ip = ctx.request.ip;
    fiveReqLimits(ctx.req, ctx.res, (error) => {
      console.log(error);
      if (error) {
        console.log("Error:", error);
        ctx.status = 500;
        ctx.body = { error: error.message };
      }
    });
  };

  plugin.routes["content-api"].routes.unshift({
    method: "POST",
    path: "/auth/forgot-password-mobile",
    handler: "auth.forgotPasswordMobile",
    config: {
      middlewares: ["plugin::crefinex.rateLimit"],
      prefix: "",
    },
  });
  plugin.controllers.auth.forgotPasswordMobile = async (ctx) => {
    const { email } = await validateForgotPasswordBody(ctx.request.body);
    const pluginStore = await strapi.store({
      type: "plugin",
      name: "users-permissions",
    });
    const emailSettings = await pluginStore.get({ key: "email" });
    const advancedSettings = await pluginStore.get({ key: "advanced" });

    // Find the user by email.
    const user = await strapi.query("plugin::users-permissions.user").findOne({ where: { email: email.toLowerCase() } });

    if (!user || user.blocked) {
      return ctx.send({ ok: true });
    }
    const ip = ctx.request.ip;

    console.log("start custom controller2");
    // Generate random token.
    const userInfo = sanitizeOutput(user);

    const resetPasswordToken = crypto.randomInt(100000, 999999).toString(); //crypto.randomBytes(3).toString("hex");

    const resetPasswordSettings = _.get(emailSettings, "reset_password.options", {});
    const emailBody = await getService("users-permissions").template(resetPasswordSettings.message, {
      URL: advancedSettings.email_reset_password,
      SERVER_URL: getAbsoluteServerUrl(strapi.config),
      ADMIN_URL: getAbsoluteAdminUrl(strapi.config),
      USER: userInfo,
      TOKEN: resetPasswordToken,
    });

    const emailObject = await getService("users-permissions").template(resetPasswordSettings.object, {
      USER: userInfo,
    });

    const emailToSend = {
      to: user.email,
      from:
        resetPasswordSettings.from.email || resetPasswordSettings.from.name
          ? `${resetPasswordSettings.from.name} <${resetPasswordSettings.from.email}>`
          : undefined,
      replyTo: resetPasswordSettings.response_email,
      subject: emailObject,
      text: emailBody,
      html: emailBody,
    };

    // NOTE: Update the user before sending the email so an Admin can generate the link if the email fails
    await getService("user").edit(user.id, { resetPasswordToken });

    // Send an email to the user.
    await strapi.plugin("email").service("email").send(emailToSend);

    ctx.send({ ok: true });
  };

  return plugin;
};
