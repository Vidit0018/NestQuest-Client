import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import OAuth from "../components/OAuth";

const SignUp = () => {
  const [formData, setformData] = useState({});
  const [error, setError] = useState(null);
  const [loading, setloading] = useState(false);
  
  const SuccessToast = ()=>{
      signupSuccessToast();
      setTimeout(() => {
        redirectionToast();
      }, 2500);
      setTimeout(() => {
        navigate("/sign-in");
      }, 4500);
  }
  const signupSuccessToast = ()=>{
    toast.success("Sign Up Successful! ");
  }
  const errorToast = () => {
    toast.error("Could Not SignUp");
  };
  const redirectionToast = () => {
    toast.info("Redirecting to Sign in Page");
  };
  const navigate = useNavigate();

  const handleChange = (e) => {
    setformData({
      ...formData,
      [e.target.id]: e.target.value,
    });
  };
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setloading(true);
      const res = await fetch("api/auth/signup", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });
      const data = await res.json();
      if (data.success === false) {
        setError(data.message);
        setloading(false);
        return;
      }

      console.log(data);
      setloading(false);
      setError(null);
      SuccessToast();
    } catch (error) {
      setloading(false);
      setError(error.message);
      errorToast();
    }
  };
  return (
    <>
      <ToastContainer
        position="top-center"
        autoClose={1500}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="dark"
      />

      <div className="p-3 max-w-lg mx-auto">
        <h1 className="text-3xl text-lime-800 text-center font-bold my-7 ">
          Sign Up
        </h1>
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <input
            type="text"
            placeholder="Username"
            className="border p-3 rounded-lg focus:outline-none"
            id="username"
            onChange={handleChange}
          />
          <input
            type="email"
            placeholder="Email"
            className="border p-3 rounded-lg focus:outline-none"
            id="email"
            onChange={handleChange}
          />
          <input
            type="password"
            placeholder="Password"
            className="border p-3 rounded-lg focus:outline-none"
            id="password"
            onChange={handleChange}
          />
          <button
            disabled={loading}
            className="bg-lime-800 text-white rounded-lg uppercase p-3 font-semibold hover:opacity-95 disabled:opacity-80"
          >
            {loading ? "Loading..." : "Sign up"}
          </button>
        <OAuth></OAuth>
        </form>
        <div className="flex gap-2 mt-5">
          <p>Already have an account ?</p>
          <Link to="/sign-in">
            <span className="text-blue-800 font-semibold">
              Sign in
            </span>
          </Link>
        </div>
        {error && <p className="text-red-500 mt-5">{error}</p>}
        <button onClick={SuccessToast}>Check Toast Funcitoning</button>
      </div>
    </>
  );
};

export default SignUp;
