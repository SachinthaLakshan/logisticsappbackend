
const { Client } = require('@googlemaps/google-maps-services-js');
const Direction = require("../models/direction.model");
const { mongo, default: mongoose } = require('mongoose');
const Vehicle = require('../models/vehicle.modal');
const CustomerRequest = require('../models/customerRequests.model');

// Create a new client instance
const client = new Client({});

// Create a new Direction
exports.createDirection = async (req, res) => {
    try {
        const { origin, destination, waypoints, currentLocation, onTheWay, lorryCapacity,startTime,endDate,startDate,createdBy } = req.body;

        // Create a new Direction instance with request data
        const direction = new Direction({
            origin,
            destination,
            waypoints,
            currentLocation,
            onTheWay: onTheWay || false,
            // vehicle,
            driverConfirmed: false,
            lorryCapacity,
            startTime,
            endDate,
            startDate,
            createdBy,
            tripFinished: false
        });
        
        // Save the new Direction to the database
        const savedDirection = await direction.save();

        // Send a success response with the saved Direction data
        res.status(201).json({
            message: "Direction created successfully",
            data: savedDirection,
        });
    } catch (error) {
        // Handle any errors
        res.status(400).json({
            message: "Error creating direction",
            error: error.message,
        });
    }
};

exports.updateLorryDetails = async (req, res) => {
    try {
        const { lorryRegNumber, lorryCapacity } = req.params;
        console.log(lorryRegNumber, lorryCapacity);

        // Find and update the document by lorryRegNumber
        const updatedVehicle = await Vehicle.findOneAndUpdate(
            { licensePlateNumber: lorryRegNumber },
            { $set: { containerCapacity: lorryCapacity } }
        );

        if (!updatedVehicle) {
            return res.status(404).json({
                message: `LorryRegNumber not found. requested No: ${lorryRegNumber} | requested Capasity:${lorryCapacity}`,
            });
        }

        res.status(200).json({
            message: `Capacity updated successfully. Requested No: ${lorryRegNumber} | Requested Capasity:${lorryCapacity}`,
            data: updatedVehicle,
        });
    } catch (error) {
        res.status(400).json({
            message: "Error updating Capacity",
            error: error.message,
        });
    }
};

exports.updateDriverResponse = async (req, res) => {
    try {
        const { directionId, response } = req.params;

        // Find and update the document by lorryRegNumber
        const updatedDirection = await Direction.findOneAndUpdate(
            { _id: directionId },
            { $set: { driverConfirmed: response } }
        );

        if (!updatedDirection) {
            return res.status(404).json({
                message: "Driver Response not found",
            });
        }

        res.status(200).json({
            message: "Driver response updated successfully"
        });
    } catch (error) {
        res.status(400).json({
            message: "Error updating driver response",
            error: error.message,
        });
    }
};

exports.findAssignedDirection = async (req, res) => {
    try {
        const { vehicleId } = req.params;

        const foundDirection = await Direction.findOne({ vehicle: vehicleId,tripFinished:false }).populate('vehicle').populate('createdBy');

        if (!foundDirection) {
            return res.status(404).json({
                message: "You have not been assigned a Trip yet",
            });
        }
        res.status(200).json({
            message: "Trip found successfully",
            data: foundDirection,
        });
    } catch (error) {
        res.status(400).json({
            message: "Error finding direction",
            error: error.message,
        });
    }
}

exports.getDirections = async (req, res) => {
    const { currentLatitude, currentLongitude } = req.body;
    try {
        let nearbyRoutes = [];
        const directionsList = await Direction.find({ onTheWay: true,tripFinished:false }).populate('vehicle').populate('createdBy');
        for (const direction of directionsList) {

            const response = await client.directions({
                params: {
                    origin: direction.origin,
                    destination: direction.destination,
                    waypoints: direction.waypoints,
                    mode: 'driving',
                    key: process.env.GOOGLE_MAPS_API_KEY
                },
                timeout: 1000 // milliseconds
            });
            if (response.data.routes.length > 0) {
                const overviewPath = response.data.routes[0].overview_polyline.points; // Get the encoded polyline points

                // Decode the polyline points
                const decodedPath = decodePolyline(overviewPath);

                // Map the decoded path to desired format
                const array = decodedPath.map((item, index) => {
                    return { latitude: item.lat, longitude: item.lng, name: index };
                });

                const nearbyLocations = isWithin5km(currentLatitude, currentLongitude, array);

                if (nearbyLocations.length > 0) {
                    nearbyRoutes.push(direction);
                }


            }
        }
        return res.status(200).json({ message: "Successful", nearbyRoute: nearbyRoutes });
    } catch (error) {
        console.error('Error fetching directions:', error);
        return res.status(400).json({ message: "Error", error });
    }
}

function decodePolyline(encoded) {
    const poly = [];
    let index = 0, len = encoded.length;
    let lat = 0, lng = 0;

    while (index < len) {
        let b, shift = 0, result = 0;
        do {
            b = encoded.charCodeAt(index++) - 63;
            result |= (b & 0x1f) << shift;
            shift += 5;
        } while (b >= 0x20);
        const dlat = ((result & 1) ? ~(result >> 1) : (result >> 1));
        lat += dlat;

        shift = 0;
        result = 0;
        do {
            b = encoded.charCodeAt(index++) - 63;
            result |= (b & 0x1f) << shift;
            shift += 5;
        } while (b >= 0x20);
        const dlng = ((result & 1) ? ~(result >> 1) : (result >> 1));
        lng += dlng;

        poly.push({ lat: lat / 1E5, lng: lng / 1E5 });
    }

    return poly;
}

