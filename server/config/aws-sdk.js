const AWS = require('aws-sdk');
const config = require('./config')


const endpoint = config.S3_ENDPOINT
const region = config.S3_REGION
const access_key = config.S3_ACCCESS_KEY
const secret_key = config.S3_SECRET_KEY

const S3 = new AWS.S3({
    endpoint: endpoint,
    region: region,
    credentials: {
        accessKeyId : access_key,
        secretAccessKey: secret_key
    }
});

module.exports = { S3 };