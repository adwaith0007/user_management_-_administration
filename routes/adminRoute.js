const express =require('express')
const admin_route =express();
const config=require('../config/config')
const session = require('express-session')
admin_route.use(session({
    secret:config.sessionsecret,
    resave: false,
    saveUninitialized: true
}));


const bodyParser = require('body-parser')

admin_route.use(bodyParser.json());
admin_route.use(bodyParser.urlencoded({extended:true}))
const auth =require('../middleware/adminAuth')

admin_route.set('view engine','ejs')
admin_route.set('views','./views/admin')

const adminController = require('../controllers/adminController')
admin_route.get('/',auth.isLogout,adminController.loginLoad)



admin_route.post('/',adminController.verifyLogin)

admin_route.get('/home',auth.isLogin,adminController.loadDashboard)

admin_route.get('/logout',auth.isLogin,adminController.logout);
admin_route.get('/dashboard',adminController.adminDashboard);

admin_route.get('/new-user',auth.isLogin,adminController.newUserLoad)
admin_route.post('/new-user',adminController.addUser)

admin_route.get('/edit-user',auth.isLogin,adminController.editUserLoad)

admin_route.post('/edit-user',adminController.updateUsers)

admin_route.get('/delete-user',adminController.deleteUser);

admin_route.get('*',function(req,res){
    res.redirect('/admin/home')
})

module.exports= admin_route