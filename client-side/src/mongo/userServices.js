import axios from "axios";

// Base API URL from .env file
const BASE_URL = process.env.REACT_APP_BASE_URL + "/users";

// Login API for users
export const loginUser = async (email, password) => {
  const response = await axios.post(`${BASE_URL}/login`, { email, password });
  return response.data; // Return response data
};

// Login API for admin
export const loginAdmin = async (email, password) => {
  const response = await axios.post(`${BASE_URL}/adminlogin`, {
    email,
    password,
  });
  return response.data; // Return response data
};

// Signup API
export const signup = async (email, password, role) => {
  try {
    const response = await axios.post(`${BASE_URL}/signup`, {
      email,
      password,
    });

    return response.data; // Return the response data (including token)
  } catch (error) {
    throw new Error("Signup failed. Please try again.");
  }
};
