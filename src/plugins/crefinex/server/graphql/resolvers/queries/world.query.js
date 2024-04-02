const typeDef = `
    extend type Query {
      worlds(start:Int, limit:Int): CrefinexWorldEntityResponseCollection!

    }
`;

const resolvers = {
  worlds: {
    resolve: async (parent, args, context) => {
      const UID = "plugin::crefinex.world";
      const { toEntityResponseCollection } = strapi.service("plugin::graphql.format").returnTypes;

      //This extra info is needed for breadcrumbs
      const results = await strapi.entityService.findMany(UID);
      const response = toEntityResponseCollection(results, {
        args: { start: args.start, limit: args.limit },
        resourceUID: UID,
      });

      return response;
    },
  },
};

module.exports = {
  typeDef,
  resolvers,
};
