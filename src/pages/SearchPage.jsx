import React from 'react'

const SearchPage = () => {
  return (
    <div className='flex flex-col md:flex-row '>
        <div className='p-7 border-b-2 md:border-r-2 md:min-h-screen'>
            <form action="" className='flex flex-col gap-8'>
              <div className='flex items-center gap-2' >
                <label className='whitespace-nowrap font-semibold' htmlFor="">Search Term :</label>
                <input type="text" id='searchTerm'
                className='border rounded-lg p-3 w-full'
                placeholder='Search' />
              </div>
              <div className='flex gap-2 flex-wrap items-center'>
                <label htmlFor="" className='font-semibold'>Type:</label>
                <div className='flex gap-2'>
                  <input type="checkbox" id="all" 
                  className='w-5'/>
                  <span>Rent & Sale</span>
                </div>
                <div className='flex gap-2'>
                  <input type="checkbox" id="rent" 
                  className='w-5'/>
                  <span>Rent</span>
                </div>
                <div className='flex gap-2'>
                  <input type="checkbox" id="sale" 
                  className='w-5'/>
                  <span>Sale</span>
                </div>
                <div className='flex gap-2'>
                  <input type="checkbox" id="offer" 
                  className='w-5'/>
                  <span>Offer</span>
                </div>
              </div>
              <div className='flex gap-2 flex-wrap items-center'>
                <label htmlFor="" className='font-semibold'>Amenities:</label>
                <div className='flex gap-2'>
                  <input type="checkbox" id="parking" 
                  className='w-5'/>
                  <span>Parking</span>
                </div>
                <div className='flex gap-2'>
                  <input type="checkbox" id="furnished" 
                  className='w-5'/>
                  <span>Furnished</span>
                </div>
              </div>
              <div className='flex items-center gap-2'>
                <label htmlFor="" className='font-semibold'>Sort</label>
                <select name="" id="sort_order" className='border border-lime-800   rounded-lg w-fit p-2 focus:outline-none '>
                  <option   value="">Price High to Low</option>z
                  <option  value="">Price low to Low</option>
                  <option  value="">Latest</option>
                  <option  value="">Oldest</option>
                </select>
              </div>
              <button type='button' className='bg-lime-800 text-white p-3 rounded-lg uppercase hover:opacity-95'> Search</button>
            </form>
        </div>
        <div className=''>
            <h1 className='text-3xl font-bold border-b p-3 text-lime-700 mt-5'>Listing Results :</h1>
        </div>
    </div>
  )
}

export default SearchPage
