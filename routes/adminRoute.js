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
const adminMiddleware =require('../middleware/adminMiddleware')

admin_route.set('view engine','ejs')
admin_route.set('views','./views/admin')

const adminController = require('../controllers/adminController')



admin_route.get('/',adminMiddleware.isLogout,adminController.loginLoad)

admin_route.post('/',adminController.verifyLogin)

admin_route.get('/home',adminMiddleware.isLogin,adminController.loadDashboard)

admin_route.get('/logout',adminMiddleware.isLogin,adminController.logout);
admin_route.get('/dashboard',adminController.adminDashboard);

admin_route.get('/new-user',adminMiddleware.isLogin,adminController.newUserLoad)
admin_route.post('/new-user',adminController.addUser)

admin_route.get('/edit-user',adminMiddleware.isLogin,adminController.editUserLoad)

admin_route.post('/edit-user',adminController.updateUsers)

admin_route.get('/delete-user',adminController.deleteUser);

admin_route.get('*',function(req,res){
    res.redirect('/admin/home')
})

module.exports= admin_route