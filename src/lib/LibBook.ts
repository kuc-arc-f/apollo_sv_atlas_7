const ObjectID = require('mongodb').ObjectID;
import LibCommon from "./LibCommon"
import LibMongo from "./LibMongo"
import LibApiFind from "./LibApiFind"
import LibCsrf from "./LibCsrf"

export default {
  getItems :async function(){
    try {
      const client = await LibMongo.getClient();
      const dbName = LibMongo.get_db_name();
//console.log(d);
      const collection = client.db(dbName).collection("books");
//      let items = await collection.find({}).toArray();
      let items = await collection.find({}).sort({created_at: -1}).toArray();
      items = LibApiFind.convertItems(items);
//console.log( items);
      client.close();             
      return items
    } catch (err) {
        throw new Error('Error , getItems');
    }          
  },    
  getBook :async function(id: string){
    try {
      const where = { _id: new ObjectID(id) }
      const dbName = LibMongo.get_db_name();
      const client = await LibMongo.getClient();
      const collection = client.db(dbName).collection("books");
      const item = await collection.findOne(where) ;
      client.close();
      if(item !== null){
        item.id = item._id;
      }  
console.log( item)       
      return item;
    } catch (err) {
      throw new Error('Error , getBook');
    }          
  },
  addBook :async function(args: any){
    try {
      const valid = await LibCsrf.validToken(args);
//console.log( args.user_id, valid );
      const item: any = {
        title: args.title ,  
        content: "",
        created_at: new Date(),
      };
      const dbName = LibMongo.get_db_name();
      const client = await LibMongo.getClient();
      const collection = client.db(dbName).collection("books");
      const itemOne = await collection.insertOne(item); 
      client.close();
      item.id = item._id   
//console.log(item); 
      return item;
    } catch (err) {
      console.log(err);
      throw new Error('Error , addBook');
    }          
  },
  updateBook :async function(args: any){
    try {
//console.log( args);  
      const valid = await LibCsrf.validToken(args);
      const where = {"_id": new ObjectID( args.id )};
      const item: any = {
        title: args.title ,  
      };
      const dbName = LibMongo.get_db_name();
      const client = await LibMongo.getClient();
      const collection = client.db(dbName).collection("books");
      await collection.updateOne(where, { $set: item })
      client.close();
//console.log(item); 
      return args;
    } catch (err) {
      console.log(err);
      throw new Error('Error , updateBook');
    }          
  },  
  deleteBook :async function(args: any){
    try {
      const valid = await LibCsrf.validToken(args);
//console.log( args.user_id, valid );
      const dbName = LibMongo.get_db_name();
      const where = {"_id": new ObjectID( args.id )};
      const client = await LibMongo.getClient();
      const collection = client.db(dbName).collection("books");
      await collection.deleteOne(where) 
      client.close();
//console.log(item); 
      return args;
    } catch (err) {
      console.error(err);
      throw new Error('Error , deleteBook :'+ err);
    }          
  },             
}
