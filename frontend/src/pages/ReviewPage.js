import React, { useState } from "react";
import axios from "axios";
import "../styles/ReviewPage.css";

const ReviewPage = () => {
    // Use a valid MongoDB ObjectId format for serviceId 
    // (24 hex characters - this is just a placeholder)
    const [formData, setFormData] = useState({
        name: "",
        description: "",
        image: null,
        rating: 0,
        serviceId: "6405fb334ac30232d8c34671" // Temporary valid ObjectId format
    });
    
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    const handleImageChange = (e) => {
        setFormData({ ...formData, image: e.target.files[0] });
    };

    const handleRating = (ratingValue) => {
        setFormData({ ...formData, rating: ratingValue });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError("");
        setSuccess("");
    
        if (!formData.description || formData.rating === 0) {
            setError("Please fill all required fields and select a rating!");
            setLoading(false);
            return;
        }
    
        // Get the token from localStorage
        const token = localStorage.getItem('token');
        if (!token) {
            setError("Authentication required. Please log in again.");
            setLoading(false);
            return;
        }
    
        try {
            // Create a simple JSON object instead of FormData
            const reviewData = {
                serviceId: formData.serviceId,
                comment: formData.description,
                rating: Number(formData.rating)
            };
    
            console.log("Sending review data:", reviewData);
            
            const response = await axios.post(
                "http://localhost:5000/api/reviews",
                reviewData,
                {
                    headers: {
                        "Authorization": `Bearer ${token}`
                    }
                }
            );
    
            console.log("Review response:", response.data);
            setSuccess("Review posted successfully!");
            setFormData({
                name: "",
                description: "",
                image: null,
                rating: 0,
                serviceId: "6405fb334ac30232d8c34671" // Keep the same ObjectId
            });
        } catch (error) {
            console.error("Error submitting review:", error);
            setError(error.response?.data?.message || "Failed to post review. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="review-container">
            <h2>Post A Review</h2>

            {error && <div className="error-message">{error}</div>}
            {success && <div className="success-message">{success}</div>}

            <form onSubmit={handleSubmit} className="review-form">
                <input
                    type="text"
                    name="name"
                    placeholder="Title"
                    value={formData.name}
                    onChange={handleChange}
                />
                <textarea
                    name="description"
                    placeholder="Your Review (Required)"
                    value={formData.description}
                    onChange={handleChange}
                    required
                />

                {/*<div className="image-upload">
                    <label htmlFor="imageUpload">Add Images (Optional)</label>
                    <input type="file" id="imageUpload" onChange={handleImageChange} />
                </div>*/}

                <div className="rating-section">
                    <p>Your Rating (Required)</p>
                    <div className="stars">
                        {[1, 2, 3, 4, 5].map((star) => (
                            <span
                                key={star}
                                className={formData.rating >= star ? "star selected" : "star"}
                                onClick={() => handleRating(star)}
                            >
                                ★
                            </span>
                        ))}
                    </div>
                </div>

                <button type="submit" className="submit-btn" disabled={loading}>
                    {loading ? "Posting..." : "Post Review"}
                </button>
            </form>
        </div>
    );
};

export default ReviewPage;