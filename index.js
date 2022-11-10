const express = require('express');
const app = express();
const cors = require('cors');
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const { request } = require('express');
require('dotenv').config();

const port = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

console.log(process.env.DB_USER);

// const uri = "mongodb://localhost:27017";
//vJaDPX3fm7S5fPbB
const uri = "mongodb+srv://DB_USER:DB_PASSWORD@cluster0.4t6fenq.mongodb.net/?retryWrites=true&w=majority";
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });

async function run(){
    try{
        const collectionOfServices = client.db('smile-bright').collection('services');
        const collectionOfreview = client.db('smile-bright').collection('review');
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

        app.get('/service-details/:id',async(req,res)=>{
            const id = req.params.id;
            const query = {_id: ObjectId(id)};
            const services = await collectionOfServices.findOne(query); 
            res.send(services);

        })
        app.get('/add-review/:id',async(req,res)=>{
            const id = req.params.id;
            const query = {_id: ObjectId(id)};
            const services = await collectionOfServices.findOne(query); 
            res.send(services);
            
        })

        
        // review API
        app.get('/review-add',async(req,res)=>{
            let query = {};
            if(req.query.serrviceId){
                query = {
                    serrviceId: req.query.serrviceId
                }
            }
            const cursor = collectionOfreview.find(query);
            const review = await cursor.toArray();
            res.send(review);
        })
        app.get('/my-review',async(req,res)=>{
            let query = {};
            if(req.query.email){
                query = {
                    email: req.query.email
                }
            }
            const cursor = collectionOfreview.find(query);
            const review = await cursor.toArray();
            res.send(review);
        })
        app.post("/add-review",async(req, res)=>{
            const review = req.body;            
            const result = await collectionOfreview.insertOne(review);
            console.log(result);
            res.send(result);
        })

        app.post("/add-service",async(req, res)=>{
            const service = req.body;            
            const result = await collectionOfServices.insertOne(service);
            console.log(result);
            res.send(result);
        })

        app.delete('/my-review/:id', async(req, res)=>{
            const id = req.params.id;
            const query = {_id: ObjectId(id)};
            const result = await collectionOfreview.deleteOne(query);
            res.send(result);
        })

        app.patch('/my-review/:id', async(req, res)=>{
            const id = req.params.id;
            const review = req.body;
            const query = {_id: ObjectId(id)};
            const updateDoc = {
                $set:{
                    comment:review.comment
                }
            }
            const result = await collectionOfreview.updateOne(query, updateDoc);
            res.send(result);
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