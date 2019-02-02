const mongoose = require('mongoose');
const { Schema } = mongoose;

const anoSchema = new Schema({
    ano: { type: Number, required: true, unique: true },
    saldoinicial: {type: String, required:true},
    //saldoinicial: {type: Schema.Types.Decimal128, required:true},
})

module.exports = mongoose.model('Ano', anoSchema);