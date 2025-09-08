const Joi=require("joi");

//for server side validation
module.exports.userSchema = Joi.object({
        name: Joi.string().required(),
        email: Joi.string().required(),
        post: Joi.string().required(),
        comment: Joi.string().required(),
        likes: Joi.number().min(0),
        followers: Joi.number().min(0),
        password: Joi.number().required(),
        image: Joi.string().allow("", null)
});


module.exports.commentSchema = Joi.object({
    comments : Joi.object({
        rating : Joi.number().required().min(1).max(5),
        comment : Joi.string().required()
    }).required()
})