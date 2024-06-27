import React from "react";
import GoogleIcon from "../assets/icons/google.png";
import { GoogleAuthProvider, getAuth, signInWithPopup } from "firebase/auth";
import { app } from "../firebase";
import { useDispatch } from "react-redux";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { signInSuccess } from "../redux/user/userSlice";
import { useNavigate } from "react-router-dom";
const OAuth = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const redirectionToast = () => {
      toast.info('Redirecting to Home Page');
    };
    const SuccessToast = ()=>{
      toast.success('Successful SignUp !');
        setTimeout(() => {
          redirectionToast();
        }, 500);
        setTimeout(() => {
          navigate("/");
        }, 1000);
    }
    const errorToast = () => {
      toast.error('Bad Credentials');
    };

    const handleGoogleClick = async () => {
        try {
        const provider = new GoogleAuthProvider();
        const auth = getAuth(app);

        const result = await signInWithPopup(auth, provider);
        const res = await fetch("https://nestquest-server-1.onrender.com/api/auth/google", {
            method: "POST",
            headers: {
            "Content-Type": "application/json",
            },
            body: JSON.stringify({
            name: result.user.displayName,
            email: result.user.email,
            photo: result.user.photoURL,
            }),
        });
        const data = await res.json();
        dispatch(signInSuccess(data));
        SuccessToast();
        } catch (error) {
        console.log(error);
        console.log("Couldnt signup with google ");
        errorToast();
        }
    };
    return (
        <>
        <ToastContainer
            position="top-center"
            autoClose={1000}
            hideProgressBar={false}
            newestOnTop={false}
            closeOnClick
            rtl={false}
            pauseOnFocusLoss
            draggable
            pauseOnHover
            theme="dark"
        />

        <button
            onClick={handleGoogleClick}
            type="button"
            className="bg-yellow-300 text-lime-800 rounded-lg uppercase p-3 font-semibold hover:opacity-95 disabled:opacity-80 flex items-center justify-center
        "
        >
            <div className="flex space-x-4 items-center justify-center">
            <img src={GoogleIcon} className="h-6 w-6" />
            <p>Continue With Google</p>
            </div>
        </button>
        </>
    );
    };

    export default OAuth;
