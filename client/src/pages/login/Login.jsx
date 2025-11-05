import React, { useState } from "react"
import "./Login.scss"
import axios from "axios"
import newRequest from "../../utils/newRequest"
import { useNavigate } from "react-router-dom"
import { showError, showSuccess } from "../../utils/toastify"


function Login() {
  const navigate = useNavigate()
  
  const [username, setUsername] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState(null)

  const handleSubmit = async (e)=>{
    e.preventDefault()
    try {
      const res =  await newRequest.post("auth/login",{
        username,
        password
      })
      localStorage.setItem("currentUser",JSON.stringify(res.data));
      showSuccess("🎉 Login successful!");
      navigate("/")
    } catch (error) {
       showError(error.response?.data || "❌ Invalid username or password!");
     setError(error)
    }
  }
  return (
  <div className="login">
  <form className="form"onSubmit={handleSubmit} >
    <h1>Sign in</h1>
    <label htmlFor="">Username</label>
    <input
      type="text"
      placeholder="johndoe"
      name="username"
      autoComplete="username"
      onChange={e => setUsername(e.target.value)}
    />
    <label htmlFor="">Password</label>
    <input
      type="password"
      autoComplete="current-password"
      onChange={e => setPassword(e.target.value)}
    />
    <button type="submit">Login</button>
    {/* {error && <span className="error">{error.response?.data || error.message}</span>} */}
  </form>
</div>
  )
}

export default Login