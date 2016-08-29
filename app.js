require('dotenv').config();

const aws = require('aws-sdk');
aws.config.update({
    accessKeyId: process.env.ACCESS_KEY_ID,
    secretAccessKey: process.env.SECRET_ACCESS_KEY
});
const S3_BUCKET = process.env.S3_BUCKET;
const REGION = process.env.REGION;
aws.config.region = REGION;

const express = require('express');
const app = express();
app.set('views', './views');
app.use(express.static('./public'));
app.engine('html', require('ejs').renderFile);

app.get('/', (req, res) => res.render('index.html'));
app.get('/sign-s3', (req, res) => {
  const s3 = new aws.S3();
  const path = 'images/';
  const fileName = req.query['file-name'];
  const fileType = req.query['file-type'];
  const s3Params = {
    Bucket: S3_BUCKET,
    Key: `${path}${fileName}`,
    Expires: 60,
    ContentType: fileType,
    ACL: 'public-read'
  };

  s3.getSignedUrl('putObject', s3Params, (err, data) => {
    if(err){
      console.log(err);
      return res.end();
    }
    const returnData = {
      signedRequest: data,
      url: `https://s3-${REGION}.amazonaws.com/${S3_BUCKET}/${path}${fileName}`
    };
    res.write(JSON.stringify(returnData));
    res.end();
  });
});

app.listen(process.env.PORT || 3000);
