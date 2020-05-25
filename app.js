const express = require('express');
const app = express();
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
require('dotenv/config');

//Import Routes
const userRoute = require('./routes/user');

//MIddlewares
app.use(express.urlencoded({ extended: true }));
app.use(express.json());



//Routes
app.get('/', function (req, res) {
  res.send('Hello World!');
});
app.use('/user',userRoute);


//Connect to DB

mongoose.connect(
  process.env.DB_CONNECTION,
  { useNewUrlParser: true },()=>{
  console.log('CORONAOO CONECTAOUU');
});


app.listen(3000, function () {
  console.log('Example app listening on port 3000!');
});