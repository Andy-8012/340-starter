// Needed Resources 
const express = require("express")
const router = new express.Router()
const invController = require("../controllers/invController")

// Route to build inventory by classification view
router.get("/type/:classificationId", invController.buildByClassificationId);

//Route to build inventory by vehicle id
router.get("/detail/:vehicleId", invController.buildByVehicleId);

module.exports = router;