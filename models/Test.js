const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const TestSchema = mongoose.Schema({
    title: String,
    question: [{type: Schema.Types.ObjectId, ref: 'Question' }]
})

module.exports = mongoose.model('Test', TestSchema)