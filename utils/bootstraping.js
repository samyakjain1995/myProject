"use strict";

const md5 = require('MD5');
const winston = require('winston');
const Models = require('../models');
const async = require('async');

class bootstrap{

    constructor(){
        /////
        async.series([
            //check if user with email or mobile and country code already exists
            function (cb) {
                Models.Admin.find({}, { _id: 1 }, function (err, dbData) {
                    if (err) {
                        // cb(ERROR.DB_ERROR);
                        cb("error in admin addition");
                    }
                    else {
                        let data = {};
                        // console.log("admin length--", dbData.length)
                        if (dbData && dbData.length <= 0) {
                            // console.log("adding admin--");
                            let password = "qwerty";
                            let encryptedPassword = md5(password);
                            let admin = {
                                email: "samyakjain.1995@gmail.com",
                                name: 'Samyak Jain',
                                mobile: "9781738344",
                                countryCode: "+91",
                                password: encryptedPassword
                            };
                            admin = new Models.Admin(admin);
                            admin.save((err) => {
                            });
                            cb();
                        }
                    }
                });
            },
        ], function (err, result) {
            if (err){
                // console.log("error in adding admin");    
            }
            else{
                // console.log("success in adding admin");
            }
        })
    }
};

module.exports = bootstrap;