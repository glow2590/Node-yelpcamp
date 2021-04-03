if (process.env.NODE_ENV!=='production'){
    require('dotenv').config();
}


const express = require('express');
const router = express.Router();
const catchAsync = require('../utilities/catchAsync');
const Campground=require('../models/campground');
const campgrounds=require('../controllers/campgrounds')
const {isLoggedIn, isAuthor,validateCampground}= require('../middleware');
const passport = require('passport');

const multer  = require('multer')
const {storage}= require('../cloudinary')
const upload = multer({storage});


router.get('/',catchAsync(campgrounds.index));
router.route('/new')
    .get(isLoggedIn,campgrounds.renderNewForm)

    .post(isLoggedIn,upload.array('image'),validateCampground,catchAsync(campgrounds.createCampground))

    // .post(upload.array('image'),(req,res)=>{
    //     console.log(req.body , req.files);
    //     res.send('It worked!!')
    // })
router.get('/:id/edit',isLoggedIn,isAuthor,catchAsync(campgrounds.renderEditForm))


router.route('/:id')
    .get(catchAsync(campgrounds.renderCampground))
    .put(isLoggedIn,isAuthor,upload.array('image'),validateCampground,catchAsync(campgrounds.updateCampground))
    .delete(isLoggedIn,isAuthor,catchAsync(campgrounds.deleteCampground))



module.exports=router;