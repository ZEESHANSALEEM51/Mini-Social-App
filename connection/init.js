const mongoose=require("mongoose");
async function main(params) {
    await mongoose.connect("mongodb://127.0.0.1:27017/instagaram")
}
main().then((res)=>{
    console.log("Connection sucessful");
}).catch((err)=>{
    console.log("Can't connect ",err);
})
module.exports=main();