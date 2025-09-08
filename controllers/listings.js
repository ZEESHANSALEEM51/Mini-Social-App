const user=require("../models/schema.js")
const fs = require("fs");
const { cloudinary,upload } = require("../cloudConfig.js");
//define the path of public folder
const path=require("path");

module.exports.index=async(req,res)=>{
    const users=await user.find();
    res.render("home.ejs",{users});
}

module.exports.rendeAaddUserForm=(req,res)=>{
    res.render("new.ejs");
}

module.exports.showUser=async(req,res)=>{
    let {id}=req.params
    const users=await user.findById(id).populate({path : "comments",populate : {path : "author"}}).populate("owner");
    if(!users){
        req.flash("error","User you requested does not exist!")
        return res.redirect("/users");
    }
    res.render("index.ejs",{users});
}

module.exports.addNewUser=async(req,res)=>{
    let { name, image, email, post, likes, comment, followers, password }=req.body;
    let newUser=new user({ 
        name : name,
        image: req.file ? req.file.path : null,
        email : email,
        post : post,
        comment : comment,
        likes : likes,
        followers : followers,
        password : password
    });
    newUser.owner=req.user._id;
    await newUser.save().then((res)=>{
        console.log("Sucessfully added new user")
    }).catch((err)=>{
        console.log("Can't added ",err);
    })
    req.flash("sucess","New user added sucessfull");
    res.redirect("/users");
}

module.exports.renderEditUserForm=async(req,res)=>{
    let {id}=req.params;
    let users=await user.findById(id);
    res.render("edit.ejs",{users})
}

module.exports.updateUser = async (req, res) => {
    try {
        let { id } = req.params;
        let {
            name: newName,
            post: newPost,
            email: newEmail,
            comment: newComment,
            likes: newLikes,
            followers: newFollowers,
            password: newPassword
        } = req.body;

        let uniquser = await user.findById(id);
        if (!uniquser) {
            return res.status(404).send("User not found");
        }

        let password = uniquser.password;
        if (newPassword != password) {
            return res.send("Can't Edit wrong password");
        }

        // Update data
        let updatedData = {
            name: newName,
            post: newPost,
            email: newEmail,
            comment: newComment,
            likes: newLikes,
            followers: newFollowers,
            password: newPassword
        };

        //Handle new image upload
        if (req.file) {
            updatedData.image = req.file.path; // Cloudinary URL

            // Optionally delete old image from Cloudinary
            if (uniquser.image) {
                // extract public_id from old URL
                const parts = uniquser.image.split('/');
                const publicIdWithExt = parts[parts.length - 1];
                const publicId = publicIdWithExt.split('.')[0];

                await cloudinary.uploader.destroy(`MiniSocial-App/${publicId}`);
            }
        }

        let updated = await user.findByIdAndUpdate(id, updatedData, {
            runValidators: true,
            new: true
        });

        req.flash("success", "User data updated successfully");
        res.redirect(`/users/${id}`);
    } catch (err) {
        console.error(err);
        res.status(500).send("Server error");
    }
};
module.exports.renderDeleteUserForm=async(req,res)=>{
    let {id}=req.params;
    let users=await user.findById(id);
    res.render("delete.ejs",{users});
}

module.exports.destroyUser = async (req, res) => {
    try {
        let { id } = req.params;
        let { password: newPassword } = req.body;

        let uniquser = await user.findById(id);
        if (!uniquser) {
            return res.status(404).send("User not found");
        }

        let password = uniquser.password;
        if (newPassword != password) {
            return res.send("Can't delete wrong password");
        }

        //Delete user
        let deletedUser = await user.findByIdAndDelete(id);

        //If user had image in Cloudinary
        if (deletedUser.image) {
            // Extract public_id from Cloudinary URL
            const parts = deletedUser.image.split('/');
            const publicIdWithExt = parts[parts.length - 1];
            const publicId = publicIdWithExt.split('.')[0];

            // Destroy old image from Cloudinary folder
            await cloudinary.uploader.destroy(`MiniSocial-App/${publicId}`);
        }

        console.log("Delete successful");
        req.flash("success", "User Deleted");
        res.redirect("/users");
    } catch (err) {
        console.error(err);
        res.status(500).send("Server error");
    }
};
