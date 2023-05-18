const express = require("express");
const cors = require("cors");
const app = express();
const port = process.env.PORT || 5000;
app.use(cors());
app.use(express.json());
const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb");

const uri =
   "mongodb+srv://ashfatul:ashfatul-admin@todo-app.ufopdly.mongodb.net/?retryWrites=true&w=majority";
const client = new MongoClient(uri, {
   serverApi: {
      version: ServerApiVersion.v1,
      strict: true,
      deprecationErrors: true,
   },
});

async function run() {
   try {
      await client.connect();

      const database = client.db("todoDatabase");
      const todos = database.collection("todos");

      console.log("successfully connected to MongoDB!");

      app.get("/todos", async (req, res) => {
         const data = todos.find();
         const todosFound = await data.toArray();
         res.send(todosFound);
      });

      app.post("/todos", async (req, res) => {
         const data = req.body;
         const createTodo = await todos.insertOne(data);
         res.send(createTodo);
      });

      app.put("/todos/:id", async (req, res) => {
         const id = req.params.id;
         const query = { _id: new ObjectId(id) };
         const data = {
            $set: {
               todoItem: req.body.todoItem,
            },
         };
         const options = { upsert: true };

         const updateTodo = await todos.updateOne(query, data, options);
         res.send(updateTodo);
      });

      app.delete("/todos/:id", async (req, res) => {
         const id = req.params.id;
         console.log(id);
         const query = { _id: new ObjectId(id) };
         const deleteTodo = await todos.deleteOne(query);
         console.log(deleteTodo);
         res.send(deleteTodo);
      });
   } finally {
   }
}
run().catch(console.dir);

app.get("/", (req, res) => {
   res.send("Running ToDo Server");
});

app.listen(port);
