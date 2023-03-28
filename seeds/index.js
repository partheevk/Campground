if(process.env.NODE_ENV !=="production"){
    require('dotenv').config();
}
const campground=require('../models/campground');
const mongoose=require('mongoose');
mongoose.connect('mongodb://localhost:27017/camp',{
    useNewUrlParser:true,
  //  useCreateIndex:true, //in mongoose 6 no support
    useUnifiedTopology:true
})
const db=mongoose.connection;
db.on('error',console.error.bind(console,"connection error:"));
db.once("open",()=>{
    console.log("data base connected");
})

const cities=require('./cities.js')
const {places,descriptors}=require('./seedhelpers');
const sample=(array)=>{
     return array[Math.floor(Math.random() * array.length)]
}
const seeddb=async()=>{
    await campground.deleteMany({});
    for(let i=0;i<407;i++){
        const rand=Math.floor(Math.random()*400);
        const pric=Math.floor(Math.random()*20)+10;
        const camp=new campground({
            author:"6331b0ba77a22bd612b9d88c",
            location:`${cities[rand].city},${cities[rand].admin_name}`,
            title:`${sample(descriptors)} ${sample(places)}`,
            description:'hello good bljslldsjflsjadjcsdd',
            price:pric,
            geometry: { 
                type: "Point", 
                coordinates: [
                          cities[rand].lng,
                          cities[rand].lat
                            ] },
            image:
                [
                    {
                      url: 'https://res.cloudinary.com/dfonpjxqe/image/upload/v1664361629/projectcamp/wlu1jhpr8ygppvixeupu.jpg',
                      filename: 'projectcamp/wlu1jhpr8ygppvixeupu',
                     
                    },
                    {
                      url: 'https://res.cloudinary.com/dfonpjxqe/image/upload/v1664361629/projectcamp/redse0romdglhdrpaqgq.jpg',
                      filename: 'projectcamp/redse0romdglhdrpaqgq',
                    }
                  ]
        })
        await camp.save();
    }
}
seeddb().then(()=>mongoose.connection.close())