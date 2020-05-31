const mongoose = require('mongoose');
const slug = require('mongoose-slug-generator');
const Schema = mongoose.Schema;

mongoose.plugin(slug);

const UserSchema = mongoose.Schema({
    first_name: {
        type: String,
    },
    last_name: {
        type: String,
    },
    cedula: {
        type: Number,
    },
    address: {
        type: String,
    },
    address: {
        type: String,
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
    slug: { type: String, slug: ["first_name", "last_name", "username"] },
    role: {
        type: Schema.Types.ObjectId,
        ref: 'Role',
        required: true
    },
    bio: {
        type: String,
    },
    avatar: {
        type: String,
    },
    rating: Number,
    speciality: [{ type: Schema.Types.ObjectId, ref: 'Speciality' }],
    tests: [{ type: Schema.Types.ObjectId, ref: 'Test' }],
    created_at: {
        type: Date,
        default: Date.now
    },
})

module.exports = mongoose.model('User', UserSchema)