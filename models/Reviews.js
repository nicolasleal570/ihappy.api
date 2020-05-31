const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const ReviewsSchema = mongoose.Schema({
    psicologo: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    user: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    content: { type: String, required: true },
    created_at: {
        type: Date,
        default: Date.now
    },
});

module.exports = mongoose.model('Reviews', ReviewsSchema)