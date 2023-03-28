const mongoose=require('mongoose');
const Schema=mongoose.Schema;
const Review=require('./review')

//https://res.cloudinary.com/douqbebwk/image/upload/w_300/v160113904/yelpcamp/gxglelovzdz.png

const Imageschema=new Schema({
    url:String,
    filename:String
})

Imageschema.virtual('thumbnail').get(function(){
  return this.url.replace('/upload','/upload/w_100');
});

const opts={toJSON:{virtuals:true}};

const campgroundSchema=new Schema({
    title:String,
    image:[
        Imageschema
    ],
    geometry:{
        type:{
            type:String,
            enum:['Point'],
            required:true
        },
        coordinates:{
            type:[Number],
            required:true,
        }
    },
    price:Number,
    description:String,
    location:String,
    author:{
        type:Schema.Types.ObjectId,
        ref:'User'
    },
    reviews:[{
        type:Schema.Types.ObjectId,
        ref:'Review'
    }]
},opts);

campgroundSchema.virtual('properties.popupMarkup').get(function(){
  return `<strong><a href="/campgrounds/${this._id}">${this.title}</a></strong>`
});

campgroundSchema.post('findOneAndDelete',async function(doc){
    if(doc){
        await Review.deleteMany({
            _id:{
                $in:doc.reviews,
            }
        })
    }
})

module.exports=mongoose.model('campground',campgroundSchema)