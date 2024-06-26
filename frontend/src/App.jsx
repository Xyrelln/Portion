import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Header from './components/Header';
import Sidebar from './components/Sidebar';
import Dashboard from './components/Dashboard';
import MyOrders from './components/MyOrders';
import MenuItems from './components/MenuItems';
import Transactions from './components/Transactions';
import MyProfile from './components/MyProfile';
import Reports from './components/Reports';
import Settings from './components/Settings';
import Login from './components/Login';
import Signup from './components/Signup';
import EmailVerification from './components/EmailVerification';
import ContactUs from './components/ContactUs';
import NotificationBar from './components/NotificationBar';
import { AuthProvider } from './contexts/AuthContext';
import { WebSocketProvider } from './contexts/WebSocketContext';
import ProtectedRoute from './ProtectedRoute';
import './App.css';

const AppContent = () => {
  return (
    <Routes>
      <Route path="/owner/login" element={<Login />} />
      <Route path="/owner/signup" element={<Signup />} />
      <Route path="/owner/email-verification" element={<EmailVerification />} />
      <Route path="/owner/contact-us" element={<ContactUs />} />
      <Route element={<ProtectedRoute />}>
        <Route
          path="/owner/*"
          element={
            <>
              <Header />
              <NotificationBar />
              <div className="main-wrapper">
                <Sidebar />
                <div className="content">
                  <Routes>
                    <Route path="" element={<Dashboard />} />
                    <Route path="dashboard" element={<Dashboard />} />
                    <Route path="my-orders" element={<MyOrders />} />
                    <Route path="menu-items" element={<MenuItems />} />
                    <Route path="transactions" element={<Transactions />} />
                    <Route path="my-profile" element={<MyProfile />} />
                    <Route path="reports" element={<Reports />} />
                    <Route path="settings" element={<Settings />} />
                    <Route path="contact-us" element={<ContactUs />} />
                  </Routes>
                </div>
              </div>
            </>
          }
        />
      </Route>
    </Routes>
  );
};

const App = () => {
  return (
    <AuthProvider>
      <WebSocketProvider>
        <Router>
          <div className="App">
            <AppContent />
          </div>
        </Router>
      </WebSocketProvider>
    </AuthProvider>
  );
};

export default App;