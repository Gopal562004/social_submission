import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { loginUser, loginAdmin } from "../../mongo/userServices"; // Import the API services

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(null);
  const [isAdmin, setIsAdmin] = useState(false); // State to toggle between user and admin login
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = isAdmin
        ? await loginAdmin(email, password) // Call the admin login API
        : await loginUser(email, password); // Call the user login API

      if (response.token) {
        // Store token in localStorage
        localStorage.setItem("social_token", response.token);

        // Redirect based on user role
        if (isAdmin) {
          navigate("/admin", { replace: true }); // Redirect to admin dashboard if admin
        } else {
          navigate("/submission", { replace: true }); // Redirect to user form for regular users
        }
      } else {
        setError("Login failed. Please try again.");
      }
    } catch (error) {
      console.error(error);
      setError("Invalid email or password");
    }
  };

  const toggleLoginForm = () => {
    setIsAdmin(!isAdmin);
    setEmail(""); // Reset email input when switching forms
    setPassword(""); // Reset password input when switching forms
    setError(null); // Reset error message when switching forms
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="bg-white p-8 rounded-lg shadow-lg w-full sm:w-96">
        <h2 className="text-2xl font-semibold text-center text-gray-700 mb-6">
          {isAdmin ? "Admin Login" : "User Login"}
        </h2>
        {error && (
          <div className="bg-red-100 text-red-700 p-3 rounded-lg mb-4">
            {error}
          </div>
        )}
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label
              htmlFor="email"
              className="block text-sm font-medium text-gray-600"
            >
              Email
            </label>
            <input
              type="email"
              id="email"
              className="mt-2 p-3 w-full border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-600"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter your email"
              required
            />
          </div>
          <div className="mb-6">
            <label
              htmlFor="password"
              className="block text-sm font-medium text-gray-600"
            >
              Password
            </label>
            <input
              type="password"
              id="password"
              className="mt-2 p-3 w-full border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-600"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter your password"
              required
            />
          </div>
          <button
            type="submit"
            className="w-full bg-indigo-600 text-white p-3 rounded-md hover:bg-indigo-700 transition duration-300"
          >
            Login as {isAdmin ? "Admin" : "User"}
          </button>
        </form>

        {/* Toggle between User and Admin Login */}
        <div className="mt-4 text-center">
          <button
            onClick={toggleLoginForm}
            className="text-sm text-indigo-600 hover:text-indigo-700"
          >
            {isAdmin ? "Switch to User Login" : "Login as Admin"}
          </button>
        </div>

        <p className="mt-4 text-center text-sm text-gray-500">
          Don't have an account?{" "}
          <a href="/signup" className="text-indigo-600 hover:text-indigo-700">
            Sign Up
          </a>
        </p>
      </div>
    </div>
  );
};

export default Login;
