const express=require('express');
const router=express.Router({mergeParams:true});
const asyncerror=require('../utils/asyncerror');

const Campground = require('../models/campground');

const Review=require("../models/review")
const{validateReview,isLoggedIn,isreviewauthor}=require('../middleware');
const reviews=require('../controllers/reviews');


router.post('/',isLoggedIn,validateReview,asyncerror(reviews.addreview));

 router.delete('/:reviewid',isLoggedIn,isreviewauthor,asyncerror(reviews.delreview))

 module.exports=router;