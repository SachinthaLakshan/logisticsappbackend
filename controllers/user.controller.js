const User = require('../models/user.model'); // Assuming a User model
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const Vehicle = require('../models/vehicle.modal');

exports.registerUser = async (req, res) => {

    try {
        const userDetails = req.body;

        const existingUser = await User.findOne({ email: userDetails.email });
        if (existingUser) {
            return res.status(400).json({ message: "Email already registered" });
        }
        const hashedPassword = await bcrypt.hash(userDetails.password, 10);

        const newVehicle = new Vehicle({
            ...userDetails.vehicleDetails
        });
        await newVehicle.save();
        delete userDetails.vehicleDetails;
        const newUser = new User({
            ...userDetails,
            password: hashedPassword,
            vehicleDetails: newVehicle._id
        });
        await newUser.save();
        const token = jwt.sign({ userId: newUser._id, userType: newUser.userType }, "secret-key", {
            expiresIn: "1h",
        });

        res.status(201).json({ message: "User registered successfully", token });
    } catch (error) {
        console.log(error);

        res.status(500).json({ message: "An error occurred" });
    }
};

exports.loginUser = async (req, res) => {
    const { email, password } = req.body;

    try {
        const { email, password } = req.body;

        const user = await User.findOne({ email });
        if (!user) {
            return res.status(401).json({ message: "Invalid credentials" });
        }

        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid) {
            return res.status(401).json({ message: "Invalid credentials" });
        }

        const token = jwt.sign({ userId: user._id, userType: user.userType }, "secret-key", {
            expiresIn: "1h", // Token expiration time
        });

        res.status(200).json({ message: "Login successful", token });
    } catch (error) {
        console.log(error);

        res.status(500).json({ message: "An error occurred" });
    }
};

exports.getUserById = async (req, res) => {
    
    const { userId } = req.params;

    try {
        const user = await User.findOne({ _id: userId }).populate('vehicleDetails');
        if (!user) {
            return res.status(401).json({ message: "Invalid User" });
        }

        res.status(200).json({ message: "User Details", data: user });
    } catch (error) {
        console.log(error);

        res.status(500).json({ message: "An error occurred" });
    }
};