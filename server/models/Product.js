const mongoose = require('mongoose');
const mongoosePaginate = require('mongoose-paginate-v2');

// mongoose.Schema 인스턴스를 생성합니다.
const productSchema = new mongoose.Schema({
    id: mongoose.Types.ObjectId,
    title: {
        type: String,
        required: ['Title is required'],
        trim: true,
        minlength: [3, 'Title should be at least 3 characters long'],
        maxLenght: [50, "Title can't be more than 50 cahracters long"]
    },
    category: {
        type: String,
        required: ['Category is required'],
        validate: {
            validator: function (v) {
                return (v != 'Choose...');
            },
            message: 'Please choose a category'
        }
    },
    description: {
        type: String,
        trim: true,
        required: ['Description is required'],
        minlength: [10, 'Description should be at least 10 characters long'],
        maxlength: [1000, 'Description should be max 500 characters long']
    },
    price: {
        type: Number,
        required: true,
        trim: true,
    },
    city: {
        type: String,
        required: ['City is required'],
        trim: true
    },
    image: {
        type: String,
        required: true
    },
    addedAt: {
        type: Date,
        required: true,
    },
    seller: {
        type: mongoose.Types.ObjectId,
        ref: 'User'
    },
    likes: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User'
        }
    ],
    active: {
        type: Boolean,
        default: true
    },
    soldout: {
        type: Boolean,
        default: false
    },
    // 조회수 추가  
    views:[
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User'
        }
    ]
    
});

// mongoosePaginate 플러그인을 productSchema에 적용합니다.
productSchema.plugin(mongoosePaginate);

// Product 모델로 productSchema를 컴파일하고 내보냅니다.
module.exports = mongoose.model('Product', productSchema);