const resolvers = {
  sectionsCompletedByUser: {
    resolve: async (parent, args, context) => {
      const UID = "plugin::crefinex.section-completed";
      let { results: sectionsCompleted, pagination } = await strapi.services[UID].find({
        filters: {
          user: args.id,
        },
        pagination: { page: args.start, pageSize: args.limit },
      });
      //This extra info is needed for breadcrumbs

      const data = {
        id: args.id,
        sectionsCompleted: sectionsCompleted.map((section) => {
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
