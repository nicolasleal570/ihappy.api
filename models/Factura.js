const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const FacturaSchema = mongoose.Schema({
    psicologo:{type: Schema.Types.ObjectId, ref: 'User', required: true},
    user: {type: Schema.Types.ObjectId, ref: 'User', requited: true},
    fecha: {
    type: Date,
    default: Date.now
    },
    total: Number,
    payment_id: String
});

module.exports = mongoose.model('Factura', FacturaSchema)