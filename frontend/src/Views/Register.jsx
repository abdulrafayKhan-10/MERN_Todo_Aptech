import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import axios from 'axios';

function registerNewUser(userInfo) {
    return axios.post('http://localhost:5000/api/user/register', userInfo);
}

function Register() {
    const navigate = useNavigate();
    
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [age, setAge] = useState('');
    const [password, setPassword] = useState('');
    const [isRegistering, setIsRegistering] = useState(false);

    function handleNameChange(e) {
        setName(e.target.value);
    }

    function handleEmailChange(e) {
        setEmail(e.target.value);
    }

    function handleAgeChange(e) {
        setAge(e.target.value);
    }

    function handlePasswordChange(e) {
        setPassword(e.target.value);
    }

    async function handleFormSubmit(e) {
        e.preventDefault();
        setIsRegistering(true);

        try {
            let userInfo = {
                name: name,
                email: email,
                age: age,
                password: password
            };

            await registerNewUser(userInfo);
            toast.success("Yay! Registration successful!");
            
            setName('');
            setEmail('');
            setAge('');
            setPassword('');
            
            navigate('/login');
        } catch (error) {
            toast.error("Oops! Registration failed. Please try again.");
            console.log("Registration error:", error);
        }

        setIsRegistering(false);
    }

    return (
        <div className="container mt-5">
            <div className="row justify-content-center">
                <div className="col-md-6 col-lg-5">
                    <div className="card shadow-lg border-0 rounded-lg">
                        <div className="card-body p-5">
                            <h2 className="text-center mb-4" style={{ color: '#2c3e50', fontWeight: '600' }}>
                                Create Account
                            </h2>
                            <form onSubmit={handleFormSubmit} className="mt-4">
                                <div className="form-group mb-4">
                                    <label className="form-label text-muted mb-2">Full Name</label>
                                    <input
                                        type="text"
                                        value={name}
                                        onChange={handleNameChange}
                                        className="form-control form-control-lg"
                                        style={{ backgroundColor: '#f8f9fa', border: '1px solid #e9ecef' }}
                                        required
                                    />
                                </div>

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
                                    <label className="form-label text-muted mb-2">Age</label>
                                    <input
                                        type="number"
                                        value={age}
                                        onChange={handleAgeChange}
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
                                    disabled={isRegistering}
                                >
                                    {isRegistering ? 'Creating Account...' : 'Register'}
                                </button>

                                <p className="text-center mt-4">
                                    Already have an account? <a href="/login" style={{ color: '#3498db' }}>Login here</a>
                                </p>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Register;