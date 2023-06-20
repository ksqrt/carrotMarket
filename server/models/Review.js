const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const ReviewSchema = mongoose.Schema({
   id: {
       type : String,
       required : true
   },
   content : {
       type : String,
       required : true
   },
   createdAt:{ // 글을 생성한 날짜 
       type : Date,
       default : Date.now
   }
},{timestamps:true})



const Review = mongoose.model('Review', ReviewSchema);

module.exports = { Review }