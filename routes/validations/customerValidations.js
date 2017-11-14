"use strict";

const Joi= require('joi');

module.exports = {

    getAllProducts: {
        query: {
            productCategory : Joi.string().optional().description('product category id').min(24).max(24),
            productBrand : Joi.string().optional().description('product brand id').min(24).max(24),
            searchProduct : Joi.string().optional().description('seach by product name,brand name'),
            skip : Joi.number().required(),
            limit : Joi.number().required(),
            priceSorting : Joi.number().allow([ 1, -1]).optional().description('1- for low to high, -1 for high to low'),
            isOfferAvailable : Joi.boolean().optional()
        }
    }
};
