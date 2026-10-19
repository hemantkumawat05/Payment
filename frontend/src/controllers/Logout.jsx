import React from 'react'
import { AppData } from '../context/AppContext'
import { useNavigate } from 'react-router-dom'



const Logout = () => {
  const {logoutUser}=AppData()
  const navigate=useNavigate()
  return (
    <div>
        <button className='border border-1 border-red-500 bg-red-500 hover:bg-red-700 m-2 p-2' onClick={() => logoutUser(navigate)}>Logout Button</button>
    </div>
  )
}

export default Logout