import React, { useEffect } from "react";
import { FaSearch } from "react-icons/fa";
import { Link ,useNavigate} from "react-router-dom";
import { useSelector } from "react-redux";
import { useState } from "react";

const Header = () => {
  const navigate = useNavigate(); 
  const { currentUser } = useSelector((state) => state.user);
  const [searchTerm,setSearchTerm] = useState('');
  const handleSubmit = (e) =>{
    e.preventDefault();
    const urlParams = new URLSearchParams(window.location.search)
    urlParams.set('searchTerm',searchTerm);
    const searchQuery= urlParams.toString();
    navigate(`/search?${searchQuery}`)
    
  }
  useEffect(()=>{
    const urlParams = new URLSearchParams(window.location.search)
    const searchTermFromUrl = urlParams.get('searchTerm');
    if(searchTermFromUrl){
      setSearchTerm(searchTermFromUrl)
    }
  },[location.search])
  return (
    <header className="bg-yellow-300 shadow-md ">
      <div className="flex justify-between items-center max-w-6xl mx-auto p-2 sm:p-3 gap-3">
        <Link to="/">
          <h1 className="text-xl sm:text-3xl font-bold sm:font-extrabold  flex flex-wrap ">
            <span className="text-lime-600">Nest</span>
            <span className="text-lime-800 ">Quest</span>
          </h1>
        </Link>
        <form
          onSubmit={handleSubmit}
          className="bg-yellow-100 p-3 rounded-lg flex items-center"
        >
          <input
            type="text"
            placeholder="Search..."
            value={searchTerm}
            onChange={(e)=> setSearchTerm(e.target.value)}
            className="bg-transparent focus:outline-none w-20 sm:w-64"
          />
          <button>

          <FaSearch className="text-lime-800" />
          </button>
        </form>
        <ul className="flex justify-center items-center gap-4 font-3xl font-semibold">
          <Link to="/">
            <li className="hidden sm:inline text-lime-800 hover:text-lime-600 cursor-pointer">
              Home
            </li>
          </Link>
          <Link to="/about">
            <li className="hidden sm:inline text-lime-800 hover:text-lime-600 cursor-pointer">
              About
            </li>
          </Link>

          <Link to="/profile">
            {currentUser ? (
              <img src={currentUser.avatar} className="h-10 rounded-full  w-10 object-cover"></img>
            ) : (
              <li className="truncate text-white text-sm sm:text-l hover:text-white cursor-pointer bg-lime-800 rounded-md  px-4 py-2 f  ">
                Sign in
              </li>
            )}
          </Link>
        </ul>
      </div>
    </header>
  );
};

export default Header;
