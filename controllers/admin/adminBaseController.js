"use strict";

const md5 = require('MD5');
const async = require('async');
// const redis = require('../../config/dbConfig').redisClient;
const Models = require('../../models');
const bcrypt = require('bcrypt');
const CONFIG = require('../../config');

const ERROR = CONFIG.APPCONFIG.STATUS_MSG.ERROR;
const SUCCESS = CONFIG.APPCONFIG.STATUS_MSG.SUCCESS;

let addAdmin = function(req,res){

    async.series([
        //check if user with email or mobile and country code already exists
        function (cb) {
            let criteria = {
                $or: [{
                    email: req.body.email,
                },
                {
                    $and: [{
                        mobile: req.body.mobile,
                    },
                    {
                        countryCode: req.body.countryCode,
                    },
                    ],
                },
                ],
            };
            let projection = {
                email: 1,
                mobile: 1,
                countryCode: 1
            }
            Models.Admin.find(criteria, projection, function (err, dbData) {
                if (err) {
                    cb(ERROR.DB_ERROR);
                }
                else {
                    let data = {};
                    if (dbData && dbData.length > 0) {
                        data = dbData[0];
                    }
                    if (data && data.email == req.body.email) {
                        cb(ERROR.EMAIL_ALREADY_EXIST);
                    } else if(data && data.mobile == req.body.mobile && data.countryCode == req.body.countryCode){
                        cb(ERROR.PHONE_ALREADY_EXIST);
                    }
                    else{
                        cb();
                    }
                }

            });
        },
        function(cb){
            req.body.password = md5(req.body.password); //password encryption using md5
            req.body.accessToken = md5(req.body.password + new Date().getTime());    //session creation on admin registration

            let admin = new Models.Admin(req.body);
            admin.save((err,result)=>{
               if(err){
                cb(ERROR.DB_ERROR);
               }
                else{
                   let msg = SUCCESS.ADMIN_REGISTER;
                   const cleanResult = JSON.parse(JSON.stringify(result));
                   delete cleanResult.password;
                   msg.data = cleanResult;
                   cb(msg, null);
                }
            });
        },
    ],function(err,result){
        console.log("err response", err, result)
        return res.send(JSON.stringify(err ? err : result));
    })
};

let adminLogin = function(req,res){

    async.series([
        //check if user with email and password exists or not
        function (cb) {
            let criteria = {
                email : req.body.email,
                password : md5(req.body.password)
            };
            let projection = {
                email: 1,
                mobile: 1,
                countryCode: 1
            }
            Models.Admin.find(criteria, projection, function (err, dbData) {
                if (err) {
                    cb(ERROR.DB_ERROR);
                }
                else {
                    if (dbData && dbData.length > 0) {
                       cb();
                    }
                    else{
                        cb(ERROR.EMAIL_PASSWORD_INCORRECT);
                    }
                }

            });
        },
        function(cb){
             //session creation on admin login
             let criteria = {
                email : req.body.email,
                password : md5(req.body.password)
            };
            let dataToUpdate = {
                accessToken : md5(req.body.password + new Date().getTime())
            };
            let options = {
                new : true,
                lean: true
            }
            Models.Admin.findOneAndUpdate(criteria,dataToUpdate,options,(err,data)=>{
               if(err){
                   console.log("error---",err);
                cb(ERROR.DB_ERROR);
               }
                else{
                let msg= SUCCESS.LOGIN;
                delete data.password;
                msg.data  = data;
                cb(msg,null);
                }
            });
        },
    ],function(err,result){
        console.log("err response", err, result)
        return res.send(JSON.stringify(err ? err : result));
        // if(err){
        //     console.log("eer");
        //     res.send(err);
        // }
        // else{
        //     console.log("res--",result);
        //     res.send(result[1]);
        // }
    })
};

let adminLogout = function(req,res){

    async.series([
        //check if accessToken is valid or not
        function (cb) {
            let criteria = {
                accessToken : req.body.accessToken,
            };
            let projection = {
                accessToken: 1,
            }
            Models.Admin.find(criteria, projection, function (err, dbData) {
                if (err) {
                    cb(ERROR.DB_ERROR);
                }
                else {
                    if (dbData && dbData.length > 0) {
                       cb();
                    }
                    else{
                        cb(ERROR.INCORRECT_ACCESSTOKEN);
                    }
                }
            });
        },
        function(cb){
            //session removal on admin logout - destroy accessToken
            let criteria = {
                accessToken: req.body.accessToken,
            };
            let dataToUpdate = {
                 $unset: { accessToken: 1 },
            };
            let options = {
                new : true
            }
            Models.Admin.update(criteria,dataToUpdate,options,(err,result)=>{
               if(err){
                   console.log("error---",err);
                cb(ERROR.DB_ERROR);
               }
                else{
                cb(SUCCESS.LOGOUT);
                }
            });
        },
    ],function(err,result){
        console.log("err response", err, result)
        return res.send(JSON.stringify(err ? err : result));
    })
};

