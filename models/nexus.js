const { string } = require("joi");
const mongoose = require("mongoose");
const { countDocuments } = require("./review.js");
const Schema = mongoose.Schema;
const Review = require("./review.js");
const nexusSchema = new Schema({
    title: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    image: {
        filename: {
            type: String
        },
        url: {
            type: String,
            set: (v) => v === "" ? "https://cdn.pixabay.com/photo/2017/02/01/22/02/mountain-landscape-2031539_1280.jpg":v
        }
    },
    price: {
        type: Number,
        required: true
    },
    location: {
        type: String,
    },
    country: {
        type: String,
    },
    reviews: [
        {
            type: Schema.Types.ObjectId,
            ref : "Review"
        }
    ],
    rating: {
        type: Number,
    },
    owner: {
        type: Schema.Types.ObjectId,
        ref: "User"
    },
    geometry: {
        type: {
          type: String,
          enum: ['Point'],
          required: true
        },
        coordinates: {
          type: [Number],
          required: true
        }
    },
    category: [{
        type: String,
        enum: ["Rooms", "Mountains", "Beach", "Resort", "Camping", "Hiking", "Farm", "Arctic", "Sailing"],
        required: true
    }]
});
nexusSchema.post("findOneAndDelete", async (nexus)=>{
    if(nexus){
        await Review.deleteMany({_id: {$in: nexus.reviews}});
    }
});
const Nexus = mongoose.model("Nexus", nexusSchema);
module.exports = Nexus;