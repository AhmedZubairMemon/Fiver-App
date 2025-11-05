import React from "react";
import "./Register.scss";
import { useState } from "react";
import { use } from "react";
import upload from "../../utils/upload";
import newRequest from "../../utils/newRequest";
import { useNavigate } from "react-router-dom"
import { showError, showSuccess } from "../../utils/toastify";

function Register() {
  const navigate = useNavigate()
  const [file, setFile] = useState(null)
  const [loading, setLoading] = useState(false)

  const [user, setUser] = useState({
    username:"",
    email:"",
    password:"",
    img:"",
    country:"",
    isSeller:false,
    desc:""
  })
  

  const handelChange = (e)=>{
    setUser((prev)=> {
      return {...prev,[e.target.name]:e.target.value};
    });
  }

  const handelSeller = (e)=>{
    setUser((prev)=> {
      return {...prev, isSeller: e.target.checked};
    });
    
  }

  const handleSubmit = async (e)=>{
    e.preventDefault();
    setLoading(true); 
    const url = await upload(file)
    try {
      await newRequest.post("/auth/register",{
        ...user,
        img: url,
      });
      showSuccess("🎉 User registered successfully!");
      setTimeout(()=> navigate("/login"),1000)
    } catch (error) {
      console.log(error)
      showError("❌ Registration failed. Please try again!");
    }
    finally{
      setLoading(false)
    }
    
  }



  return (
    <div className="register">
      <form className="registerForm" onSubmit={handleSubmit}>
        {/* Left side */}
        <div className="left">
          <h1>Create a new account</h1>

          <label>Username</label>
          <input type="text" name="username" placeholder="johndoe" onChange={handelChange} />

          <label>Email</label>
          <input type="email" name="email" placeholder="email" onChange={handelChange} />

          <label>Password</label>
          <input type="password" name="password"onChange={handelChange}autoComplete="current-password"    />

          <label>Profile Picture</label>
          <input type="file" onChange={(e) => setFile(e.target.files[0])} />

          <label>Country</label>
          <input type="text" name="country" placeholder="USA" onChange={handelChange} />

          <button type="submit" disabled={loading}>
            {loading ? "Please wait..." : "Register"}
          </button>
        </div>

        {/* Right side */}
        <div className="right">
          <h1>I want to become a seller</h1>
          <div className="toggle">
            <label>Activate the seller account</label>
            <label className="switch">
              <input type="checkbox" onChange={handelSeller} />
              <span className="slider"></span>
            </label>
          </div>

          <label>Phone Number</label>
          <input type="text" name="phone" placeholder="+1 234 567 89" onChange={handelChange} />

          <label>Description</label>
          <textarea
            name="desc"
            placeholder="A short description of yourself"
            cols="30"
            rows="10"
            onChange={handelChange}
          ></textarea>
        </div>
      </form>
    </div>
  );
}
export default Register;