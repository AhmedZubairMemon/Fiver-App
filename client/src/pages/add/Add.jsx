import React, { useReducer, useState } from "react";
import "./Add.scss";
import { gigReducer, INITIAL_STATE } from "../../reducers/gigReducer";
import upload from "../../utils/upload";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import newRequest from "../../utils/newRequest";
import { useNavigate } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const Add = () => {
  const [singleFile, setSingleFile] = useState(undefined);
  const [files, setFiles] = useState([]);
  const [uploading, setUploading] = useState(false);
  const [state, dispatch] = useReducer(gigReducer, INITIAL_STATE);
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const handleChange = (e) => {
    dispatch({
      type: "CHANGE_INPUT",
      payload: { name: e.target.name, value: e.target.value },
    });
  };

  const handleFeature = (e) => {
    e.preventDefault();
    const featureValue = e.target[0].value.trim();
    if (!featureValue) {
      toast.warn("⚠️ Please enter a feature before adding.");
      return;
    }
    dispatch({
      type: "ADD_FEATURE",
      payload: featureValue,
    });
    toast.success("✅ Feature added successfully!");
    e.target[0].value = "";
  };

  const handleUpload = async () => {
    if (!singleFile && files.length === 0) {
      toast.error("❌ Please select files first!");
      return;
    }

    setUploading(true);
    try {
      const cover = singleFile ? await upload(singleFile) : null;
      const images = files.length
        ? await Promise.all(
            [...files].map(async (file) => {
              const url = await upload(file);
              return url;
            })
          )
        : [];

      setUploading(false);
      dispatch({ type: "ADD_IMAGES", payload: { cover, images } });
      toast.success("✅ Images uploaded successfully!");
    } catch (error) {
      console.log(error);
      setUploading(false);
      toast.error("❌ Error uploading images.");
    }
  };

  const mutation = useMutation({
    mutationFn: (gig) => {
      return newRequest.post("/gigs", gig, { withCredentials: true });
    },
    onSuccess: () => {
      toast.success("🎉 Gig created successfully!");
      queryClient.invalidateQueries(["myGigs"]);
      setTimeout(() => navigate("/myGigs"), 1500);
    },
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    const requiredFields = [
      state.title,
      state.desc,
      state.cat,
      state.shortTitle,
      state.shortDesc,
      state.deliveryTime,
      state.revisionNumber,
      state.price,
    ];

    if (requiredFields.some((f) => !f)) {
      toast.error("⚠️ Please fill all required fields before creating a gig.");
      return;
    }

    mutation.mutate(state);
  };

  return (
    <div className="add">
      <div className="container">
        <h1>Add New Gig</h1>
        <div className="sections">
          <div className="info">
            <label>Title</label>
            <input
              type="text"
              name="title"
              placeholder="e.g. I will do something I'm really good at"
              onChange={handleChange}
            />

            <label>Category</label>
            <select name="cat" id="cat" onChange={handleChange}>
              <option value="">Select category</option>
              <option value="design">Design</option>
              <option value="web">Web Development</option>
              <option value="animation">Animation</option>
              <option value="music">Music</option>
            </select>

            <div className="images">
              <div className="imagesInputs">
                <label>Cover Image</label>
                <input
                  type="file"
                  onChange={(e) => setSingleFile(e.target.files[0])}
                />
                <label>Upload Images</label>
                <input
                  type="file"
                  multiple
                  onChange={(e) => setFiles(e.target.files)}
                />
              </div>
              <button onClick={handleUpload}>
                {uploading ? "Uploading..." : "Upload"}
              </button>
            </div>

            <label>Description</label>
            <textarea
              name="desc"
              placeholder="Brief descriptions to introduce your service"
              rows="16"
              onChange={handleChange}
            ></textarea>

            <button onClick={handleSubmit}>Create</button>
          </div>

          <div className="details">
            <label>Service Title</label>
            <input
              type="text"
              name="shortTitle"
              placeholder="e.g. One-page web design"
              onChange={handleChange}
            />

            <label>Short Description</label>
            <textarea
              name="shortDesc"
              placeholder="Short description of your service"
              cols="30"
              rows="10"
              onChange={handleChange}
            ></textarea>

            <label>Delivery Time (e.g. 3 days)</label>
            <input type="number" name="deliveryTime" onChange={handleChange} />

            <label>Revision Number</label>
            <input type="number" name="revisionNumber" onChange={handleChange} />

            <label>Add Features</label>
            <form className="add" onSubmit={handleFeature}>
              <input type="text" placeholder="e.g. page design" />
              <button type="submit">Add</button>
            </form>

            <div className="addedFeatures">
              {state?.features?.map((f) => (
                <div className="item" key={f}>
                  <button
                    className="X"
                    onClick={() =>
                      dispatch({ type: "REMOVE_FEATURE", payload: f })
                    }
                  >
                    {f} <span>X</span>
                  </button>
                </div>
              ))}
            </div>

            <label>Price</label>
            <input type="number" name="price" onChange={handleChange} />
          </div>
        </div>
      </div>
      <ToastContainer position="top-center" autoClose={2000} />
    </div>
  );
};

export default Add;
