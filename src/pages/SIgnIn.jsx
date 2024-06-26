import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { signInStart,signInFailure,signInSuccess } from "../redux/user/userSlice";
import OAuth from "../components/OAuth";


const SignIn = () => {
  const [formData, setformData] = useState({});
  // const [error, setError] = useState(null);
  // const [loading, setloading] = useState(false);
  const {loading,error} = useSelector((state)=>state.user)
  
  const navigate = useNavigate();
  const SuccessToast = ()=>{
      setTimeout(() => {
        navigate("/");
      }, 1000);
  }
  

  const dispatch = useDispatch();

  const handleChange = (e) => {
    setformData({
      ...formData,
      [e.target.id]: e.target.value,
    });
  };
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      // setloading(true);
      dispatch(signInStart());
      const res = await fetch("https://nestquest-server-1.onrender.com/api/auth/signin", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });
      const data = await res.json();
      SuccessToast();
      if (data.success === false) {
        // setError(data.message);
        // setloading(false);
        dispatch((signInFailure(data.message)))
        return;
      }

      console.log(data);
      // setloading(false);
      // setError(null);
      dispatch(signInSuccess(data));
    } catch (error) {
      // setloading(false);
      // setError(error.message);
      dispatch(signInFailure(error.message))
    }
  };
  return (
    <>

      <div className="p-3 max-w-lg mx-auto">
        <h1 className="text-3xl text-lime-800 text-center font-bold my-7 ">
          Sign In
        </h1>
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
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
            {loading ? "Loading..." : "Sign In"}
          </button>
        <OAuth></OAuth>
        </form>
        <div className="flex gap-2 mt-5">
          <p>Don't have an account ?</p>
          <Link to="/sign-up">
            <span className="text-blue-800 font-semibold">
              Sign up
            </span>
          </Link>
        </div>
        {error && <p className="text-red-500 mt-5">{error}</p>}
      </div>
    </>
  );
};

export default SignIn;
