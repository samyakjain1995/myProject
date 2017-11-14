"use strict";

const async = require('async');
const mongoose = require('mongoose');
const Models = require('../../models');
const bcrypt = require('bcrypt');
const CONFIG = require('../../config');

const ERROR = CONFIG.APPCONFIG.STATUS_MSG.ERROR;
const SUCCESS = CONFIG.APPCONFIG.STATUS_MSG.SUCCESS;

let getAllProducts = function (req, res) {

    let data = null;

    async.series([
        function (cb) {
            let c1 = {};
            let c2 = {};
            let c3 = {};
            let c4 = {};
            let c5 = {};
            let c6 = {};

            //search product for a particular product brand
            if (Object.prototype.hasOwnProperty.call(req.query, 'productBrand')) {
                c1 = {
                    productBrand: mongoose.Types.ObjectId(req.query.productBrand)
                };
            }

            //search product for a particular product category
            if (Object.prototype.hasOwnProperty.call(req.query, 'productCategory')) {
                c2 = {
                    productCategory: mongoose.Types.ObjectId(req.query.productCategory)
                };
            }

            //search products if offers are available
            if (req.query.isOfferAvailable == true) {
                c3 = {
                    'offerDetails.isOfferAvailable': true,
                };
            }

            //search product on the basis of product name,product brand name,product category name
            if (Object.prototype.hasOwnProperty.call(req.query, 'searchProduct')) {
                c4 = { 'productCategory.name': { $regex: `.*${req.query.searchProduct}.*`, $options: 'i' } };
                c5 = { 'productBrand.name': { $regex: `.*${req.query.searchProduct}.*`, $options: 'i' } };
                c6 = { name: { $regex: `.*${req.query.searchProduct}.*`, $options: 'i' } };
            }

            const aggregateData = [
                {
                    $match: {
                        $and: [
                            { isDeleted: false },
                            { quantity : { $gt : 0} },
                            c1,
                            c2,
                            c3
                        ],
                    },
                },
                {
                    $lookup: {
                        from: 'productbrands',
                        localField: 'productBrand',
                        foreignField: '_id',
                        as: 'productBrand',
                    },
                },
                {
                    $unwind: '$productBrand',
                },
                {
                    $lookup: {
                        from: 'productcategories',
                        localField: 'productCategory',
                        foreignField: '_id',
                        as: 'productCategory',
                    },
                },
                {
                    $unwind: '$productCategory',
                },
                {
                    $project: {
                        name: 1,
                        image: 1,
                        ratedByUserCount: 1,
                        totalRatingPoints: 1,
                        offerDetails: 1,
                        price: 1,
                        quantity: 1,
                        'productCategory._id': 1,
                        'productCategory.name': 1,
                        'productBrand._id': 1,
                        'productBrand.name': 1,
                        'productBrand.image': 1,
                    },
                },
                {
                    $match: {
                        $or: [
                            c4,
                            c5,
                            c6,
                        ],
                    },
                },
            ];

            Models.product.aggregate(aggregateData, (err, result) => {
                if (err) {
                    console.log("error---", err);
                    cb(ERROR.DB_ERROR);
                }
                else {
                    let count = result.length;

                    //if there is a price fliter from low to high(1) or high to low(-1)
                    if (Object.prototype.hasOwnProperty.call(req.query, 'priceSorting')) {
                        aggregateData.push({ $sort: { price: req.query.priceSorting } });
                    }
                    else {
                        aggregateData.push({ $sort: { _id: -1 } });
                    }
                    aggregateData.push({ $skip: req.query.skip });
                    aggregateData.push({ $limit: req.query.limit });

                    Models.product.aggregate(aggregateData, (err, result2) => {
                        if (err) {
                            console.log("error---", err);
                            cb(ERROR.DB_ERROR);
                        }
                        else {
                            let products = result2;
                            const data = {
                                count,
                                products,
                            };
                            let msg = SUCCESS.DEFAULT;
                            msg.data = data;
                            cb(msg, null);
                        }
                    });
                }
            });
        }
    ], function (err, result) {
        console.log("err response", err, result)
        return res.send(JSON.stringify(err ? err : result));
        // if (err)
        //     res.send(err);
        // else
        //     res.send(data);
    })
}



module.exports = {

    getAllProducts : getAllProducts
}