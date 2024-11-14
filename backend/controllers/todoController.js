const TodoTask = require('../models/todotaskModel');

async function createTask(req, res) {
    try {

        let taskTitle = req.body.title;
        let taskCategory = req.body.category;
        
        
        if (!taskTitle) {
            return res.status(400).json({
                message: "Hey! Task title cannot be empty"
            });
        }

      
        let newTask = new TodoTask({
            title: taskTitle,
            category: taskCategory,
            completed: false  // Tasks start as not completed
        });

       
        let savedTask = await newTask.save();
        
    
        res.status(201).json({
            message: "Yay! Task created successfully",
            task: savedTask
        });

    } catch (err) {
        console.log("Oops! Error creating task:", err);
        res.status(500).json({
            message: "Sorry! Something went wrong while creating the task"
        });
    }
}

async function getTasks(req, res) {
    try {
        let allTasks = await TodoTask.find();
        
        res.status(200).json(allTasks);

    } catch (err) {
        console.log("Oops! Error fetching tasks:", err);
        res.status(500).json({
            message: "Sorry! Couldn't get your tasks right now"
        });
    }
}

async function updateTask(req, res) {
    try {
        let taskId = req.params.id;
        let updates = req.body;

        let updatedTask = await TodoTask.findById(taskId);
        
        if (!updatedTask) {
            return res.status(404).json({
                message: "Hmm... Can't find that task"
            });
        }

        // Update the task properties
        if (updates.title) updatedTask.title = updates.title;
        if (updates.category) updatedTask.category = updates.category;
        if (typeof updates.completed === 'boolean') {
            updatedTask.completed = updates.completed;
        }

        // Save the changes
        await updatedTask.save();

        res.json({
            message: "Task updated!",
            task: updatedTask
        });

    } catch (err) {
        console.log("Oops! Error updating task:", err);
        res.status(500).json({
            message: "Sorry! Couldn't update the task"
        });
    }
}

async function deleteTask(req, res) {
    try {
        let taskId = req.params.id;

        // Try to find and delete the task
        let deletedTask = await TodoTask.findByIdAndDelete(taskId);
        
        // Check if task existed
        if (!deletedTask) {
            return res.status(404).json({
                message: "Can't find that task to delete"
            });
        }

        res.json({
            message: "Task deleted successfully!",
            deletedTask: deletedTask
        });

    } catch (err) {
        console.log("Oops! Error deleting task:", err);
        res.status(500).json({
            message: "Sorry! Couldn't delete the task"
        });
    }
}

module.exports = {
    createTask,    
    getTasks,     
    updateTask,   
    deleteTask     
};
