import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { signInStart,signInFailure,signInSuccess } from "../redux/user/userSlice";
import { Bounce, ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import OAuth from "../components/OAuth";


const SignIn = () => {
  const [formData, setformData] = useState({});
  // const [error, setError] = useState(null);
  // const [loading, setloading] = useState(false);
  const {loading,error} = useSelector((state)=>state.user)
  
  const navigate = useNavigate();
  const SuccessToast = ()=>{
      signInSuccessToast();
      setTimeout(() => {
        redirectionToast();
      }, 2500);
      setTimeout(() => {
        navigate("/");
      }, 4000);
  }
  const signInSuccessToast = () =>{
    toast.success('Sign In Successful !')
  }
  const errorToast = () => {
    toast.error("Bad Credentials");
  };
  const redirectionToast = () => {
    toast.info("Redirecting to Home Page");
  };

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
      const res = await fetch("api/auth/signin", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });
      const data = await res.json();
      if (data.success === false) {
        // setError(data.message);
        // setloading(false);
        dispatch((signInFailure(data.message)))
        errorToast();
        return;
      }

      console.log(data);
      // setloading(false);
      // setError(null);
      dispatch(signInSuccess(data));
      SuccessToast();
    } catch (error) {
      // setloading(false);
      // setError(error.message);
      dispatch(signInFailure(error.message))
    }
  };
  return (
    <>
<ToastContainer
position="top-right"
autoClose={5000}
hideProgressBar={false}
newestOnTop={false}
closeOnClick
rtl={false}
pauseOnFocusLoss
draggable
pauseOnHover
theme="light"
/>
{/* Same as */}
<ToastContainer />


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
        <button onClick={SuccessToast}>Check Toast Funcitoning</button>
      </div>
    </>
  );
};

export default SignIn;
