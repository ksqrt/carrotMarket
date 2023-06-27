const mongoose = require('mongoose');
const mongoosePaginate = require('mongoose-paginate-v2');

const reviewSchema = new mongoose.Schema({
    id: mongoose.Types.ObjectId,

    content: {
        type: String,
        required: true,
        trim: true,
        minlength: [10, 'Content should be at least 10 characters long'],
        maxlength: [500, 'Content should be max 500 characters long']
    },
    seller: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Seller',
        required: true
      },
      name: {
        type: String,
        required: true,
        trim: true
      },
    createdAt: {
        type: Date,
        default: Date.now
      }
});

// Review 모델 생성
const Review = mongoose.model('Review', reviewSchema);

module.exports = mongoose.model('Review', reviewSchema);
