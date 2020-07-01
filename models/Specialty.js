const mongoose = require('mongoose');
const slug = require('mongoose-slug-generator');

mongoose.plugin(slug);

const SpecialitySchema = mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    slug: { type: String, slug: "name" }
})
module.exports = mongoose.model('Speciality', SpecialitySchema)
