// const { required } = require('joi');
const mongoose=require('mongoose');
const Schema=mongoose.Schema;
const passportLocalMongoose=require("passport-local-mongoose");

const clientSchema=new Schema({
    email : {
        type : String,
        required : true,
    }
})
clientSchema.plugin(passportLocalMongoose);
module.exports=mongoose.model("Client",clientSchema);