const Product = require('../models/Product');
const User = require('../models/User');
const { S3 } = require('../config/aws-sdk');
const { v4: uuidv4 } = require('uuid');

const path = require('path');

const { cloudinary } = require('../config/cloudinary');
const { CLOUDINARY_STORAGE } = require('../config/config');
const fs = require('fs');
const { promisify } = require('util');


async function getAll() {
    return await Product.paginate();
}

async function findByCategory(category) {
    return await Product.find({ category: category })
}

async function findById(id) {
    return await Product.findById(id);
}

async function edit(id, data) {
    return await Product.updateOne({ _id: id }, data);
}

async function create(data, userId) {
    let product = new Product({...data})
    await product.save();

    return await User.updateOne({ _id: userId }, { $push: { createdSells: product } });
}




// async function uploadImage(image) {
//     const uploadResponse = await cloudinary.uploader.upload(image, {
//         upload_preset: CLOUDINARY_STORAGE,
//     }, { quality: "auto" });

//     let imageUrl = uploadResponse.url;
//     let index = (imageUrl.indexOf('upload/')) + 6;

//     let compressedImg = imageUrl
//         .substring(0, index) +
//         "/c_fit,q_auto,f_auto,w_800" +
//         imageUrl.substring(index);

//     return compressedImg;
// }

async function uploadImage(image) {
    const fileExtension = '.jpg';

    const bucket_name = 'ncp3';

    const object_name = `sample-folder/${uuidv4()}${fileExtension}`;

    try {
        // Convert image to Buffer
        const imageBuffer = Buffer.from(image, 'base64');

        // Extract the file extension from the object name
        const extension = path.extname(object_name).toLowerCase();

        // Map the file extension to the corresponding MIME type
        const mimeTypes = {
            '.jpg': 'image/jpeg',
            '.jpeg': 'image/jpeg',
            '.png': 'image/png',
            // Add more supported extensions and MIME types here
        };

        // Get the MIME type based on the file extension
        const contentType = mimeTypes[extension] || 'application/octet-stream';

        // Upload file to S3
        const uploadParams = {
            Bucket: bucket_name,
            Key: object_name,
            ACL: 'public-read',
            ContentType: contentType,
            Body: imageBuffer,
        };
        const uploadResult = await S3.upload(uploadParams).promise();

        // 업로드된 이미지 URL 생성
        const imageUrl = uploadResult.Location;

        return imageUrl;
    } catch (error) {
        console.error('S3 image upload failed:', error);
        throw error;
    }
}

async function userCollectionUpdate(userId, product) {
    return await User.updateOne({ _id: userId }, { $push: { createdSells: product } });
}

async function findUserById(id) {
    return await User.findById(id);
}

module.exports = {
    create,
    getAll,
    findByCategory,
    findById,
    edit,
    uploadImage,
    userCollectionUpdate,
    findUserById
}
