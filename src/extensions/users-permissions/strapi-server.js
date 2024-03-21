"use strict";

const crypto = require("crypto");
const _ = require("lodash");
const utils = require("../../../node_modules/@strapi/utils");
const { getService } = require("../../../node_modules/@strapi/plugin-users-permissions/server/utils");
const { validateForgotPasswordBody } = require("../../../node_modules/@strapi/plugin-users-permissions/server/controllers/validation/auth");

const { getAbsoluteAdminUrl, getAbsoluteServerUrl } = utils;

module.exports = (plugin) => {
  /**
   * Sanitizes sensitive user data before sending it to the client.
   * @param {Object} user - User object containing sensitive data.
   * @returns {Object} - Sanitized user object.
   */
  const sanitizeOutput = (user) => {
    const { password, resetPasswordToken, confirmationToken, ...sanitizedUser } = user;
    return sanitizedUser;
  };

  /**
   * Controller for fetching the current user's information.
   * This custom controller was created to support the current_world field.
   * @param {Object} ctx - Koa context object.
   */
  plugin.controllers.user.me = async (ctx) => {
    if (!ctx.state.user) {
      return ctx.unauthorized();
    }
    const user = await strapi.entityService.findOne("plugin::users-permissions.user", ctx.state.user.id, { populate: ["current_world"] });

    // Format response data according to GraphQL return types.
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

  /**
   * Controller for fetching multiple users' information.
   * This custom controller was created to support the current_world field.
   *
   * @param {Object} ctx - Koa context object.
   */
  plugin.controllers.user.find = async (ctx) => {
    const users = await strapi.entityService.findMany("plugin::users-permissions.user", { ...ctx.params, populate: ["current_world"] });

    ctx.body = users.map((user) => sanitizeOutput(user));
  };

  // Route configuration for forgot password functionality.
  // This route was created to handle forgot password functionality via mobile returning a 6 digit code.

  plugin.routes["content-api"].routes.unshift({
    method: "POST",
    path: "/auth/forgot-password-mobile",
    handler: "auth.forgotPasswordMobile",
    config: {
      middlewares: ["plugin::crefinex.rateLimit"],
      prefix: "",
    },
  });

  /**
   * Controller for handling forgot password functionality via mobile.
   * @param {Object} ctx - Koa context object.
   */
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

    // Return if user not found or is blocked.
    if (!user || user.blocked) {
      return ctx.send({ ok: true });
    }

    // Generate random token for password reset.
    const userInfo = sanitizeOutput(user);
    const resetPasswordToken = crypto.randomInt(100000, 999999).toString();

    const resetPasswordSettings = _.get(emailSettings, "reset_password.options", {});

    // Prepare email content.
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

    // Update user with reset password token.
    await getService("user").edit(user.id, { resetPasswordToken });

    // Send email to the user.
    await strapi.plugin("email").service("email").send(emailToSend);

    ctx.send({ ok: true });
  };

  return plugin;
};
