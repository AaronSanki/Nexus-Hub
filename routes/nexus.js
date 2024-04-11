const express = require("express");
const router = express.Router();
const wrapAsync = require("../utils/wrapAsync");
const {isLoggedIn, isOwner, validateNexus} = require("../middlewares.js");
const nexusController = require("../controllers/nexus.js");
const multer = require("multer");
const {storage} = require("../cloudConfig.js");
const upload = multer({storage});

router
    .route("/")
    //Index Route
    .get(wrapAsync(nexusController.index)) 
    //Create Route
    .post(isLoggedIn, validateNexus, upload.single("nexus[image][url]"), wrapAsync(nexusController.createNexus)); 
//New Route
router.get("/new", isLoggedIn, wrapAsync(nexusController.renderNewForm)); 

//Search Route
router.get("/search", wrapAsync(nexusController.searchNexus));

//Search Suggestion
// router.get("/searchSuggestions", wrapAsync(ingController.searchSuggestions));

//Filter Route
router.get("/filters", wrapAsync(nexusController.filterNexus));

router
    .route("/:id")
    //Show Route
    .get( wrapAsync(nexusController.showNexus)) 
    //Update Route
    .put(isLoggedIn, isOwner, validateNexus,  upload.single("nexus[image][url]"), wrapAsync(nexusController.updateNexus)) 
    //Destroy Route
    .delete(isLoggedIn, isOwner, wrapAsync(nexusController.destroyNexus)); 
    
//Edit Route
router.get("/:id/edit", isLoggedIn, wrapAsync(nexusController.renderEditForm)); 

module.exports = router;