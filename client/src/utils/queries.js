import gql from "graphql-tag";

// GET_ME query: retrieves the logged-in user's information and saved books
export const GET_ME = gql`
  {
    me {
      _id
      username
      email
      bookCount
      savedBooks {
        bookId
        authors
        description
        title
        image
        link
      }
    }
  }
`;
