import React from "react";
import { Link, Navigate, useNavigate } from "react-router-dom";
import "./MyGigs.scss";
import getCurrentUser from "../../utils/getCurrentUser";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import newRequest from "../../utils/newRequest";

function MyGigs() {
  const currentUser = getCurrentUser();
  const Navigate = useNavigate()
  const queryClient = useQueryClient()
  const { isLoading, error, data } = useQuery({
    queryKey: ["myGigs"],
    queryFn: async () => {
      const res = await newRequest.get(`/gigs?userId=${currentUser._id}`);
      return res.data;
    },
  });
  const mutation = useMutation({
    mutationFn: (id) => {
      return newRequest.delete(`/gigs/${id}`,)
    },
    onSuccess:()=>{
      queryClient.invalidateQueries(["myGigs"])
    }
  })

  const handleDelete = (id)=>{
    mutation.mutate(id);
  }

  const handleEdit = (id) => {
  Navigate(`/edit/${id}`);
};
  
  return (
    <div className="myGigs">
  {isLoading ? (
    "isLoading" 
  ) : error ? (
    "error" 
  ) : (<div className="container">
        <div className="title">
          <h1>Gigs</h1>
          {currentUser.isSeller && (
            <Link to="/add">
              <button>Add New Gig</button>
            </Link>
          )}
        </div>
        <table>
          <tr>
            <th>Image</th>
            <th>Title</th>
            <th>Price</th>
            <th>Sales</th>
            <th>Action</th>
            <th>Edit</th>
          </tr>
         { data.map((gig)=>(

           <tr key={gig._id}>
            <td>
              <img
                className="image"
                src={gig.cover}
                alt=""
              />
            </td>
            <td>{gig.title}</td>
            <td>{gig.price}</td>
            <td>{gig.sales}</td>
            <td>
              <img className="delete" src="./img/delete.png" alt="" onClick={ ()=> handleDelete(gig._id)} />
            </td>
            <td>
              <img src="https://www.freeiconspng.com/uploads/edit-png-icon-blue-pencil-18.png" className="delete" alt="" onClick={() => handleEdit(gig._id)} />
            </td>
          </tr>))}
        </table>
      </div>)}
    </div>
  );
}

export default MyGigs;