const express = require("express");
const app = express();
const cors = require("cors");
const dotenv = require("dotenv");
dotenv.config();
const userController = require("./controllers/userController");
const todoController = require("./controllers/todoController");
const connectDB = require("./config/db");
connectDB();

const corsOptions = {
    origin: 'http://localhost:3000',
    methods: ["GET", "POST", "PUT", "DELETE"], 
    allowedHeaders: ["Content-Type"], 
};

app.use(cors(corsOptions));

// Middleware
app.use(express.json());

// User Routes
app.route("/api/user/login").post(userController.loginUser);
app.route("/api/user/register").post(userController.registerUser);
app.route("/api/user/:id").post(userController.updateUser);

// Todo Routes (no authentication required)
app.route("/api/todo")
    .get(todoController.getTasks)
    .post(todoController.createTask);

app.route("/api/todo/:id")
    .put(todoController.updateTask)
    .delete(todoController.deleteTask);

app.listen(process.env.PORT, () => {
    console.log(`Server is running on port ${process.env.PORT}`);
});
