const mongoose=require("mongoose")


const regSchema=mongoose.Schema({
    email:String,
    password:String,
    firstName:String,
    lastName:String,
    mobile:Number,
    desc:String,
    img:{type:String,default:"defaultimg.png"},
    creationDate:{type:Date,default:new Date()},
    status:{type:String,default:"suspended"},
    role:{type:String,default:"free"}
})





module.exports=mongoose.model("reg",regSchema)