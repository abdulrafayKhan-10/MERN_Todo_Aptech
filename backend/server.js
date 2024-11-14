
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


app.use(express.json());

app.post("/api/user/login", userController.loginUser);
app.post("/api/user/register", userController.registerUser);

app.route("/api/todo")
    .get(todoController.getTasks)
    .post(todoController.createTask);

app.route("/api/todo/:id")
    .put(todoController.updateTask)   
    .delete(todoController.deleteTask); 

    
const PORT = process.env.PORT || 5000; 
app.listen(PORT, () => {
    console.log(`Server is up and running on port ${PORT}`);
    
});

