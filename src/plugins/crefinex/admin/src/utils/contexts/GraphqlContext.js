import React, { createContext, useContext } from "react";
import { GraphQLClient } from "graphql-request";

const GraphQLContext = createContext();
const graphQLClient = new GraphQLClient(`${process.env.STRAPI_ADMIN_PUBLIC_URL}/graphql`, {
  headers: {
    authorization: `Bearer ${process.env.STRAPI_ADMIN_API_KEY}`,
  },
});

export const GraphQLProvider = ({ children }) => {
  return <GraphQLContext.Provider value={{ graphQLClient }}>{children}</GraphQLContext.Provider>;
};

export const useGraphQL = () => useContext(GraphQLContext);
