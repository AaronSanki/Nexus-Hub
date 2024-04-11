const express = require("express");
const router = express.Router({mergeParams: true});
const wrapAsync = require("../utils/wrapAsync");
const reviewsController = require("../controllers/review.js");
const {validateReview, isLoggedIn, isAuthor} = require("../middlewares.js");
//Post Review Route
router.post("/", isLoggedIn, validateReview, wrapAsync(reviewsController.createReview));
//Delete Review Route
router.delete("/:reviewId", isLoggedIn, isAuthor, wrapAsync(reviewsController.destroyReview));
module.exports = router;