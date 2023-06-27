const AWS = require('aws-sdk');


const endpoint = process.env.REACT_APP_S3_ENDPOINT
const region = process.env.REACT_APP_S3_REGION
const access_key = process.env.REACT_APP_S3_ACCCESS_KEY
const secret_key = process.env.REACT_APP_S3_SECRET_KEY

const S3 = new AWS.S3({
    endpoint: endpoint,
    region: region,
    credentials: {
        accessKeyId : access_key,
        secretAccessKey: secret_key
    }
});

module.exports = { S3 };