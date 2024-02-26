module.exports = {
  createOrUpdateCompletedWorld: async (parent, args, context) => {
    const UID = "plugin::crefinex.world-completed";

    const existingCompletedWorld = await strapi.entityService.findMany(UID, {
      filters: {
        user: args.user,
        lesson: args.lesson,
      },
    });

    if (existingCompletedWorld.length > 0) {
      const completedWorldUpdated = await strapi.entityService.update(UID, existingCompletedWorld[0].id, {
        data: args.data,
      });
      return completedWorldUpdated;
    }

    const completedWorldCreated = await strapi.entityService.create(UID, {
      data: args.data,
    });

    return completedWorldCreated;
  },
};
