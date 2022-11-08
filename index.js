const express = require('express');
const app = express();
const cors = require('cors');
const { MongoClient, ServerApiVersion } = require('mongodb');
const { request } = require('express');
require('dotenv').config();

const port = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

console.log(process.env.DB_USER);

const uri = "mongodb://localhost:27017";
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });

async function run(){
    try{
        const collectionOfServices = client.db('smile-bright').collection('services');
        app.get('/home',async(req,res)=>{
            const query = {};
            const cursor = collectionOfServices.find(query).limit(3); 
            const servicesForHome = await cursor.toArray();
            res.send(servicesForHome);

        })
        app.get('/services',async(req,res)=>{
            const query = {};
            const cursor = collectionOfServices.find(query); 
            const services = await cursor.toArray();
            res.send(services);

        })
        

    }
    finally{

    }

}

run().catch(err => console.error(err));
app.get('/',(req,res)=>{
    res.send("smile bright server running")
})

app.listen(port,()=>{
    console.log(`smile-bright server running on port ${port}`);
})