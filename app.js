const express = require('express');
const app = express();

app.set('views', './views');
app.use(express.static('./public'));
app.engine('html', require('ejs').renderFile);

app.get('/', (req, res) => res.render('index.html'));
app.get('/list-s3', require('./src/s3').listObjects)
app.get('/put-s3', require('./src/s3').putObject);

app.listen(process.env.PORT || 3000);
