import React, { useState, useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { fetchProfile, updateProfile } from '../services/api';
import AuthContext from '../contexts/AuthContext';
import { WebSocketContext } from '../contexts/WebSocketContext';
import '../assets/styles/MyProfile.css';

const MyProfile = () => {
  const [profileData, setProfileData] = useState({});
  const [restaurantData, setRestaurantData] = useState({});
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
        const response = await fetchProfile();
        console.log('Fetched profile data:', response);
        setProfileData(response.user);
        setRestaurantData(response.restaurant || {});
        setNewProfileName(response.user.name || '');
        setNewRestaurantName(response.restaurant?.name || '');
      } catch (error) {
        console.error('Error fetching profile data:', error);
      }
    };

    fetchProfileData();
  }, []);

  useEffect(() => {
    const profileUpdateHandler = (data) => {
      console.log('Profile updated via WebSocket:', data);
      setProfileData(data.user);
      setRestaurantData(data.restaurant || {});
      setNewProfileName(data.user.name || '');
      setNewRestaurantName(data.restaurant?.name || '');
      setRestaurantImage(data.restaurantImage); // Reset the image input field
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

      const response = await updateProfile(formData);
      console.log('Profile updated successfully:', response);
      setProfileData(response.user);
      setRestaurantData(response.restaurant || {});
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
    navigate('/owner/contact-us?subject=Request Password Change');
  };

  return (
    <div className="my-profile">
      <h2 className="profile-page-title">My Profile</h2>
      <div className="profile-card">
        <div className="profile-info">
          <h3 className="profile-name">{`Profile Name: ${profileData.name}`}</h3>
          <p className="profile-email">{`Profile Email: ${profileData.email}`}</p>
        </div>
        {restaurantData.img && (
          <div className="restaurant-image-container">
            <img src={`data:image/${restaurantData.imgExtension};base64,${restaurantData.img}`} alt="Restaurant" className="restaurant-image" />
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
