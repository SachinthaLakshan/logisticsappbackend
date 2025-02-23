const CustomerRequest = require("../models/customerRequests.model");
const Direction = require("../models/direction.model");



exports.createCustomerRequest = async (req, res) => {
    try {
        const availableVehicles = await CustomerRequest.find({ requestedTo: req.body.requestedTo,requestedBy:req.body.requestedBy });
        if(availableVehicles.length>0){
            return res.status(400).json({ message: "You have already requested this vehicle" });
        }
        const customerRequest = await CustomerRequest.create({...req.body,driverAccepted:false});
        await Direction.updateOne({ _id: req.body.route }, { $push: { customerRequests:customerRequest._id } });
        res.status(200).json(customerRequest);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }

}

exports.getCustomerRequestsByDriver = async (req, res) => {
    try {
        const customerRequests = await CustomerRequest.find({ requestedTo: req.params.driverId,driverAccepted:false }).populate('route').populate('vehicle').populate('requestedBy').populate('requestedTo');
        res.status(200).json(customerRequests);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
    
}

exports.acceptCustomerRequest = async (req, res) => {
    try {
        const customerRequest = await CustomerRequest.findById(req.params.id);
        if (!customerRequest) {
            return res.status(404).json({ message: "Customer Request not found" });
        }
        customerRequest.driverAccepted = true;
        await customerRequest.save();
        await Direction.updateOne({ _id: req.params.routeId }, { $push: { waypoints:req.body.address } });
        res.status(200).json({ message: "Customer Request accepted successfully" });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
    
}

exports.removeCustomerRequest = async (req, res) => {
    try {
        
        const customerRequest = await CustomerRequest.findByIdAndDelete(req.params.id);
        await Direction.updateOne({ _id: customerRequest.route._id }, { $pull: { customerRequests: req.params.id } });
        if (!customerRequest) {
            return res.status(404).json({ message: "Customer Request not found" });
        }
        res.status(200).json({ message: "Customer Request deleted successfully" });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}