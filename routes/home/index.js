const express = require("express");
const router = express.Router();
const Post = require("../../models/Post");
const Category = require("../../models/categories");
const User = require("../../models/user");
const bcrypt = require("bcryptjs");
const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;

router.all("/*", (req, res, next) => {
  req.app.locals.layout = "home";
  next();
});

router.get("/", (req, res) => {
  Post.find({}).then(posts => {
    Category.find({})
    .populate('user')
    .then(categories => {
      res.render("home/index", { posts, categories });
    });
  });
});

router.get("/about", (req, res) => {
  res.render("home/about");
});

router.get("/login", (req, res) => {
  res.render("home/login");
});
router.get("/register", (req, res) => {
  res.render("home/register");
});

router.get("/post/:slug", (req, res) => {
  Post.findOne({ slug: req.params.slug })
  .populate({path:'comments',match:{approveComment:true}, populate:{path:'user',model:'user'}})
  .populate('user')
  .then(post => {
    Category.find({}).then(categories => {
      res.render("home/post", { post, categories });
    });
  });
});

router.post("/register", (req, res) => {
  let errors = [];

  if (req.body.password !== req.body.passwordConfirm) {
    errors.push({ message: "Password fields dont match" });
  }

  if (errors.length > 0) {
    res.render("home/register", {
      errors,
      firstName: req.body.firstName,
      lastName: req.body.lastName,
      email: req.body.email
    });
  } else {
    User.findOne({ email: req.body.email }).then(user => {
      if (!user) {
        const newUser = new User({
          firstName: req.body.firstName,
          lastName: req.body.lastName,
          email: req.body.email,
          password: req.body.password
        });

        bcrypt.genSalt(10, (err, salt) => {
          bcrypt.hash(newUser.password, salt, (err, hash) => {
            newUser.password = hash;

            newUser.save().then(saveUser => {
              req.flash(
                "success_message",
                "You are now registered please login"
              );
              res.redirect("/login");
            });
          });
        });
      } else {
        req.flash("error_message", "That email already exist choose new email");
        res.redirect("/register");
      }
    });
  }
});

//App Login

passport.use(new LocalStrategy({usernameField:'email'},(email,password,done)=>{
  
  User.findOne({email}).then(user=>{
    if(!user) return done(null,false,{message:'no user found'})
    bcrypt.compare(password,user.password,(err,matched)=>{
      if(err) return err;
      if(matched){
        return done(null,user)
      }else{
        return done(null,false,{message:'Incorrect password'})
      }
    })
  })
}))

passport.serializeUser(function(user,done){
  done(null,user.id);
});

passport.deserializeUser(function(id,done){
  User.findById(id,function(err,user){
    done(err,user);
  })
});

router.post("/login", (req, res,next) => {
passport.authenticate('local',{
  successRedirect:'/admin',
  failureRedirect:'/login',
  failureFlash:true
})(req,res,next)
});

//logout
router.get('/logout',(req,res)=>{
  req.logOut();
  res.redirect('/login')
})



module.exports = router;
