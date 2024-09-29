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
  startDates:[Date]
})

const Tour=mongoose.model("Tour",tourSchema)

module.exports=Tour;