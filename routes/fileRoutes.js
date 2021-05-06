
const { Router } = require('express');
const router = Router();
//const upload = require('./upload');
const multipart = require('connect-multiparty');
const bodyParser = require('body-parser');
const formidable = require('formidable');
const Documentos = require('../models/documento');
const credentials = require('../credentials.js');

var fs = require('fs');
const express = require('express'),
  path = require('path'),
  cors = require('cors'),
  multer = require('multer');
/*router.use(bodyParser.json());
router.use(bodyParser.urlencoded({
    extended: true
}));*/

const multipartMiddleware = multipart({
  uploadDir: './uploads'
});

router.post('/api/upload', multipartMiddleware, (req, res) => {
  var file = req.files
  console.log("files " + JSON.stringify(file))
  for (var i = 0; i < file.length; i++) {//para cuando sean varios documentos
    var pathy = file[i]
  }
  res.json({
    'message': 'File uploaded succesfully.',
    'url': 'http://181.198.203.160:3000/'
  });

});

router.post('/uploadBulkFile', multipartMiddleware, (req, res) => {
  var file = req.files
  // var ruta = "http://181.198.203.160:3000/" + file.file.path
  var ruta = credentials.server + file.file.path
  res.json(ruta);

});

router.get('/files', async (req, res) => {

  for (var i = 0; i < fileBulk.length; i++) {//para cuando sean varios documentos
    var pathy = fileBulk[i]
  }
  res.json(pathy);

});

router.post('/loadPDF', async (req, res) => {

  res.json("http://181.198.203.160:3000/uploads/cPlev1MsH0mwVzgddvaqNbJR.pdf");

});


const PATH = './uploads';

let storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, PATH);
  },
  filename: (req, file, cb) => {
    cb(null, file.fieldname + '-' + Date.now())
  }
});

let upload = multer({
  storage: storage
});

router.post('/uploadFile', multipartMiddleware, (req, res, next) => {
  var file = req.files.uploads
  for (var i = 0; i < file.length; i++) {//para cuando sean varios documentos
    var pathy = file[i]

  }
  var sizeKb = 1024;
  var sizeMb = sizeKb * sizeKb;
  var sizeGb = sizeMb * sizeKb;
  var tamaño = pathy.size.length
  var nexto = pathy.path.substring(8, pathy.path.lenght);
  console.log(credentials['server']+"here")
  res.json({
    'message': 'File uploaded succesfully.',
    'url': credentials.server + pathy.path,
    'nameDefault': nexto,
    'size': parseInt(pathy.size / 1024)

  });

});



// POST File
/* router.post('/uploadFile', upload.single(fieldname), function (req, res) {
    if (!req.file) {
      console.log("No file is available!");
      return res.send({
        success: false
      });
  
    } else {
      console.log('File is available!');
      return res.send({
        success: true
      })
    }
});
 */


/* 
router.post('/uploadFile', function (req, res) {
    console.log(req.file.name);
    console.log(req.file.path);
    console.log(req.file.type);
    var file = __dirname + "/" + req.file.name;
 
    fs.readFile( req.file.path, function (err, data) {
       fs.writeFile(file, data, function (err) {
          if( err ){
             console.log( err );
             }else{
                response = {
                   message:'File uploaded successfully',
                   filename:req.file.name
                };
             }
          console.log( response );
          res.end( JSON.stringify( response ) );
       });
    });
 }) */


router.get('/', function (req, res) {
  let ruta = req.body.ruta
  res.sendFile(uploads + ruta);
})

router.get('/getDocumentos', async (req, res) => {
  const documentos = await Documentos.find();
  res.send(documentos)
})

router.post('/DocumentosByClass/', async (req, res) => {

  const documentos = await Documentos.find({ "clase_id": req.body._id, "empresa": req.body.clasedoc_empresa });

  res.json(documentos);
})


router.get('/countAllDocumentsbyClass/:_id', async (req, res) => {
  const { _id } = req.params;
  const dox = await Documentos.countDocuments({ "clase_id": _id })
  res.json(dox)
})


router.get('/countAllDocuments', async (req, res) => {
  const dox = await Documentos.countDocuments({})
  res.json(dox)
})

router.get('/countAllDocumentsEmpresa/:empresa', async (req, res) => {

  const { empresa } = req.params;
  const dox = await Documentos.countDocuments({ "empresa": empresa })
  res.json(dox)
})


router.get('/countAllDocumentsByClass/:class', async (req, res) => {
  const { classe } = req.params;
  const dox = await Documentos.countDocuments({ "clase_id": classe })
  res.json(dox)
})

router.get('/countAllDocumentsEmpresaNotDeleted/:empresa', async (req, res) => {

  const { empresa } = req.params;
  const dox = await Documentos.countDocuments({ "empresa": empresa, "deleted_doc": false })
  res.json(dox)
})

router.get('/countAllDocumentsLocked/:clase_id', async (req, res) => {

  const { clase_id } = req.params;
  const dox = await Documentos.countDocuments({ "clase_id": clase_id, "checkOut": true })
  res.json(dox)
})

