const express = require('express');
const app = express();
const cors = require('cors');
const jwt = require('jsonwebtoken');
//const email  = require('emailjs');
const path = require('path');
const passport = require('passport');
const mongoose = require('mongoose');
const config = require('./config/database');
const http = require('http').Server(app);
const io = require('socket.io')(http);



/*mongoose.connect(config.url);
// On Connection
mongoose.connection.on('connected', () => {
  console.log('Connected to Database ' + config.url);
});*/


mongoose.connect(config.database, { useNewUrlParser: true });
// On Connection
mongoose.connection.on('connected', () => {
  console.log('Connected to Database ' + config.database);
});

// On Error
mongoose.connection.on('error', (err) => {
  console.log('Database error ' + err);
})

// Port Number
const port = process.env.PORT || 3000;
// middlewares
app.use(cors());
app.use(express.json());


const bodyParser = require('body-parser');


/* app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
    extended: true
})); */


app.use(bodyParser.json({ limit: '50mb', extended: true }))
app.use(bodyParser.urlencoded({ limit: '50mb', extended: true }))
// Passport Middleware
app.use(passport.initialize());
app.use(passport.session());
app.use('/uploads', express.static('uploads'));
require('./config/passport')(passport);

app.use(express.static(path.join(__dirname, 'client')));

app.use('/api', require('./routes/index'));
app.use('/grupos', require('./routes/groupsRoutes'));
app.use('/empresas', require('./routes/empresasRoutes'));
app.use('/files', require('./routes/fileRoutes'));
app.use('/email', require('./routes/emailRoutes'));
app.use('/indexes', require('./routes/indexesRoutes'));
app.use('/subscriptions', require('./routes/subscriptionsRoutes'));
app.use('/clasesDoc', require('./routes/clasesDocRoutes'));
app.use('/list', require('./routes/listRoutes'));
app.use('/notifications', require('./routes/notificationsRoutes'));
app.use('/linkDocs', require('./routes/linkDocsRoutes'));
app.use('/reports', require('./routes/reportsRoutes'));



/*router.use('/uploads', function (req, res, next) {
 
    if (!payload) { //si no esta vacio extrae los datos del token
        return res.status(401).send('Unauhtorized Request');
    }
    else {
        return express.static(('uploads'));
    }
});
*/




// Index Route
app.get('/', (req, res) => {
  res.send('invaild endpoint');
});


app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'public/index.html'));
});


//programar cuando corre el script
var cron = require('node-cron');
const Empresas = require('./models/empresas')
const User = require('./models/user')
const Reports = require('./models/reports')

let users = {}
let browsers = {}
let idis = {}
let ip = {}
io.on('connection', function (socket) {
  console.log('Socket: client connected');
  setInterval(function () {
    io.emit('init', users);
  }, 2000);


  socket.on('login', function (data) {
    console.log('a user' + data.userId + ' logged in' + data.browserToken + 'userlog' + data.idi + data.ip_is);
    //saving userId to array with socket ID
    const activeBrowserIds = Object.values(browsers)
    const userIds = Object.values(users)
    const idi = Object.values(idis)
    const ipv = Object.values(ip)
    if (userIds.indexOf(data.userId) === -1) {
      setEmpresas(data.userId, 1)
    } else if (activeBrowserIds.indexOf(data.browserToken) === -1) {
      updateEmpresas(data.userId, 1, idi)
    }

    users[socket.id] = data.userId;
    browsers[socket.id] = data.browserToken;
    idis[socket.id] = data.idi;
    ip[socket.id] = data.ip_is;
    //io.emit('login', data.userId);

  });
  socket.on('disconnect', function () {
    const userId = users[socket.id];
    const browserId = browsers[socket.id]
    const idi = idis[socket.id]
    const ipv = ip[socket.id];
    delete users[socket.id];
    delete browsers[socket.id];
    delete idis[socket.id];
    delete ip[socket.id];
    //io.emit('logout', users[socket.id]);
    const activeBrowserIds = Object.values(browsers)
    console.log("me active"+activeBrowserIds.indexOf(browserId))
    if (activeBrowserIds.indexOf(browserId) === -1) {
      updateEmpresas(userId, -1, idi)
    //  createReport(userId, idi, ipv)


    } else {
      console.log(userId + 'is still online now')
    }
  });

});

const updateEmpresas = async (userId, amount, idi) => {
  await Empresas.update({ _id: userId }, { $pull: { currentUsers: idi } });
  const empresa2 = await Empresas.findOne({ "_id": userId });
  await Empresas.update({ _id: userId }, { $inc: { usuarios_activos: empresa2.currentUsers.length, } });


}

const createReport = async (userId, idi, ipaddress) => {
  const usuario = await User.findOne({ _id: idi });

  var moment = require('moment');
  const newReport = new Reports({
    empresa_id: userId,
    user_id: idi,
    user_name: usuario.name,
    module: "Sesiones",
    type: "Finalizadas",
    description: usuario.name + " ha finalizado su sesión ",
    date: moment().format("YYYY-MM-DD"),
    origen: usuario.rol,
    hour: moment().format("HH:mm:ss"),
    ip: ipaddress,
  });
  await newReport.save();

}

const setEmpresas = async (userId, amount, idi) => {
  await Empresas.findByIdAndUpdate(userId, { usuarios_activos: amount, idi });
}

// Start Server
http.listen(port, function () {
  console.log('Server started on port ' + port);
});

cron.schedule('57 14 * * *', () => {
  console.log('Hello World');
  var empresasArray = [];
  var usersArray = [];
  Empresas.find({})
    .exec(function (err, dtxArray) {
      if (err)
        console.log(err);
      // console.log('DTX Array: ', dtxArray);
      empresasArray = dtxArray;

      for (let index = 0; index < empresasArray.length; index++) {
        let element = empresasArray[index];
        let empresaid = element._id.toString()
        var moment = require('moment');
        const nodemailer = require("nodemailer");

        let currentMilli = Date.now()
        let today = moment(currentMilli).format('YYYY-MM-DD');
        var start = moment(today, "YYYY-MM-DD");
        var end = moment(element.license_end, "YYYY-MM-DD");
        var daysFaltan = moment.duration(start.diff(end)).asDays();

        if (daysFaltan == 2) {
          console.log("so good")

          User.find({ "empresa.nombre": empresaid, 'rol': "Administrador" }).exec(function (err, usArray) {
            if (err)
              console.log(err);
            console.log(usArray)
            usersArray = usArray;

            for (let m = 0; m < usersArray.length; m++) {
              const admini = usersArray[m];

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

              var mailOptions = {
                from: 'digifile@dox-ec.com', // TODO: email sender
                to: admini.email, // TODO: email receiver
                subject: "Recordatorio",
                html: `<p> Estimado cliente, le recordamos que su licencia a nuestro servicio Digifile está próxima a expirar el  <span style="color:red"> ` + element.license_end + `</span></p>` + `<br><p>Saludos Cordiales</p><p style="font-weight:bold;">Jorge Parreño L. <br><i>Dpto. de Desarrollo</i></p><img width="90" height="35"  src="https://digifile2.web.app/assets/img/brand/dox_logo.png"><p>Telf: 2381005<br>jparreno@ofistore.us</p>`,
              };




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



            }
          });






        }


      }



    });




});



