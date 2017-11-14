"use strict";

const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const APPCONFIG = require('../config/appConfig.js');

let customer = new Schema({
    
    emailId : {type:String},
    name : {type : String},
    mobile : {type:String},
    countryCode : {type:String},
    password : {type: String,default:null},
    accessToken : {type : String,default:null},
},{
    timestamps : true
});

module.exports = mongoose.model('customer',customer);