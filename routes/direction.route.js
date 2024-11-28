const express = require("express");
const { getDirections, createDirection, updateLorryDetails, findAssignedDirection, updateDriverResponse, updateCurrentLocation } = require("../controllers/direction.controller");
const router = express.Router();

router.post("/create", createDirection);
router.post("/nearbydirections", getDirections);
router.put("/updatecapacity/:lorryRegNumber/:lorryCapacity", updateLorryDetails);
router.get("/findtrip/:vehicleId", findAssignedDirection);
router.put("/driverresponse/:directionId/:response", updateDriverResponse);
router.put("/updatecurrentlocation", updateCurrentLocation);

module.exports = router;