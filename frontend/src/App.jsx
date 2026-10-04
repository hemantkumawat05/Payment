import React, { useEffect, useState } from 'react'
import { Route, Routes } from 'react-router-dom'
import Home from './pages/Home'
import Signup from './pages/Signup'
import Login from './pages/Login'
import Transcations from './controllers/Transcations'
import Navbar from './pages/Navbar'
import Setting from './pages/Setting'
import Profile from './pages/Profile'
const App = () => {
  const [token, setToken] = useState(localStorage.getItem('token') ? localStorage.getItem('token') : "")
  useEffect(() => {
    localStorage.setItem('token', token)
  }, [token])
  return (
    <div>
      {token === "" ? (
        <Routes>
          <Route path='/signup' element={<Signup />} />
          <Route path='*' element={<Login setToken={setToken} />} />
        </Routes>
      ) : (
        <>
          <Navbar setToken={setToken} />
          <Routes>
            <Route path='/' element={<Home token={token}/>} />
            <Route path='/transcation' element={<Transcations token={token}/>} />
            <Route path='/setting' element={<Setting token={token}/>} />
            <Route path='/profile' element={<Profile token={token}/>} />

          </Routes>
        </>
      )}
    </div>
  )
}

export default App