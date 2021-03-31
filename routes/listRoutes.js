
const { Router } = require('express');
const router = Router();
const List = require('../models/list')

router.post('/newList', async (req, res) => {
    const { list_name, list_description, list_items, list_empresa } = req.body;
    const newList = new List({
        list_name: req.body.list_name,
        list_description: req.body.list_description,
        list_empresa: req.body.list_empresa,
        list_items: req.body.list_items,
        list_orden: req.body.list_orden,
        usado: req.body.usado,
    });
    await newList.save();
    //res.send("empresa registrado");
    res.json({ status: 'Lista creada' });
});

router.get('/getListByEmpresa/:empresa', async (req, res) => {
    const { empresa } = req.params;
    const listByEmpresas = await List.find({ "list_empresa": empresa });
    // console.log("sss "+grupos)
    res.json(listByEmpresas);
})

router.get('/getListUsado/:_id', async (req, res) => {
    const { _id } = req.params;
    const listByEmpresas = await List.find({ "_id": _id });
    // console.log("sss "+grupos)
    res.json(listByEmpresas);
})

router.get('/getListOne/:_id', async (req, res) => {
    const { _id } = req.params;
    const list = await List.findOne({ "_id": _id });
    // console.log("sss "+grupos)
    res.json(list);
})

router.post('/getListExistlist/', async (req, res) => {
    var exis = false
    const listaExiste = await List.find({ "list_name": req.body.list_name, "list_empresa": req.body.list_empresa });
    if (listaExiste == '') {
        exis = false
        res.json({
            'existe': exis,
        });
    }
    else {
        exis = true
        res.json({
            'existe': exis,
        });
    }
})


router.post('/getListExistlistName2/', async (req, res) => {
    var exis = false
    const listaExiste = await List.find({ "list_name": req.body.list_name, "list_empresa": req.body.list_empresa, "_id": { $ne: req.body._id } });

    if (listaExiste == '') {
        exis = false
        res.json({
            'existe': exis,
        });
    }
    else {
        exis = true
        res.json({
            'existe': exis,
        });
    }
})



router.post('/getListEmpresa/', async (req, res) => {
    const { _id } = req.body._id;
    console.log(req.body._id)
    const listByEmpresas = await List.findOne({ "_id": req.body._id });
    // console.log("sss "+grupos)
    // console.log(listByEmpresas)
 
    res.json(listByEmpresas);
})


router.put('/updateList/:id', async (req, res, next) => {
    const { id } = req.params;
    const list = {
        list_name: req.body.list_name,
        list_description: req.body.list_description,
        list_empresa: req.body.list_empresa,
        list_items: req.body.list_items,
        list_orden: req.body.list_orden,
        usado: req.body.usado,

    };
    await List.findByIdAndUpdate(id, { $set: list }, { new: true });
    res.json({ status: 'Lista Actualizada' });
})

router.put('/updateListUsado/:id', async (req, res, next) => {
    const { id } = req.params;
    const list = {
        list_name: req.body.list_name,
        list_decription: req.body.list_decription,
        list_empresa: req.body.list_empresa,
        list_items: req.body.list_items,
        list_orden: req.body.list_orden,
        usado: req.body.usado,

    };
    await List.findByIdAndUpdate(id, { $set: list }, { new: true });

    res.json({ status: 'Lista Actualizada' });
})


router.delete('/deleteList/:id', async (req, res, next) => {
    await List.findByIdAndRemove(req.params.id);
    res.json({ status: 'Lista Eliminada' });
})


module.exports = router;