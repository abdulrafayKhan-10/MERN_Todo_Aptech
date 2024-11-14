const mongoose = require("mongoose");

// Define a schema for a to-do task
const todoTaskSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
    },
    completed: {
        type: Boolean,
        default: false,
    },
    createdAt: {
        type: Date,
        default: Date.now,
    }
});

// Export the model
module.exports = mongoose.model("TodoTask", todoTaskSchema);
