const Review = require("../models/review.js");
const Nexus = require("../models/nexus.js");
module.exports.createReview = async (req, res) =>{
    let {id} = req.params;
    let nexus = await Nexus.findById(id);
    let newReview = new Review(req.body.review);
    nexus.reviews.push(newReview);
    if(nexus.rating){
        nexus.rating = (nexus.rating + newReview.rating) / 2;
    }
    else{
        nexus.rating = newReview.rating
    }
    newReview.author = res.locals.currUser._id;
    await newReview.save();
    await nexus.save();
    console.log("saved");
    res.redirect(`/nexus/${id}`);
}
module.exports.destroyReview = async (req, res) => {
    let {id, reviewId} = req.params;
    let nexus = await Nexus.findByIdAndUpdate(id, {$pull: {reviews: reviewId}});
    let deletedReview = await Review.findByIdAndDelete(reviewId);
    if(nexus.reviews.length > 1){
        let newRating = (2 * nexus.rating) - deletedReview.rating;
        await Nexus.findByIdAndUpdate(id, {rating: newRating});
    }
    else{
        await Nexus.findByIdAndUpdate(id, {rating: null});
    }
    res.redirect(`/nexus/${id}`);
}