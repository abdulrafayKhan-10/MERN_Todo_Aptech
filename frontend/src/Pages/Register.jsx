import React, { useState, useEffect } from 'react';
import { createUser } from '../api';  // Add getRoles to your API functions
import { toast } from 'react-toastify';

const Register = () => {
    const [userData, setUserData] = useState({
        name: '',
        email: '',
        age: '',
        password: '',
    });

    const [loading, setLoading] = useState(true);  // Loading state for roles

    useEffect(() => {
      
        setLoading(false);
      
    }, []);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setUserData({ ...userData, [name]: value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await createUser(userData);
            toast.success("User registered successfully!");
            setUserData({ name: '', email: '',age: '', password: ''});
        } catch (error) {
            if (error.code === 11000) { // 11000 is the error code for duplicate key
                return error.code(409).toast.error({ message: 'User already exists' });
              } else {
                toast.error('Failed to register user');
            }
            console.error(error);
        }
    };


    return (
        <div className="container mt-5">
            <h2 className="text-center">Register User</h2>
            <form onSubmit={handleSubmit} className="mt-4">                
                <div className="form-group mb-3">
                <div className="form-group mb-3">
                    <label htmlFor="name">name:</label>
                    <input
                        type="text"
                        name="name"
                        value={userData.name}
                        onChange={handleChange}
                        className="form-control"
                        required
                    />
                </div>
                <div className="form-group mb-3">
                    <label htmlFor="email">Email:</label>
                    <input
                        type="email"
                        name="email"
                        value={userData.email}
                        onChange={handleChange}
                        className="form-control"
                        required
                    />
                </div>
                <div className="form-group mb-3">
                    <label htmlFor="age">age:</label>
                    <input
                        type="number"
                        name="age"
                        value={userData.age}
                        onChange={handleChange}
                        className="form-control"
                        required
                    />
                </div>
                <div className="form-group mb-3">
                    <label htmlFor="password">password:</label>
                    <input
                        type="password"
                        name="password"
                        value={userData.password}
                        onChange={handleChange}
                        className="form-control"
                        required
                    />
                </div>
             
                </div>

                <button 
                    type="submit" 
                    className="btn btn-primary w-100"
                    disabled={loading}
                >
                    Register
                </button>
            </form>
        </div>
    );
};

export default Register;