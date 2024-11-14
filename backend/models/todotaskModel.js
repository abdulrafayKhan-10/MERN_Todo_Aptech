const mongoose = require("mongoose");

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
    },
    category: {
        type: String,
        default: "Uncategorized",
    }
});

module.exports = mongoose.model("TodoTask", todoTaskSchema);
