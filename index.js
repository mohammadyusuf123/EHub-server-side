const express = require('express');
const app=express()
const cors = require('cors');
const port=process.env.PORT||2000
const jwt = require('jsonwebtoken');
require('dotenv').config()
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');

//middleware
app.use(cors())
app.use(express.json())

//Connect to MongoDb

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.oglyu.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });
async function run(){
 try{
    await client.connect();
    const inventoryCollection=client.db('assignment-11').collection('inventories')
    const orderCollection=client.db('assignment-11').collection('orders')
    app.get('/inventories',async(req,res)=>{
        const query={}
        const cursor=inventoryCollection.find(query)
        const inventories=await cursor.toArray()
        res.send(inventories)
    })
    app.get('/inventories/:id',async(req,res)=>{
        const id=req.params.id
        const query={_id:ObjectId(id)}
        const inventory=await inventoryCollection.findOne(query)
        res.send(inventory)

    })
    app.post('/inventories',async(req,res)=>{
        const newInventories=req.body
        const result=await inventoryCollection.insertOne(newInventories)
        res.send(result)
    })
    
    app.delete('/inventories/:id',async(req,res)=>{
        const id=req.params.id
        const query={_id:ObjectId(id)}
        const result=await inventoryCollection.deleteOne(query)
        res.send(result)


    })
    //Update API
    app.put('/inventories/:id',async(req,res)=>{
        const id=req.params.id
        const newStock=req.body;

        const query={_id:ObjectId(id)}
        const option={upsert:true}
        const updateDoc={
            $set:{
               stock:newStock.stock
            }
            
            
    }
   
    const result=await inventoryCollection.updateOne(query,updateDoc,option)
       res.send(result);

 })
  
//Order Collection API

 app.get('/order',async(req,res)=>{
     const email=req.query.email
     const query={email:email}
     const cursor=orderCollection.find(query)
     const order=await cursor.toArray()
     res.send(order)
 })


app.post('/order',async(req,res)=>{
    const order=req.body
    const result= await orderCollection.insertOne(order)
    res.send(result)
  })

  //Auth
app.post('/login',async(req,res)=>{
    const user=req.body
    const accessKey=jwt.sign(user,process.env.ACCESS_KEY,{
      expiresIn:'1d'
    })
    res.send(accessKey)
  })

 }
 finally{
   
 }
}
run().catch(console.dir)



app.get('/',(req,res)=>{
    res.send('Server is running')
})
app.listen(port,()=>{
    console.log('listing from',port)
})