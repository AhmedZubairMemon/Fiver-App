import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import newRequest from "../../utils/newRequest";
import "./editGig.scss";

function EditGig() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [gig, setGig] = useState({
    title: "",
    shortTitle: "",
    shortDesc: "",
    price: "",
    deliveryTime: "",
    revisionNumber: "",
    desc: "",
    features: [],
    cover: "",
  });

  const [newFeature, setNewFeature] = useState("");

  // Fetch current gig data
  useEffect(() => {
    const fetchGig = async () => {
      try {
        const res = await newRequest.get(`/gigs/single/${id}`);
        setGig(res.data);
      } catch (err) {
        console.log("Error fetching gig:", err);
      }
    };
    fetchGig();
  }, [id]);

  // Input change
  const handleChange = (e) => {
    const { name, value } = e.target;
    setGig((prev) => ({ ...prev, [name]: value }));
  };

  // Feature update
  const handleFeatureChange = (e, index) => {
    const updatedFeatures = [...gig.features];
    updatedFeatures[index] = e.target.value;
    setGig((prev) => ({ ...prev, features: updatedFeatures }));
  };

  // Add new feature
  const handleAddFeature = () => {
    if (newFeature.trim() === "") return;
    setGig((prev) => ({
      ...prev,
      features: [...prev.features, newFeature.trim()],
    }));
    setNewFeature("");
  };

  // Remove feature
  const handleRemoveFeature = (featureToRemove) => {
    setGig((prev) => ({
      ...prev,
      features: prev.features.filter((f) => f !== featureToRemove),
    }));
  };

  // ✅ Update gig API call
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      // PUT request to update gig
      await newRequest.put(`/gigs/${id}`, gig);
      alert("✅ Gig updated successfully!");
      navigate("/mygigs"); // Redirect to MyGigs page after update
    } catch (error) {
      console.log("❌ Error updating gig:", error);
      alert("Something went wrong while updating gig!");
    }
  };

  return (
    <div className="editGig">
      <div className="container">
        <h1>Edit Gig</h1>
        <form onSubmit={handleSubmit}>
          {/* Title & Price */}
          <div className="doubleFields">
            <div className="field">
              <label>Title</label>
              <input
                type="text"
                name="title"
                value={gig.title}
                onChange={handleChange}
                placeholder="Gig Title"
              />
            </div>
            <div className="field">
              <label>Price ($)</label>
              <input
                type="number"
                name="price"
                value={gig.price}
                onChange={handleChange}
                placeholder="Price"
              />
            </div>
          </div>

          {/* Short Title & Description */}
          <div className="doubleFields">
            <div className="field">
              <label>Short Title</label>
              <input
                type="text"
                name="shortTitle"
                value={gig.shortTitle}
                onChange={handleChange}
                placeholder="Short Title"
              />
            </div>
            <div className="field">
              <label>Short Description</label>
              <input
                type="text"
                name="shortDesc"
                value={gig.shortDesc}
                onChange={handleChange}
                placeholder="Short Description"
              />
            </div>
          </div>

          {/* Delivery & Revisions */}
          <div className="doubleFields">
            <div className="field">
              <label>Delivery Time (Days)</label>
              <input
                type="number"
                name="deliveryTime"
                value={gig.deliveryTime}
                onChange={handleChange}
              />
            </div>
            <div className="field">
              <label>Revisions</label>
              <input
                type="number"
                name="revisionNumber"
                value={gig.revisionNumber}
                onChange={handleChange}
              />
            </div>
          </div>

          {/* Full Description */}
          <div className="field">
            <label>Description</label>
            <textarea
              name="desc"
              value={gig.desc}
              onChange={handleChange}
              placeholder="Full Description"
            />
          </div>

          {/* Cover Image */}
          <div className="field">
            <label>Cover Image URL</label>
            <input
              type="text"
              name="cover"
              value={gig.cover}
              onChange={handleChange}
              placeholder="Cover Image URL"
            />
          </div>

          {/* Features Section */}
          <div className="featuresSection">
            <label>Features</label>
            {gig.features.map((feature, index) => (
              <div key={index} className="featureItem">
                <input
                  type="text"
                  value={feature}
                  onChange={(e) => handleFeatureChange(e, index)}
                  placeholder={`Feature ${index + 1}`}
                />
                <button
                  type="button"
                  className="removeFeatureBtn"
                  onClick={() => handleRemoveFeature(feature)}
                >
                  ✕
                </button>
              </div>
            ))}

            {/* Add New Feature */}
            <div className="addFeatureForm">
              <input
                type="text"
                value={newFeature}
                onChange={(e) => setNewFeature(e.target.value)}
                placeholder="Add new feature"
              />
              <button
                type="button"
                className="addFeatureBtn"
                onClick={handleAddFeature}
              >
                + Add
              </button>
            </div>
          </div>

          {/* Submit */}
          <button type="submit" className="updateBtn">
            Update Gig
          </button>
        </form>
      </div>
    </div>
  );
}

export default EditGig;
