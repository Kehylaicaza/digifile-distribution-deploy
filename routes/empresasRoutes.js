const { Router } = require('express');
const router = Router();
const Empresas = require('../models/empresas')

router.get('/getEmpresa', async (req, res) => {
    const empresas = await Empresas.find();
    res.send(empresas)      
})


router.get('/getAllempresas', async (req, res) => {
    const empresas = await Empresas.find({"_id": { $ne: "60241c852c8f92c391fde8af" } });
    res.send(empresas)      
})


router.get('/countAllEmpresas', async (req, res) => {
    const empresas = await Empresas.countDocuments({})
    res.json(empresas)      
})



router.get('/getOnlyEmpresa/:_id', async (req, res) => {
    const { _id } = req.params;
    const empresa = await Empresas.findOne({"_id":_id});
   // console.log("alo??"+grupos)
    res.json(empresa); 
})

router.post('/getMultipleID', async (req, res) => {
    const empresas = await Empresas.find({
        "_id" : {
          "$in" : 
            [req.body.id1, 
             req.body.id2,
             req.body.id3
            ]
         }
      });
      console.log(empresas)
    res.send(empresas)      
})


router.put('/update/:id', async (req, res,next) => {
    const { id } = req.params;
    console.log("soy current users"+req.body.currentUsers)
    const empresas = {
        nombre: req.body.nombre,
        representante: req.body.representante,
        direccion: req.body.direccion,
        ruc: req.body.ruc,
        email_empresarial: req.body.email_empresarial,
        email_administrador: req.body.email_administrador,
        numUsuarios:req.body.numUsuarios,
        mutlipleUsers:req.body.mutlipleUsers,
        currentUsers:req.body.currentUsers,
        usuarios_activos:req.body.usuarios_activos,
        license_begin:req.body.license_begin,
        license_end:req.body.license_end,
    };
    console.log("llegue update")
    await Empresas.findByIdAndUpdate(id, {$set: empresas}, {new: true});
    res.json({status: 'empresa Updated'});  
})


router.delete('/delete/:id', async (req, res,next) => {
    await Empresas.findByIdAndRemove(req.params.id);
    res.json({status: 'Employee Deleted'});
})

router.post('/newEmpresa', async (req, res) => {
    const { nombre, representante, direccion,email_empresarial,email_administrador,contrasena,numUsuarios } = req.body;
    const newEmpresa = new Empresas({ nombre:req.body.nombre,
         representante:req.body.representante, 
         direccion:req.body.direccion,
         ruc:req.body.ruc,
         email_empresarial: req.body.email_empresarial,
         email_administrador:req.body.email_administrador,
         contrasena:req.body.contrasena,
         mutlipleUsers:req.body.mutlipleUsers,
         currentUsers:req.body.currentUsers,
         numUsuarios:req.body.numUsuarios,
         usuarios_activos:req.body.usuarios_activos,
         license_begin:req.body.license_begin,
         license_end:req.body.license_end,});
    console.log("ttt "+newEmpresa);
    await newEmpresa.save();
    //res.send("empresa registrado");
    res.json({status: 'EMPRESA CREADA'});
});

router.post('/newEmpresaSuperAdmin', async (req, res) => {
    const { nombre, representante, direccion,email_empresarial,email_administrador,contrasena,numUsuarios } = req.body;
    const newEmpresa = new Empresas({ nombre:req.body.nombre,
         representante:req.body.representante, 
         direccion:req.body.direccion,
         ruc:req.body.ruc,
         email_empresarial: req.body.email_empresarial,
         email_administrador:req.body.email_administrador,
         contrasena:req.body.contrasena,
         mutlipleUsers:req.body.mutlipleUsers,
         currentUsers:[],
         numUsuarios:req.body.numUsuarios,
         usuarios_activos:req.body.usuarios_activos,
         license_begin:req.body.license_begin,
         license_end:req.body.license_end,});
 
    await newEmpresa.save();
    //res.send("empresa registrado");
    console.log(newEmpresa._id)
    res.json({"_id": newEmpresa._id});
});

module.exports = router;