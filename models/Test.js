const mongoose = require('mongoose');

const TestSchema = mongoose.model.Schema({
    title: String,
    question: [{type: Schema.Types.ObjectId, ref: 'Question' }]
})

module.exports = mongoose.model('Test', TestSchema)