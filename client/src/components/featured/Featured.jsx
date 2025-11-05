import React, { useState } from "react";
import "./Featured.scss";
import { useNavigate } from "react-router-dom";
import { showError, showWarning } from "../../utils/toastify";

function Featured() {
  const [input, setInput] = useState("")
  const navigate = useNavigate()

  const handleSubmit = async ()=>{
    if (!input.trim()) {
      // ✅ agar input empty hai to warning show karo
      showWarning("Please enter something to search!");
      return;
    }
    try {
      // 🔍 Backend se search check
      const res = await newRequest.get(`/gigs?search=${input}`);
      if (!res.data.length) {
        showWarning("No gigs found for this search!");
        return;
      }

      navigate(`/gigs?search=${input}`);
    } catch (err) {
      showError("Something went wrong while searching!");
    }
  };

 
  return (
    <div className="featured">
      <div className="container">
        <div className="left">
          <h1>
            Find the perfect <span>freelance</span> services for your business
          </h1>
          <div className="search">
            <div className="searchInput">
              <img src="./img/search.png" alt="" />
              <input type="text" placeholder="Try building mobile app"
               onChange={(e)=> setInput(e.target.value)}/>
            </div>
            <button onClick={handleSubmit}>Search</button>
          </div>
          <div className="popular">
            <span>Popular:</span>
            <button>Web Design</button>
            <button>WordPress</button>
            <button>Logo Design</button>
            <button>AI Services</button>
          </div>
        </div>
        <div className="right">
          <img src="./img/man.png" alt="" />
        </div>
      </div>
    </div>
  );
}

export default Featured;
