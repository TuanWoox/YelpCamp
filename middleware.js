const Campground = require('./models/campground');
const Review = require('./models/review');
const {campgroundSchema,reviewSchema } = require('./validateSchema');
const ExpressError = require('./utils/ExpressError');


module.exports.isLoggedIn = (req,res,next) => {
    //isAuthenticated() is used to check if the cookie for the session is still valid!
    if(!req.isAuthenticated())
        {
            req.session.returnTo = req.originalUrl; 
            req.flash('error','you must be signed in!!!');
            return res.redirect('/login');
        }
    next();
}
module.exports.storeReturnTo = (req, res, next) => {
    if (req.session.returnTo) {
        res.locals.returnTo = req.session.returnTo;
    }
    next();
}

module.exports.isAuthor =  async (req,res,next) => {
    const campground = await Campground.findById(req.params.id);
    if(!campground.author.equals(req.user._id)){
        req.flash('error','You do not have permission to do that!!!')
        return res.redirect(`/campgrounds/${campground._id}`);
    }
    next();
}
module.exports.isReviewAuthor =  async (req,res,next) => {
    const {id,reviewId} = req.params;
    const review = await Review.findById(reviewId);
    if(!review.author.equals(req.user._id)){
        req.flash('error','You do not have permission to do that!!!')
        return res.redirect(`/campgrounds/${id}`);
    }
    next();
}
module.exports.validateCampground = (req, res, next) => {
    const { error } = campgroundSchema.validate(req.body);
    if (error) {
        const msg = error.details.map(el => el.message).join(',');
        throw new ExpressError(msg, 400);
    } else {
        next();
    }
};
module.exports.validateReview = (req,res,next) => {
    const { error } = reviewSchema.validate(req.body);
    if (error) {
        const msg = error.details.map(el => el.message).join(',');
        throw new ExpressError(msg, 400);
    } else {
        next();
    }
}