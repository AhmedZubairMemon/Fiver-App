import React from "react";
import "./reviews.scss";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import newRequest from "../../utils/newRequest";
import Review from "./Reviews.scss";

const Reviews = ({ gigId }) => {
  const queryClient = useQueryClient()
  const { isLoading, error, data } = useQuery({
    queryKey: ["reviews",gigId],
    queryFn: async () => {
      const res = await newRequest.get(`/reviews/${gigId}`);
      return res.data;
    },
    staleTime: 0,
  cacheTime: 0,
  });
  const mutation = useMutation({
 mutationFn: (review) =>
  newRequest.post("/reviews", review, {
    headers: { "Content-Type": "application/json" },
  }),
  onSuccess: (newReview) => {
   queryClient.setQueryData(["reviews", gigId], (oldData) =>
  oldData ? [...oldData, newReview.data] : [newReview.data]
);
queryClient.invalidateQueries(["reviews", gigId]); 
  },
});

  const handleSubmit = (e)=>{
    e.preventDefault();
    const desc = e.target[0].value
    const star = parseInt(e.target[1].value)
    mutation.mutate({gigId, desc, star})
    console.log({ gigId, desc, star });
    e.target.reset();
  }
  return (
    <div className="reviews">
      <h2>Reviews</h2>
      <div className="add">
        <h3>Add a review</h3>
        <form action=""  className="addForm" onSubmit={handleSubmit}>
          <input type="text" placeholder="write your opinion" />
          <select name="" id="">
            <option value={1}>1</option>
            <option value={2}>2</option>
            <option value={3}>3</option>
            <option value={4}>4</option>
            <option value={5}>5</option>
          </select>
          <button>Send</button>
        </form>
      </div>
      {isLoading ? (
        "Loading..."
      ) : error ? (
        <span style={{ color: "red" }}>Something went wrong!</span>
      ) : data && data.length > 0 ? (
        data.map((review) => <Review key={review._id} review={review} />)
      ) : (
        <p>No reviews yet.</p>
      )}
    </div>
  );
};

export default Reviews;