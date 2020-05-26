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

const bank_accountsRoute = require('./routes/bank_accounts');
const choiceRoute = require('./routes/choice');
const conversationRoute = require('./routes/conversation');
const facturaRoute = require('./routes/factura');
const questionRoute = require('./routes/question');
const reviewsRoute = require('./routes/reviews');
const specialtyRoute = require('./routes/specialty');
const testRoute = require('./routes/test');
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
app.use('/api/bank-accounts', bank_accountsRoute);
app.use('/api/choice', choiceRoute);
app.use('/api/conversation', conversationRoute);
app.use('/api/factura', facturaRoute);
app.use('/api/question', questionRoute);
app.use('/api/reviews', reviewsRoute);
app.use('/api/specialty', specialtyRoute);
app.use('/api/test', testRoute);

// Port
const PORT = process.env.PORT || 3000;

// Server Running
app.listen(PORT, console.log(`Server running in ${process.env.NODE_ENV} mode on port ${PORT}`));