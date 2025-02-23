const express = require("express");
const { getAllVehicles, getAllRoutes, getAllDrivers, assignVehicleToRoute, getAllOnGoingRoutes } = require("../controllers/admin.controller");
const router = express.Router();

router.get("/getallvehicles", getAllVehicles);
router.get("/getallroutes/:userId", getAllRoutes);
router.get("/getalldrivers", getAllDrivers);
router.put("/assignvehicletoroute", assignVehicleToRoute);
router.get("/getallongingroutes/:userId", getAllOnGoingRoutes);

module.exports = router;