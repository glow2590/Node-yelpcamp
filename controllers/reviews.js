const Campground=require('../models/campground');
const Review= require('../models/review')
module.exports.createReviews=async(req,res)=>{
    const {id} =req.params;
    const campground = await Campground.findById(id);
    const review= new Review(req.body.review);
    campground.reviews.push(review);
    review.author=req.user._id
    await review.save();
    await campground.save();
    req.flash('success','Added Your Review!')

    res.redirect(`/campground/${id}`)
};
module.exports.deleteReviews=async(req,res)=>{
    const {id,reviewId}=req.params;
    await Campground.findByIdAndUpdate(id,{$pull:{reviews:reviewId}});
    await Review.findByIdAndDelete(reviewId);
    req.flash('success','Deleted Your Review!')
    res.redirect(`/campground/${id}`)

};