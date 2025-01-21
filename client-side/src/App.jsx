import React from "react";
import {
  BrowserRouter as Router,
  Route,
  Routes,
  Navigate,
} from "react-router-dom";
import UserForm from "./components/UserForm";
import Login from "./components/auth/Login";
import Signup from "./components/auth/Signup";
import AdminDashboard from "./components/AdminDashBoard";

const App = () => {
  return (
    <Router>
      <div className="app-container">
        <Routes>
          {/* Default route redirects to login */}
          <Route path="/" element={<Navigate to="/login" />} />

          {/* Public Routes */}
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />

          {/* Protected Routes */}
          <Route path="/admin" element={<AdminDashboard />} />
          <Route path="/submission" element={<UserForm />} />
        </Routes>
      </div>
    </Router>
  );
};

export default App;
