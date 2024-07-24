const express = require('express');
const router = express.Router({mergeParams : true});
const catchAsync = require('../utils/CatchAsync');
const {isLoggedIn,isAuthor,validateCampground} = require('../middleware');
const campgControl = require('../controllers/campgrounds');
const multer  = require('multer')
const {storage } = require('../cloudinary'); 
const upload = multer({ storage })

router.route('/')
.get(catchAsync(campgControl.index))
.post(isLoggedIn,upload.array('images'),validateCampground,catchAsync(campgControl.createCampground));

//New to be put ahead of route :/id => because it will thought new is a id
router.get('/new',isLoggedIn, campgControl.renderNewForm);

router.route('/:id')
.get(catchAsync(campgControl.showCampground))
.put(isLoggedIn,isAuthor,upload.array('images'),validateCampground,catchAsync(campgControl.updateCampground))
.delete(isLoggedIn,isAuthor,catchAsync(campgControl.deleteCampground))

router.get('/:id/edit',isLoggedIn,isAuthor,catchAsync(campgControl.renderEditForm));

module.exports = router;