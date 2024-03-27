// /graphql/mutations/blog.mutations.js

import { gql } from "graphql-request";

// Note that the type of the $data param is of type update_blogpost_input.
// This type is probably different depending on
// how your backend has set this up.
// Refer to their docs to get the proper type.

export const createWorld = gql`
  mutation ($data: CrefinexWorldInput!) {
    createCrefinexWorld(data: $data) {
      data {
        id
      }
    }
  }
`;

export const updateWorld = gql`
  mutation ($id: ID!, $data: CrefinexWorldInput!) {
    updateWorld(id: $id, data: $data) {
      id
    }
  }
`;

export const deleteWorld = gql`
  mutation ($id: ID!) {
    deleteCrefinexWorld(id: $id) {
      data {
        id
      }
    }
  }
`;
