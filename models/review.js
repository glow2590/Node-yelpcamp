const mongoose = require ('mongoose');
const Schema = mongoose.Schema;


const reviewsSchema=new Schema({
    body:String,
    rating:Number,
    author:{
        type:Schema.Types.ObjectId,
        ref:'User'
    }
});
const Review = mongoose.model('Review',reviewsSchema);
module.exports=Review;