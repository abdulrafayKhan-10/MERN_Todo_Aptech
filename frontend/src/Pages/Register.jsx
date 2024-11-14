import React, { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import axios from 'axios';

const registerUser = async (userData) => {
    try {
        const response = await axios.post(`http://localhost:5000/api/user/register`, userData);
        return response;
    } catch (error) {
        console.error('Error registering user:', error);
        throw error;
    }
};


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
            await registerUser(userData);
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
            <div className="row justify-content-center">
                <div className="col-md-6 col-lg-5">
                    <div className="card shadow-lg border-0 rounded-lg">
                        <div className="card-body p-5">
                            <h2 className="text-center mb-4" style={{ color: '#2c3e50', fontWeight: '600' }}>
                                Create Account
                            </h2>
                            <form onSubmit={handleSubmit} className="mt-4">
                                <div className="form-group mb-4">
                                    <label htmlFor="name" className="form-label text-muted mb-2">Full Name</label>
                                    <input
                                        type="text"
                                        name="name"
                                        value={userData.name}
                                        onChange={handleChange}
                                        className="form-control form-control-lg"
                                        style={{ backgroundColor: '#f8f9fa', border: '1px solid #e9ecef' }}
                                        required
                                    />
                                </div>
                                <div className="form-group mb-4">
                                    <label htmlFor="email" className="form-label text-muted mb-2">Email Address</label>
                                    <input
                                        type="email"
                                        name="email"
                                        value={userData.email}
                                        onChange={handleChange}
                                        className="form-control form-control-lg"
                                        style={{ backgroundColor: '#f8f9fa', border: '1px solid #e9ecef' }}
                                        required
                                    />
                                </div>
                                <div className="form-group mb-4">
                                    <label htmlFor="age" className="form-label text-muted mb-2">Age</label>
                                    <input
                                        type="number"
                                        name="age"
                                        value={userData.age}
                                        onChange={handleChange}
                                        className="form-control form-control-lg"
                                        style={{ backgroundColor: '#f8f9fa', border: '1px solid #e9ecef' }}
                                        required
                                    />
                                </div>
                                <div className="form-group mb-4">
                                    <label htmlFor="password" className="form-label text-muted mb-2">Password</label>
                                    <input
                                        type="password"
                                        name="password"
                                        value={userData.password}
                                        onChange={handleChange}
                                        className="form-control form-control-lg"
                                        style={{ backgroundColor: '#f8f9fa', border: '1px solid #e9ecef' }}
                                        required
                                    />
                                </div>

                                <button 
                                    type="submit" 
                                    className="btn btn-primary w-100 py-3 mt-3"
                                    style={{
                                        backgroundColor: '#3498db',
                                        border: 'none',
                                        fontSize: '1.1rem',
                                        fontWeight: '500',
                                        transition: 'all 0.3s'
                                    }}
                                    disabled={loading}
                                >
                                    Register
                                </button>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Register;