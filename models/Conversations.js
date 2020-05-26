const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const ConversationsSchema = mongoose.Schema({

    id_user: {type: Schema.Types.ObjectId, ref: 'User'},
    id_contact: {type: Schema.Types.ObjectId, ref: 'User'},
    last_message: String,
    last_time: Date


});

module.exports = mongoose.model('Conversations', ConversationsSchema)