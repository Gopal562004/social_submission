import axios from "axios";

// Fetch the BASE_URL from environment variables
const BASE_URL = process.env.REACT_APP_BASE_URL;

export const fetchAllForms = async (token) => {
  const response = await axios.get(`${BASE_URL}/forms/all`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return response.data;
};

export const fetchFormById = async (formId, token) => {
  const response = await axios.get(`${BASE_URL}/forms/${formId}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return response.data;
};

export const submitForm = async (formData, token) => {
  const response = await axios.post(`${BASE_URL}/forms`, formData, {
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "multipart/form-data",
    },
  });
  return response.data;
};

export const updateForm = async (formId, updatedData, token) => {
  const response = await axios.put(`${BASE_URL}/forms/${formId}`, updatedData, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return response.data;
};

export const deleteForm = async (formId, token) => {
  const response = await axios.delete(`${BASE_URL}/forms/${formId}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return response.data;
};
