const express = require('express');
const router = express.Router();
const catchAsync = require('../utils/CatchAsync');
const passport = require('passport');
const { storeReturnTo } = require('../middleware');
const userControl = require('../controllers/users');

router.get('/register',userControl.renderRegisterForm)
router.post('/register', catchAsync(userControl.createUser));
router.get('/login',userControl.renderLoginForm)
//Automatically use User for us! 
router.post('/login', storeReturnTo,passport.authenticate('local',{failureFlash: true, failureRedirect:'/login'}),userControl.loginUser)
router.get('/logout',userControl.logoutUser)
module.exports = router;