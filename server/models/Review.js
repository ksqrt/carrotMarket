const mongoose = require('mongoose');
const mongoosePaginate = require('mongoose-paginate-v2');

const reviewSchema = new mongoose.Schema({
    // title: {
    //     type: String,
    //     required: true,
    //     trim: true,
    //     minlength: [3, 'Title should be at least 3 characters long'],
    //     maxlength: [50, "Title can't be more than 50 characters long"]
    // },
    content: {
        type: String,
        required: true,
        trim: true,
        minlength: [10, 'Content should be at least 10 characters long'],
        maxlength: [500, 'Content should be max 500 characters long']
    },
    // user: {
    //     type: mongoose.Schema.Types.ObjectId,
    //     ref: 'User',
    //     required: true
    // },
    // createdAt: {
    //     type: Date,
    //     default: Date.now
    // }
});

// Review 모델 생성
const Review = mongoose.model('Review', reviewSchema);

module.exports = mongoose.model('Review', reviewSchema);