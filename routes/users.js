const express=require("express")
const router=express.Router();
const wrapAsync=require("../utils/wrapAsync.js");
//requrie express error
const ExpressError=require("../utils/ExpressError.js");
const Comment=require("../models/comment.js");
const {userSchema}=require("../schemaValidation.js");
const user=require("../models/schema.js");
//define the path of public folder
const path=require("path");
//for images
const multer = require("multer");
const { storage }=require("../cloudConfig.js");
const fs = require("fs");
const passport = require("passport");
const { isLoggedIn,isOwner,validateuser } = require("../middleware.js");

// //to ensure uploads directory exist
// const uploadDir = path.join(__dirname, "public/uploads");
// if (!fs.existsSync(uploadDir)) {
//     fs.mkdirSync(uploadDir, { recursive: true });
// }
// // Multer configuration
// const storage = multer.diskStorage({
//     destination: (req, file, cb) => {
//         cb(null, "public/uploads");
//     },
//     filename: (req, file, cb) => {
//         cb(null, Date.now() + path.extname(file.originalname)); // Unique filename
//     }
// });
const upload = multer({ storage });

//Require from controllers
const userControllers=require("../controllers/listings.js");
const { ucs2 } = require("punycode");

//Home Route
router.get("/",userControllers.index);

//Add Route
router.route("/add")
.get(isLoggedIn,userControllers.rendeAaddUserForm)
.post(isLoggedIn,upload.single('image'),validateuser,wrapAsync(userControllers.addNewUser));

//Show Route
router.route("/:id")
.get(userControllers.showUser)
.patch(isLoggedIn,isOwner,upload.single('image'),validateuser,wrapAsync(userControllers.updateUser))
.delete(wrapAsync(userControllers.destroyUser));

//Edit Route
router.get("/:id/edit",isLoggedIn,isOwner,wrapAsync(userControllers.renderEditUserForm));
//update in db

//Delete Router
router.get("/:id/delete",isLoggedIn,isOwner,userControllers.renderDeleteUserForm);



module.exports=router;
