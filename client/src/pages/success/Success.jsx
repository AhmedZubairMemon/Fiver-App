import React, { useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import newRequest from "../../utils/newRequest";
import "./success.scss";

const Success = () => {
  const { search } = useLocation();
  const navigate = useNavigate();
  const params = new URLSearchParams(search);
  const payment_intent = params.get("payment_intent");

  useEffect(() => {
    const makeRequest = async () => {
      try {
        await newRequest.put("/orders", { paymentIntent: payment_intent });
        setTimeout(() => {
          navigate("/orders");
        }, 5000);
      } catch (error) {
        console.log(error);
      }
    };
    makeRequest();
  }, [navigate, payment_intent]);

  return (
    <div className="success">
      <div className="success-box">
        <h2>✅ Payment Successful!</h2>
        <p>
          You are being redirected to the <strong>Orders</strong> page.
          <br />
          Please don’t close this tab.
        </p>
        <span>Redirecting in a few seconds...</span>
      </div>
    </div>
  );
};

export default Success