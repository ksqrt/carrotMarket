const Product = require('../models/Product');
const User = require('../models/User');
const { S3 } = require('../config/aws-sdk');
const { v4: uuidv4 } = require('uuid');


const { cloudinary } = require('../config/cloudinary');
const { CLOUDINARY_STORAGE } = require('../config/config');
const fs = require('fs');
const path = require('path');
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
    const bucket_name = 'ncp3';
    const object_name = `sample-folder/${uuidv4()}.jpg`;

    try {
        // Convert image to Buffer
        const imageBuffer = Buffer.from(image, 'binary');

        // Upload file to S3
        const uploadParams = {
            Bucket: bucket_name,
            Key: object_name,
            ACL: 'public-read',
            Body: imageBuffer
        };
        const uploadResult = await S3.upload(uploadParams).promise();

        // 업로드된 이미지 URL 생성
        const imageUrl = uploadResult.Location;

        // 이미지 URL을 원하는 형식으로 변환 (여기서는 리사이징 예시)
        const index = imageUrl.indexOf('upload/') + 7;
        const resizedImageUrl =
            imageUrl.substring(0, index) +
            'c_fit,q_auto,f_auto,w_800' +
            imageUrl.substring(index);

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
