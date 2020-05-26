const mongoose = require('mongoose');

const ReviewsSchema = mongoose.model.Schema({
    id_psicologo:{type: Schema.Types.ObjectId, ref: 'User'},
    id_usuario: {type: Schema.Types.ObjectId, ref: 'User'},
    content: String,
    created_at: Date,
    rating: Number
});

module.exports = mongoose.model('Reviews', ReviewsSchema)