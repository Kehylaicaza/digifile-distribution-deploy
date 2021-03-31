const { Router } = require('express');
const router = Router();
const nodemailer = require("nodemailer");
const fs = require('fs');

router.post("/sendmail", (req, res) => {

  let transporter = nodemailer.createTransport({
    //si es gmail
    /*  host: 'smtp.gmail.com',
      port: 465,
      secure: true,
      auth: {
        user: 'keilacicaza@gmail.com',
        pass: '***********'
      },
      tls: {
        rejectUnauthorized: false
      }*/
    //si es otro
    
    name: 'dox-ec.com',
    host: 'mail.dox-ec.com',
    port: 587,
    secure: false,
    auth: {
      user: 'digifile@dox-ec.com',
      pass: 'Administrador123'
    },
    tls: {
      rejectUnauthorized: false
    }
  });


  if(req.body.type  == "attachment"){
   var mailOptions = {
      from: 'digifile@dox-ec.com', // TODO: email sender
      to: req.body.to, // TODO: email receiver
      subject: req.body.subject,
      text: req.body.coment,
      attachments: [
        {   // utf-8 string as an attachment
          filename: req.body.filename,
          contentType: req.body.typeFile,
          path: req.body.fileContent
         
  
        },
      ]
    };
    console.log(mailOptions)
  }
  else{
   var mailOptions = {
      from: 'digifile@dox-ec.com', // TODO: email sender
      to: req.body.to, // TODO: email receiver
      subject: req.body.subject,
      text: req.body.coment,
      html: req.body.html
    };
  }
 

  transporter.sendMail(mailOptions, (err, data) => {

    if (err) {
      console.log('Error occurs', err);
      res.json({
        'message': 'Error',
      });
      return;
    }
    console.log('Email sent!!!');
    res.json({
      'message': 'Sent',
    });
  });

});




router.post("/sendmailWelcome", (req, res) => {

  let transporter = nodemailer.createTransport({

    
    name: 'dox-ec.com',
    host: 'mail.dox-ec.com',
    port: 587,
    secure: false,
    auth: {
      user: 'digifile@dox-ec.com',
      pass: 'Administrador123'
    },
    tls: {
      rejectUnauthorized: false
    }
  });


  var mailOptionsWell = {
    from: 'digifile@dox-ec.com', // TODO: email sender
    to: req.body.to, // TODO: email receiver
    subject: req.body.subject,
    text: req.body.coment,
    html: req.body.html
  };

  transporter.sendMail(mailOptionsWell, (err, data) => {

    if (err) {
      console.log('Error occurs', err);
      res.json({
        'message': 'Error',
      });
      return;
    }
    console.log('Email sent!!!');
    res.json({
      'message': 'Sent',
    });
  });

});
module.exports = router;

