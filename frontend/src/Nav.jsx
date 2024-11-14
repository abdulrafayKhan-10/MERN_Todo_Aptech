import React from 'react';
import { Link } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUser, faBars } from '@fortawesome/free-solid-svg-icons';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min.js';

const Nav = ({ isAuthenticated, handleLogout }) => {
    return (
        <nav className="navbar navbar-expand-lg" style={{
            backgroundColor: '#3498db',  // Changed to match the primary blue
            boxShadow: '0 2px 8px rgba(0,0,0,0.15)',
            padding: '1rem 0'
        }}>
            <div className="container">
                <Link className="navbar-brand" to="/" style={{ 
                    color: '#ffffff', 
                    fontWeight: '700',
                    fontSize: '1.5rem',
                    letterSpacing: '0.5px'
                }}>
                    Todo App
                </Link>
                <button
                    className="navbar-toggler"
                    type="button"
                    data-bs-toggle="collapse"
                    data-bs-target="#navbarNav"
                    aria-controls="navbarNav"
                    aria-expanded="false"
                    aria-label="Toggle navigation"
                    style={{ border: '2px solid #ffffff' }}
                >
                    <FontAwesomeIcon icon={faBars} style={{ color: '#ffffff' }} />
                </button>
                <div className="collapse navbar-collapse" id="navbarNav">
                    <ul className="navbar-nav ms-auto align-items-center">
                        <li className="nav-item mx-2">
                            <Link className="nav-link" to="/" style={{ 
                                color: '#ffffff',
                                fontWeight: '500',
                                padding: '0.5rem 1rem',
                                borderRadius: '5px',
                                transition: 'all 0.3s'
                            }}>
                                Home
                            </Link>
                        </li>
                        {!isAuthenticated ? (
                            <>
                                <li className="nav-item mx-2">
                                    <Link className="nav-link btn btn-outline-light" to="/login" style={{ 
                                        fontWeight: '500',
                                        padding: '0.5rem 1.5rem',
                                        borderRadius: '5px',
                                        transition: 'all 0.3s'
                                    }}>
                                        Login
                                    </Link>
                                </li>
                                <li className="nav-item mx-2">
                                    <Link className="nav-link btn" to="/register" style={{ 
                                        backgroundColor: '#ffffff',
                                        color: '#3498db',
                                        fontWeight: '500',
                                        padding: '0.5rem 1.5rem',
                                        borderRadius: '5px',
                                        transition: 'all 0.3s'
                                    }}>
                                        Register
                                    </Link>
                                </li>
                            </>
                        ) : (
                            <>
                                <li className="nav-item mx-2">
                                    <Link className="nav-link btn btn-outline-light" to="/profile" style={{ 
                                        fontWeight: '500',
                                        padding: '0.5rem 1.5rem',
                                        borderRadius: '5px',
                                        transition: 'all 0.3s'
                                    }}>
                                        <FontAwesomeIcon icon={faUser} className="me-2" /> Profile
                                    </Link>
                                </li>
                                <li className="nav-item mx-2">
                                    <button
                                        className="nav-link btn"
                                        onClick={handleLogout}
                                        style={{
                                            backgroundColor: '#ffffff',
                                            color: '#e74c3c',
                                            fontWeight: '500',
                                            padding: '0.5rem 1.5rem',
                                            borderRadius: '5px',
                                            border: 'none',
                                            transition: 'all 0.3s'
                                        }}
                                    >
                                        Logout
                                    </button>
                                </li>
                            </>
                        )}
                    </ul>
                </div>
            </div>
        </nav>
    );
};

export default Nav;
