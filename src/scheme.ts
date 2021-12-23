const {gql} = require('apollo-server-express');
import {GQL_QUERY} from './query'
import {GQL_MUTATION} from './mutation'

const scheme = {
  getTypeDefs : function(){
    return gql`
    type User {
      id: String
      mail: String
      name: String
      password: String
    }
    type Book {
      id: String
      title: String
      content: String
      user_id: String
      created_at: String
    }             
    ${GQL_QUERY}
    ${GQL_MUTATION}
  `;
  }
}
export default scheme;
