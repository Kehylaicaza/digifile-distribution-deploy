const { Router } = require('express');
const router = Router();
const LinkingDocs = require('../models/linkingDocs')


router.post('/newLinkingDocs', async (req, res) => {
   // const { list_name, list_description, list_items, list_empresa } = req.body;
    const newLinkingDocs = new LinkingDocs({
        name: req.body.name,
        description: req.body.description,
        empresa_id: req.body.empresa_id,
        index_id: req.body.index_id,
        origin_id: req.body.origin_id,
        final_id: req.body. final_id
    });
    await newLinkingDocs.save();
    //res.send("empresa registrado");
    res.json({ status: 'Link creada' });
});



router.put('/updateLinkingDocs/:id', async (req, res,next) => {
    const { id } = req.params;
    const link= {
        name: req.body.name,
        description: req.body.description,
        empresa_id: req.body.empresa_id,
        index_id: req.body.index_id,
        origin_id: req.body.origin_id,
        final_id: req.body. final_id

    };
    await LinkingDocs.findByIdAndUpdate(id, {$set: link}, {new: true});
    res.json({status: 'Link Actualizado'});  
})


router.delete('/deleteLinkingDocs/:id', async (req, res,next) => {
    await LinkingDocs.findByIdAndRemove(req.params.id);
    res.json({status: 'Link Eliminada'});
})


router.get('/getLinkId/:_id', async (req, res) => {
    const { _id } = req.params;
    const linking = await LinkingDocs.find({ "_id": _id});
    // console.log("sss "+grupos)
    res.json(linking );
})

//linking
router.delete('/deleteLinkingDocsMany/:clase_id', async (req, res,next) => {
    const { clase_id } = req.params;
    await LinkingDocs.deleteMany({$or: [ {"origin_id":clase_id} ,{ "final_id":clase_id} ]})
    res.json({status: 'Link Eliminada'});
})

router.get('/getLinkingOrigin/:_id', async (req, res) => {
    const { _id } = req.params;
    const linking = await LinkingDocs.find({ "origin_id": _id});
    // console.log("sss "+grupos)

    res.json(linking );
})

router.post('/getLinkName/', async (req, res) => {
 
    const linking = await LinkingDocs.find({ "name": req.body.name,"empresa_id": req.body.empresa_id});
    res.json(linking );
  
})

router.get('/getLinkEmpresa/:empresa', async (req, res) => {
    const { empresa } = req.params;
   
    const linkByEmpresas = await LinkingDocs.find({ "empresa_id": empresa });
 
    res.json(linkByEmpresas);
})


router.post('/getLinkNameEdit', async (req, res) => {
 
    const linking = await LinkingDocs.find({ "name": req.body.name,"empresa_id": req.body.empresa_id, "_id": { $ne: req.body._id } });
    res.json(linking );
  
})

module.exports = router;