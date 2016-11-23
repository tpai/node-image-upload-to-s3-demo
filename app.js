const CircularJSON = require('circular-json');
const formidable = require('formidable');
const bodyParser = require('body-parser')
const express = require('express');
const app = express();

app.set('views', './views');
app.use(express.static('./public'));
app.use(function(req, res, next) {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE,OPTIONS');
    res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization, Content-Length, X-Requested-With');

    // intercept OPTIONS method
    if ('OPTIONS' == req.method) {
        res.sendStatus(200);
    }
    else {
        next();
    }
});
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.engine('html', require('ejs').renderFile);

app.get('/', (req, res) => res.render('index.html'));
app.get('/ckeditor', (req, res) => res.render('ckeditor.html'));
app.get('/list-s3', require('./src/s3').listObjects)
app.get('/put-s3', require('./src/s3').putObjectClient);
app.post('/ckUpload', require('./src/s3').putObjectServer);
// app.post('/imgUpload', (req, res) => {
//     new formidable.IncomingForm().parse(req, function (err, fields, files) {
//         res.setHeader('Content-Type', 'application/json');
//         res.send(
//             JSON.stringify({
//                 query: req.query.CKEditorFuncNum,
//                 fields: fields,
//                 files: files
//             })
//         );
//     });
// });

app.listen(process.env.PORT || 3333);
