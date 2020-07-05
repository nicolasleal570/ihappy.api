const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const PaymentSchema = mongoose.Schema({

    amount:Number,
    id: String

});

module.exports = mongoose.model('Payment', PaymentSchema)
