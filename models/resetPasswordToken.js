const mongoose = require('mongoose');
const { Schema } = mongoose;

const resetPasswordTokenSchema = new mongoose.Schema({
    id: { type: Number, required: false},
    _userId: { type: String, required: false},
    resettoken: { type: String, required: false},
    link: { type: String, required: false},
    type: { type: String, required: false},
    createdAt: { type: Date, required: true, default: Date.now, expires: 43200 },

},{
    timestamps:true
});



module.exports = mongoose.model('resetPasswordToken', resetPasswordTokenSchema);