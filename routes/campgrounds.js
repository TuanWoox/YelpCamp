const express = require('express');
const router = express.Router({mergeParams : true});
const catchAsync = require('../utils/CatchAsync');
const ExpressError = require('../utils/ExpressError');
const Campground = require('../models/campground');
const {campgroundSchema } = require('../validateSchema');
const {isLoggedIn} = require('../middleware');
const validateCampground = (req, res, next) => {
    const { error } = campgroundSchema.validate(req.body);
    if (error) {
        const msg = error.details.map(el => el.message).join(',');
        throw new ExpressError(msg, 400);
    } else {
        next();
    }
};

router.get('/',catchAsync(async (req,res) =>{
    const campgrounds = await Campground.find({});
    res.render('campgrounds/index',{campgrounds});
}))
//Form for creating new campground
router.get('/new',isLoggedIn, (req,res) =>{
    res.render('campgrounds/new')
})
//Insert new data into database
router.post('/',isLoggedIn,validateCampground,catchAsync(async (req,res) =>{
    //if(!req.body.campground) throw new ExpressError('Invalid Campground Data',400);
    const newcamp = new Campground(req.body.campground);
    await newcamp.save();
    req.flash('success','Successfully made a new campground');
    res.redirect(`/campgrounds/${newcamp._id}`);
}))
router.get('/:id',catchAsync(async (req,res) =>{
    const campground =await Campground.findById(req.params.id).populate('reviews');
    if(!campground){
        req.flash('error','Cannot find that campground');
        return res.redirect('/campgrounds');
    }
    res.render('campgrounds/show', {campground})
}))

router.get('/:id/edit',isLoggedIn,catchAsync(async (req, res) => {
    const campground =await Campground.findById(req.params.id);
    if(!campground){
        req.flash('error','Cannot find that campground');
        return res.redirect('/campgrounds');
    }
    res.render('campgrounds/edit',{campground});
}))
router.put('/:id',isLoggedIn,validateCampground,catchAsync(async (req, res) => {
    const campground = await Campground.findByIdAndUpdate(req.params.id,req.body.campground,{new : true});
    req.flash('success','Successfully updated campground!');
    res.redirect(`/campgrounds/${campground._id}`);
}))

router.delete('/:id',isLoggedIn,catchAsync(async(req,res) =>{
    const {id} = req.params;
    await Campground.findByIdAndDelete(id);
    req.flash('success','Successfully deleted campground!!');
    res.redirect('/campgrounds');
}))


module.exports = router;