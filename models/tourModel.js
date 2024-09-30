const mongoose=require('mongoose')
const tourSchema= new mongoose.Schema({
  name:{
    type:String,
    required:[true,"tours name must have name"],
    unique:true,
    trim:true
  },
  duration:{
    type:Number,
    required:[true,"duration is required"]
  },
  maxGroupSize:{
    type:Number,
    required:[true,"maximum number is required"]
  },
  difficulty:{
    type:String,
    required:[true,"defficality is required"]
  },
  ratingAverage:{
    type:Number,
    default:4.5
  },
   ratingsQuantity:{
    type:Number,
    default:0
  },
  price:{
    type:Number,
    required:[true,"price is required"]
  },
  priceDiscount:Number,
  summary:{
    type:String,
    trim:true,
    required:[true,"description is required"]
  },
  description:{
    type:String,
    trim:true
  },
  imageCover:{
    type:String,
    required:[true,"cover image is required"]
  },
  images:[String],
  createdAt:{
    type:Date,
    default:Date.now()
  },
  startDates:[Date],
  secret_tour:{
    type:Boolean,
    default:false
  },
},{
  toJSON:{virtual:true},
  toObject:{virtual:true}
})
tourSchema.virtual("duration_weak",function(){
  return this.duration/7
})

// middileware on mongdb

tourSchema.pre(/^find/,function(next){
  console.log("the midle ware is started")
  this.find({secret_tour:{$ne:true}})
  this.start=Date.now()
  console.log("this in pre is",this )
  next()
})

tourSchema.post(/^find/,function(docs,next){
  console.log(`the time it takes is ${Date.now()-this.start}`)
  console.log('this in post is ',this)
   console.log(docs)
  next()
})

tourSchema.pre('aggregate',function(next){
      this.pipeline().unshift({$match:{secret_tour:{$ne:true}}})
      next()
})

const Tour=mongoose.model("Tour",tourSchema)

module.exports=Tour;




// WHAT IS DOCUMENT MIDDLE WARE MIDDLE WARE 
// middle ware *on mongdb is the about eifinning the funcition taht is excuted before and after the operation is done on 
// the data base 

// they are two types of middlware hooks 
// pre and post
// specifically they are four types of middleware 
// 1 document middleware 2 query middleware 3 model middleware and aggregation middlewarr

