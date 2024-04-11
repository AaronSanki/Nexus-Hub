const Nexus = require("./models/nexus.js");
const Review = require("./models/review.js");
const ExpressError = require("./utils/ExpressError.js");
const {nexusSchema, reviewSchema} = require("./schema.js");
module.exports.isLoggedIn = (req, res, next)=>{
    if(!req.isAuthenticated()){
        req.session.redirectUrl = req.originalUrl;
        req.flash("error", "Log In to perform this action.");
        return res.redirect("/login");
    }
    next();
}
module.exports.savedUrl = (req, res, next)=>{
    if(req.session.redirectUrl){
        res.locals.redirectUrl = req.session.redirectUrl;
    }
    next();
}
module.exports.isOwner = async (req, res, next)=>{
    let {id} = req.params;
    let nexus = await Nexus.findById(id);
    if(!res.locals.currUser._id.equals(nexus.owner._id)){
        req.flash("error", "You do not have permission to perform this action.");
        return res.redirect(`/nexus/${id}`);
    }
    next();
}
module.exports.validateNexus = (req, res, next)=>{
    let {error} = nexusSchema.validate(req.file);
    if(error){
        let errMsg = error.details.map((el)=> el.message).join(", ");
        throw new ExpressError(400, errMsg);
    }
    else{
        next();
    }
}
module.exports.validateReview = (req, res, next)=>{
    let {error} = reviewSchema.validate(req.body);
    if(error){
        let errMsg = error.details.map((el)=>el.message).join(", ");
        throw new ExpressError(400, errMsg);
    }
    else{
        next();
    }
}
module.exports.isAuthor = async (req, res, next)=>{
    let {id, reviewId} = req.params;
    console.log(id, " ", reviewId);
    let review = await Review.findById(reviewId);
    console.log(res.locals.currUser._id," ", review.author);
    if(!res.locals.currUser._id.equals(review.author._id)){
        req.flash("error", "You do not have permission to perform this action.");
        return res.redirect(`/nexus/${id}`);
    }
    next();
}