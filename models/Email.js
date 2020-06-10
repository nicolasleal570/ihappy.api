const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const QuestionSchema = mongoose.Schema ({
    name: String,
    email: String,
    message: String

});

module.exports = mongoose.model('Email', QuestionSchema)