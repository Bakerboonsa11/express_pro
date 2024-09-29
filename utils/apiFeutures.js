class apiFeutures{
  constructor(query,queryString){
       this.query=query;
       this.queryString=queryString;
  }
   
  filter(){
  
    const queryObject={...this.queryString}
    const excludeQuery=['page','sort','limit','fields']
    excludeQuery.forEach(el=>{
      delete queryObject[el]
    })
  
     let queryString=JSON.stringify(queryObject);
     queryString=queryString.replace(/\b(gte|gt|lte|lt)\b/g,match=>`$${match}`)
    

     this.query.find(JSON.parse(queryString))
   return this
  }

  sort(){
    
       if(this.queryString.sort){
      
      const sortBy=this.queryString.sort.split(',').join(' ');
      this.query=this.query.sort(sortBy)
    }
    else{
      this.query.sort("-createdAt");
    }
    return this
  }
  limit(){

   if(this.queryString.fields){
    console.log(`the select is ${this.queryString.fields}`)
    const selectBy=this.queryString.fields.split(',').join(' ');
    this.query=this.query.select(selectBy)
   }
   else{ this.query=this.query.select('-__v')}
   return this
  }
   pagination(){
    console.log(this.query.page,this.query.limit)
    const page=this.queryString.page*1
    const limit=this.queryString.limit*1
    const skip=(page-1)*limit
      if(this.queryString.page){
     
    this.query=this.query.skip(skip).limit(limit)
  }
  return this
  }
}

module.exports=apiFeutures;