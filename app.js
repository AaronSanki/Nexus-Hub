if(process.env.NODE_ENV != "production"){
    require("dotenv").config();
}
const mongoUrl = process.env.MONGO_ATLAS_URL;
const express = require("express");
const app = express();
const port = 3000;
const mongoose = require("mongoose");
const path = require("path");
const methodOverride = require("method-override");
const ejsMate = require("ejs-mate");
const ExpressError = require("./utils/ExpressError");
const nexusRouter = require("./routes/nexus.js");
const reviewsRouter = require("./routes/review.js");
const usersRouter = require("./routes/user.js");
const session = require("express-session");
const MongoStore = require("connect-mongo");
const store = MongoStore.create({
    mongoUrl,
    crypto: {
        secret: process.env.SECRET
    },
    touchAfter: 24 * 60 * 60
})

store.on("error", (err)=>{
    console("ERROR IN MONGO SESSION STORE", err);
});

const sessionOptions = {
    store,
    secret: process.env.SECRET,
    resave: false,
    saveUninitialized: true,
    cookie: {
        expires: Date.now()+ 7 * 24 * 60 * 60 * 1000,
        maxAge: 7 * 24 * 60 * 60 * 1000,
        httpOnly: true
    }
}
const flash = require("connect-flash");
const User = require("./models/user.js");
const passport = require("passport");
const LocalStrategy = require("passport-local");

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

app.use(express.urlencoded({extended: true}));
app.use(methodOverride("_method"));
app.engine("ejs", ejsMate);
app.use(express.static(path.join(__dirname, "public")));

app.use(session(sessionOptions));
app.use(flash());

async function main(){
    await mongoose.connect(mongoUrl);
}
main()
    .then(()=>{
        console.log("Connected");
    })
    .catch((err)=>{
        console.log(err);
    });
app.listen(port, ()=>{
    console.log(`Server is listening to port ${port}`);
});

app.use(passport.initialize());
app.use(passport.session());

app.use((req, res, next)=>{
    res.locals.success = req.flash("success");
    res.locals.error = req.flash("error");
    res.locals.currUser = req.user;
    next();
});

app.use("/nexus", nexusRouter); //Middleware for listings route
app.use("/nexus/:id/reviews", reviewsRouter); //Middleware for reviews route
app.use("/", usersRouter); //Middleware for users route

passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.all("*", (req, res, next)=>{
    next(new ExpressError(404, "Page not found!"));
});
app.use((err, req, res, next)=>{
    let {statusCode = 500, message = "Oops! Looks like something went wrong :("} = err;
    console.log(err);
    res.status(statusCode).render("error.ejs", {message});
});