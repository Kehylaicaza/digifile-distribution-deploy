const { Router } = require('express');
const router = Router();
const Notifications = require('../models/notifications')


router.post('/newNotifications', async (req, res) => {

  const {clase_id,doc_id, empresa,array_activity,tipoDoc,tipo,mensaje,fecha,by,enlace,} = req.body;
  const newNotification = new  Notifications({clase_id,doc_id, empresa,array_activity,tipoDoc,tipo, mensaje,fecha,by,enlace});
  await newNotification.save();
  res.json({status: 'Nueva Notification'});  

});

router.post('/getNotificationsNoSeen/', async (req, res) => {
      const documentos = await Notifications.find(
        { $and: [
            { "array_activity": { $elemMatch: { user_id: req.body.user_id, read: req.body.seen} } }, 
            
        ]}
    )
      

    
      console.log(documentos)  
    res.json(documentos);
  })

  
  router.get('/getAllNotificationsByUser/:id', async (req, res) => {
    const { id } = req.params;
    const noti = await Notifications.find(
      { $and: [
          { "array_activity": { $elemMatch: { user_id: id} } }, 
          
      ]}
  )
  res.json(noti);
})

  router.put('/update/:id', async (req, res, next) => {
    const { id } = req.params;
    const noti = {
      clase_id: req.body.clase_id,
      doc_id: req.body.doc_id,
      empresa: req.body.empresa,
      array_activity: req.body.array_activity,
      tipoDoc: req.body.tipoDoc,
      tipo: req.body.tipo,
      mensaje: req.body.mensaje,
      fecha: req.body.fecha,
      by: req.body.by,
      enlace: req.body.enlace,
     
     
    };
  
    await Notifications.findByIdAndUpdate(id, { $set: noti }, { new: true });
    res.json({ status: 'visteado' });
  })

module.exports = router;