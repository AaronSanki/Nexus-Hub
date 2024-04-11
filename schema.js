const Joi = require("joi");
module.exports.nexusSchema = Joi.object({
    nexus: Joi.object({
        title: Joi.string().required(),
        description: Joi.string().required(),
        image: Joi.object({
            filename: Joi.string(),
            url: Joi.string().allow("").default("https://cdn.pixabay.com/photo/2017/02/01/22/02/mountain-landscape-2031539_1280.jpg")
        }).required(),
        price: Joi.number().required().min(0),
        location: Joi.string().required(),
        country: Joi.string().required(),
        schema: Joi.string().required(),
        rating: Joi.number().min(1).max(5).precision(1)
    }).required()
});
module.exports.reviewSchema = Joi.object({
    review: Joi.object({
        comment: Joi.string().required(),
        rating: Joi.number().required().min(1).max(5)
    })
});