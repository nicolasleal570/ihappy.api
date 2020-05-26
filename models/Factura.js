const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const FacturaSchema = mongoose.Schema({
    id_psicologo:{type: Schema.Types.ObjectId, ref: 'User'},
    id_usuario: {type: Schema.Types.ObjectId, ref: 'User'},
    fecha: Date,
    total: Number,
    id_tarjeta: {type: Schema.Types.ObjectId, ref: 'Bank_accounts'}
});

module.exports = mongoose.model('Factura', FacturaSchema)