import React, { useEffect, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import "./Navbar.scss";
import newRequest from "../../utils/newRequest";
import { toast } from "react-toastify"; // ✅ import toast
import "react-toastify/dist/ReactToastify.css";

function Navbar() {
  const navigate = useNavigate();
  const [active, setActive] = useState(false);
  const [open, setOpen] = useState(false);
  const { pathname } = useLocation();

  const isActive = () => {
    window.scrollY > 0 ? setActive(true) : setActive(false);
  };

  useEffect(() => {
    window.addEventListener("scroll", isActive);
    return () => {
      window.removeEventListener("scroll", isActive);
    };
  }, []);

  const currentUser = JSON.parse(localStorage.getItem("currentUser"));

  // ✅ Logout handler
  const handleLogout = async () => {
    try {
      await newRequest.post("auth/logout");
      localStorage.removeItem("currentUser"); // ✅ token/user data delete
      toast.success("Logged out successfully!", { position: "top-center" }); // ✅ toast message
      navigate("/");
    } catch (error) {
      toast.error("Logout failed. Please try again.", { position: "top-center" });
    }
  };

  return (
    <div className={active || pathname !== "/" ? "navbar active" : "navbar"}>
      <div className="container">
        <div className="logo">
          <Link className="link" to="/">
            <span className="text">Fiverr</span>
          </Link>
          <span className="dot">.</span>
        </div>

        <div className="links">
          <span>Fiverr Business</span>
          <span>Explore</span>
          <span>English</span>
          {!currentUser?.isSeller && <span>Become a Seller</span>}

          {currentUser ? (
            <div className="user" onClick={() => setOpen(!open)}>
              <img src={currentUser.img || "No image"} alt="" />
              <span>{currentUser?.username}</span>

              {open && (
                <div className="options">
                  {currentUser.isSeller && (
                    <>
                      <Link className="link" to="/mygigs">
                        Gigs
                      </Link>
                      <Link className="link" to="/add">
                        Add New Gig
                      </Link>
                    </>
                  )}
                  <Link className="link" to="/orders">
                    Orders
                  </Link>
                  <Link className="link" to="/messages">
                    Messages
                  </Link>
                  <Link className="link" onClick={handleLogout}>
                    Logout
                  </Link>
                </div>
              )}
            </div>
          ) : (
            <>
              <Link to="/login" className="link">
                Sign in
              </Link>
              <Link className="link" to="/register">
                <button>Join</button>
              </Link>
            </>
          )}
        </div>
      </div>

      {(active || pathname !== "/") && (
        <>
          <hr />
          <div className="menu">
            <Link className="link menuLink" to="/">Graphics & Design</Link>
            <Link className="link menuLink" to="/">Video & Animation</Link>
            <Link className="link menuLink" to="/">Writing & Translation</Link>
            <Link className="link menuLink" to="/">AI Services</Link>
            <Link className="link menuLink" to="/">Digital Marketing</Link>
            <Link className="link menuLink" to="/">Music & Audio</Link>
            <Link className="link menuLink" to="/">Programming & Tech</Link>
            <Link className="link menuLink" to="/">Business</Link>
            <Link className="link menuLink" to="/">Lifestyle</Link>
          </div>
          <hr />
        </>
      )}
    </div>
  );
}

export default Navbar;