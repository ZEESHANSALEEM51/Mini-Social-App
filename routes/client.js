const express=require("express");
const wrapAsync = require("../utils/wrapAsync");
const router=express.Router();
const Client=require("../models/client.js");
const passport = require("passport");
const {saveRedirectUrl}=require("../middleware.js");
const clientController=require("../controllers/users.js");

router.route("/signup")
.get(clientController.renderSignup)
.post(wrapAsync(clientController.signup))

router.route("/login")
.get(clientController.renderLogin)
.post(saveRedirectUrl,passport.authenticate("local", {failureRedirect : "/login", failureFlash : true}),clientController.login);

router.get("/logout",clientController.logout);

module.exports=router;