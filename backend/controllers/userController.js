const User = require('../models/userModel');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const registerUser = async (req, res) => {
  try {
    const { name, email, age, password } = req.body;

    // Log incoming data
    console.log('Incoming data:', req.body);

    // Check if email already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(409).json({ message: 'User already exists' });
    }

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create and save the new user
    const user = new User({ name, email,age, password: hashedPassword,});
    await user.save();

    res.status(201).json({ message: 'User created successfully', user });
  } catch (error) {
    console.error('Error creating user:', error);

    // Check if it's a validation error
    if (error.name === 'ValidationError') {
      return res.status(400).json({ message: 'Validation error', error: error.message });
    }

    res.status(500).json({ message: 'Error creating user', error: error.message });
  }
};

// Update a user by ID
const updateUser = async (req, res) => {
  try {
    const {name, email, age, password } = req.body;
    let updatedData = { name, email, age };

    // Only hash the password if it's provided in the update
    if (password) {
      const hashedPassword = await bcrypt.hash(password, 10);
      updatedData.password = hashedPassword;
    }

    const user = await User.findByIdAndUpdate(req.params.id, updatedData, {
      new: true,
      runValidators: true,
    });
    if (!user) return res.status(404).json({ message: 'User not found' });
    res.status(200).json({ message: 'User updated successfully', user });
  } catch (error) {
    res.status(400).json({ message: 'Error updating user', error: error.message });
  }
};



const loginUser = async (req, res) => {
  const { email, password } = req.body;
  try {
      const user = await User.findOne({ email });
      if (!user) {
          return res.status(401).json({ message: 'Invalid credentials' });
      }
      const isMatch = await bcrypt.compare(password, user.password);
      if (!isMatch) {
          return res.status(401).json({ message: 'Invalid credentials' });
      }
      
      // Create payload with more user data
      const payload = {
          userId: user._id,
          name: user.name,
          email: user.email,
          age: user.age
      };
      
      const token = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '1h' });
      res.json({ token, user: payload }); // Optionally return user data alongside token
  } catch (error) {
      res.status(500).json({ message: 'Server error', error: error.message });
  }
};

module.exports = {
  registerUser,
  updateUser,
  loginUser
};



