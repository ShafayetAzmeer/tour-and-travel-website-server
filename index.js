const express = require('express')
const { MongoClient } = require('mongodb');
const bodyParser = require("body-parser");
const cors = require("cors");
require("dotenv").config();
// const MongoClient = require("mongodb").MongoClient;
const ObjectId = require("mongodb").ObjectId;

const app = express()
const port =process.env.PORT || 7000;
app.use(cors());
app.use(express.json());
app.use(bodyParser.urlencoded({extended: true}));

// user = tourism-website-server-side
// password = uvBnWFDhkhupLPaX

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.lfgr1.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;

const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });


client.connect((err) => {
  const spotCollection = client.db("tour_guide").collection("spots");
  const confirmCollection = client.db("tour_guide").collection("orders");
  const beachCollection = client.db("tour_guide").collection("beaches");
  const heritageCollection = client.db("tour_guide").collection("heritage");

  // addNewService

  app.post("/addNewService", async(req, res) => {
     const result = await spotCollection.insertOne(req.body);
    res.send(result);
  });

  //  get all services

   app.get("/allSpots", async (req, res) => {
    const result = await spotCollection.find({}).toArray();
    res.send(result);
  });

  //  get beaches

   app.get("/beaches", async (req, res) => {
    const result = await beachCollection.find({}).toArray();
    res.send(result);
  });

  //  get heritage

   app.get("/heritages", async (req, res) => {
    const result = await heritageCollection.find({}).toArray();
    res.send(result);
  });

  //get single spot detail

  app.get("/spotDetail/:id", async (req, res) => {
    const result = await spotCollection
    .find({ _id: ObjectId(req.params.id) })
    .toArray();
    res.send(result[0]);
  });

  // cofirm order
  app.post("/confirmOrder", async (req, res) => {
    const result = await confirmCollection.insertOne(req.body);
    res.send(result);
  });

  // my Order

  app.get("/myOrders/:email", async (req, res) => {
    const result = await confirmCollection
      .find({ email: req.params.email })
      .toArray();
      res.send(result);
  });

  //delete myOrder

  app.delete("/deleteOrder/:id", async (req, res) => {
    const result = await confirmCollection.deleteOne({
      _id: ObjectId(req.params.id),
    });
    res.send(result);
  });

  //  manage all Orders

  app.get("/manageAllOrders", async (req, res) => {
    const result = await confirmCollection.find({}).toArray();
    res.send(result);
  });

    //delete mymanage all Order

    app.delete("/deleteManageOrder/:id", async (req, res) => {
      const result = await confirmCollection.deleteOne({
        _id: ObjectId(req.params.id),
      });
      res.send(result);
    });

     // update status

   app.put("/updateStatus/:id", (req, res) => {
    const id = req.params.id;
    const updatedStatus = req.body.status;
    const filter = { _id: ObjectId(id) };
    confirmCollection
      .updateOne(filter, {
        $set: { status: updatedStatus },
      })
      .then((result) => {
        res.send(result);
      });
  });

  });

  async function run () {
    try {
      await client.connect();
      console.log('database Connected');

    }
    finally{
      // await client.close()
    }
  }

  run().catch(console.dir);

app.get('/', (req, res) => {
  res.send('Hello World!')
})

app.listen(port, () => {
  console.log("Heroku is working", port)
  // console.log(`Example app listening at http://localhost:${port}`)
})