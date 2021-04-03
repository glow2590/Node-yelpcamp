//PACKAGES and requires
const mongoose = require('mongoose');
const cities = require('./cities')
const {places,descriptors}=require('./seedhelpers');
const methodOverride = require('method-override')
const Campground=require('../models/campground');

//CONNECTIONS

mongoose.connect('mongodb://localhost:27017/yelpCamp',
{useNewUrlParser: true,useUnifiedTopology: true,useCreateIndex:true})
.then(()=>{
console.log('Connected To mongo...')
}).catch((err)=>{

    console.log('Oh no mongo connection Error!!');
    console.log(err);
})
const sample =(array)=>array[Math.floor(Math.random()*array.length)];


const seedDB=async ()=>{
        await Campground.deleteMany({});
        for(let i =0;i<50;i++){
            const random1000= Math.floor(Math.random() *1000);
            const price = Math.floor(Math.random()*20)+10;
            const camp =new Campground({
                author:'60421a24dd03e45354b33cc1',
                location:`${cities[random1000].city},${cities[random1000].state}`,
                title:`${sample(descriptors)} ${sample(places)}`,
                
                description:'Lorem ipsum dolor sit amet, consectetur adipisicing elit. Saepe iste suscipit veniam quisquam tempore, incidunt vero quam eaque inventore? Eveniet id ducimus, quasi inventore accusamus molestiae consectetur natus magnam ab?',
                price,
                geometry:{ type: 'Point',
                 coordinates: [
                             cities[random1000].longitude,
                             cities[random1000].latitude,
                              ]
                       },
                images: [
                    {
                      _id: '605b304691428b3d4c39afd6',
                      url: 'https://res.cloudinary.com/development-purpose/image/upload/v1616588867/YelpCamp/fhixjmyyxdpx58sxdwqd.jpg',
                      filename: 'YelpCamp/fhixjmyyxdpx58sxdwqd'
                    },
                    {
                      _id: '605b304691428b3d4c39afd7',
                      url: 'https://res.cloudinary.com/development-purpose/image/upload/v1616588865/YelpCamp/in1gdpol8nebxm9iuhzs.jpg',
                      filename: 'YelpCamp/in1gdpol8nebxm9iuhzs'
                    }
                  ]
                
            })
            await camp.save();
           const result = await Campground.find({});
           await console.log(result);

        }
}
seedDB().then(()=>{
    mongoose.connection.close();
})

