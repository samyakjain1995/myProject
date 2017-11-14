"use strict";

const mongoose = require('mongoose');
const Schema = mongoose.Schema;

let productBrand = new Schema({
    
    name : {type:String},
    isDeleted : {type : Boolean,default:false},
    image: {
      thumb: { type: String, default: null },
      original: { type: String, default: null },
    },
},{
    timestamps : true
});

module.exports = mongoose.model('productBrand',productBrand);