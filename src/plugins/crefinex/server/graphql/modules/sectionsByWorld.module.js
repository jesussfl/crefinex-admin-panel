const resolvers = {
  sectionsByWorldId: {
    resolve: async (parent, args, context) => {
      const UID = "plugin::crefinex.section";
      // const { toEntityResponseCollection, toEntityResponse } = strapi.service("plugin::graphql.format").returnTypes;

      let { results: sectionsData, pagination } = await strapi.services[UID].find({
        filters: {
          world: args.id,
        },
        pagination: { page: args.start, pageSize: args.limit },
      });

      //This extra info is needed for breadcrumbs
      const { results: worldData } = await strapi.services["plugin::crefinex.world"].find({
        filters: { id: args.id },
        fields: ["name", "order", "description"],
      });
      const data = {
        id: args.id,
        sections: sectionsData.map((lesson) => {
          return lesson;
        }),
        world: worldData[0],
        pagination,
      };

      // const response = toEntityResponseCollection(data, {
      //   args: { start: args.start, limit: args.limit },
      //   resourceUID: UID,
      // });

      return data;
    },
  },
};

module.exports = {
  resolvers,
};
