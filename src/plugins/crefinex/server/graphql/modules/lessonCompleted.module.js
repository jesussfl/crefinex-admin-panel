const resolvers = {
  lessonsCompletedByUser: {
    resolve: async (parent, args, context) => {
      const UID = "plugin::crefinex.lesson-completed";
      let { results: lessonsCompleted, pagination } = await strapi.services[UID].find({
        filters: {
          user: args.id,
        },
        pagination: { page: args.start, pageSize: args.limit },
      });
      //This extra info is needed for breadcrumbs

      const data = {
        id: args.id,
        lessonsCompleted: lessonsCompleted.map((lesson) => {
          return lesson;
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
