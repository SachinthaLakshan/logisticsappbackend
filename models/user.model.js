const mongoose = require("mongoose");

const UserSchema = mongoose.Schema(
    {
        userType: {
            type: String,
            enum: ['LogisticsCompany', 'TransportProvider', 'FarmerCustomer'],
            required: true
        },
        companyName: {
            type: String,
            required: false
        },
        businessRegistrationNumber: {
            type: String,
            required: false
        },
        industryType: {
            type: String,
            required: false
        },
        email: {
            type: String,
            required: [true, 'Email is required'],
            unique: true,
            match: [/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/, 'Please fill a valid email   address']
        },
        password: {
            type: String,
            required: [true, 'Password is required'],
        },
        contactNumber: {
            type: String,
            required: true
        },
        driverName: {
            type: String,
            required: false
        },
        idNumber: {
            type: String,
            required: false
        },
        address: {
            type: String,
            required: false
        },
        vehicleDetails: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Vehicle',
            required: false
        },
        fullName: {
            type: String,
            required: false
        },
        farmBusinessLocation: {
            type: String,
            required: false
        },
        typeOfGoods: {
            type: String,
            required: false
        },
    },
    {
        timestamps: true,
    }
);


const User = mongoose.model("User", UserSchema);

module.exports = User;