import React, { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom';
import {Swiper,SwiperSlide} from 'swiper/react';
import SwiperCore from 'swiper';
import { Navigation } from 'swiper/modules';
import 'swiper/css/bundle'
const Listing = () => {
     SwiperCore.use([Navigation]);
    const params= useParams();
    const [listing, setListing] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(false);
    const listingId = params.listingId;
    useEffect(() => {
        const fetchListing = async () => {
          try {
            setLoading(true);
            console.log("fetch fxn call")
            const res = await fetch(`/api/listing/get/${params.listingId}`);
            const data = await res.json();
            if (data.success === false) {
              setError(true);
              setLoading(false);
              return;
            }
            setListing(data);
            setLoading(false);
            setError(false);
          } catch (error) {
            setError(true);
            setLoading(false);
          }
        };
        fetchListing();
      },[params.listingId]);
    
  return (
    <main>
      {loading && <p className='text-center text-lime-800 my-7 text-2xl font-semibold'>Loading</p>}
      {error && <p className='text-center text-red-700 my-7 text-2xl font-semibold'>Something Went Wrong</p>}
      {listing && !loading && !error && (
        <>
        <Swiper navigation>
            {listing.imageUrls.map((url)=>(
                <SwiperSlide key={url}>
                    <div className='h-[500px]'
                    style={{background : `url(${url})
                    center no-repeat 
                    `, backgroundSize:'cover'}}
                    >

                    </div>
                </SwiperSlide>
            ))}
        </Swiper>
        </>
      )}
    </main>
  )
}

export default Listing
