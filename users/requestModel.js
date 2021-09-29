const mongoose = require('mongoose');

const requestSchema = new mongoose.Schema({
    from: {
        type: mongoose.Types.ObjectId,
        required: [true, "A sender is required"],
        ref: "User"
    },
    to: {
        type: mongoose.Types.ObjectId,
        required: [true, "A recipient is required"],
        ref: "User"
    },
    status: {
        type: String,
        enum: ["pending", "declined", "accepted", "spam"],
        default: "pending"
    }
}, {timestamps: {createdAt: "createdAt", updatedAt: "updatedAt"}});

const requestModel = mongoose.model("Request", requestSchema);

module.exports = requestModel;