const { Model } = require("mongoose");
const Direction = require("../models/direction.model");
const User = require("../models/user.model");
const Vehicle = require("../models/vehicle.modal");
const CustomerRequest = require("../models/customerRequests.model");

exports.getAllVehicles = async (req, res) => {
    try {
        const vehicles = await Vehicle.find();
        res.status(200).json(vehicles);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

exports.getAllRoutes = async (req, res) => {
    try {
        const directions = await Direction.find({createdBy:req.params.userId}).populate('vehicle');
        res.status(200).json(directions);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

exports.getAllOnGoingRoutes = async (req, res) => {
    try {
        const directions = await Direction.find({createdBy:req.params.userId,onTheWay:true,driverConfirmed : true})
            .populate({
                path: 'customerRequests',
                populate: {
                    path: 'requestedTo',
                    model: 'User'
                }
            })
            .populate({
                path: 'customerRequests',
                populate: {
                    path: 'requestedBy',
                    model: 'User'
                }
            })
            .populate('vehicle');
        res.status(200).json(directions);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

exports.getAllDrivers = async (req, res) => {
    try {
        const users = await User.find({userType:'TransportProvider'}).populate('vehicleDetails');
        res.status(200).json(users);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
exports.assignVehicleToRoute = async (req, res) => {
    try {
        const { vehicleId, directionId } = req.body;
        const vehicle = await Vehicle.findById(vehicleId);
        const direction = await Direction.findById(directionId);

        if(vehicle.assignedRoute != undefined){
            return res.status(400).json({ message: "Vehicle already assigned to a route" });
        }
        
        if(direction.vehicle != undefined){
            if(direction.vehicle != vehicleId){
                await Vehicle.updateOne({ _id: direction.vehicle }, { $unset: { assignedRoute: "" } });
            }
        }

        direction.vehicle = vehicleId;
        vehicle.assignedRoute = directionId;
        await direction.save();
        await vehicle.save();
        res.status(200).json({ message: "Vehicle assigned to route successfully" });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
