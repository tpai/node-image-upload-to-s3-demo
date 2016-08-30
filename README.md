# Node Image Upload To S3 Demo

Image upload demo based on [heroku document](https://devcenter.heroku.com/articles/s3-upload-node) and more simple and accurately.

Credit for [flyingsparx/NodeDirectUploader](https://github.com/flyingsparx/NodeDirectUploader).

## Usage

**Install Dependencies**

```
npm i
```

**Fill Up Environment Variables**

* ID & SECRET: https://console.aws.amazon.com/iam/home?#encryptionKeys
* REGION: http://docs.aws.amazon.com/general/latest/gr/rande.html
* BUCKET: https://console.aws.amazon.com/s3/home

```
ACCESS_KEY_ID=
SECRET_ACCESS_KEY=
REGION=
S3_BUCKET=
```

**Start Node Service**

```
npm start
// http://localhost
```
