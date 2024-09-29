const fs = require('fs');
const Tour=require('./../models/tourModel');
const { error } = require('console');
exports.get_top_cheap=(req,res,next)=>{
  req.query.sort='-price',
  req.query.limit='5',
  req.query.fields='name,price,ratingAverage'
  next()
}
exports.getAllTours = async (req, res) => {
 
  // const queryObject={...req.query};
   try{
    const queryObject={...req.query}
    const excludeQuery=['page','sort','limit','fields']
    excludeQuery.forEach(el=>{
      delete queryObject[el]
    })
  
 let queryString=JSON.stringify(queryObject);
  queryString=queryString.replace(/\b(gte|gt|lte|lt)\b/g,match=>`$${match}`)
     console.log(queryObject)
     console.log(JSON.parse(queryString))
   
    let query= Tour.find(JSON.parse(queryString));
  // SORTING
    if(req.query.sort){
      const sortBy=req.query.sort.split(',').join(' ');
      query=query.sort(sortBy)
    }
    else{
      query.sort("-createdAt");
    }
// FIELD LIMITIN

   if(req.query.fields){
    console.log(`the select is ${req.query.fields}`)
    const selectBy=req.query.fields.split(',').join(' ');
    query=query.select(selectBy)
   }
   else{ query=query.select('-__v')}

  //  PAGINATION
 const page=req.query.page*1
    const limit=req.query.limit*1
    const skip=(page-1)*limit
  if(req.query.page){
    
    const tourNumber=await query.countDocuments()
    if(skip>=tourNumber ) throw new Error('there is NO page')
    query=query.skip(skip).limit(limit)
  }

    const all_tours=await query;
    // const all_tours=await Tour.find().where("difficulty").equals("easy")
  // console.log(req.requestTime);

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
