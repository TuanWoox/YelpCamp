const express = require('express');
const router = express.Router({mergeParams : true});
const catchAsync = require('../utils/CatchAsync');
const {isLoggedIn,validateReview,isReviewAuthor} = require('../middleware');
const reviewControl = require('../controllers/reviews');

router.post('/',isLoggedIn,validateReview,catchAsync(reviewControl.createReview));
router.delete('/:reviewId',isLoggedIn,isReviewAuthor,catchAsync(reviewControl.deleteReview));

module.exports = router;