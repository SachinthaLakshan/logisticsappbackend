const { request } = require("express");
const mongoose = require("mongoose");

const CustomerRequestSchema = mongoose.Schema(
    {
        customerLocation: {
            type: String,
            required: false,
        },
        vehicle: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Vehicle',
            required: false
        },
        requestedBy: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
            required: false
        },
        requestedTo: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
            required: false
        },
        driverAccepted: {
            type: Boolean,
            required: false,
        },
        route:{
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Direction',
            required: false
        },
        capacityOfGoods:{
            type: Number,
            required: false
        },
        toAddress :{
            type: String,
            required: false
        },
        typeOfGoods :{
            type: String,
            required: false
        },
        destinationContactNumber :{
            type: String,
            required: false
        },
        isExpired:{
            type: Boolean,
            required: false
        },

    },
    {
        timestamps: true,
    }
);


const CustomerRequest = mongoose.model("CustomerRequest", CustomerRequestSchema);

module.exports = CustomerRequest;