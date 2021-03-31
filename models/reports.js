
const mongoose = require('mongoose');
const { Schema } = mongoose;
const ReportsSchema = new Schema({
    id: { type: Number, required: false },
    empresa_id: { type: String, required: false },
    user_id: { type: String, required: false },
    user_name: { type: String, required: false },
    module: { type: String, required: false },
    type: { type: String, required: false },
    description: { type: String, required: false },
    date: { type: String, required: false },
    origen: { type: String, required: false },
    hour: { type: String, required: false },
    ip: { type: String, required: false },

}, {
    timestamps: true
});

module.exports = mongoose.model('Reports', ReportsSchema );