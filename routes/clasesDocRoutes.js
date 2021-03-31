
const { Router } = require('express');
const router = Router();
const ClasesDoc = require('../models/clasesDoc')

router.post('/newClassDoc', async (req, res) => {

    const { clasedoc_name, clasedoc_description, clasedoc_cantidadDoc, clasedoc_indicesNum, clasedoc_tamanoMax, clasedoc_cantidadMax, clasedoc_periodoExp, empresa } = req.body;
    const newClassDoc = new ClasesDoc({
        clasedoc_name: req.body.clasedoc_name,
        clasedoc_description: req.body.clasedoc_description,
        clasedoc_empresa: req.body.clasedoc_empresa,
        clasedoc_cantidadDoc: req.body.clasedoc_cantidadDoc,
        clasedoc_cantidadDocIlimitado: req.body.clasedoc_cantidadDocIlimitado,
        clasedoc_indicesNum: req.body.clasedoc_indicesNum,
        clasedoc_tamanoMax: req.body.clasedoc_tamanoMax,
        empresa: req.body.empresa,
        clasedoc_cantidadMax: req.body.clasedoc_cantidadMax,
        clasedoc_estado: req.body.clasedoc_estado,
        clasedoc_indices: req.body.clasedoc_indices,
        permisosGrupo: req.body.permisosGrupo,
        permisosUsuario: req.body.permisosUsuario
    });


    await newClassDoc.save();
    //res.send("empresa registrado");
    res.json({ status: newClassDoc._id });
});

router.get('/getClassDoc/:empresa', async (req, res) => {
    const { empresa } = req.params;
    const clase = await ClasesDoc.find({ "clasedoc_empresa": empresa });
    res.json(clase);
})


router.get('/getClassDocNotGroup/:empresa', async (req, res) => {
    const { empresa } = req.params;
    const clase = await ClasesDoc.find({ "clasedoc_empresa": empresa, 'permisosGrupo': { $size: 0 } });
    res.json(clase);
})

router.get('/getIndexeUsedInClass/:idIndexe', async (req, res) => {
    const { idIndexe } = req.params;
    const clase = await ClasesDoc.find({ "clasedoc_indices.indiceGeneral_id": idIndexe });
    res.json(clase);
})


router.get('/getClassDocNotUsers/:empresa', async (req, res) => {
    const { empresa } = req.params;
    const clase = await ClasesDoc.find({ "clasedoc_empresa": empresa, 'permisosUsuario': { $size: 0 } });
    res.json(clase);
})

router.get('/getDocsWithPermissions/:empresa', async (req, res) => {
    const { empresa } = req.params;
    const clase = await ClasesDoc.find({ $or: [{ "clasedoc_empresa": empresa, "permisosGrupo": { $gt: { $size: 0 } } }, { "permisosUsuario": { $gt: { $size: 0 } }, "clasedoc_empresa": empresa }] });
    res.json(clase);
})


router.get('/getDocsWithoutPermissions/:empresa', async (req, res) => {
    const { empresa } = req.params;
    const clase = await ClasesDoc.find({ $and: [{ "clasedoc_empresa": empresa, "permisosGrupo": { $size: 0 } }, { "permisosUsuario": { $size: 0 }, "clasedoc_empresa": empresa }] });
    res.json(clase);
})

router.get('/countAllDocumentsEmpresa/:empresa', async (req, res) => {

    const { empresa } = req.params;
    const dox = await ClasesDoc.countDocuments({ "clasedoc_empresa": empresa })
    res.json(dox)
})

router.post('/countAllDocumentsTypeNameRepeatEmpresa', async (req, res) => {

    const dox = await ClasesDoc.countDocuments({ "clasedoc_empresa": req.body.clasedoc_empresa, "clasedoc_name": req.body.clasedoc_name })
    res.json(dox)
})

router.get('/getClassDocID/:id', async (req, res) => {
    const { id } = req.params;

    const clase = await ClasesDoc.findById(id);

    res.json(clase);
})

router.get('/getClassDocIDBulkUpload/:id', async (req, res) => {
    const { id } = req.params;

    const clase = await ClasesDoc.findOne({ "_id": id });

    res.json(clase);
})

router.put('/update/:id', async (req, res, next) => {
    const { id } = req.params;
    const newClassDoc = {
        clasedoc_name: req.body.clasedoc_name,
        clasedoc_description: req.body.clasedoc_description,
        clasedoc_empresa: req.body.clasedoc_empresa,
        clasedoc_cantidadDoc: req.body.clasedoc_cantidadDoc,
        clasedoc_indicesNum: req.body.clasedoc_indicesNum,
        clasedoc_cantidadDocIlimitado: req.body.clasedoc_cantidadDocIlimitado,
        clasedoc_tamanoMax: req.body.clasedoc_tamanoMax,
        clasedoc_cantidadMax: req.body.clasedoc_cantidadMax,
        clasedoc_estado: req.body.clasedoc_estado,
        empresa: req.body.empresa,
        clasedoc_indices: req.body.clasedoc_indices,
        permisosGrupo: req.body.permisosGrupo,
        permisosUsuario: req.body.permisosUsuario

    };
    await ClasesDoc.findByIdAndUpdate(id, { $set: newClassDoc }, { new: true });
    res.json({ status: 'Actualización Exitosa' });
})

