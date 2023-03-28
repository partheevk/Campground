const Campground=require('../models/campground')
const Review=require('../models/review');

module.exports.addreview=async(req,res)=>{
    const camp=await Campground.findById(req.params.id);
   // console.log(`req ${req.params}`);
    const rev= new Review(req.body.review);
    rev.author=req.user._id;
    camp.reviews.push(rev);
    await rev.save();
    await camp.save();
    req.flash('success','created new review')
   // console.log(camp._id)
    res.redirect(`/campgrounds/${camp._id}`);
}

module.exports.delreview=async(req,res)=>{
    const{id,reviewid}=req.params;
     await Campground.findByIdAndUpdate(id,{$pull:{reviews:reviewid}});
     await Review.findByIdAndDelete(reviewid);
     req.flash('success','succesfully deleted review')
     res.redirect(`/campgrounds/${id}`)
 }