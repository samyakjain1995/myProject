"use strict";

const path = require('path');
const express = require('express');
const router = express.Router();
const validate = require('express-validation');
const validations = require('./validations');
const CONTROLLER = require('../controllers');


router.route('*').get((req,res)=>{
   res.sendFile(path.join(__dirname),'public/index.html');
});

router.route('/logs/:type/:date').get((req,res)=>{
    res.sendFile(path.resolve(__dirname+"/../logs/"+req.params.date+'-'+req.params.type+'.log'));
});

router.route('/admin_register').post(validate(validations.adminValidation.addAdmin),CONTROLLER.AdminBaseController.addAdmin);
router.route('/admin_login').post(validate(validations.adminValidation.adminLogin),CONTROLLER.AdminBaseController.adminLogin);
router.route('/admin_logout').post(validate(validations.adminValidation.adminLogout),CONTROLLER.AdminBaseController.adminLogout);

//product apis
router.route('/admin_add_product_category').post(validate(validations.adminValidation.adminAddProductCategory),CONTROLLER.AdminBaseController.adminAddProductCategory);
router.route('/admin_add_product_brand').post(validate(validations.adminValidation.adminAddProductBrand),CONTROLLER.AdminBaseController.adminAddProductBrand);
router.route('/admin_add_product').post(validate(validations.adminValidation.adminAddProduct),CONTROLLER.AdminBaseController.adminAddProduct);
router.route('/admin_edit_product').post(validate(validations.adminValidation.adminEditProduct),CONTROLLER.AdminBaseController.adminEditProduct);

//customer api
router.route('/customer_get_all_products').get(validate(validations.customerValidation.getAllProducts),CONTROLLER.CustomerBaseController.getAllProducts);


module.exports = router;