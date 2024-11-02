// src/components/HomePage.jsx
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const HomePage = () => {
  const [user, setUser] = useState(null);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    // Check if the user is authenticated
    fetch(`${import.meta.env.VITE_API_URL}/auth/check-auth`, {
      method: 'GET',
      credentials: 'include', // Include cookies for authentication
    })
      .then(response => {
        if (response.status === 304) {
          // User is authenticated
          fetch(`${import.meta.env.VITE_API_URL}/home/userinfo`, {
            method: 'GET',
            credentials: 'include', // Include cookies for authentication
          })
            .then(response => {
              if (response.ok) {
                return response.json();
              } else {
                throw new Error('Failed to fetch user info');
              }
            })
            .then(data => {
              setUser(data.user); // Set user data to state
            })
            .catch(error => {
              setError(error.message); // Handle errors
            });
        } else {
          // User is not authenticated, redirect to open page
          navigate('/open');
        }
      })
      .catch(error => {
        setError('Failed to authenticate'); // Handle check-auth failure
        navigate('/open');
      });
  }, [navigate]);

  const handleLogout = () => {
    fetch(`${import.meta.env.VITE_API_URL}/auth/logout`, {
      method: 'GET',
      credentials: 'include', // Include cookies for authentication
    })
      .then(response => {
        if (response.ok) {
          navigate("/open");
        } else {
          throw new Error('Logout failed');
        }
      })
      .catch(error => {
        console.error("Logout failed", error);
      });
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '100vh' }}>
      <h1>Welcome to the Home Page</h1>
      {error && <p style={{ color: 'red' }}>{error}</p>}
      {user ? (
        <div>
          <h2>User Information</h2>
          <p><strong>Name:</strong> {user.name}</p>
          <p><strong>Email:</strong> {user.email}</p>
          <p><strong>Google ID:</strong> {user.googleId}</p>
          <p><strong>Photo URL:</strong> <img src={user.photo} alt="User Photo" style={{ width: '100px', borderRadius: '50%' }} /></p>
        </div>
      ) : (
        <p>Loading user information...</p>
      )}
      <button 
        onClick={handleLogout} 
        style={{ padding: '10px 20px', fontSize: '16px', cursor: 'pointer', marginTop: '20px' }}>
        Log out
      </button>
    </div>
  );
};

export default HomePage;
