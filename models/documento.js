
const mongoose = require('mongoose');
const { Schema } = mongoose;

const DocumentoSchema = new Schema({
    id: { type: Number, required: false },
    clase_id: { type: String, required: false },
    nameDefault: { type: String, required: false },
    nombreDocumento: { type: String, required: false },
    checkOut: { type: Boolean, required: false },
    version: { type: String, required: false },
    urlDocumento: { type: String, required: false },
    type: { type: String, required: false },
    creadoPor: { type: String, required: false },
    empresa: { type: String, required: false },
    fechaCreacion: { type: String, required: false },
    tamanoArchivo: { type: String, required: false },
    newdoc_indices: { type: Array, required: false },
    versionesUrl: { type: Array, required: false },
    deleted_doc: { type: Boolean, required: false },
    history: { type: Array, required: false }
    /* clasedoc_name: { type: String, required: false},
    clasedoc_description: { type: String, required: false},
    clasedoc_empresa: { type: String, required: false},
    clasedoc_tamanoMax: { type: String, required: false},
    clasedoc_cantidadMax: { type: Number, required: false},
    clasedoc_cantidadDoc: { type: Number, required: false},
    clasedoc_indicesNum: { type: Number, required: false},
    clasedoc_estado: { type: String, required: false},
    newdoc_indices: { type: Array, required: false} */

}, {
    timestamps: true
});

module.exports = mongoose.model('Documentos', DocumentoSchema);


