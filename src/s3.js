require('dotenv').config();

const formidable = require('formidable');
const fs = require('fs');

const S3_BUCKET = process.env.S3_BUCKET;
const REGION = process.env.REGION;

const aws = require('aws-sdk');

aws.config.update({
    accessKeyId: process.env.ACCESS_KEY_ID,
    secretAccessKey: process.env.SECRET_ACCESS_KEY
});
aws.config.region = REGION;

const s3 = new aws.S3();
const S3_PREFIX = `origin/`;

module.exports = {
    listObjects: (req, res) => {
        const s3Params = {
            Bucket: S3_BUCKET,
            Prefix: S3_PREFIX,
            MaxKeys: 20
        };
        s3.listObjects(s3Params, function(err, data) {
            if (err) {
                res.write(JSON.stringify(err));
            }
            else {
                res.write(JSON.stringify(data));
            }
            res.end();
        });
    },
    putObjectClient: (req, res) => {
        const path = S3_PREFIX;
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
    },
    putObjectServer: (req, res) => {
        new formidable.IncomingForm().parse(req, function (err, fields, files) {
            const fileName = files.upload.name;
            const fileType = files.upload.type;
            fs.readFile(files.upload.path, function(ferr, fileBuffer){
                const S3_KEY = `${S3_PREFIX}${fileName}`
                s3.putObject({
                    Bucket: S3_BUCKET,
                    Key: S3_KEY,
                    Expires: 60,
                    ContentType: fileType,
                    ACL: 'public-read',
                    Body: fileBuffer
                }, function (s3err, s3res) {
                    if (s3err) {
                        console.log("Error uploading data: ", s3err);
                    } else {
                        const url = `https://s3-${REGION}.amazonaws.com/${S3_BUCKET}/${S3_KEY}`
                        res.setHeader('Content-Type', 'text/html');
                        res.send(`
                            <script type='text/javascript'>
                                window.parent.CKEDITOR.tools.callFunction(${req.query.CKEditorFuncNum}, '${url}', '');
                            </script>
                        `);
                    }
                });
            });
        });
    }
};
