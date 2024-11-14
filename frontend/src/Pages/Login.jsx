import React, { useState } from 'react';
import { loginUser } from '../api';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';

const Login = ({ setIsAuthenticated }) => {
    const [loginData, setLoginData] = useState({
        email: '',
        password: ''
    });

    const navigate = useNavigate();

    const handleChange = (e) => {
        const { name, value } = e.target;
        setLoginData({ ...loginData, [name]: value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await loginUser(loginData);
            toast.success('Login successful!');
            setIsAuthenticated(true);
            navigate('/');
        } catch (error) {
            if (error.response && error.response.status === 401) {
                toast.error('Invalid credentials');
            } else {
                toast.error('Failed to login');
            }
            console.error('Login error:', error);
        }
    };

    return (
        <div className="container mt-5">
            <div className="row justify-content-center">
                <div className="col-md-6 col-lg-5">
                    <div className="card shadow-lg border-0 rounded-lg">
                        <div className="card-body p-5">
                            <h2 className="text-center mb-4" style={{ color: '#2c3e50', fontWeight: '600' }}>
                                Welcome Back
                            </h2>
                            <form onSubmit={handleSubmit} className="mt-4">
                                <div className="form-group mb-4">
                                    <label htmlFor="email" className="form-label text-muted mb-2">Email Address</label>
                                    <input
                                        type="email"
                                        name="email"
                                        value={loginData.email}
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
                                        value={loginData.password}
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
                                >
                                    Sign In
                                </button>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Login;
