const express = require('express');
const router = express.Router();
const catchAsync = require('../utils/CatchAsync');
const passport = require('passport');
const { storeReturnTo } = require('../middleware');
const userControl = require('../controllers/users');

router.route('/register')
.get(userControl.renderRegisterForm)
.post(catchAsync(userControl.createUser))

router.route('/login')
.get(userControl.renderLoginForm)
.post(storeReturnTo,passport.authenticate('local',{failureFlash: true, failureRedirect:'/login'}),userControl.loginUser)

router.get('/logout',userControl.logoutUser)
module.exports = router;