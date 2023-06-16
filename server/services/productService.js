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

async function findOneAndDelete(data, userId) {
    let product = await Product.findById(data);
    await product.remove(userId);

    return await User.updateOne({ _id: userId }, { $pull: { createdSells: product } });
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

    const base64Data = new Buffer.from(image.replace(/^data:image\/\w+;base64,/, ""), 'base64');
    const type = image.split(';')[0].split('/')[1];
    try {
        // Convert image to Buffer
        // const imageBuffer = Buffer.from(image, 'base64');

        // Upload file to S3
        const uploadParams = {
            Bucket: bucket_name,
            Key: `${uuidv4()}.${type}`,
            Body: base64Data,
            ACL: 'public-read',
            ContentEncoding: 'base64',
            ContentType: `image/${type}`,
        };
        
        let location = '';
        let key = '';
        try {
            const { Location, Key } = await S3.upload(uploadParams).promise();
            location = Location;
            key = Key;
        } catch (error) {
            // console.log(error)
        }
        
        // Save the Location (url) to your database and Key if needs be.
        // As good developers, we should return the url and let other function do the saving to database etc
        console.log(location, key);
        
        return location;

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
    findUserById,
    findOneAndDelete,
}
