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
    // await client.connect();

    const carsToysCollection = client.db("carsToys").collection("cartoy");

    app.get("/totalData", async (req, res) => {
      const limit = parseInt(req.query.limit);
      console.log(limit);

      const coursor = carsToysCollection.find().limit(limit);
      const result = await coursor.toArray();
      res.send(result);
    });

    app.get("/toydetails/:id", async (req, res) => {
      const id = req.params.id;
      const filter = { _id: new ObjectId(id) };
      const result = await carsToysCollection.findOne(filter);
      res.send(result);
    });

    app.get("/searchByName/:text", async (req, res) => {
      const text = req.params.text;

      const filter = { toyName: { $regex: text } };

      const result = await carsToysCollection.find(filter).toArray();
      res.send(result);
    });

    app.get("/mytoy", async (req, res) => {
      let query = {};
      if (req.query?.email) {
        query = { email: req.query.email };
      }
      const result = await carsToysCollection.find(query).toArray();
      res.send(result);
    });

    app.get("/mytoys/:sortType", async (req, res) => {
      const sortType = req.params.sortType;
      // console.log(sortType);
      let query = {};
      if (req.query?.email) {
        query = { email: req.query.email };
      }
      const result = await carsToysCollection
        .find(query)
        .sort({ price: sortType === "ascending" ? 1 : -1 })
        .toArray();
      res.send(result);
    });

    app.get("/mytoy/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: new ObjectId(id) };
      const result = await carsToysCollection.findOne(query);
      res.send(result);
    });

    app.get("/mytoyCategory/:category", async (req, res) => {
      const newCategory = req.params.category;

      const query = { category: newCategory };
      const result = await carsToysCollection.find(query).toArray();
      res.send(result);
    });

    app.put("/mytoy/:id", async (req, res) => {
      const id = req.params.id;
      console.log(id);
      const updateToy = req.body;
      const filter = { _id: new ObjectId(id) };
      const updateDoc = {
        $set: {
          quantity: updateToy.quantity,
          message: updateToy.message,
          price: updateToy.price,
        },
      };
      const result = await carsToysCollection.updateOne(filter, updateDoc);
      res.send(result);
    });

    app.delete("/mytoy/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: new ObjectId(id) };
      const result = await carsToysCollection.deleteOne(query);
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
