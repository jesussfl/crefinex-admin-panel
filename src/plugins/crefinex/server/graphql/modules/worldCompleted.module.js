const resolvers = {
  worldsCompletedByUser: {
    resolve: async (parent, args, context) => {
      const UID = "plugin::crefinex.world-completed";
      let { results: worldsCompleted, pagination } = await strapi.services[UID].find({
        filters: {
          user: args.id,
        },
        pagination: { page: args.start, pageSize: args.limit },
      });
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
