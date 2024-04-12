const User = require("../models/user.js");
module.exports.renderSignupForm = async (req, res)=>{
    res.render("../views/users/signup.ejs");
}
module.exports.createAccount = async (req, res)=>{
    try{
        let {email, username, password} = req.body;
        let newUser = new User({email, username});
        const signedUser = await User.register(newUser, password);
        console.log(signedUser);
        req.login(signedUser, (err)=>{
            if(err){
                return next(err);
            }
            req.flash("success", "Signed in successfully");
            res.redirect("/nexus");
        });
    }
    catch(err){
        req.flash("error", err.message);
        res.redirect("/signup");
    }
}
module.exports.renderLoginForm = async (req, res)=>{
    res.render("../views/users/login.ejs");
}
module.exports.login = async (req, res)=>{
    req.flash("success", "Welcome back to Nexus Hub");
    res.redirect(res.locals.redirectUrl || "/nexus");
}
module.exports.logout = (req, res, next)=>{
    req.logout((err)=>{
        if(err){
            next(err);
        }
        req.flash("success", "LogOut Successful!");
        res.redirect("/nexus");
    });
}