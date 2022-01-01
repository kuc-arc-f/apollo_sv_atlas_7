const ObjectID = require('mongodb').ObjectID;
import moment from 'moment';
import LibCommon from "./LibCommon"
import LibMongo from "./LibMongo"
import Config from '../../config';
const csrf = require('csrf');
const tokens = new csrf();

export default {
  getToken :async function(){
    try {
      let ret = "";
      const secret = tokens.secretSync();
      const token = tokens.create(secret);
console.log("secret=" ,secret);
console.log(token);
      //delete
      this.deleteOldToken();
      //add
      const client = await LibMongo.getClient();
      const dbName = LibMongo.get_db_name();
      const collection = client.db(dbName).collection("tokens");
      const item: any = {
        secret: secret, 
        token: token,
        expire_datetime: new Date(),
        created_at: new Date(),
      };
      const itemOne = await collection.insertOne(item);        
      client.close();
      return token;
    } catch (err) {
        console.error(err);
        throw new Error('Error , getToken');
    }          
  },
  deleteOldToken :async function(){
    try {
      const client = await LibMongo.getClient();
      const dbName = LibMongo.get_db_name();
      const collection = client.db(dbName).collection("tokens");
//console.log(Config.DELETE_TOKEN_EXPIRE_MIN);
      const befMin = Config.DELETE_TOKEN_EXPIRE_MIN * (-1);
      const dt = moment().add( befMin, 'minutes').toISOString();
console.log(dt, befMin);
      let befDate = new Date(dt);
      const where = { "expire_datetime": { $lt: befDate } };
//console.log(items);
      await collection.deleteMany(where);       
      client.close();      
    } catch (err) {
        console.error(err);
        throw new Error('Error , deleteOldToken');
    }          
  },  
  validToken :async function(args: any){
    try {
console.log(args);
      let ret: boolean = false;
      const client = await LibMongo.getClient();
      const dbName = LibMongo.get_db_name();
      const where = { token: args.token };
      const collection = client.db(dbName).collection("tokens");
      const item = await collection.findOne(where);
      client.close();
      if(item === null ){
        throw new Error('Error , token nothing');
      }
console.log(item);
      //valid token
      if(tokens.verify(item.secret, args.token) === false)
      {
        throw new Error('Invalid Token');
      }      
      ret = true;
//console.log(ret);
      return ret;
    } catch (err) {
      console.error(err);
      throw new Error('Error validToken : ' + err);
    }          
  },           
}
