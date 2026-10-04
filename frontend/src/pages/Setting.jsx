import React from 'react'

const Setting = ({ token }) => {
    return (
        <div className='px-25 pt-5 bg-blue-50 '>
            <div>
                <h1 className='flex text-5xl font-bold'>
                    <p>Security, PIN & </p>
                    <p className='text-blue-800'> Account Setting</p>
                </h1>
                <p className='mt-2 text-gray-500'>Manage your 6-digit transaction PIN, multi-factor authentication, active login devices, and profile pricacy.</p>

            </div>
            <div className='flex w-full h-full '>
                <div className='w-[50%] border-1 m-2 pt-3 px-5 rounded-xl border-gray-400 bg-white'>
                    <div>
                        <p className='text-2xl font-bold '>6-DIgit Transaction PIN Management</p>
                        <p className='text-sm text-gray-500'>Your PIN is required to authorize every money transfer or withdrawal.</p>
                    </div>
                    <div className='flex flex-col'>
                        <label >Enter Current 6-Digit PIN</label>
                        <input className='border-1 py-2 px-2 rounded-xl bg-gray-100 border-gray-700' type="number" placeholder='Current PIN' />
                    </div>
                    <div className='flex flex-col'>
                        <label >Enter New 6-Digit PIN</label>
                        <input className='border-1 py-2 px-2 rounded-xl bg-gray-100 border-gray-700' type="number" placeholder='New PIN' />
                    </div>
                    <div className='flex flex-col'>
                        <label >Re-Enter New 6-Digit PIN to Confirm</label>
                        <input className='border-1 py-2 px-2 rounded-xl bg-gray-100 border-gray-700' type="number" placeholder='Confirm new PIN' />
                    </div>
                    <div>
                        <button className='bg-blue-700 border-1 border-blue-800 hover:bg-blue-900 rounded-xl text-white font-bold p-2 my-2'>Update Security PIN</button>
                    </div>

                    <div className='border-t-1 my-5 border-gray-300'>
                        <div>
                            <p className='text-2xl font-bold '>Account Password</p>
                            <p className='text-sm text-gray-500'>Change your authentication password (minimum 8 characters).</p>
                        </div>
                        <div className='flex flex-col'>
                            <label >Enter Current Password</label>
                            <input className='border-1 py-2 px-2 rounded-xl bg-gray-100 border-gray-700' type="password" placeholder='Current PIN' />
                        </div>
                        <div className='flex flex-col'>
                            <label >New Strong Password</label>
                            <input className='border-1 py-2 px-2 rounded-xl bg-gray-100 border-gray-700' type="password" placeholder='Enter Strong Password (Minimum 8 characters)' />
                        </div>
                        <div>
                            <button className='bg-blue-700 border-1 border-blue-800 hover:bg-blue-900 rounded-xl text-white font-bold p-2 my-2'>Update Password</button>
                        </div>
                    </div>
                </div>




                <div className='flex flex-col w-[50%]'>
                    <div className='border-1 border-gray-400 rounded-xl m-2 p-2 bg-white pb-10'>
                        <div className='border-1 border-gray-100 bg-gray-100 hover:bg-gray-200 px-4 py-1 mx-1 my-1 rounded-xl'>
                            <h3 className='font-bold text-lg'>Account Protection Policies</h3>
                            <p className='text-sm text-gray-500'>Enterprise-grade multi-layer fraud protection</p>
                        </div>
                        <div className='border-1 border-gray-100 bg-gray-100 hover:bg-gray-200 px-4 py-1 mx-1 my-1 rounded-xl'>
                            <h3 className='font-bold text-lg'>Account Protection Policies</h3>
                            <p className='text-sm text-gray-500'>Enterprise-grade multi-layer fraud protection</p>
                        </div>
                        <div className='border-1 border-gray-100 bg-gray-100 hover:bg-gray-200 px-4 py-1 mx-1 my-1 rounded-xl'>
                            <h3 className='font-bold text-lg'>Account Protection Policies</h3>
                            <p className='text-sm text-gray-500'>Enterprise-grade multi-layer fraud protection</p>
                        </div>
                        <div className='border-1 border-gray-100 bg-gray-100 hover:bg-gray-200 px-4 py-1 mx-1 my-1 rounded-xl'>
                            <h3 className='font-bold text-lg'>Account Protection Policies</h3>
                            <p className='text-sm text-gray-500'>Enterprise-grade multi-layer fraud protection</p>
                        </div>

                    </div>
                    <div className='border-1 border-gray-400 rounded-xl m-2 p-2 bg-white pb-10'>
                        <div className='border-1 border-gray-100 bg-gray-100 hover:bg-gray-200 px-4 py-1 mx-1 my-1 rounded-xl'>
                            <h3 className='font-bold text-lg'>Account Protection Policies</h3>
                            <p className='text-sm text-gray-500'>Enterprise-grade multi-layer fraud protection</p>
                        </div>
                        <div className='border-1 border-gray-100 bg-gray-100 hover:bg-gray-200 px-4 py-1 mx-1 my-1 rounded-xl'>
                            <h3 className='font-bold text-lg'>Account Protection Policies</h3>
                            <p className='text-sm text-gray-500'>Enterprise-grade multi-layer fraud protection</p>
                        </div>
                        <div className='border-1 border-gray-100 bg-gray-100 hover:bg-gray-200 px-4 py-1 mx-1 my-1 rounded-xl'>
                            <h3 className='font-bold text-lg'>Account Protection Policies</h3>
                            <p className='text-sm text-gray-500'>Enterprise-grade multi-layer fraud protection</p>
                        </div>
                        <div className='border-1 border-gray-100 bg-gray-100 hover:bg-gray-200 px-4 py-1 mx-1 my-1 rounded-xl'>
                            <h3 className='font-bold text-lg'>Account Protection Policies</h3>
                            <p className='text-sm text-gray-500'>Enterprise-grade multi-layer fraud protection</p>
                        </div>
                    </div>
                </div>
            </div>

        </div>
    )
}

export default Setting