const Direction = require("../models/direction.model");
const User = require("../models/user.model");
const Vehicle = require("../models/vehicle.modal");

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
        const directions = await Direction.find();
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