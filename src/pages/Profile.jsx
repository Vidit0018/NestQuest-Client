import React, { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { app } from "../firebase";
import { useRef } from "react";
import {
  getDownloadURL,
  getStorage,
  ref,
  uploadBytesResumable,
} from "firebase/storage";
import { useDispatch } from "react-redux";
import { updateUserFailure, updateUserStart, updateUserSuccess } from "../redux/user/userSlice";
const Profile = () => {
  const fileref = useRef(null);
  const { currentUser , loading , error } = useSelector((state) => state.user);
  const [file, setfile] = useState(null);
  const [filePerc, setFilePerc] = useState(0);
  const [fileError, setFileError] = useState(false);
  const [formData, setFormData] = useState({});
  const dispatch = useDispatch();
  const [updateSuccess, setUpdateSuccess] = useState(false);

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
  console.log(`/api/user/update/${currentUser._id}`)
  console.log(formData);
  const handlechange =(e)=>{
    setFormData({...formData, [e.target.id]: e.target.value})
  }
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      dispatch(updateUserStart());
      const res = await fetch(`/api/user/update/${currentUser._id}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });
      const data = await res.json();
      if (data.success === false) {
        dispatch(updateUserFailure(data.message));
        return;
      }
      console.log(data)
      dispatch(updateUserSuccess(data));
      setUpdateSuccess(true);
    } catch (error) {
      dispatch(updateUserFailure(error.message));
    }
  };
  console.log(updateSuccess)
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
        <button disabled={loading} className="bg-lime-800 text-white rounded-lg uppercase p-3 font-semibold hover:opacity-95 disabled:opacity-80">
          {loading ? "Loading" : "Update"}
        </button>
      </form>
      <div className="flex justify-between mt-5">
        <span className="text-red-700 font-semibold cursor-pointer">
          Delete Account
        </span>
        <span className="text-red-700 font-semibold cursor-pointer">
          Sign-Out
        </span>
      </div>
      <div className="flex flex-col justify-center items-center p-1">
      <p className="text-red-700 font-semibold mt-3 self-center">{error ? error :""}</p>
      <p className="text-green-700 font-semibold mt-3 self-center">{updateSuccess ? "Updation Successfull !" :""}</p>
      </div>
    </div>
  );
};

export default Profile;
