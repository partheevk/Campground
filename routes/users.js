const express=require('express');
const passport = require('passport');
const router=express.Router();
const User=require('../models/users');
const catchasync=require('../utils/asyncerror');
const users=require('../controllers/users');

router.route('/register')
    .get(users.renderreg)
    .post(catchasync(users.reg));


router.route('/login')
    .get(users.renderlogin)
    .post(passport.authenticate('local',{failureFlash:true,failureRedirect:'/login',
    failureMessage:true,keepSessionInfo:true}),users.login);


router.get('/logout',users.logout);

module.exports=router;