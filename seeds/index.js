const mongoose = require('mongoose');
const Campground = require('../models/campground');
const cities = require('./cities');
const {places,descriptors} = require('./seedHelpers');
async function main() {
  await mongoose.connect('mongodb://127.0.0.1:27017/yelp-camp');
}
main().then(() =>{
    console.log("Database connect")
})
main().catch((e) =>{
    console.log("Error");
    console.log(e);
})

const sample = array => array[Math.floor(Math.random()*array.length)];

const seedDB = async () => {
    await Campground.deleteMany({});
    for(let i = 0; i < 200; i++)
    {
        const random1000 = Math.floor((Math.random()*1000))
        const price = Math.floor(Math.random()*20) + 10;
        const camp = new Campground({
            author: '669db2f54650b1a7546f2337',
            location: `${cities[random1000].city}, ${cities[random1000].state}`,
            title: `${sample(descriptors)} ${sample(places)}`,
            description :'Lorem ipsum dolor sit amet consectetur adipisicing elit. Fugiat blanditiis eveniet commodi facilis magnam rerum eius dolore omnis sit, sed quibusdam est quas earum iste, dolores vero quos deserunt placeat',
            price,
            geometry: { 
              type: 'Point', 
              coordinates: [ 
              cities[random1000].longitude, 
              cities[random1000].latitude
              ]},
            images: 
            [
                {
                  url: 'https://res.cloudinary.com/dztjmkvak/image/upload/v1721746685/YelpCamp/olncykkvxr7zfmu5l3la.jpg',
                  filename: 'YelpCamp/olncykkvxr7zfmu5l3la',
                },
                {
                  url: 'https://res.cloudinary.com/dztjmkvak/image/upload/v1721746686/YelpCamp/izrhtee8q6hzpnjrrtjn.jpg',
                  filename: 'YelpCamp/izrhtee8q6hzpnjrrtjn',
                }
              ],
        })
        await camp.save();
    }
}

seedDB().then(() =>{
    mongoose.connection.close();
})