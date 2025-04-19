const express= require("express");
const router = express.Router({mergeParams:true});
const{validateReview,isLoggedIn, isReviewAuthor}=require("../middleware.js");
const wrapAsync = require("../utils/wrapAsync.js");
const Review = require("../models/review.js");
const Listing = require('../models/db.js');
const reviewController = require("../controllers/reviews.js");

//review post route
router.post("/",isLoggedIn,validateReview ,wrapAsync(reviewController.createReview));

//delete review route
router.delete("/:reviewId", isLoggedIn,isReviewAuthor,wrapAsync(reviewController.destroyreview));
module.exports= router;
