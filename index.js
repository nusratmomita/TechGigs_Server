require('dotenv').config()
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const express = require('express')
const cors = require('cors')
const port = process.env.PORT || 3000

const app = express();

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
    // await client.connect();

    const tasksCollection = client.db('TechGigs').collection('tasks');

    // for creating tasks
    app.post('/tasks', async(req,res)=>{
      const addTasksData = req.body;
      const result = await tasksCollection.insertOne(addTasksData);
      res.send(result);
    })

    // for showing all the tasks
    app.get('/tasks/allTasks', async(req,res)=>{
      const result = await tasksCollection.find().toArray();
      res.send(result)
    })

    // for showing features 6 tasks
    app.get('/tasks', async (req, res) => {
    const tasks = await tasksCollection.find()
      .sort({ task_deadline: 1 })
      .limit(6)
      .toArray();
    // const result = await tasksCollection.find().toArray();
      res.send(tasks)
    });

    // for showing individual task details
    app.get('/tasks/:id', async(req,res)=>{
      const id = req.params.id;
      const query = { _id : new ObjectId(id) };
      const result = await tasksCollection.findOne(query);
      res.send(result);
    })

    // for showing logged in users tasks only
    app.get('/tasks/specific/:email' , async(req,res)=>{
      const email = req.params.email;
      const query = { email : email } ;
      // console.log(query)

      const result = await tasksCollection.find(query).toArray();
      res.send(result);
    })

    // for updating tasks
    // app.put('/tasks/update/:id', async(req,res)=>{
    app.put('/tasks/:id', async(req,res)=>{
      const id = req.params.id;
      const filter = { _id : new ObjectId(id)};
      
      const options = { upset: true };
      const updatedTask = req.body;
      const updatedDoc = {
        $set: updatedTask
      };

      const result = await tasksCollection.updateOne(filter , updatedDoc , options);
      res.send(result);
    })

    // for deleting tasks
    app.delete('/tasks/:id' , async(req,res)=>{
      const id = req.params.id;
      const query = { _id : new ObjectId(id) };
      const result = await tasksCollection.deleteOne(query);
      res.send(result);
    })

    // for bid counts
    app.patch('/tasks/bid/:id', async (req, res) => {
    const id = req.params.id;
    const filter = { _id: new ObjectId(id) };
    const updateDoc = {
      $inc: { total_bids: 1 }
    };
    const result = await tasksCollection.updateOne(filter, updateDoc);
    res.send(result);
    });

    // await client.db("admin").command({ ping: 1 });
    // console.log("Pinged your deployment. You successfully connected to MongoDB!");
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