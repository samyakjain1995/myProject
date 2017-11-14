"use strict";

const mongoose = require('mongoose');
const Schema = mongoose.Schema;

let productCategory = new Schema({
    
    name : {type:String},
    isDeleted : {type : Boolean,default:false},
},{
    timestamps : true
});

module.exports = mongoose.model('productCategory',productCategory);