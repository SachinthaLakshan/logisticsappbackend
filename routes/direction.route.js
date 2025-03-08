const express = require("express");
const { getDirections, createDirection, updateLorryDetails, findAssignedDirection, updateDriverResponse, updateCurrentLocation, removeDirection, getDirectionByVehicleId, ignoreTripByDriver, startTripByDriver, getDirectionById, getVehicleFullCapasity } = require("../controllers/direction.controller");
const router = express.Router();

router.post("/create", createDirection);
router.post("/nearbydirections", getDirections);
router.put("/updatecapacity/:lorryRegNumber/:lorryCapacity", updateLorryDetails);
router.get("/findtrip/:vehicleId", findAssignedDirection);
router.put("/driverresponse/:directionId/:response", updateDriverResponse);
router.put("/updatecurrentlocation", updateCurrentLocation);
router.delete("/delete/:directionId", removeDirection);
router.delete("/ignore/:directionId", ignoreTripByDriver);
router.put("/starttrip/:directionId", startTripByDriver);
router.get("/getdirection/:directionId", getDirectionById);
router.get("/getvehiclecapasity/:vehicleNo", getVehicleFullCapasity);

module.exports = router;