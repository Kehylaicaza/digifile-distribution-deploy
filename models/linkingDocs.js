const mongoose = require('mongoose');
const { Schema } = mongoose;

const LinkingDocsSchema = new Schema({
    id: { type: Number, required: false},
    name: { type: String, required: true},
    description: { type: String, required: true},
    index_id: { type: String, required: true},
    empresa_id: { type: String, required: true},
    origin_id: { type: String, required: true},
    final_id: { type: String, required: false}
},{
    timestamps:true
});

module.exports = mongoose.model('LinkinDocs', LinkingDocsSchema);