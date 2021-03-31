const mongoose = require('mongoose');
const { Schema } = mongoose;

const SubscriptionsSchema = new Schema({
    id: { type: Number, required: false},
    doc_id: { type: String, required: false},
    empresa: { type: String, required: false},
    array_users: { type: Array, required: false},
    array_activity: { type: Array, required: false}
},{
    timestamps:true
});

module.exports = mongoose.model('Subscriptions', SubscriptionsSchema);