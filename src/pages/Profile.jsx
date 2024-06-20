import React from "react";
import { useSelector } from "react-redux";
const Profile = () => {
  const { currentUser } = useSelector((state) => state.user);
  return (
    <div className="p-3 max-w-lg  mx-auto">
      <h1 className="text-3xl font-bold text-center my-7 text-lime-800">
        Profile
      </h1>
      <form className="flex flex-col  gap-4 ">
        <img
          src={currentUser.avatar}
          className="rounded-full object-cover h-24 w-24 cursor-pointer drop-shadow-2xl self-center"
          alt="profile"
        ></img>
        <input
          type="text"
          placeholder="Username"
          id="username"
          className="border p-3 rounded-lg "
        />
        <input
          type="text"
          placeholder="Email"
          id="email"
          className="border  p-3 rounded-lg "
        />
        <input
          type="password"
          placeholder="Password"
          id="password"
          className="border  p-3 rounded-lg "
        />
        <button className="bg-lime-800 text-white rounded-lg uppercase p-3 font-semibold hover:opacity-95 disabled:opacity-80">
          Update
        </button>
      </form>
      <div className="flex justify-between mt-5">
        <span className="text-red-700 font-semibold cursor-pointer">Delete Account</span>
        <span className="text-red-700 font-semibold cursor-pointer">Sign-Out</span>
      </div>
    </div>
  );
};

export default Profile;
