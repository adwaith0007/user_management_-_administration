const User = require('../models/userModel')
const bcrypt = require('bcrypt');

const loginLoad = async(req,res)=>{
    try {

        res.render('login')
        
    } catch (error) {
        console.log(error.message)
    }
}


 const verifyLogin = async (req,res)=>{
    try {
       

        const email =req.body.email
        const password = req.body.password

        const userData = await User.findOne({email:email})
          const passwordMatch = await bcrypt.compare(password,userData.password)
        if(passwordMatch){
            
            if(userData.is_admin===0){
                res.render('login',{message:'incorrect information'})
            }else{
                req.session.user_id=userData._id;
                res.render('../admin/home',{admin:userData});
            }

        }else{
            res.render('login',{message:'incorrect information'})
        }

    } catch (error) {
        
        console.log(error.message);

    }
 }

 const loadDashboard = async(req,res)=>{
    try {
    const userData=  await User.findById({_id:req.session.user_id})
        res.render('home',{admin:userData})
        
    } catch (error) {
        console.log(error.message);
    }
 }

 const logout=async(req,res)=>{
    try {

        req.session.destroy();
        res.redirect('/admin')
        
    } catch (error) {
        console.log(error.message);
    }
 }


 const adminDashboard=async(req,res)=>{
    try {
        
        const usersData=await User.find({is_admin:0})
        res.render('dashboard',{users:usersData})
        
    } catch (error) {
        console.log(error.message)
    }
 }

//add new user

const newUserLoad = async(req,res)=>{
    try {
        res.render('new-user');
    } catch (error) {
        console.log(error.message);
    }
}

const addUser =async (req,res)=>{
    try {
        
        const name=req.body.name;
        const email=req.body.email;
        const mobile=req.body.mobile;
        const password=req.body.password;

        const user=new User({
             
            name:name,
            email:email,
            mobile:mobile,
            password:password
        })
        
        const userData = await user.save();

        if( userData){

            res.redirect('/admin/dashboard')
            

        }else{

            res.render('new-user',{message:'something went wrong'})
         
        }

    } catch (error) {
        console.log(error.message);
    }
}

//edit user 

const editUserLoad = async (req,res)=>{
    try {

        const id =req.query.id;
        const userData=await User.findById({_id:id})
        if(userData){
            res.render('edit-user',{user:userData})
        }else{
            res.redirect('/admin/dashboard')
        }
        
        
    } catch (error) {
        console.log(error.message)
    }
}

const updateUsers= async(req,res)=>{
    try {

    const userData = await User.findByIdAndUpdate({_id:req.body.id},{$set:{name:req.body.name,email:req.body.email,mobile:req.body.mobile}})
         
    res.redirect('/admin/dashboard')

        
    } catch (error) {
        console.log(error.message);
    }
}

// delete user
const deleteUser = async(req,res)=>{
    try {
        
       const id = req.query.id;
       await User.deleteOne({_id:id})
        res.redirect('/admin/dashboard')
    } catch (error) {
        console.log(error.message);
    }
}


module.exports={
    loginLoad,
    verifyLogin,
    loadDashboard,
    logout,
   adminDashboard,
   newUserLoad,
   addUser,
   editUserLoad,
   updateUsers,
   deleteUser

}