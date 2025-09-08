if(process.env.NODE_ENV != "production"){
    require('dotenv').config()
}

// console.log(process.env.SECRET)

const express=require("express");
const port=3030;
const app=express();
const ejsmate=require("ejs-mate");
//requrie express error
const ExpressError=require("./utils/ExpressError.js");
//define the path of public folder
const path=require("path");
app.use(express.static(path.join(__dirname,"public")));
//for parsing the form data
app.use(express.urlencoded({extended : true})); 
app.engine("ejs",ejsmate);
//include method-override
const methodOverride = require('method-override');
app.use(methodOverride('_method'));
const users=require("./routes/users.js")
const comments=require("./routes/comment.js")
const clientRouter=require("./routes/client.js");
// const main=require("./connection/init");
//Connection
const dbUrl = process.env.ATLASDB_URL;
const mongoose=require("mongoose");
async function main(params) {
    await mongoose.connect(dbUrl)
}
main().then((res)=>{
    console.log("Connection sucessful");
}).catch((err)=>{
    console.log("Can't connect ",err);
})
const uploadDir = path.join(__dirname, "public/uploads");
app.use("/uploads", express.static(path.join(__dirname, "upload")));


app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
const session=require("express-session")
const MongoStore = require('connect-mongo');
const flash=require("connect-flash")
const passport = require("passport");
const LocalStrategy = require("passport-local").Strategy;
const Client = require("./models/client.js");

const store = MongoStore.create({
    mongoUrl: dbUrl,
    crypto: {
        secret: process.env.SECRET,
    },
    touchAfter: 24 * 3600,
})
store.on("error",()=>{
    console.log("Error in mongo session store",err)
})
const sessionOption={
    store,
    secret: process.env.SECRET,
    resave: false,
  saveUninitialized: true,
  cookie : {
    expires : Date.now()+7*24*60*60*1000,
    maxAge : 7*24*60*60*1000,
    httpOnly : true,
  }
}


app.use(session(sessionOption));
app.use(flash());
app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(Client.authenticate()));
passport.serializeUser(Client.serializeUser());
passport.deserializeUser(Client.deserializeUser());

app.get("/",(req,res)=>{
    res.send("Alhamdulillah Root is working");
})


app.use((req,res,next)=>{
    res.locals.sucess=req.flash("sucess");
    res.locals.error=req.flash("error")
    res.locals.currClient=req.user
    next();
})

app.use("/users",users);
app.use("/users/:id/comments",comments)
app.use("/", clientRouter)
// app.all("*",(req,res,next)=>{
//     next(new ExpressError(404,"Page not found"));
// })


//error handler middleware
app.use((err,req,res,next)=>{
    let {statusCode=500,message="Something went wrong"}=err
    res.status(statusCode).render("error.ejs",{message});
})

app.listen(port,(req,res)=>{
    console.log(`Server starts listen at port ${port}`);
})