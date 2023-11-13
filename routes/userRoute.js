const express = require ("express");
const user_route=express();


// const session = require("express-session");
// const config = require("../config/config");
// user_route.use(session({
//     secret:config.sessionsecret,
//     resave: false,
//     saveUninitialized: true
// }))


const userMiddleware = require('../middleware/userMiddleware')

const bodyParser = require("body-parser");
user_route.use(bodyParser.json());
user_route.use(bodyParser.urlencoded({extended:true}));

user_route.set('view engine','ejs');
user_route.set('views','./views/users');


const userController = require ("../controllers/userController");

user_route.get("/register",userMiddleware.isAuthenticated_get , userController.loadregister_get );

user_route.post("/register",userController.insertUser_post);



user_route.get('/',userMiddleware.mainpage);

user_route.get('/login', userMiddleware.isLogin , userController.loginLoad_get,);
user_route.post('/login',userController.verifyLogin_post);

user_route.get('/home', userMiddleware.home_get );


user_route.get('/logout',userMiddleware.isLogout_get)



module.exports=user_route;