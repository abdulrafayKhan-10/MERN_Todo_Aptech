import React from 'react';
import { Link } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUser, faBars } from '@fortawesome/free-solid-svg-icons';
import 'bootstrap/dist/css/bootstrap.min.css';

const Nav = ({ isAuthenticated, handleLogout }) => {
    return (
        <nav className="navbar navbar-expand-lg" style={{
            backgroundColor: '#2c3e50',  // Dark blue-gray background
            boxShadow: '0 2px 4px rgba(0,0,0,0.1)'  // Subtle shadow
        }}>
            <div className="container-fluid">
                <Link className="navbar-brand" to="/" style={{ color: '#ecf0f1', fontWeight: '600' }}>
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
                >
                    <FontAwesomeIcon icon={faBars} style={{ color: '#ecf0f1' }} />
                </button>
                <div className="collapse navbar-collapse" id="navbarNav">
                    <ul className="navbar-nav ms-auto">
                        <li className="nav-item">
                            <Link className="nav-link" to="/" style={{ color: '#ecf0f1' }}>Home</Link>
                        </li>
                        {!isAuthenticated ? (
                            <>
                                <li className="nav-item">
                                    <Link className="nav-link" to="/login" style={{ 
                                        color: '#ecf0f1',
                                        '&:hover': { color: '#3498db' }
                                    }}>Login</Link>
                                </li>
                                <li className="nav-item">
                                    <Link className="nav-link" to="/register" style={{ 
                                        color: '#ecf0f1',
                                        '&:hover': { color: '#3498db' }
                                    }}>Register</Link>
                                </li>
                            </>
                        ) : (
                            <>
                                <li className="nav-item">
                                    <Link className="nav-link" to="/profile" style={{ color: '#ecf0f1' }}>
                                        <FontAwesomeIcon icon={faUser} className="me-1" /> Profile
                                    </Link>
                                </li>
                                <li className="nav-item">
                                    <button
                                        className="nav-link btn btn-link"
                                        onClick={handleLogout}
                                        style={{
                                            color: '#e74c3c',  // Reddish color for logout
                                            border: 'none',
                                            background: 'transparent',
                                            cursor: 'pointer',
                                            padding: '8px 16px',
                                            '&:hover': {
                                                color: '#c0392b'
                                            }
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
