import { gql } from "graphql-request";

export const querySections = gql`
  query ($start: Int, $limit: Int) {
    sections(start: $start, limit: $limit) {
      data {
        id
        attributes {
          description
          order
          content
          contentTitle
          status
          createdAt
          updatedAt
          lessons {
            data {
              id
              attributes {
                description
                order
              }
            }
          }
          world {
            data {
              id
              attributes {
                name
              }
            }
          }
        }
      }
      meta {
        pagination {
          total
          pageCount
        }
      }
    }
  }
`;
