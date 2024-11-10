const express = require("express");
const { getDirections, createDirection, updateLorryDetails } = require("../controllers/direction.controller");
const router = express.Router();

router.post("/create", createDirection);
router.post("/nearbydirections", getDirections);
router.put("/updatecapacity/:lorryRegNumber/:lorryCapacity", updateLorryDetails);

module.exports = router;