const express = require("express");
const nodemon = require("nodemon");
const cors = require("cors");
const knex = require("knex");
const bcrypt = require("bcrypt");
const signin = require("./controllers/signin");
const register = require("./controllers/register");
const profile = require("./controllers/profile");
const image = require("./controllers/image");

const db = knex({
  client: "pg",
  connection: {
    host: "127.0.0.1",
    user: "postgres",
    password: "test",
    database: "smartbrain",
  },
});

const app = express();
//the use() method of express is a middle ware. all incoming request
// stops here first before continuing on. here we use the urlencoded() method
// to parse the incoming data.it is always needed to parse the data recieved.
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cors());

app.get("/", (req, res) => {
  res.json("success");
});
// the res.json is the same as res.send but has more features
// with json we send a json response. we use it to send responses.
// the req.body is what we receive in the request. and this body contains
// objects which can be accessed using body.blablabla.
// the res.status is another method that comes with res, to send status of a req.
app.post("/signin", (req, res) => {
  signin.handleSignin(req, res, db, bcrypt); // adding db and bcrypt here is called dependency injection. we are sending things that
}); //the signin.js depends on to work.

app.post("/register", (req, res) => {
  register.handleRegister(req, res, db, bcrypt);
});

app.get("/profile/:id", (req, res) => {
  profile.handleProfile(req, res, db);
});

app.put("/image", (req, res) => {
  image.handleImage(req, res, db);
});

app.post("/imageurl", (req, res) => {
  image.handleApiCall(req, res);
});

app.listen("3001", () => {
  console.log("app is working");
});
