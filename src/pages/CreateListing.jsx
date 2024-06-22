import { getDownloadURL, getStorage, uploadBytes, uploadBytesResumable } from 'firebase/storage';
import React from 'react';
import { app } from "../firebase";
import { useState } from 'react';
import { ref } from 'firebase/storage';
import { setupListeners } from '@reduxjs/toolkit/query';
const CreateListing = () => {
    const [files, setFiles] = useState({});
    const [formData, setFormData] = useState({
        imageUrls: [],

    });
    const [imageUploadError, setImageUploadError] = useState(false);
    const  [uploading, setUploading] = useState(false);
    console.log(formData)
    const handleImageSubmit = (e) =>{
        if(files.length > 0 && files.length +formData.imageUrls.length<7){
            console.log("call")
            setUploading(true);
            setImageUploadError(false)
            const promises = [];
            for (let i = 0; i < files.length; i++) {
                promises.push(storeImage(files[i]))

            }
            
                Promise.all(promises).then((urls) => {
                    setFormData({...formData , imageUrls: formData.imageUrls.concat(urls)});
                    setImageUploadError(false);setUploading(false)
                }).catch((e) => {
                    setImageUploadError('Max Size of Image can be 2 mb')
                    console.log(e);
                    setUploading(false);
                });
                
        }
        else{
            setImageUploadError('you can only upload min 1 and max 6 images of the property');
           setUploading(false)
        }
    }
    const storeImage = async(file) =>{
        return new Promise ((resolve,reject) => {
            const storage = getStorage(app);
                const fileName = file.name + new Date().getTime();
                const storageRef = ref(storage, fileName);
                const uploadTask = uploadBytesResumable(storageRef,file);
                uploadTask.on(
                    "state_changed",
                    (snapshot) =>{
                        const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100 ;
                        console.log(`Upload is ${progress}% done`);
                    },
                    (error)=>{
                        reject(error)
                    },
                    () => {
                        getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) =>{
                            resolve(downloadURL)
                        })
                    }
                )

        })
    }
    const handleDelete =(index) =>{
        setFormData({
            ...formData,
            imageUrls : formData.imageUrls.filter((_,i) => i !== index),
        })
    }
  return (
    <main className='p-3 max-w-4xl mx-auto '>
        <h1 className='text-3xl font-bold text-center my-7 text-lime-800'>Create Listing</h1>
        <form className='flex flex-col sm:flex-row font-semibold text-lime-800 gap-4'>
            <div className='flex flex-col gap-4 flex-1'>
                <input type="text" placeholder='Name' className='border p-3 rounded-lg ' id='name' maxLength='62' minLength='10' required/>

                <textarea type="text" placeholder='Description' className='border p-3 rounded-lg ' id='description' maxLength='62' minLength='10' required/>

                <input type="text" placeholder='Address' className='border p-3 rounded-lg ' id='address' required/>

                <div className='flex flex-wrap gap-4'>
                    <div className='flex gap-2 '>
                        <input type="checkbox" id='sale' className='w-5'/>
                        <span>Sell</span>
                    </div>
                    <div className='flex gap-2 '>
                        <input type="checkbox" id='rent' className='w-5'/>
                        <span>Rent</span>
                    </div>
                    <div className='flex gap-2 '>
                        <input type="checkbox" id='parking' className='w-5'/>
                        <span>Parking Spot</span>
                    </div>
                    <div className='flex gap-2 '>
                        <input type="checkbox" id='furnished' className='w-5'/>
                        <span>Furnished</span>
                    </div>
                    <div className='flex gap-2 '>
                        <input type="checkbox" id='offer' className='w-5'/>
                        <span>Offer</span>
                    </div>
                </div>
                <div className='flex flex-wrap gap-6'>
                    <div className=' flex items-center gap-2'>
                        <input type="number" id='bedrooms' min='1' max='10' className='p-3 border-2 border-gray-400 rounded-lg ' required/>
                        <p>Beds</p>
                    </div>
                    
                    <div className=' flex items-center gap-2'>
                        <input type="number" id='baths' min='1' max='10' className='p-3 border-2 border-gray-400 rounded-lg ' required/>
                        <p>Baths</p>
                    </div>

                    <div className=' flex items-center gap-2'>
                        <input type="number" id='regularPrice' min='1' max='10' className='p-3 border-2 border-gray-400 rounded-lg ' required/>
                        <div className='flex flex-col items-center'>
                        <p>Regular Price</p>
                        <p>(₹/Month)</p>
                        </div>
                    </div>

                    <div className=' flex items-center gap-2'>
                        <input type="number" id='regularPrice' min='1' max='10' className='p-3 border-2 border-gray-400 rounded-lg ' required/>
                        <div className='flex flex-col items-center'>
                        <p>Discounted Price</p>
                        <p>(₹/Month)</p>
                        </div>
                    </div>

                </div>
            </div>
            <div className='flex flex-col flex-1 gap-4'>
                <p className='font-semibold text-lime-800'>Images:
                    <span className='font-normal ml-2'>The First Image will be the cover (max 6)</span>
                </p>
                <div className='flex gap-4 mt-2'>
                    <input onChange={(e)=> setFiles(e.target.files)} type="file" id='images' accept='image/*' className='p-3 border rounded-lg w-full border-lime-800' multiple/>
                    <button type='button'
                    onClick={handleImageSubmit} className='border-0  bg-green-700 text-white rounded-lg p-4  uppercase hover:shadow-lg hover:bg-green-600 backdrop-blur-[10px]'>{uploading ? 'Uploading' : 'Upload'}</button>
                </div>
            <p className='text-red-700'>{imageUploadError ? imageUploadError :""}</p>
            {formData.imageUrls.length > 0 && formData.imageUrls.map((url,index) =>(
                <div key={url} className=' flex justify-between p-3 border-2 border-gray-400 rounded-lg'>
                    <img src={url} alt="listing image" className='h-10 w-20 object-contain rounded-lg'></img>

                    <button type='button' onClick={()=> handleDelete(index)} className='p-3 bg-red-700 text-white rounded-lg uppercase hover:opacity-95 disabled:opacity-80'>Delete</button>
                </div>

            ))}
            <button className='p-3 bg-slate-700 text-white rounded-lg uppercase hover:opacity-95 disabled:opacity-80'>Create Listing</button>
            </div>
        </form>
    </main>
  )
}

export default CreateListing
