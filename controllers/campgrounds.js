const Campground=require('../models/campground');
const {cloudinary}=require('../cloudinary');
const mbxgeocoding=require('@mapbox/mapbox-sdk/services/geocoding')

const mbt=process.env.MAP_BOX_TOKEN;
const geocoder=mbxgeocoding({accessToken:mbt});

module.exports.index=async(req,res)=>{
    const campgroun=await Campground.find({});
    res.render('campgrounds/index',{campgroun})
}

module.exports.rendernewform=(req,res)=>{
    bool=true;
   // console.log(bool);
    res.render('campgrounds/new');
    //res.redirect('campgrounds/index'); //throws error because after render no link should be given
}

module.exports.newform=async(req,res)=>{
 const geodata=await geocoder.forwardGeocode({
        query:req.body.location,
        limit:1
    }).send()
   // res.send(geodata.body.features[0].geometry.coordinates);
    //res.send('ok');
    //if(!req.body) throw new expresserror('invalid input',444)
    const cam=new Campground(req.body);
    cam.geometry=geodata.body.features[0].geometry;
    
    cam.image= req.files.map(f=>({url:f.path, filename:f.filename}))
    cam.author=req.user._id;
    await cam.save();
    console.log(cam);
    req.flash('success','succesfully made new campground')
    res.redirect(`/campgrounds/${cam._id}`);
}

module.exports.showform=async(req,res)=>{
    const{id}=req.params;
    const camp=await Campground.findById(id).populate(
        {path:'reviews',
         populate:{
            path:'author'
         }
    }).populate('author');
    //console.log(camp);
    if(!camp){
        req.flash('error','cannot find that campground')
        res.redirect('/campgrounds');
    }
   // console.log(camp);
   else{
    res.render('campgrounds/show',{camp});
   }
}

module.exports.renderedit=async(req,res)=>{
    const ca=await Campground.findById(req.params.id);
    if(!ca){
        req.flash('error','cannot find that campground')
        return res.redirect('/campgrounds');
    }
    res.render('campgrounds/edit',{ca});
}

module.exports.edit=async(req,res)=>{
    const{id}=req.params;
  const ca=await Campground.findByIdAndUpdate(id,{...req.body});
    const imgs=req.files.map(f=>({url:f.path, filename:f.filename}));
  ca.image.push(...imgs);
  if(req.body.deleteImages){
    for(let filename of req.body.deleteImages){
        await cloudinary.uploader.destroy(filename);
    }
  await ca.updateOne({$pull:{image:{filename:{$in:req.body.deleteImages}}}})
  }
  await ca.save();
    req.flash('success','succesfully updated camp')
    res.redirect(`/campgrounds/${ca._id}`);
}

module.exports.delete=async(req,res)=>{
    const{id}=req.params;
    await Campground.findByIdAndDelete(id);
     req.flash('success','succesfully deleted camp')
     res.redirect('/campgrounds');
}