const path = require("path");
if(process.env.NODE_ENV != "production"){
    require("dotenv").config({ path: path.resolve(__dirname, "../.env") });
}
const mongoose = require("mongoose");
const initData = require("./data.js");
const Nexus = require("../models/nexus.js");
const User = require("../models/user.js");
const mbxGeocoding = require('@mapbox/mapbox-sdk/services/geocoding');
const mapToken = process.env.MAP_TOKEN;
const geocodingClient = mbxGeocoding({ accessToken: mapToken });

async function main(){
    mongoose.connect("mongodb://127.0.0.1:27017/wanderlust");
}
main()
    .then(()=>{
        console.log("Connected");
    })
    .catch((err)=>{
        console.log(err);
    });
const initDB = async ()=>{
    await Nexus.deleteMany({});
    for(let nexus of initData.data){
        let response = await geocodingClient
        .forwardGeocode({
        query: nexus.location,
        limit: 1
        })
        .send()
        nexus.geometry = response.body.features[0].geometry;
    }
    let user = await User.find({username: "aaron_sanki"})
    initData.data = initData.data.map((obj)=>({...obj, owner: user.id}));
    await Nexus.insertMany(initData.data);
}
initDB();