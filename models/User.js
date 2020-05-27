const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const UserSchema = mongoose.Schema({
    name: String,
    last_name: String,
    email: String,
    password: String,
    cedula: Number,
    adress: String,
    role: {type: Schema.Types.ObjectId, ref: 'Role'},
    bio: String,
    speciality:  [{type: Schema.Types.ObjectId, ref: 'Especialidad'}],
    tests:[{type: Schema.Types.ObjectId, ref: 'Test'}]
})

module.exports = mongoose.model('Users', UserSchema)