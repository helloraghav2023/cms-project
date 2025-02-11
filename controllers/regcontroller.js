const Reg=require("../models/reg")
const nodemailer=require("nodemailer")



exports.loginpage=(req,res)=>{
    res.render("login.ejs",{message:""})

}

exports.regpage=(req,res)=>{
    res.render("reg.ejs",{message:""})
}

exports.register=async(req,res)=>{
    //console.log(req.body)
    const {us,pass}=req.body
    const emailcheck=await Reg.findOne({email:us})
    //console.log(emailcheck)
    try{
        if(emailcheck==null){
            const record=new Reg({
                email:us,
                password:pass})
                record.save()
                res.render("reg.ejs",{message:"successfully created"})
        }else{
            res.render("reg.ejs",{message:"Email is already registered"})
        }
    }catch(error){
        res.render("reg.ejs",{message:error.message})
    }
    

 }  
 
 exports.login=async(req,res)=>{
    //console.log(req.body)
    const{email,pass}=req.body
    const emailcheck=await Reg.findOne({email:email})
    if(emailcheck!==null){
        if(emailcheck.password==pass){
            if(emailcheck.status=="suspended" & emailcheck.email!=="admin"){
                res.render("login.ejs",{message:"your account is suspended please cordinate with admin"})

            }
            else{
            req.session.isAuth=true
            req.session.username=email
            req.session.role=emailcheck.role
        
            if(emailcheck.email=="admin"){
                res.redirect("/admin/dashboard")
            }else{

                res.redirect("/userprofile")
            }
        }

       
        }else{
            res.render("login.ejs",{message:"wrong credentials"})
        }
    }else{
        res.render("login.ejs",{message:"wrong credentials"})
    }
}

exports.usersprofile=async(req,res)=>{
    //console.log(req.session)
    const loginname=req.session.username
    let test=['defaultimg.png']
    const record=await Reg.find({img:{$nin:test}})
    //console.log(record)
    res.render("userprofile.ejs",{loginname,record})

}

exports.logout=(req,res)=>{
    req.session.destroy()
    res.redirect("/")
}
exports.forgotpage=(req,res)=>{
    res.render("forgotform.ejs",{message:""})

}

exports.forgotlinksend=async(req,res)=>{
    //console.log(req.body)
    const {email}=req.body
    let testAccount = await nodemailer.createTestAccount();

    // create reusable transporter object using the default SMTP transport
    let transporter = nodemailer.createTransport({
      host: "smtp.gmail.com",
      port: 587,
      secure: false, // true for 465, false for other ports
      auth: {
        user: "rkemailsend@gmail.com", // generated ethereal user
        pass: "tyiejjtpxnnjaqcc", // generated ethereal password
      },

});
console.log("connected to smtp server")
let info = await transporter.sendMail({
    from: "erkemailsend@gmail.com", // sender address
    to: email, // list of receivers
    subject: "password reset link:9AM CMS PROJECT", // Subject line
    text: "please click below link to reset the password", // plain text body
    html: `<a href=http://localhost:5000/changepassword/${email}>click to reset password</a>`, // html body
    
  });
  console.log("send mail")
  res.render("forgotform.ejs",{message:"password reset link has been sent to your registered email id"})
}


exports.passwordresetform=(req,res)=>{
    res.render("resetform.ejs",{message:""})
}

exports.resetpasswordchange=async(req,res)=>{
    //console.log(req.body)
    //console.log(req.params.email)
    const{password}=req.body
    const email=req.params.email
    const record=await Reg.findOne({email:email})
    //console.log(record)
    const id=record.id
    await Reg.findByIdAndUpdate(id,{password:password})
    res.render("passwordchangemessage.ejs",{message:"successfully password change pls try with new password"})
}  


exports.admindashboard=(req,res)=>{
    //console.log(req.session)
    const username=req.session.username
    res.render("admin/dashboard.ejs",{username})
}

exports.adminusers=async(req,res)=>{
    const username=req.session.username
const record=await Reg.find()
    res.render("admin/users.ejs",{username,record,message:""})
}

exports.usersstatusupdate=async(req,res)=>{
    //console.log(req.params.id)
    const id=req.params.id
    const record1=await Reg.findById(id)
    let currentstatus=null
    if(record1.status=="suspended"){
        currentstatus="active"
    }
    else{
        currentstatus="suspended"
    }
    await Reg.findByIdAndUpdate(id,{status:currentstatus})
    const username=req.session.username
    const record=await Reg.find()
        res.render("admin/users.ejs",{username,record,message:"successfully updated"})
    }

    exports.profileupdatepage=async(req,res)=>{
        const loginname=req.session.username
        const record=await Reg.findOne({email:loginname})
        res.render("profileupdateform.ejs",{loginname,record,message:""})

    }

    exports.profileupdate=async(req,res)=>{
        //console.log(req.body)
        const{fname,lname,mobile,about}=req.body
        //console.log(req.file)
      
        const loginname=req.session.username
        const user=await Reg.findOne({email:loginname})
        //console.log(user)
        const id=user.id
        if(req.file){
            const filename=req.file.filename
        await Reg.findByIdAndUpdate(id,{
            firstName:fname,
            lastName:lname,
            mobile:mobile,
            img:filename,
            desc:about
        })
    }else{
        await Reg.findByIdAndUpdate(id,{
            firstName:fname,
            lastName:lname,
            mobile:mobile,
            desc:about

        })
    }
        const record=await Reg.findOne({email:loginname})
        res.render("profileupdateform.ejs",{loginname,record,message:"successfully profile has been updated"})
    }

    exports.userdelete=async(req,res)=>{
        //console.log(req.params.id)
        const id=req.params.id
         await Reg.findByIdAndDelete(id)
         const username=req.session.username
    const record=await Reg.find()
         res.render("admin/users.ejs",{username,record,message:"successfully deleted"})
    }

    exports.usersingledata=async(req,res)=>{
       const loginname=req.session.username
        //console.log(req.params.id)
        const id=req.params.id
        const record=await Reg.findById(id)

        res.render("singleprofile.ejs",{loginname,record})
    }

    exports.roleupdate=async(req,res)=>{
        //console.log(req.params.id)
        const id=req.params.id
        const record1=await Reg.findById(id)
        //console.log(record)
        let newrole=null
        if(record1.role=="free"){
            newrole="subscribed"
        }else{
            newrole="free"
        }
        await Reg.findByIdAndUpdate(id,{role:newrole})
        const username=req.session.username
    const record=await Reg.find()
        res.render("admin/users.ejs",{record1,record,username,message:"role has been updated successfully"})

    }