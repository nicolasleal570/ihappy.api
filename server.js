const express = require('express');
const app = express();
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const dotenv = require('dotenv');
const morgan = require('morgan');
const cors = require('cors');
const connectDB = require('./config/db');

dotenv.config({ path: './config/config.env' });

// Connect DB
connectDB();

//Import Routes
const userRoute = require('./routes/user');

//Middlewares
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// Muestra todos los request en la consola
if(process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}

//Routes
// - User API
app.use('/api/user', userRoute);

// Port
const PORT = process.env.PORT || 5000;

// Server Running
app.listen(PORT, console.log(`Server running in ${process.env.NODE_ENV} mode on port ${PORT}`));