router.get('/countAllDocumentsDeleted/:clase_id', async (req, res) => {

  const { clase_id } = req.params;
  const dox = await Documentos.countDocuments({ "clase_id": clase_id, "deleted_doc": true })
  res.json(dox)
})

router.get('/countAllDocumentsNoDeleted/:clase_id', async (req, res) => {

  const { clase_id } = req.params;
  const dox = await Documentos.countDocuments({ "clase_id": clase_id, "deleted_doc": false, "checkOut": false })
  res.json(dox)
})


router.get('/countAllDocumentsNoLocked/:clase_id', async (req, res) => {

  const { clase_id } = req.params;
  const dox = await Documentos.countDocuments({ "clase_id": clase_id, "checkOut": false })
  res.json(dox)
})


router.get('/getDocumentsByIndexeListUsed/:clase_id', async (req, res) => {
  const { indiceGeneral_id } = req.params;
  const dox = await Documentos.find({ "newdoc_indices.indiceGeneral_id": indiceGeneral_id })
  res.json(dox)
})




router.post('/getDocumetosbyValueRepeat/', async (req, res) => {

  const documentos = await Documentos.find({ "clase_id": req.body.clase_id, "newdoc_indices.indiceGeneral_id": req.body.indiceGeneral_id, "newdoc_indices.valor": req.body.valor });

  res.json(documentos);
})


router.post('/getDocumetosLockedAdmin/', async (req, res) => {

  const documentos = await Documentos.find({ "empresa": req.body.empresa, "checkout": true });

  res.json(documentos);
})

router.post('/getDocumetosLocked/', async (req, res) => {

  const documentos = await Documentos.find({ "checkOut": true, "clase_id": req.body.clase_id });

  res.json(documentos);
})

router.post('/getDocumetosDeleted/', async (req, res) => {

  const documentos = await Documentos.find({ "deleted_doc": true, "clase_id": req.body.clase_id });

  res.json(documentos);
})



router.post('/getLinkingDoki/', async (req, res) => {

  const documentos = await Documentos.find({ "clase_id": req.body.clase_id, "newdoc_indices.indiceGeneral_id": req.body.indiceGeneral_id, "newdoc_indices.valor": req.body.valor });

  res.json(documentos);
})



router.post('/getDocumetosbyNameRepeat/', async (req, res) => {

  const documentos = await Documentos.find({ "clase_id": req.body.clase_id, "nombreDocumento": req.body.nombreDocumento, "empresa": req.body.empresa });

  res.json(documentos);
})



router.get('/DocumentosById/:_id', async (req, res) => {
  const { _id } = req.params;
  const documentos = await Documentos.find({ "_id": _id });
  res.json(documentos);
})


router.get('/getDocumetosbyIndexe/:_id', async (req, res) => {
  const { _id } = req.params;
  const documentos = await Documentos.find({ "newdoc_indices._id": _id });
  res.json(documentos);
})

router.get('/getDocumetosbyIdUser/:_id', async (req, res) => {
  const { _id } = req.params;
  const documentos = await Documentos.find({ $or: [{ "history.usuario": _id }, { "versionesUrl.last_edit_by": _id }] });
  res.json(documentos);
})


router.get('/getDocumetosbyIdOnlyeOne/:_id', async (req, res) => {
  const { _id } = req.params;
  const documentos = await Documentos.findOne({ "_id": _id });
  res.json(documentos);
})

router.get('/getDocumentos3/:clase', async (req, res) => {
  const { clase } = req.params;
  const clases = await Documentos.find({ "clase": clase });
  res.json(clases);
})

router.get('/getDocumetosbyEmpresa/:empresa', async (req, res) => {
  const { clase } = req.params;
  const clases = await Documentos.find({ "empresa": empresa });
  res.json(clases);
})

router.get('/getOnlyDocument/:id', async (req, res) => {
  const { id } = req.params;
  const clases = await Documentos.findOne({ "_id": id });
  res.json(clases);
})


router.put('/update/:id', async (req, res, next) => {
  const { id } = req.params;
  const newDoc = {
    clasedoc_name: req.body.clasedoc_name,
    clasedoc_description: req.body.clasedoc_description,
    clasedoc_empresa: req.body.clasedoc_empresa,
    clasedoc_tamanoMax: req.body.clasedoc_tamanoMax,
    clasedoc_cantidadMax: req.body.clasedoc_cantidadMax,
    clasedoc_cantidadDoc: req.body.clasedoc_cantidadDoc,
    clasedoc_indicesNum: req.body.clasedoc_indicesNum,
    clasedoc_estado: req.body.clasedoc_estado,
    newdoc_indices: req.body.newdoc_indices,
    history: req.body.history,
  };
  await Documentos.findByIdAndUpdate(id, { $set: newDoc }, { new: true });
  res.json({ status: 'Documentos Updated' });
})

