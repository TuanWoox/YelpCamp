const express = require('express')
const path = require('path');
const mongoose = require('mongoose');
const app = express();
const Campground = require('./models/campground');
const methodOverride = require('method-override')
const ejsMate = require('ejs-mate');

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
app.use('ejs', ejsMate);
app.use(express.urlencoded({extended : true}));
// override with POST having ?_method=DELETE
app.use(methodOverride('_method'))

app.set('view engine', 'ejs')
app.set('views', path.join(__dirname,'views'));

app.get('/',(req,res) =>{
    res.render('home');
})

app.get('/campgrounds',async (req,res) =>{
    const campgrounds = await Campground.find({});
    res.render('campgrounds/index',{campgrounds});
})
//Form for creating new campground
app.get('/campgrounds/new', (req,res) =>{
    res.render('campgrounds/new')
})
//Insert new data into database
app.post('/campgrounds',async (req,res) =>{
    const newcamp = new Campground(req.body.campground);
    await newcamp.save();
    res.redirect(`/campgrounds/${newcamp._id}`);
})
app.get('/campgrounds/:id/edit', async (req, res) => {
    const campground =await Campground.findById(req.params.id);
    res.render('campgrounds/edit',{campground});
})
app.put('/campgrounds/:id', async (req, res) => {
    const campground = await Campground.findByIdAndUpdate(req.params.id,req.body.campground,{new : true});
    res.redirect(`/campgrounds/${campground._id}`);
})
app.delete('/campgrounds/:id',async(req,res) =>{
    const {id} = req.params;
    await Campground.findByIdAndDelete(id);
    res.redirect('/campgrounds');
})







app.get('/campgrounds/:id', async (req,res) =>{
    const campground =await Campground.findById(req.params.id);
    res.render('campgrounds/show', {campground})
})



app.listen(3000, ()=> {
    console.log('Serving on port 3000');
})