const mongoose = require('mongoose');

const RoleSchema = mongoose.Schema({
    public_name: {
        type: String,
        required: true
    },
    identification: {
        type: String,
        required: true,
        enum: ['psicologo', 'usuario']
    },
})

module.exports = mongoose.model('Roles', RoleSchema)