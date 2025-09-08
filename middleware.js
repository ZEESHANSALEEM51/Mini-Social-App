const user=require("./models/schema.js");
const Comment=require("./models/comment.js");
const ExpressError=require("./utils/ExpressError.js");
const {userSchema,commentSchema}=require("./schemaValidation.js");
module.exports.isLoggedIn=(req,res,next)=>{
    if(!req.isAuthenticated()){
        req.session.redirectUrl=req.originalUrl
        req.flash("error","You must be login to create profile")
        return res.redirect("/login")
    }
    next(); 
}
module.exports.saveRedirectUrl=(req,res,next)=>{
    if(req.session.redirectUrl){
        res.locals.redirectUrl=req.session.redirectUrl
    }
    next();
}

module.exports.isOwner=async(req,res,next)=>{
    let {id}=req.params;
     let admin=await user.findById(id)
        if(!admin.owner.equals(res.locals.currClient._id)){
            req.flash("error","You are not the Owner of the profile...")
            return res.redirect(`/users/${id}`);
        }
        next();
}

module.exports.validateuser = (req, res, next) => {
    let { error } = userSchema.validate(req.body);
    if (error) {
        const errMsg = error.details.map((el) => el.message).join(",");
        throw new ExpressError(404, errMsg);
    } else {
        next();
    }
};

module.exports.validatecomment = (req, res, next) => {
    let { error } = commentSchema.validate(req.body);
    if (error) {
        const errMsg = error.details.map((el) => el.message).join(",");
        throw new ExpressError(404, errMsg);
    } else {
        next();
    }
};
  
module.exports.isCommentAuthor=async(req,res,next)=>{
    let {id,commentId}=req.params;
     let comment=await Comment.findById(commentId)
        if(!comment.author.equals(res.locals.currClient._id)){
            req.flash("error","You are not the Author of the Comment...")
            return res.redirect(`/users/${id}`);
        }
        next();
}