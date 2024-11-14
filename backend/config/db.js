const mongoose = require("mongoose");

const connectDB = async () => {
  try {
    const connection = await mongoose.connect(process.env.MONGO_URI);
    console.log(`Database host: ${connection.connection.host}`);
  } catch (error) {
    console.log(`💡 Error message: ${error.message}`);
    
        process.exit(1);
  }
}

module.exports = connectDB;