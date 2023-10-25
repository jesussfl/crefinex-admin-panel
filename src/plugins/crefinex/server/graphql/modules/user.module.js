const resolvers = {
  usersWithStreak: {
    resolve: async (parent, args, context) => {
      const UID = "plugin::users-permissions.user";
      let { results: users } = await strapi.services[UID].find({});
      //This extra info is needed for breadcrumbs

      const data = {
        id: args.id,
        worldsCompleted: worldsCompleted.map((section) => {
          return section;
        }),
        pagination,
      };

      return data;
    },
  },
};
module.exports = {
  resolvers,
};
