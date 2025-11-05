import React from 'react'
import "./review.scss"
import { useQuery } from '@tanstack/react-query';
import newRequest from '../../utils/newRequest';

const Review = ({review}) => {
  if (!review) return null;
  const {
    isLoading, error ,data} = useQuery({
    queryKey: ["user", review.userId],
    queryFn: () => 
      newRequest.get(`/users/${review.userId}`).then((res)=>{
      return res.data;
    })
  });
  return (
   <div className="review">
            <div className="item">
              {isLoading ? ( 
                "loading" 
                ) :  error ? (
                   "error" 
                   ) : ( <div className="user">
                <img
                  className="pp"
                  src={data?.img || "no image"}
                  alt=""
                />
                <div className="info">
                  <span>{data.username}</span>
                  <div className="country">
                    <span>{data.country}</span>
                  </div>
                </div>
              </div>)}
              <div className="stars">
                {Array(review.star)
                .fill()
                .map((item,i)=>(
                  <img src="/img/star.png" alt="" key={i}/>
                ))}
                <span>{review.star}</span>
              </div>
              <p>
                {review.desc}
              </p>
              <div className="helpful">
                <span>Helpful?</span>
                <img src="/img/like.png" alt="" />
                <span>Yes</span>
                <img src="/img/dislike.png" alt="" />
                <span>No</span>
              </div>
            </div>
          </div>
  )
}

export default Review;