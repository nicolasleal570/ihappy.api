const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const ConversationsSchema = mongoose.Schema({

    participants: [{ type: Schema.Types.ObjectId, ref: 'User' }],
    last_message: String,
    last_time: Date

});

module.exports = mongoose.model('Conversation', ConversationsSchema)