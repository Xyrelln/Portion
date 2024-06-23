import React, { useState, useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import AuthContext from '../contexts/AuthContext';
import { WebSocketContext } from '../contexts/WebSocketContext';
import axios from 'axios';
import '../assets/styles/MyProfile.css';
// import profilePic from '../assets/icons/profilePic.png';

const MyProfile = () => {
  const [profileData, setProfileData] = useState({});
  const [newProfileName, setNewProfileName] = useState('');
  const [newRestaurantName, setNewRestaurantName] = useState('');
  const [restaurantImage, setRestaurantImage] = useState(null); // State for the restaurant image
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const { signOut } = useContext(AuthContext);
  const { notifications } = useContext(WebSocketContext);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchProfileData = async () => {
      try {
        const response = await axios.get('hhttp://107.175.133.12:5555/signup/profile', { withCredentials: true });
        console.log('Profile data:', response.data);
        setProfileData(response.data);
        setNewProfileName(response.data.name || '');
        setNewRestaurantName(response.data.restaurantName || '');
      } catch (error) {
        console.error('Error fetching profile data:', error);
      }
    };

    fetchProfileData();
  }, []);

  useEffect(() => {
    const profileUpdateHandler = (data) => {
      console.log('Profile updated:', data);
      setProfileData(data);
      setNewProfileName(data.name || '');
      setNewRestaurantName(data.restaurantName || '');
      setSuccess('Profile updated via WebSocket');
    };

    notifications.forEach((notification) => {
      if (notification.type === 'profileUpdated') {
        profileUpdateHandler(notification.data);
      }
    });
  }, [notifications]);

  const handleProfileUpdate = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    try {
      const formData = new FormData();
      if (newProfileName) formData.append('name', newProfileName);
      if (newRestaurantName) formData.append('restaurantName', newRestaurantName);
      if (restaurantImage) {
        formData.append('restaurantImage', restaurantImage);
      }

      const response = await axios.put('http://localhost:5555/signup/profile', formData, {
        withCredentials: true,
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      console.log('Profile updated successfully:', response.data);
      setProfileData(response.data);
      setSuccess('Profile updated successfully');
    } catch (error) {
      console.error('Error updating profile:', error);
      setError('Failed to update profile');
    }
  };

  const handleImageChange = (e) => {
    setRestaurantImage(e.target.files[0]);
  };

  const handleSignOut = () => {
    signOut();
  };

  const handleRequestPasswordChange = () => {
    navigate('/contact-us?subject=Request Password Change');
  };

  return (
    <div className="my-profile">
      <h2 className="profile-page-title">My Profile</h2>
      <div className="profile-card">
        <div className="profile-info">
          <h3 className="profile-name">{`Profile Name: ${profileData.name}`}</h3>
          <p className="profile-email">{`Profile Email: ${profileData.email}`}</p>
        </div>
        {profileData.restaurantImage && (
          <div className="restaurant-image-container">
            <img src={`http://localhost:5555/uploads/${profileData.restaurantImage}`} alt="Restaurant" className="restaurant-image" />
            <p className="image-label">Restaurant Image</p>
          </div>
        )}
      </div>
      <form onSubmit={handleProfileUpdate} className="profile-details-form">
        <div className="detail-item">
          <label>New Profile Name</label>
          <input
            type="text"
            value={newProfileName}
            onChange={(e) => setNewProfileName(e.target.value)}
            placeholder="Enter your new profile name"
          />
        </div>
        <div className="detail-item">
          <label>New Restaurant Name</label>
          <input
            type="text"
            value={newRestaurantName}
            onChange={(e) => setNewRestaurantName(e.target.value)}
            placeholder="Enter your new restaurant name"
          />
        </div>
        <div className="detail-item">
          <label>Restaurant Image</label>
          <input type="file" accept="image/*" onChange={handleImageChange} />
        </div>
        {error && <p className="error-message">{error}</p>}
        {success && <p className="success-message">{success}</p>}
        <div className="button-group">
          <button type="submit" className="button-35 update-profile-button">Update Profile</button>
          <button type="button" className="button-35 sign-out-button" onClick={handleSignOut}>Sign Out</button>
          <button type="button" className="button-35 request-password-change-button" onClick={handleRequestPasswordChange}>Request Password Change</button>
        </div>
      </form>
    </div>
  );
};

export default MyProfile;
