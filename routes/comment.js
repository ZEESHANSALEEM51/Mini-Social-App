const express=require("express")
const router=express.Router({mergeParams : true});
const wrapAsync=require("../utils/wrapAsync.js");
//requrie express error
const ExpressError=require("../utils/ExpressError.js");
const {commentSchema}=require("../schemaValidation.js");
const user=require("../models/schema.js");
const Comment=require("../models/comment.js");

const {validatecomment,isLoggedIn,isCommentAuthor}=require("../middleware.js")
//require controller comment
const commentController=require("../controllers/comments.js");

//Comments Route 
router.post("/",isLoggedIn,validatecomment,commentController.addComment);

//Delete Review Route
router.delete("/:commentId",isLoggedIn,isCommentAuthor,wrapAsync(commentController.destroyComment));

module.exports=router;