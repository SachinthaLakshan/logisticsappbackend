const express = require("express");
const { getAllVehicles, getAllRoutes, getAllDrivers, assignVehicleToRoute } = require("../controllers/admin.controller");
const router = express.Router();

router.get("/getallvehicles", getAllVehicles);
router.get("/getallroutes", getAllRoutes);
router.get("/getalldrivers", getAllDrivers);
router.put("/assignvehicletoroute", assignVehicleToRoute)

module.exports = router;