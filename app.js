const express = require('express')
const path = require('path');
const mongoose = require('mongoose');
const app = express();
const Campground = require('./models/campground');
const methodOverride = require('method-override')
const ejsMate = require('ejs-mate');
const catchAsync = require('./utils/CatchAsync');
const ExpressError = require('./utils/ExpressError');
//Later on, we will have a lot of joi schema
const {campgroundSchema} = require('./validateSchema');
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
app.use(express.urlencoded({extended : true}));
// override with POST having ?_method=DELETE
app.use(methodOverride('_method'))

app.set('view engine', 'ejs')
//This one right here is app.engine
app.engine('ejs', ejsMate);

app.set('views', path.join(__dirname,'views'));

const validateCampground = (req, res, next) => {
    const { error } = campgroundSchema.validate(req.body);
    if (error) {
        const msg = error.details.map(el => el.message).join(',');
        throw new ExpressError(msg, 400);
    } else {
        next();
    }
};



app.get('/',(req,res) =>{
    res.render('home');
})

app.get('/campgrounds',catchAsync(async (req,res) =>{
    const campgrounds = await Campground.find({});
    res.render('campgrounds/index',{campgrounds});
}))
//Form for creating new campground
app.get('/campgrounds/new', (req,res) =>{
    res.render('campgrounds/new')
})
//Insert new data into database
app.post('/campgrounds',validateCampground ,catchAsync(async (req,res) =>{
    //if(!req.body.campground) throw new ExpressError('Invalid Campground Data',400);
    const newcamp = new Campground(req.body.campground);
    await newcamp.save();
    res.redirect(`/campgrounds/${newcamp._id}`);
}))
app.get('/campgrounds/:id/edit', catchAsync(async (req, res) => {
    const campground =await Campground.findById(req.params.id);
    res.render('campgrounds/edit',{campground});
}))
app.put('/campgrounds/:id', validateCampground,catchAsync(async (req, res) => {
    const campground = await Campground.findByIdAndUpdate(req.params.id,req.body.campground,{new : true});
    res.redirect(`/campgrounds/${campground._id}`);
}))
app.delete('/campgrounds/:id',catchAsync(async(req,res) =>{
    const {id} = req.params;
    await Campground.findByIdAndDelete(id);
    res.redirect('/campgrounds');
}))

app.get('/campgrounds/:id', catchAsync(async (req,res) =>{
    const campground =await Campground.findById(req.params.id);
    res.render('campgrounds/show', {campground})
}))

app.all('*',(req,res,next) => {
    next(new ExpressError('Page Not Found', 404))
})

app.use((err,req,res,next) => {
    const {statusCode = 500} = err;
    if(!err.message) err.message = 'Oh no, Something went wrong';
    res.status(statusCode).render('error', { err });
})

app.listen(3000, ()=> {
    console.log('Serving on port 3000');
})