require('dotenv').config()
const { MongoClient, ServerApiVersion } = require('mongodb');
const express = require('express')
const cors = require('cors')
const port = process.env.PORT || 3000

const app = express();

// TechGigs
// VgpJJmMHcoPMP0jZ


app.use(cors());
app.use(express.json());


const uri = `mongodb+srv://${process.env.DB_USER }:${process.env.DB_PASSWORD}@cluster0.1k8uoge.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`;

const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
});

async function run() {
  try {
    await client.connect();

    const tasksCollection = client.db('TechGigs').collection('tasks');

    // for creating tasks
    app.post('/tasks', async(req,res)=>{
      const addTasksData = req.body;
      const result = await tasksCollection.insertOne(addTasksData);
      res.send(result);
    })

    // for showing all the tasks
    app.get('/tasks', async(req,res)=>{
      const result = await tasksCollection.find().toArray();
      res.send(result)
    })
    await client.db("admin").command({ ping: 1 });
    console.log("Pinged your deployment. You successfully connected to MongoDB!");
  } 
  finally {
  }
}
run().catch(console.dir);

app.get('/', (req,res)=>{
    res.send("TechGigs server is running")
    
})

app.listen(port , ()=>{
    console.log(`TechGigs server is listening to port ${port}`)
})