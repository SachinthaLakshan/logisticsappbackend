const mongoose = require("mongoose");

const VehicleSchema = mongoose.Schema(
    {
        licensePlateNumber: {
            type: String,
            required: false
        },
        height: {
            type: Number,
            required: false
        },
        length: {
            type: Number,
            required: false
        },
        width: {
            type: Number,
            required: false
        },
        containerCapacity: {
            type: Number,
            required: false
        },
        maximumLoadCapacity: {
            type: Number,
            required: false
        },
        vehicleType: {
            type: String,
            required: false
        },
        assignedRoute: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Direction',
            required: false
        },
        driver : {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
            required: false
        }
    },
    {
        timestamps: true,
    }
);


const Vehicle = mongoose.model("Vehicle", VehicleSchema);

module.exports = Vehicle;