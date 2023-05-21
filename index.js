const express = require("express");
const cors = require("cors");
const app = express();
require("dotenv").config();
const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb");
const port = process.env.PORT || 5000;

//middleware
app.use(cors());
app.use(express.json());

const uri = `mongodb+srv://${process.env.USER}:${process.env.SECRET_KEY}@cluster0.gflxnku.mongodb.net/?retryWrites=true&w=majority`;

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
});

async function run() {
  try {
    // Connect the client to the server	(optional starting in v4.7)
    await client.connect();

    const toyCollection = client.db("ToyTown").collection("toyProducts");

    //data read rout
    app.get("/toyProducts", async (req, res) => {
      let query = {};
      if (req.query?.email) {
        query = { email: req.query.email };
      }
      const result = await toyCollection.find(query).toArray();
      res.send(result);
    });

    // one items read
    app.get("/toyProducts/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: new ObjectId(id) };
      const result = await toyCollection.findOne(query);
      res.send(result);
    });

    /* new item add rout  */
    app.post("/toyProducts", async (req, res) => {
      const newToy = req.body;
      console.log("new toy router", newToy);
      const result = await toyCollection.insertOne(newToy);
      res.send(result);
    });

    // one items update the all products
    app.patch("/toyProducts/:id", async (req, res) => {
      const id = req.params.id;
      const filter = { _id: new ObjectId(id) };
      const option = { upsert: true };
      const robotBody = req.body;
      const updateDoc = {
        $set: {
          name: robotBody.name,
          sellerName: robotBody.sellerName,
          price: robotBody.price,
          available: robotBody.available,
          description: robotBody.description,
        },
      };
      const result = await toyCollection.updateOne(filter, updateDoc, option);
      res.send(result);
    });

    //sub category rout read
    app.get("/softToys", async (req, res) => {
      console.log("serial number 77", req.query);
      const query = { category: "Soft Toys" };
      const cursor = toyCollection.find(query);
      const result = await cursor.toArray();
      res.send(result);
    });
    app.get("/rubberwood", async (req, res) => {
      const query = { category: "Rubberwood" };
      const cursor = toyCollection.find(query);
      const result = await cursor.toArray();
      res.send(result);
    });
    app.get("/girlsCloth", async (req, res) => {
      const query = { category: "Girl's Cloth" };
      const cursor = toyCollection.find(query);
      const result = await cursor.toArray();
      res.send(result);
    });

    // one items delete read
    app.delete("/toyProducts/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: new ObjectId(id) };
      const result = await toyCollection.deleteOne(query);
      res.send(result);
    });

    // Send a ping to confirm a successful connection
    await client.db("admin").command({ ping: 1 });
    console.log(
      "Kids Omega Robot Server You successfully connected to MongoDB!"
    );
  } finally {
    // Ensures that the client will close when you finish/error
    // await client.close();
  }
}
run().catch(console.dir);

app.get("/", (req, res) => {
  res.send("This is Omega Robot Server site..");
});

//server site listen by cmd console
app.listen(port, () => {
  console.log(`kids Robot server site Port: ${port}`);
});
// cluster0.guqonkt.mongodb.net;
