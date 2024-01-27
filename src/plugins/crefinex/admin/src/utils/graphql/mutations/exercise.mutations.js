import { gql } from "graphql-request";

export const createExercise = gql`
  mutation ($data: CrefinexExerciseInput!) {
    createCrefinexExercise(data: $data) {
      data {
        id
      }
    }
  }
`;

export const updateExercise = gql`
  mutation ($id: ID!, $data: CrefinexExerciseInput!) {
    updateExercise(id: $id, data: $data) {
      id
    }
  }
`;

export const deleteExercise = gql`
  mutation ($id: ID!) {
    deleteCrefinexExercise(id: $id) {
      data {
        id
      }
    }
  }
`;
