const mongoose = require('mongoose');
const { Schema } = mongoose;

const NotificationssSchema = new Schema({
    id: { type: Number, required: false},
    clase_id: { type: String, required: false},
    doc_id: { type: String, required: false},
    mensaje: { type: String, required: false},
    by: { type: String, required: false},
    enlace: { type: String, required: false},
    tipo:{ type: String, required: false},
    tipoDoc:{ type: String, required: false},
    empresa: { type: String, required: false},
    array_activity: { type: Array, required: false},
    fecha: { type: String, required: false},
},{
    timestamps:true
});

module.exports = mongoose.model('Notifications', NotificationssSchema);