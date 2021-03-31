const { Router } = require('express');
const router = Router();
const Groups = require('../models/groups')


/* //router.get('/', (req, res) => res.send('Holly Molly'))
router.get('/', async (req, res) => {
    const grupos = await Groups.find();
    console.log(grupos)
    alert("entre")
   // res.json(grupos);       
}) */

router.get('/getGroup', async (req, res) => {
    const grupos = await Groups.find();
    res.send(grupos)      
})

router.get('/getGroup/:empresa', async (req, res) => {
    const { empresa } = req.params;
    const grupos = await Groups.find({"empresa":empresa});
    res.json(grupos); 
})

router.get('/getGroupByUser/:_id', async (req, res) => {
    const { _id } = req.params;
    const grupos = await Groups.find({"integrantes":_id});
   // console.log("alo??"+grupos)
    res.json(grupos); 
})

router.get('/getEmpresabyIDUser/:id', async (req, res) => {
    const { id } = req.params;
    const grupos = await Groups.find({ "integrantes": id });
    console.log("ddd "+grupos.length)
    res.json(grupos); 
})




router.put('/update/:id', async (req, res,next) => {
    const { id } = req.params;
    const grupos = {
        name: req.body.name,
        description: req.body.description,
        empresa: req.body.empresa,
        numIntegrantes: req.body.numIntegrantes,
        integrantes: req.body.integrantes
    };
    await Groups.findByIdAndUpdate(id, {$set: grupos}, {new: true});
    res.json({status: 'Actualización Exitosa'}); 
})


router.delete('/delete/:id', async (req, res,next) => {
    await Groups.findByIdAndRemove(req.params.id);
    res.json({status: 'Employee Deleted'});
})

router.post('/newGroup', async (req, res) => {
    //const { name, description,permisos } = req.body;
    const { name, description,empresa,numIntegrantes,integrantes} = req.body;
    const newGroup = new Groups({ name, description,empresa,numIntegrantes,integrantes});
    console.log("ttt "+newGroup);
    await newGroup.save();
    res.json({status: 'Se ha creado un nuevo grupo'});  

});


module.exports = router;