//Npm packages
const express = require('express')
const path = require('path');
const mongoose = require('mongoose');
const app = express();
const methodOverride = require('method-override')
const ejsMate = require('ejs-mate');
const ExpressError = require('./utils/ExpressError');
const session = require('express-session');
const flash = require('connect-flash');
const passport = require('passport');
const LocalStrategy = require('passport-local');
const User = require('./models/user');
//Routes
const campgroundRoutes = require('./routes/campgrounds');
const reviewRoutes = require('./routes/reviews');
const userRoutes = require('./routes/users');
const exp = require('constants');

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
//This is using for parse the body using urlencode ( our normal language)
app.use(express.urlencoded({extended : true}));
// override with POST having ?_method=DELETE
app.use(methodOverride('_method'))
app.set('view engine', 'ejs')
//This one right here is app.engine used for layouts, partials, block
app.engine('ejs', ejsMate);
//This one is for req.render 
app.set('views', path.join(__dirname,'views'));
//Serving public asset
app.use(express.static(path.join(__dirname,'public')));
//Using session
const sessionConfig = {
    secret: 'thisshouldbeabettersecret',
    resave: false,
    saveUninitialized: true,
    cookie: {
        httpOnly: true,
        //Expires for old browser
        //expires: Date.now() + 1000 * 60 * 60 * 24 * 7,
        //MaxAge for new browser nowdays
        maxAge: 1000 * 60 * 60 * 24 * 7
    }
}
app.use(session(sessionConfig));
//This is for the flash pop up
app.use(flash());
//passport.ini => install passport, passport.session => persistant login, must place after session
app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.createStrategy()));
//How do we store and unstore a user in a session
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());
//This is use for catch flash message
app.use((req,res,next) => {
    res.locals.success = req.flash('success');
    res.locals.error = req.flash('error');
    res.locals.currentUser = req.user;
    next();
})

//Routers
app.use('/',userRoutes);
app.use('/campgrounds',campgroundRoutes);
app.use('/campgrounds/:id/reviews',reviewRoutes);



app.get('/',(req,res) =>{
    res.render('home');
})
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