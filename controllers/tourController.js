const fs = require('fs');
const Tour=require('./../models/tourModel');
const { error } = require('console');
const apiFeutures=require('./../utils/apiFeutures')
exports.get_top_cheap=(req,res,next)=>{
  
  req.query.sort='-price',
  req.query.limit='3',
  req.query.fields='name,price,ratingAverage',
  req.query.page='3'
  console.log(req.query)
  next()
}


 
exports.getAllTours = async (req, res) => {
   try{
  console.log('after midlware ',req.query)
  const features=new apiFeutures(Tour.find(),req.query).filter().sort().limit().pagination()
  const all_tours=await features.query;
  
  res.status(200).json({
    status: 'success',
    requestedAt: req.requestTime,
    results: all_tours.length,
    data: {
      all_tours
    }
  });

   }

   catch(error){
    res.status(404).json({
      status:'fail',
      message:error.message
    })
   }

};

exports.getTour = async (req, res) => {
  try{
     console.log(req.params);
  const id = req.params.id * 1;
  const tour= await Tour.findById(req.params.id)
  // const tour = tours.find(el => el.id === id);

  res.status(200).json({
    status: 'success',
    data: {
      tour
    }
  });
  }
  catch(error){
    res.status(404).json({
      status:'fail',
      error:error.message
    })
  }
 
};

exports.createTour = async (req, res) => {
  try {
    console.log(req.body);

    // Create a new tour from the request body
    const new_tour = await Tour.create(req.body);

    // Respond with the created tour and a success message
    res.status(200).json({
      status: 'success',        // Make sure status is a string
      data: {
        new_tour: new_tour      // Return the new_tour data inside a 'data' object
      },
    });
  } catch (error) {
    // Handle any errors that occur
    res.status(400).json({
      status: 'fail',           // Provide a failure status
      message: error.message,   // Include the error message for more detail
    });
  }
};


exports.updateTour = async (req, res) => {
try{
  const updated_tour= await Tour.findByIdAndUpdate(req.params.id,req.body,{new:true ,runValidators:true})
  res.status(200).json({
    status: 'success',
    data: {
      updated_tour
    }
  });
}
catch(error){
  res.status(404).json({
    status: 'fail',
    error:error.message
  });
}

};

exports.deleteTour = async (req, res) => {
  try{
    await Tour.findByIdAndDelete(req.params.id)
  res.status(204).json({
    status: 'success',
    data: null
  });
  }
  catch(error){
     res.status(404).json({
    status: 'fail',
    error:error.message
  });
  }

};


exports.getToursStat= async (req,res)=>{
  try{
      const stats= await Tour.aggregate([
     {$match:{
      ratingAverage:{$gte:4.5}
     }},
     {$group:{
      _id:{$toUpper:'$difficulty'},
      numTours:{$sum:1},
      numRating:{$sum:'$ratingsQuantity'},
      avrRating:{$avg:'$ratingAverage'},
      avrPrice:{$avg:'$price'},
      minPrice:{$min:'$price'},
      maxPrice:{$max:'$price'}

     }},
     {
      $sort:{$avrPrice:1}
     }
  ])
    res.status(200).json({
    status: 'success',
    data:stats
  });
  }
  catch(error){
    res.status(404).json({
    status: 'fail',
    error:error.message
  });
  }

}

exports.monthly_plan = async (req,res)=>{
  try{
      const year=req.params.year*1;
      console.log(year)
      const plan = await Tour.aggregate([
        {
          $unwind:'$startDates'
        },
        {
         $match:{
          startDates:{$gte:new Date(`${year}-01-01`),$lte:new Date(`${year}-12-31`)}
         } 
        }
      ])

    res.status(200).json({
    status: 'success',
    data:plan
  });
  }
  catch(error){
       res.status(404).json({
    status: 'fail',
    error:error.message
  });
  }
    

}