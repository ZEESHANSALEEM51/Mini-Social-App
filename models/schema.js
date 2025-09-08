const mongoose=require("mongoose");
const Schema=mongoose.Schema;
const Comment = require("./comment.js");
const userSchema=new Schema({
    name : {
        type : String,
        required : true,
    },
     image : {
        type : String,
        default : null
    },
    email : {
        type : String,
        required : true,
    },
    post : {
        type : String,
        required : true,
    },
    likes : {
        type : Number,
        default : 0,
    },
    comment : {
        type : String,
        required : true,
    },
    followers : {
        type : Number,
        default : 0,
    },
    password : {
        type : Number,
        required : true,
    },
    createdAt: {
        type: Date,
        default: Date.now // Sets the current date and time as default
    },
    comments : [
        {
            type : Schema.Types.ObjectId,
            ref : "Comment",
        }
    ],
    owner : {
        type : Schema.Types.ObjectId,
        ref : "Client"
    }
})

userSchema.post("findOneAndDelete", async(user)=>{
    if(user){
        await Comment.deleteMany({_id : {$in : user.comments}});
    }
})

module.exports=mongoose.model("user",userSchema);