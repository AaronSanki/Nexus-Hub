const Nexus = require("../models/nexus.js");
const mbxGeocoding = require('@mapbox/mapbox-sdk/services/geocoding');
const mapToken = process.env.MAP_TOKEN;
const geocodingClient = mbxGeocoding({ accessToken: mapToken });

module.exports.index = async (req, res) => {
    const allNexus = await Nexus.find({});
    res.render("nexus/index.ejs", { allNexus });
}
module.exports.renderNewForm = (req, res) => {
    res.render("nexus/new.ejs");
}
module.exports.showNexus = async (req, res) => {
    let { id } = req.params;
    const nexus = await Nexus.findById(id).populate({path: "reviews", populate: {path: "author"}}).populate("owner");
    if(!nexus){
        req.flash("error", "This Nexus Doesn't exist.");
        res.redirect("/nexus");
    }
    res.render("nexus/show.ejs", { nexus });
}
module.exports.searchNexus = async(req, res)=>{
    const { query } = req.query;
    console.log(query);
    const searchResults = await Nexus.find({ 
        $or: [
            { title: { $regex: query, $options: 'i' } },
            { location: { $regex: query, $options: 'i' } },
            { country: { $regex: query, $options: 'i' } }
        ]
    });
    res.render("nexus/search.ejs", {searchResults});
}
module.exports.filterNexus = async (req, res)=>{
    let category = req.query.q;
    let allNexus;
    if(category === "Trending"){
        allNexus = await Nexus.find({ rating: {$exists: true, $gte: 3} }).sort({rating: -1});
    }
    else{
        allNexus = await Nexus.find({category});   
    }
    res.render("nexus/filter.ejs", {allNexus, category});
}
module.exports.createNexus = async (req, res) => {
    let response = await geocodingClient
        .forwardGeocode({
        query: req.body.nexus.location,
        limit: 1
        })
        .send();
    const newNexus = new Nexus(req.body.nexus);
    let url = req.file.path;
    let filename = req.file.filename;
    newNexus.owner = req.user._id;
    newNexus.image = {url, filename};
    newNexus.geometry = response.body.features[0].geometry;
    let savedNexus = await newNexus.save();
    req.flash("success", "New Nexus created!");
    console.log(savedNexus);
    res.redirect("/nexus");
}
module.exports.updateNexus = async (req, res) => {
    let {id} = req.params;
    let response = await geocodingClient
        .forwardGeocode({
        query: req.body.nexus.location,
        limit: 1
        })
        .send();
    let editedNexus = req.body.nexus;
    let updatedNexus = await Nexus.findByIdAndUpdate(id, editedNexus);
    updatedNexus.geometry = response.body.features[0].geometry;
    await updatedNexus.save();
    if(typeof req.file !== "undefined"){
        let url = req.file.path;
        let filename = req.file.filename;
        updatedNexus.image = {url, filename};
        await updatedNexus.save();
    }
    req.flash("success", "Nexus updated.");
    res.redirect(`/nexus/${id}`);
} 
module.exports.renderEditForm = async (req, res) => {
    let { id } = req.params;
    const post = await Nexus.findById(id);
    res.render("nexus/edit.ejs", { post });
}
module.exports.destroyNexus = async (req, res) => {
    let { id } = req.params;
    let deletedNexus = await Nexus.findByIdAndDelete(id);
    console.log(deletedNexus);
    req.flash("success", "Nexus deleted.");
    res.redirect("/nexus");
}