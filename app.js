if(process.env.NODE_ENV !=="production"){
    require('dotenv').config();
}


const express=require('express');
const app=express();
const path=require('path');
app.use(express.json());
app.use(express.urlencoded({extended:true}))
const ejsmate=require('ejs-mate');
app.engine('ejs',ejsmate);

const expresserror=require('./utils/expresserror')

const userroute=require('./routes/users');
const campgrounds=require('./routes/campgrounds');
const reviews=require('./routes/reviews');

const passport=require('passport');
const localStrategy=require('passport-local');

const User=require('./models/users');

const mongoose=require('mongoose');
const Campground = require('./models/campground');
const mo=require('method-override');
const campground = require('./models/campground');
const session = require('express-session');
const MongoDBStore=require("connect-mongo");
app.use(mo('_method'));

//const db_url=process.env.DB_URL;
//
mongoose.connect('mongodb://localhost:27017/camp',{
    useNewUrlParser:true,
  //  useCreateIndex:true, //in mongoose 6 no support
    useUnifiedTopology:true
})
const db=mongoose.connection;
db.on('error',console.error.bind(console,"connection error:"));

db.once("open",()=>{
    console.log("data base caonnected");
})

app.set('views',path.join(__dirname,'views'))
app.set('view engine','ejs');

app.use(express.static(path.join(__dirname,'public')))



const store=new MongoDBStore({
    
    mongoUrl:'mongodb://localhost:27017/camp',
    secret:'secret',
    touchAfter:24*3600
})
store.on('error',function(e){  
        console.log('session error',e);
})

const sesionconfig={
    name:'My_cookie',
    secret:'thisshouldbebettersecret',
    resave:false,
    saveUninitialized:true,
    cookie:{
        httponly:true,
        //secure:true,
        expires:Date.now()+1000*60*60*24*7,
        maxage:1000*60*60*24*7
    },
   store,
}
app.use(session(sesionconfig))

const flash=require('connect-flash');
app.use(flash());

app.use(passport.initialize());
app.use(passport.session());
passport.use(new localStrategy(User.authenticate()));

passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use((req,res,next)=>{
   // console.log(req.session);
    if(!['/login'].includes(req.originalUrl)){
        req.session.returnTo=req.originalUrl;
    }
    res.locals.currentuser=req.user;
    res.locals.success=req.flash('success');
    res.locals.error=req.flash('error');
    next();
})

app.use('/',userroute);
app.use('/campgrounds',campgrounds)
app.use('/campgrounds/:id/reviews',reviews);


app.get('/home',(req,res)=>{
    //res.send('camp is on ')
    res.render('campgrounds/home')
})


app.get('/results', async(req, res) =>{
    const {search_query} = req.query
   const campgrounds = await Campground.find( {location: {$regex: search_query, $options: "i"} })
  const camp=await Campground.findOne({location: {$regex: search_query, $options: "i"} })
   // console.log(camp.geometry.coordinates);
   //console.log(campgrounds.geometry);
   
    res.render('campgrounds/search', {campgrounds,search_query,camp})
})

app.all('*',(req,res,next)=>{
    next(new expresserror('page not foundddd',404))
})
app.use((err,req,res,next)=>{
    //console.log(err)
    const{status=500}=err;
    if(!err.message)err.message='oh no something went wrong '
    res.status(status).render('campgrounds/error',{err});
})
app.listen(3000,()=>{
    console.log('serving');
})