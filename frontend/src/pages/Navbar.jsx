import React from 'react'
import { Link } from 'react-router-dom'
const Navbar = ({ setToken }) => {
  return (
    <div className='bg-[#0A2540] py-3 px-25 flex justify-between'>
      <Link to='/'><div className='flex gap-5'>
        <p className='bg-blue-400 px-3 py-2 text-white font-bold rounded-lg'>₹</p>
        <p className='text-white py-2 font-bold'>Payments</p>
      </div>
      </Link>
      <div className='flex gap-5'>
        <Link to='/'><div className='bg-[#0F4A8A] py-2 px-3 rounded-lg text-white font-bold cursor-pointer hover:bg-[#0369A1]'>Dashboard</div></Link>
        <Link to='/transcation'><div className='bg-[#0F4A8A] py-2 px-3 rounded-lg text-white font-bold cursor-pointer hover:bg-[#0369A1]'>Transcation</div> </Link>
      </div>
      <div className='flex gap-4 mx-5'>
        <div className='bg-blue-400 py-2 px-4 rounded-full text-white font-bold cursor-pointer hover:bg-blue-600'>P</div>

        <div onClick={() => { if (setToken) setToken(''); localStorage.removeItem('token'); }} className='bg-red-700 py-2 px-3 rounded-lg text-white font-bold cursor-pointer hover:bg-red-800'>Logout</div>
      </div>
    </div>
  )
}

export default Navbar