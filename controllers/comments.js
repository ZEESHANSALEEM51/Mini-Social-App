const Comment=require("../models/comment.js");
const user=require("../models/schema.js");

module.exports.addComment=async(req,res)=>{
    let User=await user.findById(req.params.id);
    let newComment=new Comment(req.body.comments)
    newComment.author=req.user._id;
    // console.log(newComment)
    User.comments.push(newComment);

    let result=await newComment.save()
    await User.save();
    console.log("New comment added sucessful");
    req.flash("sucess","New comment added sucessful")
    res.redirect(`/users/${User._id}`);
}

module.exports.destroyComment=async(req,res)=>{
    let {id,commentId}=req.params;
    let User=await user.findByIdAndUpdate(id, {$pull : {comments : commentId}})
    await Comment.findByIdAndDelete(commentId)
   req.flash("sucess","Comment Deleted")
    res.redirect(`/users/${id}`)
}