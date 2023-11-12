const jwt = require('jsonwebtoken');
const User =require('../models/userModel')



const isAuthenticated_get = async(req,res,next)=>{

    const token = req.cookies.jwt;

    if(token ){

        console.log(token);


        res.redirect('/home');

        
    }
    else{
       

        next();
        
    }
}


const home_get=(req,res,next)=>{

    const token = req.cookies.jwt;


    if(token ){
    
        jwt.verify(token,'secretkey', async(err,decodedToken)=>{

            if(err){
               console.log(err.message);
               next(); 
            } else{
                console.log(decodedToken);
                let userData = await User.findById(decodedToken.id)
                res.render('home',{ user: userData })
               
                next();
            }

        })


    
    }
    else{

        res.redirect('/login');


    }



   
}


const mainpage = (req,res,next)=>{

    res.render('main')
}








const isLogout_get = (req,res)=>{
    res.cookie('jwt','',{maxAge:1});
    res.redirect('/');
}


const isLogin = async(req,res,next)=>{
    try {
        
        if(req.session.user_id){
            next();
        }else{
            res.redirect('/');
            return;
        }
            
    } catch (error) {
        console.log(error.message);
    }
}

module.exports={
    isLogin,
    
    isAuthenticated_get,isLogout_get,home_get,mainpage
}