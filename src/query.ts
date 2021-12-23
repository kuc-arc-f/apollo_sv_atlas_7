
export const GQL_QUERY = `
  type Query {
    hello: String
    getToken : String
    validToken(token: String) : String
    users: [User]
    user(mail: String, password: String): User
    userCount: Int
    userValid(token: String, email: String!, password: String!): User  
    books: [Book]   
    book(id: String): Book 
  }
`;