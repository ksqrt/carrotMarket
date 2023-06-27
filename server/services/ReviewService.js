const Review = require('../models/Review');
const { S3 } = require('../config/aws-sdk');
const { v4: uuidv4 } = require('uuid');
const path = require('path');
const { cloudinary } = require('../config/cloudinary');
const { CLOUDINARY_STORAGE } = require('../config/config');
const fs = require('fs');
const { promisify } = require('util');



async function createReview(data) {
    console.log('여기오냐'+data);
    let Review = new Review({...data})
    await Review.save();
}


module.exports = {
    createReview,
   
}
