import React from 'react'
import { BrowserRouter,Routes,Route } from 'react-router-dom'
import SignUp from './pages/SignUp'
import Home from './pages/Home'
import SignIn from './pages/SIgnIn'
import About from './pages/About'
import Profile from './pages/Profile'
import Header from './components/Header'
import CreateListing from './pages/CreateListing'
import PrivateRoute from './components/PrivateRoute'
export default function App(){
  return (

    <BrowserRouter>
      <Header/>
      
      <div className="absolute inset-0 -z-10 h-dvh w-full bg-lime-50 bg-[linear-gradient(to_right,#8080800a_1px,transparent_1px),linear-gradient(to_bottom,#8080800a_1px,transparent_1px)] bg-[size:14px_24px]"><div class="absolute left-0 right-0 top-0 -z-10 m-auto h-[310px] w-[310px] rounded-full bg-lime-400 opacity-20 blur-[100px]">
        
        </div></div>
      <Routes >
        
        <Route path='/' element={<Home/>}/>
        <Route path='/sign-in' element={<SignIn/>}/>
        <Route path='/sign-up' element={<SignUp/>}/>
        <Route path='/about' element={<About/>}/>
        <Route  element={<PrivateRoute/>}>
          < Route path='/profile' element={<Profile/>}/>
          < Route path='/create-listing' element={<CreateListing/>}/>
        </Route>
      </Routes>
    </BrowserRouter>
    
  )
}


