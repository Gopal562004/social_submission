import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom"; // Import for navigation
import { fetchAllForms, deleteForm } from "../mongo/adminServices";

const AdminDashboard = () => {
  const [forms, setForms] = useState([]);
  const [error, setError] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalImage, setModalImage] = useState("");

  const navigate = useNavigate(); // React Router hook for navigation
  const token = localStorage.getItem("social_token"); // Replace with your token storage logic

  useEffect(() => {
    const fetchForms = async () => {
      try {
        const data = await fetchAllForms(token);
        setForms(data);
      } catch (err) {
        setError(err.message);
      }
    };
    fetchForms();
  }, [token]);

  const handleDelete = async (formId) => {
    try {
      await deleteForm(formId, token);
      setForms(forms.filter((form) => form._id !== formId));
    } catch (err) {
      setError(err.message);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("social_token"); // Remove token from localStorage
    navigate("/login", { replace: true }); // Redirect to login page
  };

  const openModal = (image) => {
    setModalImage(image);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setModalImage("");
    setIsModalOpen(false);
  };

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      {/* Header with Logout Option */}
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Admin Dashboard</h1>
        <button
          onClick={handleLogout}
          className="bg-red-500 hover:bg-red-600 text-white py-2 px-4 rounded"
        >
          Logout
        </button>
      </div>

      {error && <p className="text-center text-red-500 mb-4">{error}</p>}

      <div className="overflow-x-auto">
        <table className="min-w-full table-auto bg-white shadow-md rounded-lg overflow-hidden">
          <thead>
            <tr className="bg-gray-200 text-gray-700 text-left">
              <th className="py-3 px-4">Name</th>
              <th className="py-3 px-4">Handle</th>
              <th className="py-3 px-4">Images</th>
              <th className="py-3 px-4">User Email</th>
              <th className="py-3 px-4">Actions</th>
            </tr>
          </thead>
          <tbody>
            {forms.map((form) => (
              <tr
                key={form._id}
                className="border-b border-gray-200 hover:bg-gray-50"
              >
                <td className="py-3 px-4">{form.name}</td>
                <td className="py-3 px-4">{form.handle}</td>
                <td className="py-3 px-4 flex space-x-2">
                  {form.images.length > 0 ? (
                    form.images.map((url, index) => (
                      <img
                        key={index}
                        src={url}
                        alt="Uploaded"
                        className="w-12 h-12 rounded object-cover border cursor-pointer"
                        onClick={() => openModal(url)}
                      />
                    ))
                  ) : (
                    <span className="text-gray-500">No Images</span>
                  )}
                </td>
                <td className="py-3 px-4">{form.user.email}</td>
                <td className="py-3 px-4">
                  <button
                    onClick={() => handleDelete(form._id)}
                    className="text-white bg-red-500 hover:bg-red-600 py-2 px-4 rounded mr-2"
                  >
                    Delete
                  </button>
                  <button className="text-white bg-blue-500 hover:bg-blue-600 py-2 px-4 rounded">
                    Edit
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Image Zoom Modal */}
      {isModalOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
          onClick={closeModal}
        >
          <div
            className="relative bg-white p-4 rounded shadow-lg"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              className="absolute top-2 right-2 text-black text-lg font-bold"
              onClick={closeModal}
            >
              &times;
            </button>
            <img
              src={modalImage}
              alt="Zoomed"
              className="max-w-full max-h-[90vh] rounded"
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminDashboard;
