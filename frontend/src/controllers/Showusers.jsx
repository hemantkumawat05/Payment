import axios from 'axios';
import React from 'react'
import { useEffect } from 'react';
import { useState } from 'react'
import Sendmoney from './Sendmoney';

const Showusers = () => {
    const [user, setUser] = useState(null);
    const [selectedUserId,setSelectedUserId]=useState(null)
    

    const getusers = async () => {
        try {
            const data = await axios.get('http://localhost:3000/api/user/userdata', { params: { excludeId: '6ab4e5bcd5a3b8617e3c7c6c' }} )
            if (!data || data.length === 0) {
                alert('Users Not Found')
            }
            setUser(data.data.users)
        }
        catch (error) {
            console.log(error)
        }
    }

    useEffect(() => {
        getusers()
    }, [])

    if (selectedUserId) {
        return (
            <div>
                <button 
                    onClick={() => setSelectedUserId(null)} 
                    className='bg-gray-500 text-white p-2 rounded mb-4 cursor-pointer'
                >
                    Back to Users
                </button>
                <Sendmoney userId={selectedUserId} />
            </div>
        );
    }

    return (
        <div>
            <div>
                <h2>User List</h2>

                
                {!user && <p>Loading users...</p>}
                {user && user.length === 0 && <p>No users found.</p>}

                <ul>
                    {user && user.map((e) => (
                        <li key={e._id}>
                            <strong>ID:</strong> {e._id} | <strong>Name:</strong> {e.name}  | <button  onClick={() => setSelectedUserId(e._id)}  className='bg-black text-white rounded-xs m-1 p-1 hover:bg-blue-500 cursor-pointer'>Send Amount</button>
                        </li>
                    ))}
                </ul>
            </div>

        </div>
    )
}

export default Showusers