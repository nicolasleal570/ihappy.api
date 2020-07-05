const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const PaymentSchema = mongoose.Schema({

    amount:Number,
    stripeID: String,
    idUsuario: String,
    idPsicologo: String

});

module.exports = mongoose.model('Payment', PaymentSchema)
