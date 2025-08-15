const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb");
require("dotenv").config();
const express = require("express");
const cors = require("cors");
const app = express();
const port = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
  res.send("Events are running..");
});

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASSWORD}@nextjs-task.ujxnpdw.mongodb.net/?retryWrites=true&w=majority&appName=nextjs-task`;

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

    // Database Created
    const eventsCollection = client.db("eventDB").collection("events");

    app.post("/events", async (req, res) => {
      try {
        const { title, startAt, endAt, location, description, image } =
          req.body;

        // Basic validation
        if (!title || !startAt || !endAt || !location || !description) {
          return res
            .status(400)
            .json({ error: "All required fields must be filled" });
        }

        const newEvent = {
          title,
          startAt: new Date(startAt), 
          endAt: new Date(endAt),
          location,
          description,
          image,
          createdAt: new Date(),
        };

        const result = await eventsCollection.insertOne(newEvent);
        res
          .status(201)
          .json({
            message: "Event added successfully",
            eventId: result.insertedId,
          });
      } catch (err) {
        console.error("Error adding event:", err);
        res.status(500).json({ error: "Server error while adding event" });
      }
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
