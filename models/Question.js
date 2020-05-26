const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const QuestionSchema = mongoose.Schema ({
    title: String,
    answers: [{type: Schema.Types.ObjectId, ref: 'Choice' }],

});

module.exports = mongoose.model('Question', QuestionSchema)