let adminAddProductCategory = function(req,res){

    async.series([
        //check if admin accessToken is valid or not
        function (cb) {
            let criteria = {
                accessToken : req.body.accessToken,
            };
            let projection = {
                accessToken: 1,
            }
            Models.Admin.find(criteria, projection, function (err, dbData) {
                if (err) {
                    cb(ERROR.DB_ERROR);
                }
                else {
                    if (dbData && dbData.length > 0) {
                       cb();
                    }
                    else{
                        cb(ERROR.INCORRECT_ACCESSTOKEN);
                    }
                }
            });
        },
        //check if product category already exists
        function (cb) {
            let criteria = {
                name : req.body.name
            };
            let projection = {
                name: 1,
            }
            Models.productCategory.find(criteria, projection, function (err, dbData) {
                if (err) {
                    cb(ERROR.DB_ERROR);
                }
                else {
                    let data = {};
                    if (dbData && dbData.length > 0) {
                        data = dbData[0];
                    }
                    if (data && data.name == req.body.name) {
                        cb(ERROR.PRODUCT_CATEGORY_ALREADY_EXISTS);
                    }
                    else{
                        cb();
                    }
                }

            });
        },
        function(cb){

            let productCategory = new Models.productCategory(req.body);
            productCategory.save((err,result)=>{
               if(err){
                cb(ERROR.DB_ERROR);
               }
                else{
                   let msg = SUCCESS.PRODUCT_CATEGORY_ADDED;
                   const cleanResult = JSON.parse(JSON.stringify(result));
                   msg.data = cleanResult;
                   cb(msg, null);
                }
            });
        },
    ],function(err,result){
        console.log("err response", err, result)
        return res.send(JSON.stringify(err ? err : result));
    })
};

let adminAddProductBrand = function(req,res){

    async.series([
        //check if accessToken is valid or not
        function (cb) {
            let criteria = {
                accessToken : req.body.accessToken,
            };
            let projection = {
                accessToken: 1,
            }
            Models.Admin.find(criteria, projection, function (err, dbData) {
                if (err) {
                    cb(ERROR.DB_ERROR);
                }
                else {
                    if (dbData && dbData.length > 0) {
                       cb();
                    }
                    else{
                        cb(ERROR.INCORRECT_ACCESSTOKEN);
                    }
                }
            });
        },
        //check if product brand already exists
        function (cb) {
            let criteria = {
                name : req.body.name
            };
            let projection = {
                name: 1,
            }
            Models.productBrand.find(criteria, projection, function (err, dbData) {
                if (err) {
                    cb(ERROR.DB_ERROR);
                }
                else {
                    let data = {};
                    if (dbData && dbData.length > 0) {
                        data = dbData[0];
                    }
                    if (data && data.name == req.body.name) {
                        cb(ERROR.PRODUCT_BRAND_ALREADY_EXISTS);
                    }
                    else{
                        cb();
                    }
                }

            });
        },
        function(cb){

            let productBrand = new Models.productBrand(req.body);
            productBrand.save((err,result)=>{
               if(err){
                cb(ERROR.DB_ERROR);
               }
                else{
                   let msg = SUCCESS.PRODUCT_CATEGORY_ADDED;
                   const cleanResult = JSON.parse(JSON.stringify(result));
                   msg.data = cleanResult;
                   cb(msg, null);
                }
            });
        },
    ],function(err,result){
        console.log("err response", err, result)
        return res.send(JSON.stringify(err ? err : result));
    })
};

