const User=require('../models/userModel');
const bcrypt = require("bcrypt");
const jwt = require('jsonwebtoken');





const securePassword = async (password)=>{

    try{

       const passwordHash = await bcrypt.hash(password, 10);
       return passwordHash;
    } catch (error) {
        console.log(error.message)
    }

}




// *********************************** To render Register Page ***********************************

const loadregister_get= async (req,res)=>{
    try{
        res.render("registration")
    } catch(error){
        console.log(error.message)
    }
} 


// *********************************** To insert user data from register page ***********************************

const insertUser_post=async(req,res)=>{
    // console.log(req.body)
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

        res.redirect('login')

      
    } catch (error) {
        console.log(error.message)
    }
}


// *********************************** To render Login Page ***********************************

const loginLoad_get = async(req,res)=>{
    try {
        res.render('login',{message:""})
    } catch (error) {
        console.log(error.message);
    }
}



const home_get = async(req,res)=>{
    try {

        let userData = await User.findById(decodedToken.id)


        res.render('home',{user: userData})
    } catch (error) {
        console.log(error.message);
    }
}

const maxAge = 3 * 24 * 60 * 60 ;
const createToken = (id) => {
    return jwt.sign({ id }, 'secretkey',{
        expiresIn: maxAge
    })
}






// *********************************** To verify user from Login Page ***********************************

const verifyLogin_post = async(req,res)=>{

    try {

        const email = req.body.email;
        const password = req.body.password;

     const userData =  await User.findOne({email:email});

     if(userData){

       const passwordMatch = await bcrypt.compare(password,userData.password);

    

       if (passwordMatch){


        const token = createToken(userData._id);
        res.cookie('jwt', token,{ httpOnly: true, maxAge: maxAge * 1000 });
        res.status(201);
        
        res.redirect('/home')
       
           
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


// *********************************** To remove session when logedout ***********************************


const userLogout_get= async(req,res)=>{
    try {
        req.session.destroy();
        res.redirect('/')
    } catch (error) {
        console.log(error.message);
    }
}


module.exports={
    insertUser_post , loadregister_get,loginLoad_get, verifyLogin_post, userLogout_get,home_get
    // verifyMail
}