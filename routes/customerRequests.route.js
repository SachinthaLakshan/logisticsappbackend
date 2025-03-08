const express = require("express");
const router = express.Router();
const { createCustomerRequest, getCustomerRequestsByDriver, removeCustomerRequest, acceptCustomerRequest, getAcceptedCustomerRequestsByDriver, getCustomerRequestDelivered } = require("../controllers/customerRequests.controller.js");

router.post("/create", createCustomerRequest);
router.get("/getcustomerrequests/:driverId", getCustomerRequestsByDriver);
router.delete("/delete/:id", removeCustomerRequest);
router.put("/accept/:id/:routeId", acceptCustomerRequest);
router.get("/getacceptedcustomerrequests/:driverId", getAcceptedCustomerRequestsByDriver);
router.delete("/delivered/:id", getCustomerRequestDelivered);

module.exports = router;