import React from 'react'
import {FaSearch} from 'react-icons/fa'
import { Link } from 'react-router-dom'

const Header = () => {
  return (
    <header className='bg-yellow-300 shadow-md '>
        <div className='flex justify-between items-center max-w-6xl mx-auto p-3 gap-4'>
        <Link to='/'>

        <h1 className='text-xl sm:text-3xl font-bold sm:font-extrabold  flex flex-wrap '>
            <span className='text-lime-600'>Nest</span>
            <span className='text-lime-800 '>Quest</span>
        </h1>
        </Link>
        <form action="" className='bg-yellow-100 p-3 rounded-lg flex items-center'>
            <input type="text" placeholder='Search...' className='bg-transparent focus:outline-none w-24 sm:w-64' />
            <FaSearch className='text-lime-800'/>
        </form>
        <ul className='flex justify-center items-center gap-4 font-3xl font-bold'>
            <Link to='/'>
            <li className='hidden sm:inline text-lime-800 hover:text-lime-600 cursor-pointer'>Home</li>
            </Link>
            <Link to='/about'>
            <li className='hidden sm:inline text-lime-800 hover:text-lime-600 cursor-pointer'>About</li>
            </Link>
            <Link to='/sign-in'>
            <li className='text-white hover:text-white cursor-pointer bg-lime-800 rounded-md px-4 py-2'>Sign-in</li>
            </Link>
        </ul>

        </div>
    </header>
  )
}

export default Header
