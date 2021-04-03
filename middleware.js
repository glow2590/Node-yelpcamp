const Campground = require('./models/campground');
const Review = require('./models/review')
const{campgroundSchema,reviewSchema}=require('./schemas');
const ExpressError = require('./utilities/ExpressError');

module.exports.isLoggedIn = (req,res,next)=>{
    if(!req.isAuthenticated()){
        req.session.returnTo = req.originalUrl;
        req.flash('error','You Have to Login');
         return res.redirect('/login');
    }
    next();
}
;
module.exports.isReviewAuthor= async(req,res,next)=>{
    const {id,reviewId}= req.params;
    const review = await Review.findById(reviewId);
    if(!review.author.equals(req.user._id)){
        req.flash('error','You dont have permission to do that!');
        return res.redirect(`/campground/${id}`);
    }
    next();
};
module.exports.isAuthor =async(req,res,next)=>{
    const {id}=req.params
    const campground = await Campground.findById(id);
    if(!campground.author.equals(req.user._id)){
        req.flash('error','You dont have permission to do that!');
        return res.redirect(`/campground/${id}`);
    }
    next();
};
module.exports.validateCampground=(req,res,next)=>{
  
    const {error }= campgroundSchema.validate(req.body);
    if (error){
        const message =error.details.map(e=>e.message).join(',');
        throw new ExpressError(message,400)
    }else {next();}
 
};
module.exports.validateReview = (req,res,next)=>{
    const{error}=reviewSchema.validate(req.body);
    if(error){
        const message =error.details.map(e=>e.message).join(',');
        throw new ExpressError(message,400)
    }else next();
};
