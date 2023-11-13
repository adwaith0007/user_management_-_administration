




const isLogin = async(req,res,next)=>{
    try {
        
        const token = req.cookies.jwt_admin;
        

        if(token){

            console.log('isLogin');

            next()

        }else{
            res.redirect('/admin')
            // next()
        }
        
        
    } catch (error) {
        console.log(error.message);
    }
}

const isLogout= async(req,res,next)=>{
    try {

        const token = req.cookies.jwt_admin;
        
        if(token){
            res.redirect('/admin/home')
        }
        next()
    } catch (error) {
        console.log(error.message);
    }
}


const logout_get = (req,res)=>{
    // res.cookie('jwt_admin','',{maxAge:1});
    res.clearCookie('jwt_admin');
    res.redirect('/admin');
}



module.exports ={
    isLogin,
    isLogout,
    logout_get
}