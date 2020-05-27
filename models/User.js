const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const UserSchema = mongoose.Schema({
    first_name: {
        type: String,
        default: ''
    },
    last_name: {
        type: String,
        default: ''
    },
    cedula: {
        type: Number,
        default: ''
    },
    adress: {
        type: String,
        default: ''
    },
    email: {
        type: String,
        required: true,
        min: 6,
        max: 255,
        unique: true
    },
    username: {
        type: String,
        required: true,
        min: 6,
        max: 255,
        unique: true
    },
    password: {
        type: String,
        required: true,
        max: 1024,
        min: 6
    },
    role: {
        type: Schema.Types.ObjectId,
        ref: 'Role',
        required: true
    },
    bio: {
        type: String,
        default: ''
    },
    created_at: {
        type: Date,
        default: Date.now
    },
    speciality: [{ type: Schema.Types.ObjectId, ref: 'Especialidad' }],
    tests: [{ type: Schema.Types.ObjectId, ref: 'Test' }]
})

module.exports = mongoose.model('User', UserSchema)