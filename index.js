const express = require("express");
const cors = require("cors");
const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb");
const app = express();
require("dotenv").config();
const port = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

const uri = `mongodb+srv://${process.env.CAR_TOY_USER}:${process.env.CAR_TOY_PASS}@cluster0.wauv4p9.mongodb.net/?retryWrites=true&w=majority`;

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

    const carsToysCollection = client.db("carsToys").collection("cartoy");

    app.get("/totalData", async (req, res) => {
      const coursor = carsToysCollection.find();
      const result = await coursor.toArray();
      res.send(result);
    });

    app.get("/toydetails/:id", async (req, res) => {
      const id = req.params.id;
      const filter = { _id: new ObjectId(id) };
      const result = await carsToysCollection.findOne(filter);
      res.send(result);
    });

    app.post("/addtoy", async (req, res) => {
      const query = req.body;
      const result = await carsToysCollection.insertOne(query);
      res.send(result);
    });

    // Send a ping to confirm a successful connection
    await client.db("admin").command({ ping: 1 });
    console.log(
      "Pinged your deployment. You successfully connected to MongoDB!"
    );
  } finally {
    // Ensures that the client will close when you finish/error
    // await client.close();
  }
}
run().catch(console.dir);

app.get("/", (req, res) => {
  res.send("car toy  is runnig !!!");
});

app.listen(port, () => {
  console.log(`car toy server is start port is ${port}`);
});
