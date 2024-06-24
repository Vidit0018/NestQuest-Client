import {
    getDownloadURL,
    getStorage,
    uploadBytesResumable,
  
  } from "firebase/storage";
  import React, { useEffect } from "react";
  import { app } from "../firebase";
  import { useState } from "react";
  import { ref } from "firebase/storage";
  import { useSelector } from "react-redux";
  import { useNavigate,useParams } from "react-router-dom";
  const UpdateListing = () => {
    const navigate= useNavigate();
    const params = useParams();
    const {currentUser} = useSelector(state => state.user)
    const [files, setFiles] = useState({});
    const [formData, setFormData] = useState({
      imageUrls: [],
      name: "",
      description: "",
      address: "",
      type: "rent",
      bedrooms: 1,
      bathrooms: 1,
      regularPrice: 6000,
      discountPrice: 0,
      offer: false,
      parking: false,
      furnished: false,
    });
    
    const [imageUploadError, setImageUploadError] = useState(false);
    const [uploading, setUploading] = useState(false);
    const [error, setError] = useState(false);
    const [loading, setLoading] = useState(false);

    useEffect(()=>{
        const fetchListing = async()=>{
            const listingId = params.listingId;
            const res = await fetch(`/api/listing/get/${listingId}`,{
                method: 'GET',
            });
            const data = await res.json();
            setFormData(data)
        }
        fetchListing();
    },[])
    const handleChange = (e) => {
      if(e.target.id === 'sale' || e.target.id === 'rent'){
          setFormData({
              ...formData,
              type:e.target.id
          })
      }
      if(e.target.id === 'parking' || e.target.id ==='furnished'  || e.target.id === 'offer'){
          setFormData({
              ...formData,
              [e.target.id]: e.target.checked 
          })
      }
  
      if(e.target.type === 'number'|| e.target.type === 'text' || e.target.type === 'textarea'
      ){  
          setFormData({
            ...formData ,
            [e.target.id] : e.target.value
          })
      }
    };
  
    console.log(formData);
    const handleImageSubmit = (e) => {
      if (files.length > 0 && files.length + formData.imageUrls.length < 7) {
        console.log("call");
        setUploading(true);
        setImageUploadError(false);
        const promises = [];
        for (let i = 0; i < files.length; i++) {
          promises.push(storeImage(files[i]));
        }
  
        Promise.all(promises)
          .then((urls) => {
            setFormData({
              ...formData,
              imageUrls: formData.imageUrls.concat(urls),
            });
            setImageUploadError(false);
            setUploading(false);
          })
          .catch((e) => {
            setImageUploadError("Max Size of Image can be 2 mb");
            console.log(e);
            setUploading(false);
          });
      } else {
        setImageUploadError(
          "you can only upload min 1 and max 6 images of the property"
        );
        setUploading(false);
      }
    };
    const storeImage = async (file) => {
      return new Promise((resolve, reject) => {
        const storage = getStorage(app);
        const fileName = file.name + new Date().getTime();
        const storageRef = ref(storage, fileName);
        const uploadTask = uploadBytesResumable(storageRef, file);
        uploadTask.on(
          "state_changed",
          (snapshot) => {
            const progress =
              (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
            console.log(`Upload is ${progress}% done`);
          },
          (error) => {
            reject(error);
          },
          () => {
            getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
              resolve(downloadURL);
            });
          }
        );
      });
    };
    const handleDelete = (index) => {
      setFormData({
        ...formData,
        imageUrls: formData.imageUrls.filter((_, i) => i !== index),
      });
    };
  
    const handleSubmit = async(e) =>{
  
      e.preventDefault();
      try {
        if(formData.imageUrls.length<1){
          return setError("You must upload Atleast one Image")
        }
        if(+formData.regularPrice < +formData.discountPrice){
          return setError("Discount Price can not be more than regular Price")
        }
        setLoading(true);
        setError(false);
        const res = await fetch(`/api/listing/update/${params.listingId}`,{
          method:'POST',
          headers: {
            'Content-Type' : 'application/json',
          },
          body: JSON.stringify({
            ...formData,
            userRef: currentUser._id
          })
        })
        const data = await res.json();
        console.log("listing created")
        setTimeout(() => {
          
          navigate(`/listing/${data._id}`)
        }, 2000);
        setLoading(false);
        if(data.success === false){
          setError(data.message)
        }
        
      } catch (error) {
        setError(error.message);
        setLoading(false)
      }
    }
    return (
      <main className="p-3 max-w-4xl mx-auto ">
        <h1 className="text-3xl font-bold text-center my-7 text-lime-800">
          Update Listing
        </h1>
        <form  onSubmit={handleSubmit} className="flex flex-col sm:flex-row font-semibold text-lime-800 gap-4">
          <div className="flex flex-col gap-4 flex-1">
            <input
              type="text"
              placeholder="Name"
              className="border p-3 rounded-lg "
              id="name"
              maxLength="62"
              minLength="10"
              onChange={handleChange}
              value={formData.name}
              required
            />
  
            <textarea
              type="text"
              placeholder="Description"
              className="border p-3 rounded-lg "
              id="description"
              maxLength="62"
              minLength="10"
              onChange={handleChange}
              value={formData.description}
              required
            />
  
            <input
              type="text"
              placeholder="Address"
              className="border p-3 rounded-lg "
              id="address"
              onChange={handleChange}
              value={formData.address}
              required
            />
  
            <div className="flex flex-wrap gap-4">
              <div className="flex gap-2 ">
                <input
                  type="checkbox"
                  id="sale"
                  onChange={handleChange}
                  checked={formData.type === "sale"}
                  className="w-5"
                />
                <span>Sell</span>
              </div>
              <div className="flex gap-2 ">
                <input
                  type="checkbox"
                  id="rent"
                  onChange={handleChange}
                  checked={formData.type === "rent"}
                  className="w-5"
                />
                <span>Rent</span>
              </div>
              <div className="flex gap-2 ">
                <input
                  type="checkbox"
                  id="parking"
                  onChange={handleChange}
                  checked={formData.parking}
                  className="w-5"
                />
                <span>Parking Spot</span>
              </div>
              <div className="flex gap-2 ">
                <input
                  type="checkbox"
                  id="furnished"
                  onChange={handleChange}
                  checked={formData.furnished}
                  className="w-5"
                />
                <span>Furnished</span>
              </div>
              <div className="flex gap-2 ">
                <input
                  type="checkbox"
                  id="offer"
                  onChange={handleChange}
                  checked={formData.offer}
                  className="w-5"
                />
                <span>Offer</span>
              </div>
            </div>
            <div className="flex flex-wrap gap-6">
              <div className=" flex items-center gap-2">
                <input
                  type="number"
                  id="bedrooms"
                  min="1"
                  max="10"
                  onChange={handleChange}
                  value={formData.bedrooms}
                  className="p-3 border-2 border-gray-400 rounded-lg "
                  required
                />
                <p>Beds</p>
              </div>
  
              <div className=" flex items-center gap-2">
                <input
                  type="number"
                  id="bathrooms"
                  min="1"
                  max="10"
                  onChange={handleChange}
                  value={formData.bathrooms}
                  className="p-3 border-2 border-gray-400 rounded-lg "
                  required
                />
                <p>Baths</p>
              </div>
  
              <div className=" flex items-center gap-2">
                <input
                  type="number"
                  id="regularPrice"
                  min="6000"
                  max="250000"
                  onChange={handleChange}
                  value={formData.regularPrice}
                  className="p-3 border-2 border-gray-400 rounded-lg "
                  required
                />
                <div className="flex flex-col items-center">
                  <p>Regular Price</p>
                  {formData.type == "rent" && (
                    
                    <p>(₹/Month)</p>
                  )}
                </div>
              </div>
              {formData.offer && (
  
              <div className=" flex items-center gap-2">
                <input
                  type="number"
                  id="discountPrice"
                  min="0"
                  max="250000"
                  onChange={handleChange}
                  value={formData.discountPrice}
                  className="p-3 border-2 border-gray-400 rounded-lg "
                  required
                />
                <div className="flex flex-col items-center">
                  <p>Discounted Price</p>
                  {formData.type == "rent" && (
                    
                    <p>(₹/Month)</p>
                  )}
                </div>
              </div>
  
              )}
  
               
            </div>
          </div>
          <div className="flex flex-col flex-1 gap-4">
            <p className="font-semibold text-lime-800">
              Images:
              <span className="font-normal ml-2">
                The First Image will be the cover (max 6)
              </span>
            </p>
            <div className="flex gap-4 mt-2">
              <input
                onChange={(e) => setFiles(e.target.files)}
                type="file"
                id="images"
                accept="image/*"
                className="p-3 border rounded-lg w-full border-lime-800"
                multiple
              />
              <button
                type="button"
                onClick={handleImageSubmit}
                className="border-0  bg-green-700 text-white rounded-lg p-4  uppercase hover:shadow-lg hover:bg-green-600 backdrop-blur-[10px]"
              >
                {uploading ? "Uploading" : "Upload"}
              </button>
            </div>
            <p className="text-red-700">
              {imageUploadError ? imageUploadError : ""}
            </p>
            {formData.imageUrls.length > 0 &&
              formData.imageUrls.map((url, index) => (
                <div
                  key={url}
                  className=" flex justify-between p-3 border-2 border-gray-400 rounded-lg"
                >
                  <img
                    src={url}
                    alt="listing image"
                    className="h-10 w-20 object-contain rounded-lg"
                  ></img>
  
                  <button
                    type="button"
                    onClick={() => handleDelete(index)}
                    className="p-3 bg-red-700 text-white rounded-lg uppercase hover:opacity-95 disabled:opacity-80"
                  >
                    Delete
                  </button>
                </div>
              ))}
            <button disabled={loading || uploading} className="p-3 bg-slate-700 text-white rounded-lg uppercase hover:opacity-95 disabled:opacity-80">
              {loading ? 'Loading' : 'Update Listing'}
            </button>
            {error && <p className="text-red-700 text-sm">{error}</p>}
          </div>
        </form>
      </main>
    );
  };
  
  export default UpdateListing;
  