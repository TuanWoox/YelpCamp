const express = require('express');
const router = express.Router({mergeParams : true});
const catchAsync = require('../utils/CatchAsync');
const {isLoggedIn,isAuthor,validateCampground} = require('../middleware');
const campgControl = require('../controllers/campgrounds');

router.get('/',catchAsync(campgControl.index));
//Form for creating new campground
router.get('/new',isLoggedIn, campgControl.renderNewForm);
//Insert new data into database
router.post('/',isLoggedIn,validateCampground,catchAsync(campgControl.createCampground));
router.get('/:id',catchAsync(campgControl.showCampground));
router.get('/:id/edit',isLoggedIn,isAuthor,catchAsync(campgControl.renderEditForm));
router.put('/:id',isLoggedIn,isAuthor,validateCampground,catchAsync(campgControl.updateCampground));
router.delete('/:id',isLoggedIn,isAuthor,catchAsync(campgControl.deleteCampground));


module.exports = router;