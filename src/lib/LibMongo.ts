// LibMongo
const MongoClient = require('mongodb').MongoClient;
import Config from '../../config';

const LibMongo = {
  url: "",
  dbName: "",
  init:function(){
    this.url = Config.MONGODB_URL;
    this.dbName = Config.MONGODB_DB_NAME;
  },
  get_db_name: function(){
    this.init()
    return this.dbName
  },  
  getClient:async function(){
    try{
      this.init();
//console.log("url= ", this.url);
//console.log("dbName=", this.dbName);
      const uri = this.url + "?retryWrites=true&w=majority";
      //console.log(process.env.MONGODB_DB_NAME);
      const client = await new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });
      await client.connect();
      return client
    } catch (err) {
      console.log(err);
      throw new Error('Error, getClient');
    }
  },
  get_arrayWhere: async function(collectionName: string , where: any){
    try{
      this.init()
      let client = await MongoClient.connect( this.url);
      const db = client.db( this.dbName);
      const collection = db.collection(collectionName);
      const items = await collection.find(where).sort({created_at: -1}).toArray()
      client.close();
      return items
    } catch (err) {
      console.log(err);
      throw new Error('Error, get_array');
    }
  },   
  get_item: async function(collectionName: string  , where: any ){
    try{
      this.init()
      const client = await this.getClient();
      const dbName = this.get_db_name();
      const collection = client.db(dbName).collection(collectionName);
      const item = await collection.findOne(where) 
      client.close();
      return item
    } catch (err) {
      console.log(err);
      throw new Error('Error, get_item');
    }
  },
  add_item: async function(collectionName: string,item: any){
    try{
      this.init();
      const client = await this.getClient();
      const dbName = this.get_db_name();
      const collection = client.db(dbName).collection(collectionName);
      await collection.insertOne(item); 
      client.close();
      return item
    } catch (err) {
      console.log(err);
      throw new Error('Error, add_item');
    }
  },
  update_item: async function(collectionName:string , where: any, item: any){
    try{
      const client = await this.getClient();
      const dbName = this.get_db_name();
      const collection = client.db(dbName).collection(collectionName);      
      await collection.updateOne(where, { $set: item })
      client.close();
    } catch (err) {
      console.log(err);
      throw new Error('Error, update_item');
    }
  },
  delete_item: async function(collectionName: string , where: any ){
    try{
      const client = await this.getClient();
      const dbName = this.get_db_name();
      const collection = client.db(dbName).collection(collectionName);      
//      this.init()
      await collection.deleteOne(where)   
      client.close();
    } catch (err) {
      console.log(err);
      throw new Error('Error, delete_item');
    }
  },             
  getCount: async function(collectionName: string , where: any){
    try{
      this.init()
      const dbName = this.get_db_name();
      const client = await LibMongo.getClient();
      const collection = client.db(dbName).collection(collectionName);
      const ret = await collection.find(where).count()
      client.close();
      return ret
    } catch (err) {
      console.log(err);
      throw new Error('Error, getCount');
    }
  },     

}
export default LibMongo;