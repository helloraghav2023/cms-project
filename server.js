const express=require("express")
const app=express()
const adminRouter=require("./routers/admin")
const cmsRouter=require("./routers/cms")
app.use(express.urlencoded({extended:false}))
const mongoose=require("mongoose")
const session=require("express-session")
mongoose.connect("mongodb://127.0.0.1:27017/9amthirdcmsproject")







app.use(session({
    secret:"ravi",
    resave:false,
    saveUninitialized:false
}))
app.use(cmsRouter)
app.use("/admin",adminRouter)
app.use(express.static("public"))
app.set("view engine","ejs")
app.listen(5000)