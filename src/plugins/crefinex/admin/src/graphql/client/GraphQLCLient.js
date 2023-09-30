import { GraphQLClient } from "graphql-request";

// Create a GraphQL client instance with the provided URL and API key
const client = new GraphQLClient(`${process.env.STRAPI_ADMIN_PUBLIC_URL}/graphql`, {
  headers: {
    authorization: `${process.env.STRAPI_ADMIN_API_KEY}`,
  },
});

// This function will be used to send queries via GraphQL
export const query = async (query, variables) => {
  // Send a GraphQL request using the client and return the response
  return await client.request(query, variables);
};
