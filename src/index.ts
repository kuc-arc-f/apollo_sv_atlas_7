
const express = require('express');
const { ApolloServer, gql } = require('apollo-server-express');
import scheme from './scheme'
import LibUser from './lib/LibUser'
import LibBook from './lib/LibBook';
import LibCsrf from './lib/LibCsrf'

const typeDefs = scheme.getTypeDefs();
/* resolvers */
const resolvers = {
  Query: {
    hello: () => 'Hello world-22',
    /* token */
    async getToken(){
      return await LibCsrf.getToken();
    },
    async validToken(_, args: any, context: any){
//console.log(args.user_id );
      const v = await LibCsrf.validToken(args);
      return "";
    },
    /* user */
    userCount:async () => {
      return await LibUser.userCount();
    },
    userValid: async(parent: any, args: any, context: any, info: any) => {
      const user = await LibUser.validUser(args);
      return user;
    },
    /* book */
    books: async () => {
      return await LibBook.getItems();
    },    
    book: async (parent: any, args: any, context: any, info: any) => {
      return await LibBook.getBook(args.id);
    },    
  },
  Mutation: {
    /* user */    
    addUser: async (parent: any, args: any, context: any) => {
      const ret = await LibUser.addUser(args)
      return ret
    },
    /* book */ 
    addBook: async (parent: any, args: any, context: any) => {
      const ret = await LibBook.addBook(args)
      return ret
    },  
    deleteBook: async (parent: any, args: any, context: any) => {
      const ret = await LibBook.deleteBook(args);
      return ret
    },
    updateBook: async (parent: any, args: any, context: any) => {
      const ret = await LibBook.updateBook(args)
      return ret
    },  
    
  }
};

/* serever-Start */
const server = new ApolloServer({ typeDefs, resolvers });
const app = express();

server.applyMiddleware({ app });
// ENV
//console.log(app.get('env'));
app.listen({ port: 4000 }, () => {
  console.log(`Server ready at http://localhost:4000${server.graphqlPath}`);
});