router.put('/updateFile/:id', async (req, res, next) => {
  const { id } = req.params;
  const newDoc = {
    clase: req.body.clase,
    nameDefault: req.body.nameDefault,
    nombreDocumento: req.body.nombreDocumento,
    checkOut: req.body.checkOut,
    version: req.body.version,
    urlDocumento: req.body.urlDocumento,
    creadoPor: req.body.creadoPor,
    fechaCreacion: req.body.fechaCreacion,
    tamanoArchivo: req.body.tamanoArchivo,
    empresa: req.body.empresa,
    newdoc_indices: req.body.newdoc_indices,
    versionesUrl: req.body.versionesUrl,
    history: req.body.history,
    type: req.body.type,
    deleted_doc: req.body.deleted_doc

  };
  await Documentos.findByIdAndUpdate(id, { $set: newDoc }, { new: true });
  res.json({ status: 'Documentos Updated' });
})


router.put('/changeStateDoc/:id', async (req, res, next) => {

  const { id } = req.params;
  var newObject = {
    usuario: req.body.usuario, fecha: req.body.fecha, edit: req.body.edit, downloaded: req.body.downloaded,
    printed: req.body.printed, deleted: req.body.deleted, coment: req.body.coment
  };
  console.log(newObject)
  await Documentos.findByIdAndUpdate(id, {
    deleted_doc: true,
    $push: { history: newObject }
  });
  res.json({ status: 'Documentos Updated' });
})



router.put('/changeStateDocActive/:id', async (req, res, next) => {
  const { id } = req.params;
  await Documentos.findByIdAndUpdate(id, {
    deleted_doc: false,
  });
  res.json({ status: 'Documentos Updated' });
})

router.delete('/delete/:id', async (req, res, next) => {
  await Documentos.findByIdAndRemove(req.params.id);
  res.json({ status: 'Documentos Deleted' });
})

router.delete('/deleteAll/:clase_id', async (req, res, next) => {
  await Documentos.deleteMany({ clase_id: req.params.clase_id });

  res.json({ status: 'Documentos Deleted' });
})

router.post('/depure/', async (req, res) => {
  const testFolder = './uploads/';
  var filesD = []
  let promiseNice = await new Promise(async (resolve, reject) => {
    saved = 0
    fs.readdir(testFolder, (err, files) => {
      filesD = files
      resolve(saved)
    })

  });

  for (let index = 0; index < filesD.length; index++) {
    const file = filesD[index];

    let promise2Nice = await new Promise(async (resolve, reject) => {
      saved = 0
      var nameed = " http://181.198.203.160:3000/uploads/" + file;
      console.log(nameed)
      var founded = await Documentos.findOne({ "urlDocumento": nameed })
      console.log(founded)
      if (founded == null) {
        var sourceUrls = './uploads/' + file;
        fs.unlinkSync(sourceUrls);
        resolve(saved)
      } else {
        resolve(saved)
      }

    });

  }

  res.json({ status: 'Depurado' });
})


router.post('/alterDocuments/', async (req, res) => {
  const testFolder = './uploads/';
  var filesD = []
  let promiseNice = await new Promise(async (resolve, reject) => {
    saved = 0
    fs.readdir(testFolder, (err, files) => {
      filesD = files
      resolve(saved)
    })

  });

  for (let index = 0; index < filesD.length; index++) {
    const file = filesD[index];

    let promise2Nice = await new Promise(async (resolve, reject) => {
      saved = 0
      var nameed = " http://181.198.203.160:3000/uploads/" + file;
      console.log(nameed)
      var founded = await Documentos.findOne({ "urlDocumento": nameed })
      console.log(founded)
      if (founded != null) {
        var sourceUrls = './uploads/' + file;
        await Documentos.findByIdAndUpdate({ _id: founded._id }, { $set: { "nameDefault": file } })

        console.log("alterado")
        resolve(saved)
      } else {
        resolve(saved)
      }

    });

  }

  res.json({ status: 'Depurado' });
})

router.get('/deleteFromFolder/:nameDocument', async (req, res) => {
  const { nameDocument } = req.params;
  var sourceUrls = './uploads/' + nameDocument;
  console.log(sourceUrls)
  fs.unlinkSync(sourceUrls);
  res.json({ status: 'Depurado' });
})

router.post('/newDocument', async (req, res) => {
  const newDoc = new Documentos({
    clase_id: req.body.clase_id,
    nameDefault: req.body.nameDefault,
    nombreDocumento: req.body.nombreDocumento,
    version: req.body.version,
    checkOut: req.body.checkOut,
    urlDocumento: req.body.urlDocumento,
    creadoPor: req.body.creadoPor,
    fechaCreacion: req.body.fechaCreacion,
    tamanoArchivo: req.body.tamanoArchivo,
    empresa: req.body.empresa,
    newdoc_indices: req.body.newdoc_indices,
    versionesUrl: req.body.versionesUrl,
    type: req.body.type,
    deleted_doc: false
  });

  await newDoc.save();
  //res.send("empresa registrado");
  res.json({ status: newDoc._id });
});


module.exports = router;