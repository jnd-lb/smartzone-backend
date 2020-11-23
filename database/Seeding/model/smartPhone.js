const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const schema = new Schema({
    modelName : {type:String, required:true},
        brandId: {type:String, required:true,},
        screenSize:{type:String, required:true},
        frontCameraRes:{type:String, required:true},
        rearCameraRes:{type:String, required:true},
        batteryCapacity:{type:Number, required:true},
        ram:{type:String, required:true},
        price:{type:Number,required:true},
        releaseDate:{type:String,required:true},
        os:{type:String, required:true},
        sim:{type:String, required:true},
        imgUrl:{type:String, required:true}
});


schema.pre('save', async function(next) {
    let error = schema.validateSync();
    if(error){
        console.log("Error:",error);
        throw "The valiation failed"
    }else{
        next();
    }
  });  

  

module.exports = mongoose.model("model",schema);