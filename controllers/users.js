const User = require('../models/user');
//shortcut below
ME=module.exports;

ME.renderRegister=(req,res)=>{
    res.render('users/register')
};

ME.registerUsers=async(req,res,next)=>{
    try{  const {username,email,password}=req.body;
      const user = new User ({username,email});
      const registerdUser =await User.register(user,password);
      req.login(registerdUser,err=>{
          if(err) return next(err);
          req.flash('success','Welcome to yelpcamp');
          res.redirect('/campground')
      })}catch(e){
   req.flash('error',e.message);
   res.redirect('register')}
};

ME.renderLogin=(req,res)=>{
    res.render('users/login')
};
ME.loginUser=(req,res)=>{
    req.flash('success','Welcome To Yelp Camp!');
    const redirectUrl= req.session.returnTo || '/campground';
    delete req.session.returnTo;
    
    res.redirect(redirectUrl);
};

ME.logoutUser=(req,res)=>{
    req.logout();
    req.flash('success','Logged Out.')
    res.redirect('/campground')
};