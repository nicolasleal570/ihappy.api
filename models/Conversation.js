const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const ConversationsSchema = mongoose.Schema({

    participants: [{ type: Schema.Types.ObjectId, ref: 'User' }],
    last_message: String,
    last_time: {
        type:Date,
        default:Date.now
    },
    pendiente: {
        type:Boolean,
        default:true
    },
    hidden: {
        type: Boolean,
        default:false
    }

});

module.exports = mongoose.model('Conversation', ConversationsSchema)