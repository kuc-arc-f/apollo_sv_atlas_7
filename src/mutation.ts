
export const GQL_MUTATION = `
type Mutation {
  addUser(token: String, name: String!, email: String!, password: String!): User
  addBook(token: String, user_id: String, title: String!): Book
  updateBook(token: String, user_id: String, id: String, title: String!): Book   
  deleteBook(token: String, user_id: String, id: String): Book 
}
`;
