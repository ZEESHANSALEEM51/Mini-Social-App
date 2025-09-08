const Client=require("../models/client.js");

module.exports.renderSignup=(req,res)=>{
    res.render("clients/signup.ejs");
}

module.exports.signup=async(req,res)=>{
    try{
    let{username,email,password}=req.body;
    const newClient=new Client({email,username})
    const registeredUser=await Client.register(newClient,password)
    // console.log(registeredUser)
    req.login(registeredUser, (err)=>{
        if(err){
            return next(err);
        }
          req.flash("sucess","Wellcome to Sayaragaram")
    res.redirect("/users")
    })
  
    }catch(err){
        req.flash("error",err.message)
        res.redirect("/signup")
    }
}

module.exports.renderLogin=(req,res)=>{
    res.render("clients/login.ejs")
}

module.exports.login=async(req,res)=>{
    req.flash("sucess","Wellcome to Sayaragaram you are loggedIn");
    let redirectUrl=res.locals.redirectUrl||"/users";
    res.redirect(redirectUrl)
}

module.exports.logout=(req,res,next)=>{
    req.logout((err)=>{
        if(err){
            next(err);
        }
        req.flash("sucess","You arer logged out!");
        res.redirect("/users")
    })
}