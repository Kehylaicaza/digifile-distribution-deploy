
const mongoose = require('mongoose');
const { Schema } = mongoose;

const ClasesDocSchema = new Schema({
    id: { type: Number, required: false},
    clasedoc_name: { type: String, required: true},
    clasedoc_description: { type: String, required: false},
    clasedoc_empresa: { type: String, required: false},
    clasedoc_cantidadDoc: { type: Number, required: true},
    clasedoc_cantidadDocIlimitado: { type: Boolean, required: true},
    clasedoc_indicesNum: { type: Number, required: true},
    clasedoc_tamanoMax: { type: Number, required: true},
    clasedoc_cantidadMax: { type: Number, required: true},
    clasedoc_estado: { type: String, required: true},
    clasedoc_indices: { type: Array, required: false},
    permisosGrupo: { type: Array, required: false},
    permisosUsuario: { type: Array, required: false}
},{
    timestamps:true
});

module.exports = mongoose.model('ClasesDoc', ClasesDocSchema);
