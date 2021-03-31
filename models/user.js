const mongoose = require('mongoose');
const { Schema } = mongoose;

const UserSchema = new mongoose.Schema({
    id: { type: Number, required: false},
    name: { type: String, required: false},
    username: { type: String, required: false},
    description: { type: String, required: false},
    email: { type: String, required: true},
    password: { type: String, required: true},
    rol: { type: String, required: true},
    grupo: { type: String, required: false},
    empresa: { type: Array, required: false},
    numUsuarios: { type: Number, required: false},
    status:{ type: String, required: false},
    imageProfile: { type: String, required: false}
},{
    timestamps:true
});



module.exports = mongoose.model('User', UserSchema);