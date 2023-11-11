const User=require('../models/userModel');
const bcrypt = require("bcrypt");
const nodemailer = require("nodemailer");

const securePassword = async (password)=>{

    try{

       const passwordHash = await bcrypt.hash(password, 10);
       return passwordHash;
    } catch (error) {
        console.log(error.message)
    }

}


// for send mail

const sendVerifyMail = async(name,email,user_id)=>{
    
    try {
        
      const transporter =  nodemailer.createTransport({
            host:"smtp.gmail.com",
            port:465,
            secure:false,
            requireTLS:true,
            auth:{
                user:"adwaith.web@gmail.com",
                pass:"grob tcmy eenp ccqf"

            }
        });

        const mailOptions ={
            from:'adwaith.web@gmail.com',
            to:email,
            subject:'For Verification mail',
            html:'<p>Hii' + name+"please click</p>"
        }
       transporter.sendMail(mailOptions, function(error,info){
            if(error){
                console.log(error);
            }
            else{
                console.log("Email has been sent:- " , info.response)
            }
       })

    } catch (error) {

        console.log(error.message);
        
    }
}



const loadregister_get= async (req,res)=>{
    try{
        res.render("registration")
    } catch(error){
        console.log(error.message)
    }
} 

const insertUser_post=async(req,res)=>{
    console.log(req.body)
    try {
        const spassword = await securePassword(req.body.password);
        const user = new User({
            name:req.body.name,
            email:req.body.email,
            mobile:req.body.mobile,
            password:spassword,
            is_admin:0,

        })

        const userData = await user.save();

        if(userData){
            sendVerifyMail(req.body.name, req.body.email, userData._id)
            res.render('registration',{message:'registration successfull'})
        }else{
            res.render('registration',{message:'registration failed'})
        }
    } catch (error) {
        console.log(error.message)
    }
}


// login user methods

const loginLoad_get = async(req,res)=>{
    try {
        res.render('login')
    } catch (error) {
        console.log(error.message);
    }
}

const verifyMail = async (req,res)=>{

    try{

      const updateInfo = await  User.updateOne({_id:req.query.id},{$set:{is_verified:1}});

      console.log(updateInfo);
      res.render("email-verified");

    } catch (error){
        console.log(error.message);
    }
}

const verifyLogin_post = async(req,res)=>{

    try {

        const email = req.body.email;
        const password = req.body.password;

     const userData =  await User.findOne({email:email});

     if(userData){

        console.log(`if true ${userData}`);

       const passwordMatch = await bcrypt.compare(password,userData.password);

       console.log(passwordMatch);

       if (passwordMatch){

        req.session.user_id = userData._id;
        res.render('home',{ user: userData })

            // if ( userData.is_verified === 1 ){
            //     res.render('login',{message:"please verify your mail"})
            // }
            // else{
            //     req.session.user_id = userData._id;
            //     res.render('home',{ user: userData })
                

            // }
       }
       else{
        res.render('login',{message:"Email and password is incorrect"});
       }
     }
     else{
        res.render('login',{message:"Email and password is incorrect"})
     }
        
    } catch (error) {
        console.log(error.message);
    }
}


const userLogout_get= async(req,res)=>{
    try {
        req.session.destroy();
        res.redirect('/')
    } catch (error) {
        console.log(error.message);
    }
}


module.exports={
    insertUser_post , loadregister_get,loginLoad_get, verifyLogin_post, userLogout_get,verifyMail
}