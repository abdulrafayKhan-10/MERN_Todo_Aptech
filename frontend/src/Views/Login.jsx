import React, { useState } from 'react';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

function sendLoginRequest(userInfo) {
    return axios.post('http://localhost:5000/api/user/login', userInfo)
        .then(response => {
            if (response.data.token) {
                localStorage.setItem('token', response.data.token);
                localStorage.setItem('userData', JSON.stringify(response.data.user));
            }
            return response;
        })
        .catch(error => {
            console.log('Login failed:', error);
            throw error;
        });
}

function Login({ setIsAuthenticated }) {
    const navigate = useNavigate();
    
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [isLoggingIn, setIsLoggingIn] = useState(false);

    function handleEmailChange(e) {
        setEmail(e.target.value);
    }

    function handlePasswordChange(e) {
        setPassword(e.target.value);
    }

    function handleFormSubmit(e) {
        e.preventDefault();
        setIsLoggingIn(true);

        let userInfo = {
            email: email,
            password: password
        };

        sendLoginRequest(userInfo)
            .then(() => {
                toast.success('Welcome back!');
                setIsAuthenticated(true);
                navigate('/');
            })
            .catch(error => {
                if (error.response && error.response.status === 401) {
                    toast.error('Wrong email or password');
                } else {
                    toast.error('Something went wrong, please try again');
                }
            })
            .finally(() => {
                setIsLoggingIn(false);
            });
    }

    return (
        <div className="container mt-5">
            <div className="row justify-content-center">
                <div className="col-md-6 col-lg-5">
                    <div className="card shadow-lg border-0 rounded-lg">
                        <div className="card-body p-5">
                            <h2 className="text-center mb-4" style={{ color: '#2c3e50', fontWeight: '600' }}>
                                Welcome Back
                            </h2>
                            
                            <form onSubmit={handleFormSubmit} className="mt-4">
                                <div className="form-group mb-4">
                                    <label className="form-label text-muted mb-2">Email Address</label>
                                    <input
                                        type="email"
                                        value={email}
                                        onChange={handleEmailChange}
                                        className="form-control form-control-lg"
                                        style={{ backgroundColor: '#f8f9fa', border: '1px solid #e9ecef' }}
                                        required
                                    />
                                </div>

                                <div className="form-group mb-4">
                                    <label className="form-label text-muted mb-2">Password</label>
                                    <input
                                        type="password"
                                        value={password}
                                        onChange={handlePasswordChange}
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
                                    disabled={isLoggingIn}
                                >
                                    {isLoggingIn ? 'Signing In...' : 'Sign In'}
                                </button>

                                <p className="text-center mt-4">
                                    Need an account? <a href="/register" style={{ color: '#3498db' }}>Register here</a>
                                </p>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Login;
