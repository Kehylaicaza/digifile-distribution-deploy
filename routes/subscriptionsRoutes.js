const { Router } = require('express');
const router = Router();
const Subscriptions = require('../models/subscriptions')


/* //router.get('/', (req, res) => res.send('Holly Molly'))
router.get('/', async (req, res) => {
    const grupos = await Groups.find();
    console.log(grupos)
    alert("entre")
   // res.json(grupos);       
}) */

router.get('/getSubscriptions', async (req, res) => {
    const subscriptions = await Subscriptions.find();
    res.send(subscriptions)      
})

router.get('/getSubscriptions/:empresa', async (req, res) => {
    const { empresa } = req.params;
    const subscriptions = await Subscriptions.find({"empresa":empresa});
    res.json(subscriptions); 
})

router.get('/getSubscriptionsByUser/:_id', async (req, res) => {
    const { _id } = req.params;
    const subscriptions = await Subscriptions.find({"integrantes._id":_id});
   // console.log("alo??"+grupos)
    res.json(subscriptions); 
})

router.get('/getSubscriptionsById/:_id', async (req, res) => {
    const { _id } = req.params;
    const subscriptions = await Subscriptions.find({"doc_id":_id});
 
    res.json(subscriptions); 
})



router.get('/getSubscriptionsByClass/:doc_id', async (req, res) => {
    const { doc_id } = req.params;
   
    const subscriptions = await Subscriptions.find({ "doc_id": doc_id });
   // console.log("alo??"+grupos)
    res.json(subscriptions); 
})

router.get('/getSubscriptionsbyIDUser/:id', async (req, res) => {
    const { id } = req.params;
    const subscriptions = await Subscriptions.find({ "array_users.user_id": id });

    res.json(subscriptions); 
})




router.put('/updateSubscriptions/:id', async (req, res,next) => {
    const { id } = req.params;
 
    const subscriptions = {
        doc_id: req.body.doc_id,
        empresa: req.body.empresa,
        array_users: req.body.array_users
     
       
    };
    await Subscriptions.findByIdAndUpdate(id, {$set: subscriptions}, {new: true});
    res.json({status: 'Actualización Exitosa'}); 
})


router.delete('/delete/:id', async (req, res,next) => {
    await Subscriptions.findByIdAndRemove(req.params.id);
    res.json({status: 'Employee Deleted'});
})

router.delete('/deleteSubscriptionsByClass/:id', async (req, res,next) => {
    const { id } = req.params;
    await Subscriptions.deleteOne({"doc_id": id} );
    res.json({status: 'suscription Deleted'});
})

router.post('/newSubscriptions', async (req, res) => {
    //const { name, description,permisos } = req.body;
    const { doc_id, empresa,array_users} = req.body;
    const newSubscriptions = new Subscriptions({doc_id, empresa,array_users});
    await newSubscriptions.save();
    res.json({status: 'Nueva Suscripcion'});  

});


module.exports = router;