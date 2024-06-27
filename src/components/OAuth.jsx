import React from "react";
import GoogleIcon from "../assets/icons/google.png";
import { GoogleAuthProvider, getAuth, signInWithPopup } from "firebase/auth";
import { app } from "../firebase";
import { useDispatch } from "react-redux";
import { signInSuccess } from "../redux/user/userSlice";
import { useNavigate } from "react-router-dom";
import toast, { Toaster } from 'react-hot-toast';
const OAuth = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
  
    const SuccessToast = ()=>{
      toast.success('Google SingIn Successful',{
        style: {
          background: '#333',
          color: '#fff',
        },
      });
      setTimeout(() => {
        navigate("/");
        
      }, 1200);
    }
    

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
            credentials: 'include'
        });
        const data = await res.json();
        dispatch(signInSuccess(data));
        SuccessToast();
        } catch (error) {
          toast.error("Something went wrong.",{
            style: {
              background: '#333',
              color: '#fff',
            },
          })
        console.log(error);
        console.log("Couldnt signup with google ");
        }
    };
    return (
        <>
             <Toaster position="bottom-center"/>

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
