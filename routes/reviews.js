const express = require('express');
const router = express.Router({mergeParams:true});
const ExpressError = require('../utilities/ExpressError');

const catchAsync = require('../utilities/catchAsync');
const{reviewSchema}=require('../schemas')
const {validateReview,isLoggedIn,isReviewAuthor}=require('../middleware')
const reviews=require('../controllers/reviews')


router.post('/',isLoggedIn,validateReview,catchAsync(reviews.createReviews))

router.delete('/:reviewId',isLoggedIn,isReviewAuthor,catchAsync(reviews.deleteReviews))

module.exports=router;