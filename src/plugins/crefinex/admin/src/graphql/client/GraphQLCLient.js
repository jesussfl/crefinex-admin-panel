import { GraphQLClient } from "graphql-request";

console.log("process.env.STRAPI_ADMIN_PUBLIC_URL", process.env.STRAPI_ADMIN_PUBLIC_URL);
console.log("process.env.STRAPI_ADMIN_API_KEY", process.env.STRAPI_ADMIN_API_KEY);
const client = new GraphQLClient(`${process.env.STRAPI_ADMIN_PUBLIC_URL}/graphql`, {
  headers: {
    authorization: `${process.env.STRAPI_ADMIN_API_KEY}`,
  },
});

// This function will be used to send queries via GraphQL

export const query = async (query, variables) => {
  return await client.request(query, variables);
};
