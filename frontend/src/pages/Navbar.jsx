import React from 'react'

const Navbar = () => {
  return (
    <div className='text-yellow-500 bg-black py-3 px-25 flex justify-between'>
        <div className='flex gap-5'>
            <div className='bg-gray-200 rounded-xl px-2 py-1 cursor-pointer hover:bg-white text-black'>Logo</div>
        </div>
        <div className='flex gap-7'>
            <div className='bg-gray-200 rounded-xl px-2 py-1 cursor-pointer hover:bg-white text-black'>Profile</div>
            <div className='bg-gray-200 rounded-xl px-2 py-1 cursor-pointer hover:bg-white text-black'>Our Transcation</div> 
        </div>
         

        <div className='flex gap-2 mx-5'>
            <div className='bg-gray-200 rounded-xl px-2 py-1 cursor-pointer hover:bg-white text-black'>Logout</div>
        </div>
    </div>
  )
}

export default Navbar