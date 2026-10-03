import axios from 'axios';
import React from 'react'
import { useEffect } from 'react';
import { useState } from 'react'
import Sendmoney from './Sendmoney';

const Showusers = ({ token }) => {
    const [user, setUser] = useState(null);
    const [selectedUserId, setSelectedUserId] = useState(null)


    const getusers = async () => {
        try {
            const data = await axios.get('http://localhost:3000/api/user/userdata', {
                headers: { token }
            })
            if (data.data && data.data.success) {
                setUser(data.data.users || [])
            } else {
                setUser([])
            }
        }
        catch (error) {
            console.log(error)
            setUser([])
        }
    }

    useEffect(() => {
        getusers()
    }, [token])

    if (selectedUserId) {
        return (
            <div>
                <button
                    onClick={() => setSelectedUserId(null)}
                    className='bg-gray-500 text-white p-2 rounded mb-4 cursor-pointer'
                >
                    Back to Users
                </button>
                <Sendmoney userId={selectedUserId} token={token} />
            </div>
        );
    }

    return (
        <div className='border-1 rounded-xl py-3 my-3 px-3'>
            <div>
                <h2 className='text-4xl font-bold  mt-3'>Payments User Directory</h2>
                <p className='text-sm text-gray-500 mt-1 mb-4'>Select any verified registered user to send money directly</p>


                <div>
                    {!user && <p>Loading users...</p>}
                    {user && user.length === 0 && <p>No users found.</p>}

                    <ul>
                        <li className='flex'>
                                <div className='px-3 py-2 font-bold'>S No.</div>
                                <div className='px-3 py-2 font-bold'>
                                    User Name
                                </div>
                                <div className='px-40 py-2 font-bold'>Id</div> 
                                <div className='px-2 py-2 font-bold'>Verified</div>
                                <button className='px-10 py-2 font-bold'>Action</button>
                            </li>
                        {user && user.map((e,index) => (
                            <li key={e._id} className='flex'>
                                <div className='px-3 py-2'>{index+1}.</div>
                                <div className='flex mx-5'>
                                    <div className='bg-black text-white rounded-full px-3 py-2 mx-3 my-2'>H</div>
                                    <div>
                                        <p className='font-bold'>{e.name}</p>
                                        <p className='text-sm'> {'user@gmail.com'}</p>
                                    </div>
                                </div>
                                <div className='text-gray-700 mx-5 my-2'>{e._id}</div> 
                                <div className='text-green-600 bg-green-100  my-2 px-3 rounded-lg mx-5 text-center'>Verified</div>
                                <button onClick={() => setSelectedUserId(e._id)} className='bg-blue-900 text-white hover:bg-blue-800 rounded-lg my-2 px-3'>Send Amount</button>
                            </li>
                        ))}
                    </ul>
                </div>



            </div>

        </div>
    )
}

export default Showusers