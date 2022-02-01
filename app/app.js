const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const crypto = require("crypto");

require('dotenv').config();

const app = express();
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(cors());

const AWS = require('aws-sdk');
AWS.config.update({
  region: process.env.S3_REGION,
  accessKeyId: process.env.S3_ACCESS_KEY_ID,
  secretAccessKey: process.env.S3_SECRET_ACCESS_KEY,
});

const BUCKET_NAME = process.env.S3_BUCKET_NAME;

const s3 = new AWS.S3({apiVersion: '2006-03-01'});

app.get('/healthcheck', (_, res) => {
  return res.status(200).json({'status': 'OK'});
});

app.get('/hello', (_, res) => {
  return res.status(200).json({'status': 'hello'});
});

app.get('/picus/list', async (_, res) => {
  const bucketParams = {
    Bucket : BUCKET_NAME,
  };

  const keyValuePairs = [];
  try {
    const { Contents } = await s3.listObjects(bucketParams).promise();
    for (const content of Contents) {
      const key = content.Key;
      const object = await getObject(BUCKET_NAME, key);
      keyValuePairs.push({
        key,
        object,
      });
    }
    return res.status(200).json(keyValuePairs);
  } catch (err) {
    return res.status(500).json({'status': err.message});
  }
});

app.post('/picus/put', async (req, res) => {
  const data = req.body;
  const key = crypto.randomBytes(20).toString('hex');

  const uploadParams = {
    Bucket: BUCKET_NAME,
    Key: key,
    Body: JSON.stringify(data),
    ContentType: "application/json"
  };

  try {
    await s3.putObject(uploadParams).promise();
    return res.status(200).json({'key': key});
  } catch (err) {
    return res.status(500).json({'status': err.message});
  }
});

app.get('/picus/get/:key', async (req, res) => {
  const key = req.params.key;
  try {
    const object = await getObject(BUCKET_NAME, key);
    return res.status(200).json(object);
  } catch (err) {
    return res.status(500).json({'status': err.message});
  }
});

async function getObject(bucket, objectKey) {
  try {
    const params = {
      Bucket: bucket,
      Key: objectKey
    }
    const { Body } = await s3.getObject(params).promise();

    return JSON.parse(Body.toString('utf-8'));
  } catch (err) {
    throw new Error(`Could not retrieve file from S3: ${err.message}`)
  }
}

module.exports = app;
