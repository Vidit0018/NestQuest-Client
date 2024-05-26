import React from 'react';
import { Link } from 'react-router-dom';

const SignUp = () => {
  return (
    <>
    
    <div className='p-3 max-w-lg mx-auto'>
    <h1 className='text-3xl text-lime-800 text-center font-bold my-7 '>
    SignUp
    </h1> 
    <form action="" className='flex flex-col gap-4'>
      <input type="text" placeholder='Username' className='border p-3 rounded-lg focus:outline-none' id='username'/>
      <input type="email" placeholder='Email' className='border p-3 rounded-lg focus:outline-none' id='email'/>
      <input type="password" placeholder='Password' className='border p-3 rounded-lg focus:outline-none' id='password'/>
      <button className='bg-lime-800 text-white rounded-lg uppercase p-3 font-semibold hover:opacity-95 disabled:opacity-80'>Sign Up</button>
    </form>
    <div className='flex gap-2 mt-5'>
      <p>Have an account ?</p>
      <Link to='/sign-in' >
        <span className='text-blue-800 font-semibold'>Sign in</span>
      </Link>
    </div>
    </div>
    </>
  )
}

export default SignUp
