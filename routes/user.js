const express = require("express");
const router = express.Router();
const wrapAsync = require("../utils/wrapAsync.js");
const passort = require("passport");
const {savedUrl} = require("../middlewares.js")
const userController = require("../controllers/user.js");

router
    .route("/signup")
    //Show Route
    .get(wrapAsync(userController.renderSignupForm))
    //Create Route
    .post(wrapAsync(userController.createAccount));

router
    .route("/login")
    //Show Route
    .get(wrapAsync(userController.renderLoginForm))
    //Create Route
    .post(savedUrl, passort.authenticate("local", {
        failureRedirect: "/login", 
        failureFlash: true
    }),wrapAsync(userController.login));

//Logout Route
router.get("/logout", userController.logout);

module.exports = router;