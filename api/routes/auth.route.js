const router = require("express").Router();
const { body } = require("express-validator");
const passport = require("passport");
const { register, userLogin, validate } = require("../controllers/auth.controllers");

//Sign up
router.post("/register", 
// name must be at least 3 chars long
body("name").trim().isLength({ min: 3 }),
// username must be an email
body("email").isEmail(),
// password must be at least 8 chars long
body("password").isLength({ min: 8 }),validate,register);

//Sign In
router.post("/login",
// username must be an email
body("email").isEmail(),
// password must be at least 8 chars long
body("password").isLength({ min: 8 }),validate,
userLogin);

router.get('login/success',(req,res)=>{
    if(req.user){
        res.json({
            error:false,
            message:"Successfully logged In",
            user:req.user
        })
    }else{
        res.status(403).json({error:true,message:"not authorized"})
    }
})

router.get('/login/failed',(req,res)=>{
    res.status(401).json({
        error:true,
        message:'login failure'
    })
})

router.get('/google/callback',passport.authenticate("google",{
    successRedirect:process.env.CLIENT_URL,
    failureRedirect:'/login/failed'
}))

router.get('/google',passport.authenticate('google',['profile','email']))

router.get('/logout',(req,res)=>{
    req.logOut();
    res.redirect(process.env.CLIENT_URL)
})

module.exports = router;