const User = require("../models/userModel");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const maxAge = 3 * 24 * 60 * 60;
const createToken = (id) => {
  return jwt.sign({ id }, "secretkey", {
    expiresIn: maxAge,
  });
};


const securePassword = async (password)=>{

    try{

       const passwordHash = await bcrypt.hash(password, 10);
       return passwordHash;
    } catch (error) {
        console.log(error.message)
    }

}

const loginLoad = async (req, res) => {
  try {
    res.render("login");
  } catch (error) {
    console.log(error.message);
  }
};

const verifyLogin_post = async (req, res) => {
  try {
    const email = req.body.email;
    const password = req.body.password;

    const userData = await User.findOne({ email: email });
    const passwordMatch = await bcrypt.compare(password, userData.password);
    if (passwordMatch) {
      if (userData.is_admin === 0) {
        res.render("login", { message: "incorrect information" });
      } else {
        const token = createToken(userData._id);
        res.cookie("jwt_admin", token, {
          httpOnly: true,
          maxAge: maxAge * 1000,
        });
        res.status(201);
        res.render("home", { admin: userData });

        // res.render('temp',{user:userData});

        // res.redirect('/home')

        // req.session.user_id=userData._id;
      }
    } else {
      res.render("login", { message: "incorrect information" });
    }
  } catch (error) {
    console.log(error.message);
  }
};



const loadDashboard = async (req, res,next) => {
  try {
    const token = req.cookies.jwt_admin;

    if (token) {
      jwt.verify(token, "secretkey", async (err, decodedToken) => {
        if (err) {
          console.log(err.message);
          next();
        } else {
          console.log(decodedToken);
          let userData = await User.findById(decodedToken.id);
          res.render("home", { admin: userData });

          
        }
      });
    } else {
      res.redirect("/admin");
    }
  } catch (error) {
    console.log(error.message);
  }
};

//  const logout_get = (req,res)=>{
//     res.cookie('jwt_admin','',{maxAge:1});
//     res.redirect('/admin');
// }

//  const logout=async(req,res)=>{
//     try {

//         req.session.destroy();
//         res.redirect('/admin')

//     } catch (error) {
//         console.log(error.message);
//     }
//  }

const adminDashboard = async (req, res) => {
  try {
    const usersData = await User.find({ is_admin: 0 });
    res.render("dashboard", { users: usersData });
  } catch (error) {
    console.log(error.message);
  }
};

//add new user

const newUserLoad = async (req, res) => {
  try {
    res.render("new-user");
  } catch (error) {
    console.log(error.message);
  }
};

const addUser = async (req, res) => {
  try {
    const spassword = await securePassword(req.body.password);
    const name = req.body.name;
    const email = req.body.email;
    const mobile = req.body.mobile;
    const password = spassword;
    

    const user = new User({
      name: name,
      email: email,
      mobile: mobile,
      password: password,
      is_admin:0,
    });

    const userData = await user.save();

    if (userData) {

        
      res.redirect("/admin/dashboard");
    } else {
      res.render("new-user", { message: "something went wrong" });
    }
  } catch (error) {
    console.log(error.message);
  }
};



//edit user

const editUserLoad = async (req, res) => {
  try {
    const id = req.query.id;
    const userData = await User.findById({ _id: id });
    if (userData) {
      res.render("edit-user", { user: userData });
    } else {
      res.redirect("/admin/dashboard");
    }
  } catch (error) {
    console.log(error.message);
  }
};

const updateUsers = async (req, res) => {
  try {
    const userData = await User.findByIdAndUpdate(
      { _id: req.body.id },
      {
        $set: {
          name: req.body.name,
          email: req.body.email,
          mobile: req.body.mobile,
        },
      }
    );

    res.redirect("/admin/dashboard");
  } catch (error) {
    console.log(error.message);
  }
};

// delete user
const deleteUser = async (req, res) => {
  try {
    const id = req.query.id;
    await User.deleteOne({ _id: id });
    res.redirect("/admin/dashboard");
  } catch (error) {
    console.log(error.message);
  }
};

module.exports = {
  loginLoad,
  verifyLogin_post,
  loadDashboard,
  // logout_get,
  adminDashboard,
  newUserLoad,
  addUser,
  editUserLoad,
  updateUsers,
  deleteUser,
};
