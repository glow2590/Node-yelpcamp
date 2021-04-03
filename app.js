if(process.env.NODE_ENV !== "production"){
    require('dotenv').config();
}

//PACKAGES and requires
const express = require('express');
const helmet = require("helmet");
const app = express();
const path = require('path');
const mongoose = require('mongoose');
const ejs = require('ejs');
const ejsMate=require('ejs-mate');
const methodOverride = require('method-override');
const Campground=require('./models/campground');
const ExpressError = require('./utilities/ExpressError');
const catchAsync = require('./utilities/catchAsync');
const { join } = require('path');

const mongoSanitize = require('express-mongo-sanitize');
const db_url=process.env.DB_URL;


const userRoutes = require('./routes/users');
const campgroundRoutes= require('./routes/campgrounds');
const reviewRoutes = require('./routes/reviews');

const session = require('express-session');
const flash = require('connect-flash');
const passport = require('passport');
const LocalStrategy= require('passport-local')
const User = require('./models/user')
const MongoStore = require('connect-mongo');
//SET

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));
//use
app.use(helmet());
app.engine('ejs',ejsMate);
app.use(methodOverride('_method'));
app.use(express.urlencoded({extended:true}))
app.use(express.static(path.join(__dirname,'public')))
app.use(mongoSanitize());


const scriptSrcUrls = [
    "https://stackpath.bootstrapcdn.com",
    "https://api.tiles.mapbox.com",
    "https://api.mapbox.com",
    "https://kit.fontawesome.com",
    "https://cdn.jsdelivr.net",
];
const styleSrcUrls = [
    "https://kit-free.fontawesome.com",
    "https://stackpath.bootstrapcdn.com",
    "https://api.mapbox.com",
    "https://api.tiles.mapbox.com",
    "https://fonts.googleapis.com",
    "https://use.fontawesome.com",
    "https://cdn.jsdelivr.net"
];
const connectSrcUrls = [
    "https://api.mapbox.com",
    "https://*.tiles.mapbox.com",
    "https://events.mapbox.com",
];
const fontSrcUrls = [];
app.use(
    helmet.contentSecurityPolicy({
        directives: {
            defaultSrc: [],
            connectSrc: ["'self'", ...connectSrcUrls],
            scriptSrc: ["'unsafe-inline'", "'self'", ...scriptSrcUrls],
            styleSrc: ["'self'", "'unsafe-inline'", ...styleSrcUrls],
            workerSrc: ["'self'", "blob:"],
            childSrc: ["blob:"],
            objectSrc: [],
            imgSrc: [
                "'self'",
                "blob:",
                "data:",
                "https://res.cloudinary.com/development-purpose/", //SHOULD MATCH YOUR CLOUDINARY ACCOUNT! 
                "https://images.unsplash.com",
                "https://unsplash.com"
            ],
            fontSrc: ["'self'", ...fontSrcUrls],
        },
    })
);
const store = new MongoStore({
    mongoUrl:db_url,
    secret:'thisshouldbeabettersecret',
    touchAfter:24*60*60
})
store.on("error",function (e) {
    console.log('SESSION STORE ERROR',e)
})
const sessionConfigr={
    store,
    name:'__smep',
    secret:'thisshouldbeabettersecret',
    resave:false,
    saveUninitialized:true,
    cookie:{
        httpOnly:true,
        //secure:true,
        expires:Date.now()+1000*60*60*24*7,
        maxAge:1000*60*60*24*7
    }
};
app.use(session(sessionConfigr));

app.use(passport.initialize());
app.use(passport.session());

passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());
 

app.use(flash());
app.use((req,res,next)=>{
    res.locals.success = req.flash('success');
    res.locals.error = req.flash('error');
    res.locals.currentUser=req.user;
    next();
})
//ROUTS
app.use('/',userRoutes)
app.use('/campground',campgroundRoutes)

app.use('/campground/:id/reviews',reviewRoutes)

app.get('/fakeuser',async(req,res)=>{
const user =new User({email:'Diaanagib3@gmail.com',username:'diaa',});
const newUser = await User.register(user,'chicken');
res.send(newUser)
})
//Mongo CONNECTION
mongoose.connect(db_url,
{useNewUrlParser: true,useUnifiedTopology: true,useCreateIndex:true,useFindAndModify:false})
.then(()=>{
console.log('Connected To mongo...')
}).catch((err)=>{

    console.log('Oh no mongo connection Error!!');
    console.log(err);
})


//ROUTS
app.get('/',(req,res)=>{

res.render('home');
})

//Error handler 
app.all('*',(req,res,next)=>{
    next(new ExpressError('Page Not Found',404))
})
app.use((err,req,res,next)=>{
    const {status=500}=err;
    if(!err.message)err.message='Oh no something went wrong !';
res.status(status).render('error',{err});
})



app.listen(3000,()=>{
    console.log('app listening port 3000!!')
    })




