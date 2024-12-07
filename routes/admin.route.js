const express = require("express");
const { getAllVehicles, getAllRoutes, getAllDrivers } = require("../controllers/admin.controller");
const router = express.Router();

router.get("/getallvehicles", getAllVehicles);
router.get("/getallroutes", getAllRoutes);
router.get("/getalldrivers", getAllDrivers);

module.exports = router;