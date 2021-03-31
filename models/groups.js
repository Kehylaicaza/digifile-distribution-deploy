const mongoose = require('mongoose');
const { Schema } = mongoose;

const GruposSchema = new Schema({
    id: { type: Number, required: false},
    name: { type: String, required: true},
    description: { type: String, required: true},
    empresa: { type: String, required: true},
    numIntegrantes: { type: Number, required: false},
    integrantes: { type: Array, required: false}
},{
    timestamps:true
});

module.exports = mongoose.model('Groups', GruposSchema);