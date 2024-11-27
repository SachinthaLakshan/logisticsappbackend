const mongoose = require("mongoose");

const DirectionSchema = mongoose.Schema(
    {
        origin: {
            type: String,
            required: [true, "Please enter origin"],
        },
        destination: {
            type: String,
            required: [true, "Please enter product name"],
        },
        waypoints: {
            type: [String],
            required: false,
        },
        currentLocation: {
            lat: {
                type: Number,
                required: false,
            },
            lng: {
                type: Number,
                required: false,
            }
        },
        onTheWay: {
            type: Boolean,
            required: false,
        },
        driverConfirmed: {
            type: Boolean,
            required: false,
        },
        lorryCapacity: {
            type: Number,
            required: false,
        },
        vehicle: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Vehicle'
        },
    },
    {
        timestamps: true,
    }
);

const Direction = mongoose.model("Direction", DirectionSchema);

module.exports = Direction;
