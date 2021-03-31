
const mongoose = require('mongoose');
const { Schema } = mongoose;
const ListSchema = new Schema({
    id: { type: Number, required: false },
    list_name: { type: String, required: false },
    list_description: { type: String, required: false },
    list_empresa: { type: String, required: false },
    list_items: { type: Array, required: false },
    list_items: { type: Array, required: false },
    list_orden: { type: String, required: false },
    usado: { type: Number, required: true },

}, {
    timestamps: true
});

module.exports = mongoose.model('List', ListSchema);


