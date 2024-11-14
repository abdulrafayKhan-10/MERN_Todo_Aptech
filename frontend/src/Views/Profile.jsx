import React, { useEffect, useState } from 'react';
import { jwtDecode } from 'jwt-decode';
import { useNavigate } from 'react-router-dom';
import { FaUser, FaEnvelope, FaBirthdayCake } from 'react-icons/fa';

const Profile = () => {
  const [user, setUser] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      navigate('/login');
      return;
    }

    try {
      const decoded = jwtDecode(token);
      setUser(decoded);
    } catch (error) {
      console.error('Error decoding token:', error);
      navigate('/login');
    }
  }, [navigate]);

  if (!user) {
    return <div>Loading...</div>;
  }

  return (
    <div className="container mt-5">
      <div className="row justify-content-center">
        <div className="col-md-8 col-lg-6">
          <div className="card shadow-lg border-0 rounded-lg">
            <div className="card-body p-5">
              <h1 className="text-center mb-5" style={{ color: '#2c3e50', fontWeight: '600' }}>
                My Profile
              </h1>
              
              <div className="profile-info">
                <div className="info-item mb-4 p-4" style={{ 
                  backgroundColor: '#f8f9fa', 
                  borderRadius: '10px',
                  transition: 'all 0.3s'
                }}>
                  <div className="d-flex align-items-center mb-2">
                    <FaUser className="text-muted me-2" />
                    <label className="text-muted mb-0">Name</label>
                  </div>
                  <p className="mb-0" style={{ fontSize: '1.1rem', color: '#2c3e50' }}>
                    {user.name}
                  </p>
                </div>

                <div className="info-item mb-4 p-4" style={{ 
                  backgroundColor: '#f8f9fa', 
                  borderRadius: '10px',
                  transition: 'all 0.3s'
                }}>
                  <div className="d-flex align-items-center mb-2">
                    <FaEnvelope className="text-muted me-2" />
                    <label className="text-muted mb-0">Email</label>
                  </div>
                  <p className="mb-0" style={{ fontSize: '1.1rem', color: '#2c3e50' }}>
                    {user.email}
                  </p>
                </div>

                <div className="info-item mb-4 p-4" style={{ 
                  backgroundColor: '#f8f9fa', 
                  borderRadius: '10px',
                  transition: 'all 0.3s'
                }}>
                  <div className="d-flex align-items-center mb-2">
                    <FaBirthdayCake className="text-muted me-2" />
                    <label className="text-muted mb-0">Age</label>
                  </div>
                  <p className="mb-0" style={{ fontSize: '1.1rem', color: '#2c3e50' }}>
                    {user.age}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
