import { gql } from "graphql-request";

export const createLesson = gql`
  mutation ($data: CrefinexLessonInput!) {
    createCrefinexLesson(data: $data) {
      data {
        id
      }
    }
  }
`;

export const updateLesson = gql`
  mutation ($id: ID!, $data: CrefinexLessonInput!) {
    updateLesson(id: $id, data: $data) {
      id
    }
  }
`;

export const deleteLesson = gql`
  mutation ($id: ID!) {
    deleteCrefinexLesson(id: $id) {
      data {
        id
      }
    }
  }
`;
