import React from "react";
import "./Gig.scss";
import { Slider } from "infinite-react-carousel/lib";
import { useQuery } from "@tanstack/react-query";
import { Link, useParams } from "react-router-dom";
import newRequest from "../../utils/newRequest";
import Reviews from "../../components/reviews/Reviews";
import image from "../../assets/download.png";

function Gig() {
  const { id } = useParams();

  // 🟢 Fetch Gig Data
  const {
    isLoading,
    error,
    data:gigData
  } = useQuery({
    queryKey: ["gig"],
    queryFn:async () => {
      const res = await newRequest.get(`/gigs/single/${id}`);
      return res.data;
    },
  });
    const userId = gigData?.userId

  // 🟢 Fetch User Data (only when userId exists)
  const {
    isLoading: isLoadingUser,
    error: errorUser,
    data: dataUser,
  } = useQuery({
    queryKey: ["user",userId],
    queryFn: async () => {
      // if (!gigData?.userId) throw new Error("User ID not found in gig data");
     const res = await newRequest.get(`/users/${userId}`)
         return res.data;
       },
    enabled: !!gigData?.userId,
    retry: false, // prevent repeated retries if user not found
  });

  if (isLoading) return <div>Loading gig...</div>;
  if (error) return <div>Something went wrong while loading gig!</div>;

  return (
    <div className="gig">
      <div className="container">
        <div className="left">
          <span className="breadcrumbs">
            Fiverr &gt; Graphics & Design &gt;
          </span>

          <h1>{gigData?.title}</h1>

          {/* 🟡 User Info */}
          {isLoadingUser ? (
            "Loading user..."
          ) : errorUser ? (
            <span style={{ color: "red" }}>User not found!</span>
          ) : (
            <div className="user">
              <img className="pp" src={dataUser?.img || image} alt="" />
              <span>{dataUser?.username}</span>

              {!isNaN(gigData.totalStars / gigData.starNumber) && (
                <div className="stars">
                  {Array(Math.round(gigData.totalStars / gigData.starNumber))
                    .fill()
                    .map((_, i) => (
                      <img src="/img/star.png" alt="" key={i} />
                    ))}
                  <span>
                    {Math.round(gigData.totalStars / gigData.starNumber)}
                  </span>
                </div>
              )}
            </div>
          )}

          {/* 🟡 Gig Images */}
          {gigData?.images?.length ? (
            <Slider slidesToShow={1} arrowsScroll={1} className="slider">
              {gigData.images.map((img, i) => (
                <img key={i} src={img || image} alt="Gig" />
              ))}
            </Slider>
          ) : (
            <img src={image} alt="Default" className="default-image" />
          )}

          <h2>About This Gig</h2>
          <p>{gigData?.desc}</p>

          {/* 🟡 Seller Info */}
          {!isLoadingUser && !errorUser && dataUser && (
            <div className="seller">
              <h2>About The Seller</h2>
              <div className="user">
                <img src={dataUser.img || image} alt="" />
                <div className="info">
                  <span>{dataUser.username}</span>
                  <button>Contact Me</button>
                </div>
              </div>

              <div className="box">
                <div className="items">
                  <div className="item">
                    <span className="title">From</span>
                    <span className="desc">{dataUser?.country || "N/A"}</span>
                  </div>
                  <div className="item">
                    <span className="title">Languages</span>
                    <span className="desc">English</span>
                  </div>
                </div>
                <hr />
                <p>{dataUser?.desc || "No description available."}</p>
              </div>
            </div>
          )}

          <Reviews gigId={id} />
        </div>

        {/* 🟡 Right Side */}
        <div className="right">
          <div className="price">
            <h3>{gigData?.shortTitle}</h3>
            <h2>${gigData?.price}</h2>
          </div>
          <p>{gigData?.shortDesc}</p>

          <div className="details">
            <div className="item">
              <img src="/img/clock.png" alt="" />
              <span>{gigData?.deliveryDate || 2} Days Delivery</span>
            </div>
            <div className="item">
              <img src="/img/recycle.png" alt="" />
              <span>{gigData?.revisionNumber || 3} Revisions</span>
            </div>
          </div>

          <div className="features">
            {gigData?.features?.map((feature, i) => (
              <div className="item" key={i}>
                <img src="/img/greencheck.png" alt="" />
                <span>{feature}</span>
              </div>
            ))}
          </div>
          <Link to={`/pay/${id}`}> 
          <button>Continue</button>
          </Link>
        </div>
      </div>
    </div>
  );
}

export default Gig;
