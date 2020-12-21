//importing
import express from "express";
import mongoose from "mongoose";
import Messages from "./dbMessages.js";
import Pusher from "pusher";
import cors from "cors";

//app config
const app = express();
const port = process.env.PORT || 9000;

const pusher = new Pusher({
  appId: "1126954",
  key: "1a1034c183709fb02c4a",
  secret: "a4675193b4e2440e87c0",
  cluster: "eu",
  useTLS: true,
});

//midlewares
app.use(express.json());
app.use(cors());

//db config
const connection_url =
  "mongodb+srv://admin:gDXWSFcQQWD3CjSo@cluster0.xa4s4.mongodb.net/whatsappdb?retryWrites=true&w=majority";
mongoose.connect(connection_url, {
  useCreateIndex: true,
  useNewUrlParser: true,
  useUnifiedTopology: true,
}); //for better connection

//???
const db = mongoose.connection;

db.once("open", () => {
  console.log("db is connected");

  const msgCollection = db.collection("messagecontents"); //listens collection
  const changeStream = msgCollection.watch();

  changeStream.on("change", (change) => {
    //whenewer change occurs store change into change variable
    console.log(change);
    //trigger the pusher if type is insert
    if (change.operationType === "insert") {
      const messageDetails = change.fullDocument;
      pusher.trigger("messages", "inserted", {
        name: messageDetails.name,
        message: messageDetails.message,
        timestamp: messageDetails.timestamp,
        received: messageDetails.received,
      });
    } else {
      console.log("error triggering pusher");
    }
  });
});

//api routes
app.get("/", (req, res) => res.status(200).send("hello covid"));

app.get("/messages/sync", (req, res) => {
  Messages.find((err, data) => {
    if (err) {
      res.status(500).send(err);
    } else {
      res.status(200).send(data);
    }
  });
});

app.post("/messages/new", (req, res) => {
  const dbMessage = req.body;

  Messages.create(dbMessage, (err, data) => {
    if (err) {
      res.status(500).send(err);
    } else {
      res.status(201).send(`new message created: \n ${data}`);
    }
  });
});

//listener
app.listen(port, () => console.log(`listening on localhost:${port}`));
