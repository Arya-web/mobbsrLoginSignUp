const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const routes = require("./routes/apis");

// get the uri for db connection!
const uri = process.env.uri || require('./config');

// set up the express app! 
const app = express();

let port = process.env.PORT || 4000;

// connect to mongodb!
mongoose.connect(uri, () => {
    console.log('Connected to mongo db!');
});

// middleware!
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// routes!
app.use('/apis', routes);

app.get("/", (req, res) => {
  res.send(
    "Hello! This is the backend for <strong>MOBBSR LOGIN SIGNUP</strong> app. <br><br> api requests are available under /apis"
  );
});

app.listen(port, () => {
  console.log(`MOBBSR app is listening in port ${port}`);
});
