// Needed Resources 
const express = require("express")
const router = new express.Router()
const invController = require("../controllers/invController")
const utilities = require("../utilities/")
const regValidate = require('../utilities/account-validation')

// Route to build inventory by classification view
router.get("/type/:classificationId", utilities.handleErrors(invController.buildByClassificationId));

//Route to build inventory by vehicle id
router.get("/detail/:vehicleId", utilities.handleErrors(invController.buildByVehicleId));

//Route to build management view
router.get("/", utilities.handleErrors(invController.buildManagementView));

//Route to build add classification view
router.get("/add-classification", utilities.handleErrors(invController.buildAddClassificationView))

//Route to add new classifcation to database
router.post('/add-classification', regValidate.addClassificationRules(), regValidate.checkClassificationData, utilities.handleErrors(invController.addClassification))

//Route to build add Inventory view
router.get("/add-inventory", utilities.handleErrors(invController.buildAddInventoryView))

//Route to add new inventory to database
router.post('/add-inventory', regValidate.addInventoryRules(), regValidate.checkInventoryData, utilities.handleErrors(invController.addInventory))

module.exports = router;