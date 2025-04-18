import React, { useState } from "react";
import axios from "axios";

const PackageForm = ({ setPackages = null }) => {
  const [formData, setFormData] = useState({
    packageName: "",
    description: "",
    price: "",
    serviceProvider: "",
  });
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    const token = localStorage.getItem('token');
    if (!token) {
      setError("Please login first");
      return;
    }

    try {
      const response = await axios.post(
        "http://localhost:5000/api/packages",
        formData,
        {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        }
      );
      
      if (setPackages) {
        setPackages(prev => [...prev, response.data]);
      }
      
      setFormData({
        packageName: "",
        description: "",
        price: "",
        serviceProvider: "",
      });
      setSuccess("Package created successfully!");
      alert("Package created successfully!");
    } catch (error) {
      setError(error.response?.data?.message || "Error creating package");
      console.error("Error adding package:", error);
      alert("Error creating package");
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      {error && <div className="alert alert-danger">{error}</div>}
      {success && <div className="alert alert-success">{success}</div>}
      <input 
        type="text" 
        name="packageName" 
        value={formData.packageName}
        placeholder="Package Name" 
        onChange={handleChange} 
        required 
      />
      <input 
        type="text" 
        name="description" 
        value={formData.description}
        placeholder="Description" 
        onChange={handleChange} 
        required 
      />
      <input 
        type="number" 
        name="price" 
        value={formData.price}
        placeholder="Price" 
        onChange={handleChange} 
        required 
      />
      <input 
        type="text" 
        name="serviceProvider" 
        value={formData.serviceProvider}
        placeholder="Service Provider" 
        onChange={handleChange} 
        required 
      />
      <button className="globalButton" type="submit">Add Package</button>
    </form>
  );
};

export default PackageForm;
