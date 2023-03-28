const express=require('express');
const router=express.Router();
const asyncerror=require('../utils/asyncerror');

const{isLoggedIn, validatecampground,isauthor}=require('../middleware');
const { populate } = require('../models/campground');
const campgrounds=require('../controllers/campgrounds');

const multer=require('multer');
const{storage}=require('../cloudinary');
const upload=multer({storage});

router.route('/')
    .get(asyncerror(campgrounds.index))
    .post(isLoggedIn,upload.array('image'),validatecampground,asyncerror(campgrounds.newform));
    
router.get('/new',isLoggedIn,campgrounds.rendernewform);

router.route('/:id')
    .get(asyncerror(campgrounds.showform))
    .put(isLoggedIn,isauthor,upload.array('image'),validatecampground,asyncerror(campgrounds.edit))
    .delete(isLoggedIn,isauthor,asyncerror(campgrounds.delete));



router.get('/:id/edit',isauthor,isLoggedIn,asyncerror(campgrounds.renderedit))

module.exports=router;