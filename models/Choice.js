const mongoose = require('mongoose');

const ChoiceSchema = mongoose.model.Schema({
    answer: String,
    value: String //Aca que por ejemplo si oprimes aca puede que seas que si Psicopata, Depresivo etc.. Como para definir que tipo de persona eligiria esto
})

module.exports = mongoose.model('Choice', ChoiceSchema)