const mongoose = require('mongoose');

const UserSchema = mongoose.Schema({
    name: {
        type: String,
        required: true

    },
    last_name: {
        type: String,
        required: true

    },
    cedula: Number,
    adress: String,
    public_name: {
        type: String,
        required: true
    },
    identification: {
        type: String,
        enum: ['Psicologo', 'Usuario']
    },

    bio: String,
    speciality:  [{type: Schema.Types.ObjectId, ref: 'Especialidad'}],
    tests:[{type: Schema.Types.ObjectId, ref: 'Test'}]
})

module.exports = mongoose.model('Users', UserSchema)