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

  return plugin;
};
