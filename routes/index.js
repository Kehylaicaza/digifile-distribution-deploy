const { Router } = require('express');
const router = Router();
const User = require('../models/user')
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const crypto = require('crypto');
const nodemailer = require("nodemailer");

const passwordResetToken = require('../models/resetPasswordToken');
const saltRounds = 10;
const myPlaintextPassword = 's0/\/\P4$$w0rD';

router.get('/', (req, res) => res.send('Holly Molly'))


router.post('/register', async (req, res) => {
    if (req.body.password) { }
    const { email, password, name, lastname, status } = req.body;
    const newUser = new User({ email, password, name, lastname, status });
    console.log(newUser);
    await newUser.save();
    res.send("Registrado");

});



router.post('/resetPasswordToken', async (req, res) => {
    var resettoken = new passwordResetToken({ _userId: req.body._id, type: "recovery", resettoken: crypto.randomBytes(16).toString('hex') });
    resettoken.save(function (err) {
        if (err) { return res.status(500).send({ msg: err.message }); }
        passwordResetToken.find({ _userId: req.body._id, type: "recovery", resettoken: { $ne: resettoken.resettoken } }).remove().exec();
        res.status(200).json({ message: 'Reset Password successfully.' });
        var transporter = nodemailer.createTransport({
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
            to: req.body.email, // TODO: email receiver
            subject: "Recuperación de contraseña",
            text: "",
            html: "Hola  " + req.body.name + " hemos recibido una solicitud de restablecimiento de contraseña para tu cuenta. " + '<br>' + "Por favor da clic en el siguiente enlace para reestablecer tu contraseña " + '<a href="' + "http://www.digifile-ec.com/#/fast/" + resettoken.resettoken + '">Ver enlace</a><br>' + "" + '<br>' + '<br><small style="color:red"><i>' + "IMPORTANTE:Si no hiciste esta solicitud, por favor ignora este mensaje." + '</i></small><br><p style="font-weight:bold;">Equipo Digifile. <br><i>Dpto. de Desarrollo</i></p><img width="90" height="35"  src="https://digifile2.web.app/assets/img/brand/dox_logo.png"><p>Telf: 2381005<br>digifile@dox-ec.com</p>'
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
});

//validate reset token
router.post('/notificationResetPassword', async (req, res) => {
    let now = new Date();
    var transporter = nodemailer.createTransport({
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
        to: req.body.email, // TODO: email receiver
        subject: "Notificación de cambio de contraseña",
        text: "",
        html: "Hola  " + req.body.name + ", el día"+   now   +" se ha registrado un cambio de contraseña en nuestra sistema Digifile. " +  '</i></small><br><p style="font-weight:bold;">Equipo Digifile. <br><i>Dpto. de Desarrollo</i></p><img width="90" height="35"  src="https://digifile2.web.app/assets/img/brand/dox_logo.png"><p>Telf: 2381005<br>digifile@dox-ec.com</p>'
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

router.get('/validPasswordToken/:resetTokened', async (req, res) => {
    const { resetTokened } = req.params;
    const reseted = await passwordResetToken.findOne({ resettoken: resetTokened, type: "recovery" });
    if (!reseted) {
        const usuarios = null
        res.json(usuarios);
    } else {
       
        const usuarios = await User.findOne({ "_id": reseted._userId });
        res.json(usuarios)
    }

})


router.get('/changeTokenState/:resetTokened', async (req, res) => {
    const { resetTokened } = req.params;
    const reseted = await passwordResetToken.findOne({
        "resettoken": resetTokened,
        "type": "recovery"
    });
    if (!reseted) {
        const resp = null
        res.json(resp);
    } else {
        await passwordResetToken.findByIdAndRemove(reseted._id);
        res.json({
            'message': 'uploaded',
        });
    }

})




//


router.get('/getUsers2', async (req, res) => {
    const usuarios = await User.find({ "rol": "Administrador" });
    res.send(usuarios)
})

router.get('/countAllUsers', async (req, res) => {
    const usuarios = await User.countDocuments({})
    res.json(usuarios)
})

router.get('/countAllUsersEmpresa/:id', async (req, res) => {
    const { id } = req.params;
    const usuarios = await User.countDocuments({ "empresa.nombre": id })

    res.json(usuarios)
})

router.post('/getUserRepeat', async (req, res) => {

    const usuarios = await User.find({ "empresa.nombre": req.body.empresa, "username": req.body.username })

    res.json(usuarios)
})


router.post('/signIn', async (req, res) => {
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user) return res.status(401).send('La cuenta no existe');
    /* if (user.password !== password) return res.status(401).send('Contraseña Incorrecta');
     const token = jwt.sign({ _id: user._id }, 'secretkey');
     return res.status(200).json({ token });*/

    if (bcrypt.compareSync(req.body.password, user.password)) {
        const token = jwt.sign({ _id: user._id }, 'secretkey');
        return res.status(200).json({ token, user });
    } else {
        return res.status(401).send('Contraseña Incorrecta');

    }


});


router.get('/dashboard', verifyToken, (req, res) => {//para rutas privadas


});


router.get('/getUserByEmail/:email', async (req, res) => {
    const { email } = req.params;

    const grupos = await User.findOne({ "email": email });
    res.send(grupos)
})

router.post('/signInGoogle', async (req, res) => {
    const { email } = req.body;

    const user = await User.findOne({ email });
    if (!user) return res.status(401).send('Correo no existe');
    // if (user.password !== password) return res.status(401).send('Wrong Password');
    const token = jwt.sign({ _id: user.token }, 'secretkey');

    return res.status(200).json({ token });
});


async function verifyToken(req, res, next) {
    console.log(req.headers.authorization)
    try {
        if (!req.headers.authorization) {//revisa si en cada petición existe una cabecera autorizacion
            return res.status(401).send('Unauhtorized Request');
        }
        let token = req.headers.authorization.split(' ')[1];
        if (token === 'null') {// si existe revisa que el token no este vacio
            return res.status(401).send('Unauhtorized Request');
        }

        const payload = await jwt.verify(token, 'secretkey');
        if (!payload) { //si no esta vacio extrae los datos del token
            return res.status(401).send('Unauhtorized Request');
        }
        req.userId = payload._id;
        next();
    } catch (e) {
        return res.status(401).send('Unauhtorized Request');
    }
}

router.post('/nameRepeatSuperAdmin/', async (req, res) => {

    const user = await User.find({ "username": req.body.username });

    res.json(user);
})

router.post('/mailRepeatSuperAdmin/', async (req, res) => {

    const user = await User.find({ "email": req.body.email });

    res.json(user);
})

router.post('/mailRepeatAdmin/', async (req, res) => {

    const user = await User.find({ "email": req.body.email, "empresa.nombre": req.body.empresa });

    res.json(user);
})

router.post('/mailRepeatAdminEdit/', async (req, res) => {

    const user = await User.find({ "email": req.body.email, "empresa.nombre": req.body.empresa, "_id": { $ne: req.body._id } });

    res.json(user);
})

router.post('/mailRepeatSuperAdminEdit/', async (req, res) => {

    const user = await User.find({ "email": req.body.email, "_id": { $ne: req.body._id } });

    res.json(user);
})

router.post('/addEmpresatoUser/', async (req, res) => {

    const user = await User.update({ "_id": req.body._id }, { $push: { empresa: req.body.empresa } });

    res.json(user);
})

router.post('/removeEmpresatoUser/', async (req, res) => {

    const user = await User.update({ "_id": req.body._id }, { $pull: { empresa: { nombre: req.body.empresa } } });

    res.json(user);
})

router.post('/nameRepeatAdmin/', async (req, res) => {

    const user = await User.find({ "username": req.body.username, "empresa.nombre": req.body.empresa });

    res.json(user);
})

router.get('/getUsers', async (req, res) => {
    const grupos = await User.find();
    res.send(grupos)
})

router.get('/getUsers2', async (req, res) => {
    const grupos = await User.find({ "empresa": "Webbi" });
    res.send(grupos)
})

router.get('/getUsers/:id', async (req, res) => {
    const { id } = req.params;
    const grupos = await User.findById(id);
    res.json(grupos);
})

router.get('/getUsers2/:empresa', async (req, res) => {
    const { empresa } = req.params;
    const grupos = await User.find({ "empresa.nombre": empresa });
    res.json(grupos);
})

router.get('/notAdminUsers/:empresa', async (req, res) => {
    const { empresa } = req.params;
    const grupos = await User.find({ "empresa.nombre": empresa, "rol": "Usuario" });
    res.json(grupos);
})


router.get('/onlyAdminUsers/:empresa', async (req, res) => {
    const { empresa } = req.params;
    const grupos = await User.find({ "empresa.nombre": empresa, "rol": "Administrador" });
    res.json(grupos);
})


router.get('/getUsers1/:correo', async (req, res) => {
    const { correo } = req.params;
    const grupos = await User.find({ "email": correo });
    // console.log("sss "+grupos)
    res.json(grupos);
})

router.get('/getUserAccess/:_id', async (req, res) => {
    const { _id } = req.params;
    const user = await User.find({ "_id": _id });
    // console.log("sss "+grupos)
    res.json(user);
})



router.post('/newUser', async (req, res) => {
    const { email, password, name, rol, grupo, empresa, numUsuarios, username, status } = req.body;

    const emailExiste = await User.findOne({ email });

    if (emailExiste) {
        return res.status(401).send('Correo ya está asociado a otra cuenta');
    }
    else {
        const { email, password, name, rol, grupo, empresa, numUsuarios, username, imageProfile, status } = req.body;
        const newUser = new User({ email, password, name, rol, grupo, empresa, numUsuarios, username, imageProfile, status });
        bcrypt.hash(req.body.password, 10, (err, hash) => {
            newUser.password = hash
            User.create(newUser)

            res.json({ status: 'user creado' });
        })

        /* await newUser.save();
         res.json({ status: 'user creado' });*/

    }

});

//actualizar un solo usuario

router.put('/updateUser/:id', async (req, res, next) => {

    const { id } = req.params;
    const user = {
        name: req.body.name,
        username: req.body.username,
        description: req.body.description,
        email: req.body.email,
        password: req.body.password,
        rol: req.body.rol,
        status: req.body.status,
        imageProfile: req.body.imageProfile,
    };
    await User.findByIdAndUpdate(id, { $set: user }, { new: true });
    res.json({ status: 'Perfil Actualizado' });
})


router.put('/update/:id', async (req, res, next) => {
    const { id } = req.params;
    /* const { email, password, name, rol,grupo,empresa,numUsuarios } = req.body;
    const newUser = new User({ email, password, name, rol ,grupo,empresa,numUsuarios}); */
    const usuario = {
        name: req.body.name,
        password: req.body.password,
        email: req.body.email,
        username: req.body.username,
        grupo: req.body.grupo,
        rol: req.body.rol,
        empresa: req.body.empresa,
        status: req.body.status
        //numUsuarios: req.body.numUsuarios,
    };
    console.log(usuario)
    await User.findByIdAndUpdate(id, { $set: usuario }, { new: true });
    res.json({ status: 'User Updated' });
})


router.put('/updateWithPassword/:id', async (req, res, next) => {
    const { id } = req.params;
    const usuario = {
        name: req.body.name,
        password: req.body.password,
        email: req.body.email,
        username: req.body.username,
        grupo: req.body.grupo,
        rol: req.body.rol,
        empresa: req.body.empresa,
        status: req.body.status
        //numUsuarios: req.body.numUsuarios,
    };
    var passUp = req.body.password

    var hashear = new Promise((resolve, reject) => {
        bcrypt.hash(passUp, 10, (err, hash) => {
            usuario.password = hash
            resolve("Stuff worked!");

        })
    })


    hashear.then(actualizar => {
        User.findByIdAndUpdate(id, { $set: usuario }, function (err, result) {
            if (err) {
                console.log(err);
            }
            console.log("RESULT: " + result);
            res.json({ status: 'User Updated' });
        });
    })

})


router.delete('/delete/:id', async (req, res, next) => {
    await User.findByIdAndRemove(req.params.id);
    res.json({ status: 'USER Deleted' });
})

//actualizar password 

router.put('/updatePassword/:id', async (req, res, next) => {
    const { id } = req.params;
    const user = {
        name: req.body.name,
        password: req.body.password,
        email: req.body.email,
        username: req.body.username,
        rol: req.body.rol,
        grupo: req.body.grupo,
        empresa: req.body.empresa,
        status: req.body.status
        //numUsuarios: req.body.numUsuarios,
    };
    var passUp = req.body.password

    var hashear = new Promise((resolve, reject) => {
        bcrypt.hash(passUp, 10, (err, hash) => {
            user.password = hash
            resolve("Stuff worked!");

        })
    })


    hashear.then(actualizar => {
        User.findByIdAndUpdate(id, { $set: user }, function (err, result) {
            if (err) {
                console.log(err);
            }
            console.log("RESULT: " + result);
            res.json({ status: 'User Updated' });
        });
    })
});





router.post('/getPassword', async (req, res) => {
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user) res.json({ status: 'unauthorized' });


    if (bcrypt.compareSync(req.body.password, user.password)) {

        res.json({ status: 'correcta' });
    } else {
        res.json({ status: 'incorrecta' });

    }
});


router.get('/getOneId/:id', async (req, res) => {
    const { id } = req.params;
    const usuarios = await User.findOne({ "_id": id});
    res.send(usuarios)
})


module.exports = router;