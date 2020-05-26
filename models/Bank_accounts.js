const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const Bank_accountsSchema = mongoose.Schema({

    id_user: {type: Schema.Types.ObjectId, ref: 'User'},
    bank: String,
    card_number: Number,
    card_CVV: Number

});

module.exports = mongoose.model('Bank_accounts', Bank_accountsSchema)
