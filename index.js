const express = require ("express");
const app = express();
const port = process.env.PORT || 5000;

const cookiePraser = require('cookie-parser')
app.use(cookiePraser());

const mongoose = require ("mongoose");
mongoose.connect("mongodb://127.0.0.1:27017/user_management_&_administration");


const bodyParser = require("express");
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended:true}))


app.use((req, res, next) => {
    res.header('Cache-Control', 'private, no-cache, no-store, must-revalidate');
    res.header('Expires', '-1');
    res.header('Pragma', 'no-cache');
    next();
});



app.set('view engine','ejs');
app.set('views','./views/users');


const user = require("./controllers/userController")




//for user routes
const userRoute=require('./routes/userRoute');
app.use('/',userRoute)


//for admin routes
const adminRoute=require('./routes/adminRoute');
app.use('/admin',adminRoute)








app.listen(port,()=>{
    console.log(`server is running at ${port}`)
})


