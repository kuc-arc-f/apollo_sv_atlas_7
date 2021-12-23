const ObjectID = require('mongodb').ObjectID;
const bcrypt = require('bcrypt');
import LibMongo from "./LibMongo"
import LibCsrf from "./LibCsrf"

interface IArgs {
  name: string,
  email: string,
  password: string,
}
//
const LibUser = {
  addUser :async function(args: IArgs){
    try {
      const valid = await LibCsrf.validToken(args);
      let hashed_password = bcrypt.hashSync(args.password, 10);
//console.log( hashed_password)
      const item: any = {
        name: args.name ,  
        email: args.email,
        password: hashed_password,
      };
      const client = await LibMongo.getClient();
      const dbName = LibMongo.get_db_name();
      const collection = client.db(dbName).collection("users");
      const itemOne = await collection.insertOne(item); 
      client.close();
      item.id = item._id     
// console.log( item)            
      return item;
    } catch (err) {
      console.error(err);
      throw new Error('Error , addUser');
    }          
  },
  getUser :async function(id: string){
    try {
      const where = { _id: new ObjectID(id) }
      const client = await LibMongo.getClient();
      const dbName = LibMongo.get_db_name();
      const collection = client.db(dbName).collection("users");
      const item = await collection.findOne(where) ;
      client.close();
      if(item !== null){
        item.id = item._id;
      }        
//console.log( item)       
      return item;
    } catch (err) {
      throw new Error('Error , getUser');
    }          
  }, 
  validUser :async function(args: IArgs){
    try {
      let user = null;
      const valid = await LibCsrf.validToken(args);
console.log(args);
      const where = { email: args.email }
      const client = await LibMongo.getClient();
      const dbName = LibMongo.get_db_name();
      const collection = client.db(dbName).collection("users");
      let items = await collection.find(where).toArray();
      client.close();
      if(typeof items[0] !== 'undefined'){
        const userOne = items[0];
//console.log(userOne);
        if (args.email === userOne.email
          && bcrypt.compareSync(args.password,  userOne.password )){
            user = userOne;
            user.id = user._id;
        }
      }
//console.log( item)       
      return user;
    } catch (err) {
      console.error(err);
      throw new Error('Error , validUser');
    }          
  }, 
  userCount: async function(){
    try {
      const count = await LibMongo.getCount("users", {});
//console.log(count)       
      return count;
    } catch (err) {
      throw new Error('Error , getUser');
    }          
  }, 
}
export default LibUser;
