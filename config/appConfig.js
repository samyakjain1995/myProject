"use strict";

let SWAGGER_BASE_LINK = null;

if(!process.env.NODE_ENV)
{
    SWAGGER_BASE_LINK = "http://localhost:";
}

const STATUS_MSG = {
    ERROR: {
        EMAIL_PASSWORD_INCORRECT:{
            statusCode : 400,
            message : 'Email password incorrect',
            data : {}
        },
        PRODUCT_CATEGORY_ALREADY_EXISTS:{
            statusCode : 400,
            message : 'Product category already exists.',
            data : {}
        },
        PRODUCT_BRAND_ALREADY_EXISTS:{
            statusCode : 400,
            message : 'Product brand already exists.',
            data : {}
        },
        PRODUCT_ALREADY_EXISTS:{
            statusCode : 400,
            message : 'Product name already exists.',
            data : {}
        },
        INCORRECT_ACCESSTOKEN: {
            statusCode: 401,
            message: 'Session expired or does not exists.',
            data : {}
        },
        DB_ERROR: {
            statusCode: 400,
            message: 'DB Error',
            data: {}
        },
        DEFAULT: {
            statusCode: 400,
            message: 'Error',
            type: 'DEFAULT'
        },
        EMAIL_ALREADY_EXIST: {
            statusCode: 400,
            message: 'Email already exists.',
            data: {}
        },
        PHONE_ALREADY_EXIST: {
            statusCode: 400,
            message: 'Mobile no and country code already exists.',
            data: {}
        },
    },
    SUCCESS: {
        ADMIN_REGISTER: {
            statusCode: 200,
            message: 'Admin registered successfully.',
            data : {}
        },
        DEFAULT: {
            statusCode: 200,
            message: 'Success',
            data : {}
        },
        LOGIN: {
            statusCode: 200,
            message: 'Logged in successfully.',
            data : {}
        },
        LOGOUT: {
            statusCode: 200,
            message: 'Logged out successfully.',
            data : {}
        },
        PRODUCT_CATEGORY_ADDED:{
            statusCode: 200,
            message: "Product category added successfully.",
            data: {}
        },
        PRODUCT_ADDED:{
            statusCode: 200,
            message: "Product added successfully.",
            data: {}
        },
        PRODUCT_UPDATED:{
            statusCode: 200,
            message: "Product updated successfully.",
            data: {}
        },
        PRODUCT_BRAND_ADDED:{
            statusCode: 200,
            message: "Product brand added successfully.",
            data: {}
        },
    }
};

module.exports = {
    SWAGGER_BASE_LINK : SWAGGER_BASE_LINK,
    STATUS_MSG : STATUS_MSG,
};