"use strict";

"use strict";

const Joi= require('joi');

module.exports = {

    addAdmin: {
        body: {
            email : Joi.string().email().required(),
            name: Joi.string().regex(/^[a-zA-Z ]+$/).trim().required(),
            countryCode: Joi.string().regex(/^[0-9,+]+$/).trim().min(2).required(),
            mobile: Joi.string().regex(/^[0-9]+$/).min(10).max(10).required(),
            password : Joi.string().required()
        }
    },
    adminLogin: {
        body: {
            email : Joi.string().email().required(),
            password : Joi.string().required()
        }
    },
    adminLogout: {
        body: {
            accessToken : Joi.string().required()
        }
    },
    adminAddProductCategory: {
        body: {
            accessToken : Joi.string().required(),
            name : Joi.string().required()
        }
    },
    adminAddProductBrand: {
        body: {
            accessToken : Joi.string().required(),
            name : Joi.string().required()
        }
    },
    adminAddProduct: {
        body: {
            accessToken : Joi.string().required(),
            productCategory : Joi.string().required().description('product category id').min(24).max(24),
            productBrand : Joi.string().required().description('product brand id').min(24).max(24),
            name : Joi.string().required(),
            quantity : Joi.number().integer().required(),
            price : Joi.number().required(),
            isOfferAvailable : Joi.boolean().optional(),
            offerPrice : Joi.number().optional(),
            offerDescription : Joi.string().optional(),
        }
    },
    adminEditProduct: {
        body: {
            accessToken : Joi.string().required(),
            productCategory : Joi.string().optional().description('product category id').min(24).max(24),
            productBrand : Joi.string().optional().description('product brand id').min(24).max(24),
            productId : Joi.string().required().description('product id').min(24).max(24),
            name : Joi.string().optional(),
            quantity : Joi.number().integer().optional(),
            price : Joi.number().optional(),
            isOfferAvailable : Joi.boolean().optional(),
            offerPrice : Joi.number().optional(),
            offerDescription : Joi.string().optional(),
            isDeleted : Joi.boolean().optional(),            
        }
    }
};