function haversineDistance(coords1, coords2) {
    const toRad = (value) => (value * Math.PI) / 180;

    const lat1 = toRad(coords1.latitude);
    const lon1 = toRad(coords1.longitude);
    const lat2 = toRad(coords2.latitude);
    const lon2 = toRad(coords2.longitude);

    const R = 6371; // Radius of the Earth in kilometers
    const dLat = lat2 - lat1;
    const dLon = lon2 - lon1;

    const a =
        Math.sin(dLat / 2) * Math.sin(dLat / 2) +
        Math.cos(lat1) * Math.cos(lat2) *
        Math.sin(dLon / 2) * Math.sin(dLon / 2);

    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

    return R * c; // Distance in kilometers
}

function isWithin5km(latitude, longitude, locations) {
    const targetCoords = { latitude, longitude };
    return locations.filter(location => {
        const distance = haversineDistance(targetCoords, {
            latitude: parseFloat(location.latitude),
            longitude: parseFloat(location.longitude)
        });
        return distance <= 50; // Check if distance is within 5 km
    });
}


exports.updateCurrentLocation = async (req, res) => {
    const { directionId, lat, lng } = req.body;

    try {
        const direction = await Direction.findById(directionId);

        if (!direction) {
            return res.status(404).json({ message: "Direction not found" });
        }
        direction.currentLocation = { lat, lng };
        await direction.save();
        res.status(200).json({ message: "Current location updated successfully" });
    } catch (error) {
        res.status(400).json({ message: "Error updating current location", error: error.message });
    }
}
exports.removeDirection = async (req, res) => {
    const { directionId } = req.params;
    try {        
        const direction = await Direction.findByIdAndDelete(directionId);
        if(direction.vehicle != undefined){
            await Vehicle.updateOne({ _id: direction.vehicle }, { $unset: { assignedRoute: "" } });
        }
        if(direction.customerRequests.length>0 ){
            await CustomerRequest.deleteMany({ _id: { $in: direction.customerRequests } });
        }
        if (!direction) {
            return res.status(404).json({ message: "Direction not found" });
        }
        res.status(200).json({ message: "Direction deleted successfully" });
    } catch (error) {
        res.status(400).json({ message: "Error deleting direction", error: error.message });
    }
}

exports.ignoreTripByDriver = async (req, res) => {
    const { directionId } = req.params;
    try {        
        const direction = await Direction.findById(directionId);

        if (!direction) {
            return res.status(404).json({ message: "Direction not found" });
        }

        await Vehicle.updateOne({ _id: direction.vehicle }, { $unset: { assignedRoute: "" } });
        await Direction.updateOne({ _id: direction._id }, { $unset: { vehicle : "" } });

        
        res.status(200).json({ message: "Direction Ignored Successfully" });
    } catch (error) {
        res.status(400).json({ message: "Error Ignored direction", error: error.message });
    }
}

exports.startTripByDriver = async (req, res) => {
    const { directionId } = req.params;
    try {        
        const direction = await Direction.findById(directionId);

        if (!direction) {
            return res.status(404).json({ message: "Direction not found" });
        }

        await Direction.updateOne({ _id: direction._id }, { $set: { onTheWay : true } });

        
        res.status(200).json({ message: "Trip started Successfully" });
    } catch (error) {
        res.status(400).json({ message: "Error started trip", error: error.message });
    }
}

exports.getDirectionById = async (req, res) => {
    const { directionId } = req.params;
    try {        
        const direction = await Direction.findById(directionId).populate('vehicle').populate('createdBy');

        if (!direction) {
            return res.status(404).json({ message: "Direction not found" });
        }

        res.status(200).json({ message: "Direction found successfully", data: direction });
    } catch (error) {
        res.status(400).json({ message: "Error finding direction", error: error.message });
    }
}

exports.getVehicleFullCapasity = async (req, res) => {
    const { vehicleNo } = req.params;
    try {        
        const vehicle = await Vehicle.find( { licensePlateNumber: vehicleNo });

        if (!vehicle) {
            return res.status(404).json({ message: "Vehicle not found" });
        }

        res.status(200).json({ message: "Vehicle found successfully", data: vehicle[0].maximumLoadCapacity });
    } catch (error) {
        res.status(400).json({ message: "Error finding vehicle", error: error.message });
    }
}

exports.markTripAsFinished = async (req, res) => {
    const { directionId } = req.params;
    try {        
        const direction = await Direction.findById(directionId); 

        if (!direction) {
            return res.status(404).json({ message: "Direction not found" });
        }    
        await Direction.updateOne({ _id: direction._id }, { $set: { tripFinished : true } });
        await Vehicle.updateOne({ _id: direction.vehicle }, { $unset: { assignedRoute: "" } });
        res.status(200).json({ message: "Trip finished Successfully" });
    } catch (error) {
        res.status(400).json({ message: "Error finishing trip", error: error.message });
    }
}