router.get('/getDocumetosbyEmpresa/:empresa', async (req, res) => {
    const { empresa } = req.params;
    const clases = await ClasesDoc.find({ "clasedoc_empresa": empresa });

    res.json(clases);
})


router.put('/update2/:id', async (req, res, next) => {
    const { id } = req.params;
    const newClassDoc = {
        clasedoc_name: req.body.clasedoc_name,
        clasedoc_description: req.body.clasedoc_description,
        clasedoc_empresa: req.body.clasedoc_empresa,
        clasedoc_cantidadDoc: req.body.clasedoc_cantidadDoc,
        clasedoc_indicesNum: req.body.clasedoc_indicesNum,
        clasedoc_tamanoMax: req.body.clasedoc_tamanoMax,
        clasedoc_cantidadMax: req.body.clasedoc_cantidadMax,
        clasedoc_estado: req.body.clasedoc_estado,
        empresa: req.body.empresa,
        clasedoc_indices: req.body.clasedoc_indices,
        permisosGrupo: req.body.permisosGrupo,
        permisosUsuario: req.body.permisosUsuario

    };
    await ClasesDoc.findByIdAndUpdate(id, { $set: { permisosGrupo: [], permisosUsuario: [] } }, { new: true });
    res.json({ status: 'Actualización Exitosa' });
})

router.put('/update3/:id', async (req, res, next) => {
    const { id } = req.params;
    const newClassDoc = {
        clasedoc_name: req.body.clasedoc_name,
        clasedoc_description: req.body.clasedoc_description,
        clasedoc_empresa: req.body.clasedoc_empresa,
        clasedoc_cantidadDoc: req.body.clasedoc_cantidadDoc,
        clasedoc_indicesNum: req.body.clasedoc_indicesNum,
        clasedoc_tamanoMax: req.body.clasedoc_tamanoMax,
        clasedoc_cantidadMax: req.body.clasedoc_cantidadMax,
        clasedoc_estado: req.body.clasedoc_estado,
        empresa: req.body.empresa,
        clasedoc_indices: req.body.clasedoc_indices,
        permisosGrupo: req.body.permisosGrupo,
        permisosUsuario: req.body.permisosUsuario

    };
    await ClasesDoc.findByIdAndUpdate(id, { $set: { permisosGrupo: req.body.permisosGrupo, permisosUsuario: req.body.permisosUsuario } }, { new: true });
    res.json({ status: 'Actualización Exitosa' });
})


router.put('/updatePermisosGrupo/:id/', async (req, res, next) => {
    const { id } = req.params;
    await ClasesDoc.findByIdAndUpdate(id, { $set: { permisosGrupo: req.body.permisosGrupo } }, { new: true });
    res.json({ status: 'Actualización Exitosa' });
})

router.put('/updatePermisosUsuarios/:id/', async (req, res, next) => {
    const { id } = req.params;
    await ClasesDoc.findByIdAndUpdate(id, { $set: { permisosUsuario: req.body.permisosUsuario } }, { new: true });
    res.json({ status: 'Actualización Exitosa' });
})


router.post('/getClassDocbyEmpresaByUserAccess/', async (req, res) => {
    const documentos = await ClasesDoc.find({ "clasedoc_empresa": req.body.empresa_id, "permisosUsuario.nombreUsuario": req.body.user_id });
    console.log("i find" + documentos)
    res.json(documentos);
})




router.post('/getClassDocbyEmpresaByGroupAccess/', async (req, res) => {

    const documentos = await ClasesDoc.find({ "clasedoc_empresa": req.body.empresa_id, "permisosGrupo.nombreGrupo": req.body.grupo_id });
    res.json(documentos);
})


router.post('/getClassDocbyEmpresaByGroupUser/', async (req, res) => {

    const documentos = await ClasesDoc.find({ "clasedoc_empresa": req.body.empresa_id, "permisosGrupo.nombreGrupo": req.body.grupo_id });
    res.json(documentos);
})

router.post('/getClaseOnlybyName', async (req, res) => {

    const claseByOnlyName = await ClasesDoc.find({ "clasedoc_name": req.body.clasedoc_name, "clasedoc_empresa": req.body.clasedoc_empresa });
    res.json(claseByOnlyName);
})


router.get('/getDocumetosbyIndexe/:_id', async (req, res) => {
    const { _id } = req.params;
    const documentos = await ClasesDoc.find({ "clasedoc_indices.indiceGeneral_id": _id });
    res.json(documentos);
})

router.get('/getDocumetosbyIndexeOne/:_id', async (req, res) => {
    const { _id } = req.params;
    const documentos = await ClasesDoc.findOne({ "clasedoc_indices.indiceGeneral_id": _id });
    res.json(documentos);
})




router.delete('/delete/:id', async (req, res, next) => {
    await ClasesDoc.findByIdAndRemove(req.params.id);
    res.json({ status: 'Clase de Documentos Eliminada' });
})


module.exports = router;

