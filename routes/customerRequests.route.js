const express = require("express");
const router = express.Router();
const { createCustomerRequest, getCustomerRequestsByDriver, removeCustomerRequest, acceptCustomerRequest } = require("../controllers/customerRequests.controller.js");

router.post("/create", createCustomerRequest);
router.get("/getcustomerrequests/:driverId", getCustomerRequestsByDriver);
router.delete("/delete/:id", removeCustomerRequest);
router.put("/accept/:id/:routeId", acceptCustomerRequest);

module.exports = router;