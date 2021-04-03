const { findOneAndUpdate } = require('../models/campground');
const Campground = require('../models/campground');
const {cloudinary} = require('../cloudinary')
const mbxGeocoding = require('@mapbox/mapbox-sdk/services/geocoding');
const mapBoxToken = process.env.MAPBOX_TOKEN;
const geoCoder=mbxGeocoding({accessToken:mapBoxToken});
module.exports.index=async (req,res)=>{
    const campgrounds =await Campground.find({});
    
   
    res.render('campgrounds/index',{campgrounds})
    
};
module.exports.renderNewForm=(req,res)=>{
    res.render('campgrounds/new');
};
module.exports.createCampground= async(req,res,next)=>{
   const geoData = await geoCoder.forwardGeocode({
        query:req.body.campground.location,
        limit:1
    }).send()
    

    const campground = new Campground(req.body.campground);
    campground.geometry=geoData.body.features[0].geometry;
    campground.images=req.files.map(f=>({url:f.path,filename:f.filename}));
    campground.author=req.user._id;
     await campground.save();
     console.log(campground)
     req.flash('success','Successfully Made Your Campground!')
     
    res.redirect(`/campground/${campground._id}`)
    
};

module.exports.renderCampground=async(req,res,next)=>{
    const {id}=req.params;
    const campground= await Campground.findById(id).populate({
        path:'reviews',
        populate:{
            path:'author'
        }
}).populate('author');
    // console.log(campground)
    if(!campground){
req.flash('error','Cannot Find That Campground!')
res.redirect('/campground')
    }
     res.render('campgrounds/show',{campground})
};

module.exports.renderEditForm =async(req,res)=>{
    const {id}=req.params;
    const campground= await Campground.findById(id);
   
    if(!campground){
        req.flash('error','Cannot Find That Campground!')
        return    res.redirect('/campground');
            }
     if(!campground.author.equals(req.user._id)){
                req.flash('error','You dont have permission to do that!');
                return res.redirect(`/campground/${id}`);
            }
    res.render('campgrounds/edit',{campground})
};
module.exports.updateCampground=async(req,res)=>{
    const {id}=req.params
   
    const camp =await Campground.findByIdAndUpdate(id,{...req.body.campground});
    const imgs=req.files.map(f=>({url:f.path,filename:f.filename}));
    camp.images.push(...imgs);
     await camp.save();
  if(req.body.deletedImages){
      for (let filename of req.body.deletedImages){
          await cloudinary.uploader.destroy(filename);
      }
    await camp.updateOne({$pull:{images:{filename:{$in:req.body.deletedImages}}}})

}
    

    req.flash('success','Successfully Edited Your Campground!')

    res.redirect(`/campground/${id}`)
    
};
module.exports.deleteCampground=async(req,res,next)=>{
    const {id}= req.params;
    const deletedCamp=await Campground.findByIdAndDelete(id);
    req.flash('success','Successfully Deleted Your Campground!')  
    res.redirect('/campground');
};