let adminAddProduct = function(req,res){

    async.series([
        //check if accessToken is valid or not
        function (cb) {
            let criteria = {
                accessToken : req.body.accessToken,
            };
            let projection = {
                accessToken: 1,
            }
            Models.Admin.find(criteria, projection, function (err, dbData) {
                if (err) {
                    cb(ERROR.DB_ERROR);
                }
                else {
                    if (dbData && dbData.length > 0) {
                       cb();
                    }
                    else{
                        cb(ERROR.INCORRECT_ACCESSTOKEN);
                    }
                }
            });
        },
        //check if product brand already exists
        function (cb) {
            let criteria = {
                name : req.body.name
            };
            let projection = {
                name: 1,
            }
            Models.product.find(criteria, projection, function (err, dbData) {
                if (err) {
                    cb(ERROR.DB_ERROR);
                }
                else {
                    let data = {};
                    if (dbData && dbData.length > 0) {
                        data = dbData[0];
                    }
                    if (data && data.name == req.body.name) {
                        cb(ERROR.PRODUCT_ALREADY_EXISTS);
                    }
                    else{
                        cb();
                    }
                }

            });
        },
        function(cb){
            let offerDetails = {
                isOfferAvailable : req.body.isOfferAvailable || false,  //by default we are assuming there is no offer
                offerPrice : req.body.offerPrice || 0,
                offerDescription : req.body.offerDescription || null,
            }
            let dataToSave = {
                productCategory : req.body.productCategory,
                productBrand : req.body.productBrand,
                name : req.body.name,
                quantity : req.body.quantity,
                price : req.body.price,
                offerDetails : offerDetails
            }

            let product = new Models.product(dataToSave);
            product.save((err,result)=>{
               if(err){
                cb(ERROR.DB_ERROR);
               }
                else{
                   let msg = SUCCESS.PRODUCT_ADDED;
                   const cleanResult = JSON.parse(JSON.stringify(result));
                   msg.data = cleanResult;
                   cb(msg, null);
                }
            });
        },
    ],function(err,result){
        console.log("err response", err, result)
        return res.send(JSON.stringify(err ? err : result));
    })
};

let adminEditProduct = function(req,res){

    async.series([
        //check if accessToken is valid or not
        function (cb) {
            let criteria = {
                accessToken : req.body.accessToken,
            };
            let projection = {
                accessToken: 1,
            }
            Models.Admin.find(criteria, projection, function (err, dbData) {
                if (err) {
                    cb(ERROR.DB_ERROR);
                }
                else {
                    if (dbData && dbData.length > 0) {
                       cb();
                    }
                    else{
                        cb(ERROR.INCORRECT_ACCESSTOKEN);
                    }
                }
            });
        },
        //check if product brand already exists
        function (cb) {
            let criteria = {
                name : req.body.name,
                _id: {
                    $nin: [ req.body.productId ],
                },
            };
            let projection = {
                name: 1,
            }
            Models.product.find(criteria, projection, function (err, dbData) {
                if (err) {
                    cb(ERROR.DB_ERROR);
                }
                else {
                    let data = {};
                    if (dbData && dbData.length > 0) {
                        data = dbData[0];
                    }
                    if (data && data.name == req.body.name) {
                        cb(ERROR.PRODUCT_ALREADY_EXISTS);
                    }
                    else{
                        cb();
                    }
                }

            });
        },
        function(cb){
            let offerDetails = {};
            if(req.body.isOfferAvailable && req.body.offerPrice && req.body.offerDescription){
                offerDetails.isOfferAvailable = req.body.isOfferAvailable;
                offerDetails.offerPrice = req.body.offerPrice;
                offerDetails.offerDescription = req.body.offerDescription;
                req.body.offerDetails = offerDetails
            }

            let criteria = {
                _id: req.body.productId,
            };
            let options = {
                new : true
            }
            Models.product.findOneAndUpdate(criteria,req.body,options,(err,result)=>{
               if(err){
                   console.log("error---",err);
                cb(ERROR.DB_ERROR);
               }
               else {
                   let msg = SUCCESS.PRODUCT_UPDATED;
                   const cleanResult = JSON.parse(JSON.stringify(result));
                   msg.data = cleanResult;
                   cb(msg, null);
               }
            });
        },
    ],function(err,result){
        console.log("err response", err, result)
        return res.send(JSON.stringify(err ? err : result));
    })
};

module.exports = {

    addAdmin : addAdmin,
    adminLogin : adminLogin,
    adminLogout : adminLogout,
    adminAddProductCategory : adminAddProductCategory,
    adminAddProductBrand : adminAddProductBrand,
    adminAddProduct : adminAddProduct,
    adminEditProduct : adminEditProduct
}