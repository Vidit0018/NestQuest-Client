import React, { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { app } from "../firebase";
import { useRef } from "react";
import { Link } from "react-router-dom";
import {
  getDownloadURL,
  getStorage,
  ref,
  uploadBytesResumable,
} from "firebase/storage";
import { useDispatch } from "react-redux";
import {
  updateUserFailure,
  updateUserStart,
  updateUserSuccess,
  deleteUserStart,
  deleteUserSuccess,
  deleteUserFailure,
  signInStart,
  singOutSuccess,
  signOutFailure,
  signOutStart,
} from "../redux/user/userSlice";

import { current } from "@reduxjs/toolkit";
import { DiAppcelerator } from "react-icons/di";
const Profile = () => {
  const fileref = useRef(null);
  const { currentUser, loading, error } = useSelector((state) => state.user);
  const [file, setfile] = useState(null);
  const [filePerc, setFilePerc] = useState(0);
  const [fileError, setFileError] = useState(false);
  const [formData, setFormData] = useState({});
  const dispatch = useDispatch();
  const [updateSuccess, setUpdateSuccess] = useState(false);
  const [showListingsError, setShowListingsError] = useState(false);
  const [UserListings, setUSerListing] = useState([])

  useEffect(() => {
    if (file) {
      handleFileUpload(file);
    }
  }, [file]);
  const handleFileUpload = (file) => {
    setFileError(false);
    const storage = getStorage(app);
    const fileName = new Date().getTime() + file.name;
    const storageRef = ref(storage, fileName);
    const uploadTask = uploadBytesResumable(storageRef, file);
    uploadTask.on(
      "state_changed",
      (snapshot) => {
        const progress =
          (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
        const roundedValue = Math.round(progress);
        setFilePerc(roundedValue);
      },

      (error) => {
        setFileError(true);
      },
      () => {
        getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
          setFormData({ ...formData, avatar: downloadURL });
        });
      }
    );
  };
  console.log(fileError);
  console.log(`/api/user/update/${currentUser._id}`);
  console.log(formData);
  const handlechange = (e) => {
    setFormData({ ...formData, [e.target.id]: e.target.value });
  };
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      dispatch(updateUserStart());
      const res = await fetch(`https://nestquest-server-1.onrender.com/api/user/update/${currentUser._id}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });
      const data = await res.json();
      if (data.success === false) {
        dispatch(updateUserFailure(data.message));
        return;
      }
      console.log(data);
      dispatch(updateUserSuccess(data));
      setUpdateSuccess(true);
    } catch (error) {
      dispatch(updateUserFailure(error.message));
    }
  };
  const handleDeleteUser = async () => {
    try {
      dispatch(deleteUserStart());
      const res = await fetch(`https://nestquest-server-1.onrender.com/api/user/delete/${currentUser._id}`, {
        method: "Delete",
      });
      const data = await res.json();

      if (data.success === false) {
        dispatch(deleteUserFailure(data.message));
        return;
      }
      dispatch(deleteUserSuccess(data));
    } catch (error) {
      dispatch(deleteUserFailure(error.message));
    }
  };
  const handleSignOut = async () => {
    try {
      dispatch(signOutStart());
      const res = await fetch("https://nestquest-server-1.onrender.com/api/auth/signout");
      const data = await res.json();
      if (data.success === false) {
        dispatch(signOutFailure(data.message));
        return;
      }
      dispatch(singOutSuccess(data));
    } catch (error) {
      dispatch(signOutFailure(error.message));
    }
  };
  const handleShowListing = async() =>{
    try {
      setShowListingsError(false);
      const res = await fetch(`https://nestquest-server-1.onrender.com/api/user/listings/${currentUser._id}`,{
        method: 'GET'
      });
      const data = await res.json();
      setUSerListing(data);
      console.log(UserListings)
      if (data.success === false) {
        showListingsError(true)
        return
      }

    } catch (error) {
      setShowListingsError(true)
    }
  }
  const handleListingDelete = async(id) =>{
    try {
      const res=  await fetch(`https://nestquest-server-1.onrender.com/api/listing/delete/${id}`,{
        method :'DELETE'
      });
      const data = await res.json()
      if(data.success===false){
        console.log(data.message);
        return;
      }
      setUSerListing((prev) => prev.filter((listing) => listing._id !== id))
    } catch (error) {
      console.log(error.message)
    }

  }
  console.log(UserListings.length)
  return (
    <div className="p-3 max-w-lg  mx-auto">
      <h1 className="text-3xl font-bold text-center my-7 text-lime-800">
        Profile
      </h1>
      <form onSubmit={handleSubmit} className="flex flex-col  gap-4 ">
        <input
          type="file"
          ref={fileref}
          className="hidden"
          accept="image/*"
          onChange={(e) => setfile(e.target.files[0])}
        />
        <img
          src={formData.avatar || currentUser.avatar}
          onClick={() => fileref.current.click()}
          className="rounded-full object-cover h-24 w-24 cursor-pointer drop-shadow-2xl self-center"
          alt="profile"
        ></img>
        <p className="text-center">
          {fileError ? (
            <span className="text-red-500">
              Error Uploading Image (image must be less than 2 mb)
            </span>
          ) : filePerc > 0 && filePerc < 100 && fileError === false ? (
            <span className="text-green-800">{`Uploading ${filePerc}%`}</span>
          ) : filePerc === 100 ? (
            <span className="text-green-800">Image Uploaded Successfully</span>
          ) : (
            ""
          )}
        </p>
        <input
          type="text"
          placeholder="Username"
          defaultValue={currentUser.username}
          id="username"
          className="border p-3 rounded-lg "
          onChange={handlechange}
        />
        <input
          type="text"
          placeholder="Email"
          defaultValue={currentUser.email}
          id="email"
          className="border  p-3 rounded-lg "
          onChange={handlechange}
        />
        <input
          type="password"
          placeholder="Password"
          id="password"
          className="border  p-3 rounded-lg "
          onChange={handlechange}
        />
        <button
          disabled={loading}
          className="bg-lime-800 text-white rounded-lg uppercase p-3 font-semibold hover:opacity-95 disabled:opacity-80"
        >
          {loading ? "Loading" : "Update"}
        </button>
        <Link to={"/create-listing" } className="bg-yellow-500 font-semibold rounded-lg text-white p-3 uppercase text-center hover:opacity-95">Create Listing</Link>
      </form>
      <div className="flex justify-between mt-5">
        <span
          onClick={handleDeleteUser}
          className="text-red-700 font-semibold cursor-pointer"
        >
          Delete Account
        </span>
        <span
          onClick={handleSignOut}
          className="text-red-700 font-semibold cursor-pointer"
        >
          Sign-Out
        </span>
      </div>
      <div className="flex flex-col justify-center items-center p-1">
        <p className="text-red-700 font-semibold mt-3 self-center">
          {error ? error : ""}
        </p>
        <p className="text-green-700 font-semibold mt-3 self-center">
          {updateSuccess ? "Updation Successfull !" : ""}
        </p>
        <button onClick={handleShowListing} className="text-green-700 w-full">Show Listings</button>
        <p className="text-red-700 font-semibold ">{showListingsError? 'Could not show listing ':''}</p>
        
        { UserListings.length > 0 && 
          <div className=" flex flex-col gap-4">
            <h1 className="text-xl text-lime-800 self-center font-bold my-7">Your Listings</h1>
            {UserListings.map((listing) =>(
             <div key={listing._id} className="border rounded-lg p-3 flex justify-between items-center gap-4">
              <Link to={`/listing/${listing._id}`}>
                <img src={listing.imageUrls[0]} alt="listing cover" className="h-16 w-16 object-contain rounded-lg"/>
              </Link>
              <Link className="text-lime-800 font-semibold flex-1 hover:underline truncate" to={`/listing/${listing._id}`}>
              <p> {listing.name}</p>
              </Link>
              <div className="flex flex-col items-center">
                <button onClick={()=> handleListingDelete(listing._id)} className="text-red-700 uppercase text-sm font font-semibold">Delete</button>
                <Link to={`/update-listing/${listing._id}`}>
                <button className="text-green-700 uppercase text-sm font-semibold">Edit</button>
                </Link>
              </div>
             </div> 
            ))}
          </div>
        }
      </div>
    </div>
  );
};

export default Profile;
