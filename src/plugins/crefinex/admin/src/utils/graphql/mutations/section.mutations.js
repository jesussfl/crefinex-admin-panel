// /graphql/mutations/blog.mutations.js

import { gql } from "graphql-request";

// Note that the type of the $data param is of type update_blogpost_input.
// This type is probably different depending on
// how your backend has set this up.
// Refer to their docs to get the proper type.

export const createSection = gql`
  mutation ($data: CrefinexSectionInput!) {
    createCrefinexSection(data: $data) {
      data {
        id
      }
    }
  }
`;

export const updateSection = gql`
  mutation ($id: ID!, $data: CrefinexSectionInput!) {
    updateSection(id: $id, data: $data) {
      id
    }
  }
`;

export const deleteSection = gql`
  mutation ($id: ID!) {
    deleteCrefinexSection(id: $id) {
      data {
        id
      }
    }
  }
`;
