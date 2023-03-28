const{campgroundschema}=require('./schemas');
const expresserror=require('./utils/expresserror')
const Campground = require('./models/campground');
const{reviewSchema}=require('./schemas')
const Review=require('./models/review');

module.exports.isLoggedIn=(req,res,next)=>{
    if(!req.isAuthenticated()){
        req.flash('error','you must be signed in');
        return res.redirect('/login');
    }
    next();
}

module.exports.isauthor=async(req,res,next)=>{
    const{id}=req.params;
    var ca= await Campground.findById(id);
   if(!ca.author.equals(req.user._id)){
        req.flash('error','u have no permission to do that');
        return res.redirect(`/campgrounds/${id}`);
   }
   next();
}

module.exports.isreviewauthor=async(req,res,next)=>{
    const{id,reviewid}=req.params;
    var re= await Review.findById(reviewid);
   if(!re.author.equals(req.user._id)){
        req.flash('error','u have no permission to do that');
        return res.redirect(`/campgrounds/${id}`);
   }
   next();
}

module.exports.validatecampground=(req,res,next)=>{
    //not mongoose, it validates data before mongoose enters;
   // console.log(req.body)
   const {error}=campgroundschema.validate(req.body);

   if(error){
       const msg=error.details.map(el=>el.message).join(',');
       throw new expresserror(msg,400)
   }
   else{
       next();
   }
}

module.exports.validateReview=(req,res,next)=>{
    //console.log(req.body.review);
    const {error}=reviewSchema.validate(req.body)
    if(error){
        const msg=error.details.map(el=>el.message).join(',');
        throw new expresserror(msg,400)
    }
    else{
        next();
    }
}