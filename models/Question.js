const mongoose = require('mongoose');

const QuestionSchema = mongoose.model.Schema ({
    question: String,
    answers: [{type: Schema.Types.ObjectId, ref: 'Choice' }],

});

module.exports = mongoose.model('Question', QuestionSchema)