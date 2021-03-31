const mongoose = require('mongoose');
const { Schema } = mongoose;

const IndexesSchema = new Schema({
    id: { type: Number, required: false},
    index_name: { type: String, required: true},
    index_description: { type: String, required: true},
    index_type: { type: String, required: true},
    empresa: { type: String, required: true},
    index_legnth: { type: Number, required: true},
    lista_id:{ type:String, required: false},
    usado: { type: Number, required: true},
},{
    timestamps:true
});

module.exports = mongoose.model('Indexes', IndexesSchema);