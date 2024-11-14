const User = require('../models/alluserModel');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

function registerUser(req, res) {
    const name = req.body.name;
    const email = req.body.email;
    const age = req.body.age;
    const password = req.body.password;

    User.findOne({ email: email })
        .then(foundUser => {
            if (foundUser) {
                return res.status(409).json({ 
                    message: 'Sorry, this email is already registered!' 
                });
            }

            bcrypt.hash(password, 10)
                .then(hashedPassword => {
                    let newUser = new User({
                        name: name,
                        email: email,
                        age: age,
                        password: hashedPassword
                    });

                    newUser.save()
                        .then(savedUser => {
                            res.status(201).json({ 
                                message: 'Welcome! Your account has been created',
                                user: savedUser 
                            });
                        })
                        .catch(err => {
                            res.status(500).json({ 
                                message: 'Something went wrong while saving user',
                                error: err.message 
                            });
                        });
                })
                .catch(err => {
                    res.status(500).json({ 
                        message: 'Password encryption failed',
                        error: err.message 
                    });
                });
        })
        .catch(err => {
            res.status(500).json({ 
                message: 'Error checking existing user',
                error: err.message 
            });
        });
}

function loginUser(req, res) {
    const email = req.body.email;
    const password = req.body.password;

    User.findOne({ email: email })
        .then(foundUser => {
            if (!foundUser) {
                return res.status(401).json({ 
                    message: 'No account found with this email' 
                });
            }

            bcrypt.compare(password, foundUser.password)
                .then(passwordMatch => {
                    if (!passwordMatch) {
                        return res.status(401).json({ 
                            message: 'Wrong password, please try again' 
                        });
                    }

                    let userData = {
                        userId: foundUser._id,
                        name: foundUser.name,
                        email: foundUser.email,
                        age: foundUser.age
                    };

                    let token = jwt.sign(
                        userData, 
                        process.env.JWT_SECRET, 
                        { expiresIn: '1h' }
                    );

                    res.json({ 
                        message: 'Login successful!',
                        token: token, 
                        user: userData 
                    });
                })
                .catch(err => {
                    res.status(500).json({ 
                        message: 'Error checking password',
                        error: err.message 
                    });
                });
        })
        .catch(err => {
            res.status(500).json({ 
                message: 'Error finding user',
                error: err.message 
            });
        });
}

module.exports = {
    registerUser,
    loginUser
};



