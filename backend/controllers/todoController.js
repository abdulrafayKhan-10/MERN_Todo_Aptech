const TodoTask = require('../models/todotaskModel');

const createTask = async (req, res) => {
    try {
      const { title, category, completed } = req.body;  // Extract category and completed from request body
      const newTask = new TodoTask({ 
        title,
        category,
        completed: completed || false  // Set default to false if not provided
      });
      await newTask.save();
      res.status(201).json({ message: "Task created successfully", task: newTask });
    } catch (error) {
      res.status(500).json({ message: "Error creating task", error: error.message });
    }
};
  

// Controller to get all to-do tasks
const getTasks = async (req, res) => {
    try {
        const tasks = await TodoTask.find({});
        res.status(200).json(tasks);
    } catch (error) {
        res.status(500).json({ message: "Error fetching tasks", error: error.message });
    }
};

// Controller to update a to-do task by ID
const updateTask = async (req, res) => {
    try {
        const { id } = req.params;
        const { title, completed } = req.body;
        const updatedTask = await TodoTask.findByIdAndUpdate(
            id,
            { title, completed },
            { new: true, runValidators: true }
        );
        if (!updatedTask) {
            return res.status(404).json({ message: "Task not found" });
        }
        res.status(200).json({ message: "Task updated successfully", task: updatedTask });
    } catch (error) {
        res.status(500).json({ message: "Error updating task", error: error.message });
    }
};

// Controller to delete a to-do task by ID
const deleteTask = async (req, res) => {
    try {
        const { id } = req.params;
        const deletedTask = await TodoTask.findByIdAndDelete(id);
        if (!deletedTask) {
            return res.status(404).json({ message: "Task not found" });
        }
        res.status(200).json({ message: "Task deleted successfully" });
    } catch (error) {
        res.status(500).json({ message: "Error deleting task", error: error.message });
    }
};

module.exports = {
    createTask,
    getTasks,
    updateTask,
    deleteTask
};
