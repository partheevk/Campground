const User=require('../models/users');

module.exports.renderreg=(req,res)=>{
    res.render('campgrounds/user/register');
}

module.exports.reg=async(req,res)=>{
    try{
    const{email,username,password}=req.body;
    const user=new User({email,username});
    const registeruser=await User.register(user,password);
   // console.log(registeruser);
   req.login(registeruser,err=>{
    if(err)return next(err);
    req.flash('success','welcome to campgrounds')
    res.redirect('/campgrounds');
   })
    }
    catch(e){
        req.flash('error',e.message);
        res.redirect('/register');
    }
    
}

module.exports.renderlogin=(req,res)=>{
    res.render('campgrounds/user/login');
}

module.exports.login=(req,res)=>{
    req.flash('success','welcome');
    var url=req.session.returnTo ||'/campgrounds';
    if(url==='/x'){
        //console.log('x')
        url='/campgrounds';
    }
    //console.log(url)
    delete req.session.returnTo;
    res.redirect(url);
}

module.exports.logout=function(req, res, next) {
    req.logout(function(err) {
      if (err) { return next(err); }
      req.flash('success','logged out successfully')
      res.redirect('/home');
    });
}