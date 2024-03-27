import { gql } from "graphql-request";

export const queryWorlds = gql`
  query {
    crefinexWorlds {
      data {
        id
        attributes {
          name
          description
          order
          status
          image {
            data {
              id
              attributes {
                formats
                previewUrl
                url
              }
            }
          }
        }
      }
      meta {
        pagination {
          total
        }
      }
    }
  }
`;
