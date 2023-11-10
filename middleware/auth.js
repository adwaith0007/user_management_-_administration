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
const isLogout = async(req,res,next)=>{
    try {
        // req.session.destroy(function(err){
        //     console.log("logout");
        //     if(err){
        //         console.log(err);
        //         res.send("ERROR");
        //     }else{
        //         console.log("logout");
        //         res.redirect('/home');
        //     }
        // })
        if(req.session.user_id){
            res.redirect('/home');
            return;
        }
        next();
     
    } catch (error) {
        console.log(error.message);
    }
}
module.exports={
    isLogin,
    isLogout
}