import React, { useState, useEffect, useContext } from 'react';
import AuthContext from '../contexts/AuthContext';
import { WebSocketContext } from '../contexts/WebSocketContext';
import axios from 'axios';
import '../assets/styles/MyProfile.css';
import profilePic from '../assets/icons/profilePic.png';

const MyProfile = () => {
  const [profileData, setProfileData] = useState({});
  const [newProfileName, setNewProfileName] = useState('');
  const [newRestaurantName, setNewRestaurantName] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const { signOut } = useContext(AuthContext);
  const { notifications } = useContext(WebSocketContext);

  useEffect(() => {
    const fetchProfileData = async () => {
      try {
        const response = await axios.get('http://localhost:5555/signup/profile', { withCredentials: true });
        console.log('Profile data:', response.data);
        setProfileData(response.data);
        setNewProfileName(response.data.name);
        setNewRestaurantName(response.data.restaurantName);
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
      setNewProfileName(data.name);
      setNewRestaurantName(data.restaurantName);
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

    if (newPassword && newPassword !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    try {
      const response = await axios.put('http://localhost:5555/signup/profile', {
        name: newProfileName,
        restaurantName: newRestaurantName,
        newPassword: newPassword ? newPassword : undefined
      }, { withCredentials: true });

      console.log('Profile updated successfully:', response.data);
      setProfileData(response.data.user);
      setSuccess('Profile updated successfully');
    } catch (error) {
      console.error('Error updating profile:', error);
      setError('Failed to update profile');
    }
  };

  const handleSignOut = () => {
    signOut();
  };

  return (
    <div className="my-profile">
      <h2 className="profile-page-title">My Profile</h2>
      <div className="profile-card">
        <img src={profilePic} alt="Profile" className="profile-picture" />
        <div className="profile-info">
          <h3 className="profile-name">{profileData.name}</h3>
          <p className="profile-email">{profileData.email}</p>
        </div>
        <div className="contact-info-profile">
         {/* <p className="contact-number">Contact Number: {profileData.contactNumber || 'Not Provided'}</p>*/}
        </div>
      </div>
      <form onSubmit={handleProfileUpdate} className="profile-details-form">
        <div className="detail-item">
          <label>New Profile Name</label>
          <input
            type="text"
            value={newProfileName}
            onChange={(e) => setNewProfileName(e.target.value)}
            placeholder="Enter your new profile name"
            required
          />
        </div>
        <div className="detail-item">
          <label>New Restaurant Name</label>
          <input
            type="text"
            value={newRestaurantName}
            onChange={(e) => setNewRestaurantName(e.target.value)}
            placeholder="Enter your new restaurant name"
            required
          />
        </div>
        <div className="detail-item">
          <label>New Password</label>
          <input
            type="password"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            placeholder="Enter your new password"
          />
        </div>
        <div className="detail-item">
          <label>Confirm New Password</label>
          <input
            type="password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            placeholder="Re-enter your new password"
          />
        </div>
        {error && <p className="error-message">{error}</p>}
        {success && <p className="success-message">{success}</p>}
        <button type="submit" className="update-profile-button">Update Profile</button>
      </form>
      <button className="sign-out-button" onClick={handleSignOut}>
        Sign Out
      </button>
    </div>
  );
};

export default MyProfile;
