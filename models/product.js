"use strict";

const mongoose = require('mongoose');
const Schema = mongoose.Schema;

let product = new Schema({
    
    productCategory: {
      type: mongoose.Schema.ObjectId,
      ref: 'productCategory',
      default: null,
    },
    productBrand: {
      type: mongoose.Schema.ObjectId,
      ref: 'productBrand',
      default: null,
    },
    name : {type:String},
    quantity: {type: Number,default: 0},
    soldOutQuantity: {type: Number,default: 0},
    price: {type: Number,default: 0},
    offerDetails: {
      isOfferAvailable: { type: Boolean, default: false },
      offerPrice: { type: Number, default: 0 },
      offerDescription: {type: String, trim: true, default: null },
    },
    isDeleted : {type : Boolean, default:false},
    totalRatingPoints: { type: Number, default: 0 },
    ratedByUserCount: { type: Number, default: 0 },
    image: {
      thumb: { type: String, default: null },
      original: { type: String, default: null },
    },
},{
    timestamps : true
});

module.exports = mongoose.model('product',product);