const { Router } = require('express');
const router = Router();
const Reports = require('../models/reports')



router.post('/newReports', async (req, res) => {
    const newReport = new Reports({
        empresa_id: req.body.empresa_id,
        user_id: req.body.user_id,
        user_name: req.body.user_name,
        module: req.body.module,
        type: req.body.type,
        description: req.body.description,
        date: req.body.date,
        origen: req.body.origen,
        hour: req.body.hour,
        ip: req.body.ip,
    });
    await newReport.save();
    res.json({ status: 'report creado' });
});


router.post('/getAllReports', async (req, res) => {

    const reportess = await Reports.find({ empresa_id: req.body.index_name, "empresa": req.body.empresa });
    res.json(reportess);
})


router.get('/getmyIpAddress', async (req, res) => {
    var http2 = require('http');

    http2.get({'host': 'api.ipify.org', 'port': 80, 'path': '/'}, function(resp) {
      resp.on('data', function(ip ) {
      //  console.log("My public IP address is: " + ip);
        res.send({ ip: ip.toString() });
      });
    });
});


router.post('/getAllUserReport', async (req, res) => {
    const usuarios = await Reports.find({ "user_id": req.body.user_id, "empresa_id":req.body.empresa_id});
    res.send(usuarios)
})


router.get('/getAllTodosParametersUsers/:id', async (req, res) => {
    const { id } = req.params;
    const reports= await Reports.find({ "empresa_id": id,"origen":"Usuario"});
    res.send(reports)
})

router.get('/getAllTodosParametersAdmin/:id', async (req, res) => {
    const { id } = req.params;
    const reports= await Reports.find({ "empresa_id": id,"origen":"Administrador"});
    res.send(reports)
})

router.post('/getAllUsOnlyModAllAct', async (req, res) => {
    console.log(req.body.empresa_id)
    console.log(req.body.module)
    const usuarios = await Reports.find({ "empresa_id":req.body.empresa_id, "module": req.body.module});
    res.send(usuarios)
})

router.post('/getAllUsOnlyModOnlyAct', async (req, res) => {
    const usuarios = await Reports.find({ "empresa_id":req.body.empresa_id, "module": req.body.module, "type": req.body.type});
    res.send(usuarios)
})

router.post('/getOnlyUsOnlyModOnlyAct', async (req, res) => {
    const usuarios = await Reports.find({ "user_id": req.body.user_id,"empresa_id":req.body.empresa_id, "module": req.body.module, "type": req.body.type});
    res.send(usuarios)
})

router.post('/getOnlyUsOnlyModAllAct', async (req, res) => {
    const usuarios = await Reports.find({ "user_id": req.body.user_id,"empresa_id":req.body.empresa_id, "module": req.body.module});
    res.send(usuarios)
})


module.exports = router;