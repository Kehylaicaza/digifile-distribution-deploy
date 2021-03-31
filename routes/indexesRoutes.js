const { Router } = require('express');
const router = Router();
const Indexes = require('../models/indexes')

router.get('/getIndexes', async (req, res) => {
    const indexes = await Indexes.find();
    res.send(indexes)      
})


router.put('/update/:id', async (req, res,next) => {
    const { id } = req.params;
    const indexes = {
        index_name: req.body.index_name,
        index_description: req.body.index_description,
        index_type: req.body.index_type,
        index_legnth: req.body.index_legnth,
        empresa:req.body.empresa,
        lista_id:req.body.lista_id,
        usado:req.body.usado
    };
    await Indexes.findByIdAndUpdate(id, {$set: indexes}, {new: true});
    res.json({status: 'Ìndice Actualizado'});  
})


router.delete('/delete/:id', async (req, res,next) => {
    await Indexes.findByIdAndRemove(req.params.id);
    res.json({status: 'Ìndice Eliminado'});
})
router.get('/getIndexesByEmpresa/:empresa', async (req, res) => {
    const { empresa} = req.params;
    const indexesByEmpresas = await Indexes.find({"empresa":empresa});
   // console.log("sss "+grupos)
    res.json(indexesByEmpresas); 
})


router.get('/getIndexeOnlybyId/:_id', async (req, res) => {
    const { _id} = req.params;
    const indexesByOnlyId = await Indexes.find({"_id":_id});
    res.json(indexesByOnlyId); 
})


router.get('/getIndexeOnlyOne/:_id', async (req, res) => {
    const { _id} = req.params;
    const indexesByOnlyId = await Indexes.findOne({"_id":_id});
    res.json(indexesByOnlyId); 
})



router.post('/getIndexeOnlybyName', async (req, res) =>{

    const indexesByOnlyName = await Indexes.find({"index_name":req.body.index_name, "empresa":req.body.empresa});
    res.json(indexesByOnlyName); 
})


router.get('/getIndexebyList/:_id', async (req, res) => {
    const { _id } = req.params;
    console.log(_id )
    const documentos = await Indexes.find({ "lista_id": _id });
    res.json(documentos);
  })


router.post('/newIndex', async (req, res) => {
    const { index_name, index_description, index_type,index_length,lista_id } = req.body;
    const newIndex= new Indexes({ 
        index_name: req.body.index_name,
        index_description: req.body.index_description,
        index_type: req.body.index_type,
        index_legnth: req.body.index_legnth,
        empresa:req.body.empresa,
        lista_id:req.body.lista_id,
        usado:req.body.usado
        });
    console.log("ttt "+newIndex);
    await newIndex.save();
    res.json({status: 'Índice creado'});
});


module.exports = router;