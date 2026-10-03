import axios from 'axios'
import React, { useEffect, useState } from 'react'
import Showusers from '../controllers/Showusers'

const Dashboard = ({ token }) => {
    const [balance, setBalance] = useState("****")
    const [pin, setPin] = useState("")
    const [userName, setUserName] = useState("")

    const fetchUserProfile = async () => {
        try {
            const response = await axios.get('http://localhost:3000/api/user/profile', {
                headers: { token }
            });
            if (response.data && response.data.success) {
                setUserName(response.data.userData.name);
            }
        } catch (error) {
            console.log(error);
        }
    };

    useEffect(() => {
        if (token) {
            fetchUserProfile();
        }
    }, [token]);

    const balancecheck = async () => {
        try {
            if (!pin) {
                return alert("Enter Valid Pin")
            }
            const response = await axios.post('http://localhost:3000/api/transaction/balance', { pin }, { headers: { token } });
            if (response.data && response.data.success) {
                setBalance(response.data.balance);
                setPin("")
            } else {
                alert(response.data?.message || "Failed to fetch balance");
            }
        } catch (error) {
            console.log(error);
            alert("Error fetching balance: " + (error.response?.data?.message || error.message));
        }
    };
    return (
        <div className='px-25'>
            <div className='flex'>
                <p className='font-bold text-4xl my-3'>Welcome back, </p>
                <p className='font-bold text-4xl my-3 text-blue-500'>{userName ? userName : "Account Holder Name"}</p>

            </div>
            <p className='text-[#334155]'>Manage wallet balance, peer to peer transfers, and live transaction ledger</p>

            <div className='bg-blue-400 rounded-xl p-4 w-[50%]'>
                <p className='text-[#334155] font-bold text-xl'>PAYMENTS PRIMARY WALLET</p>
                <p className='text-[#334155] font-bold text-lg font-normal'>Check Balance</p>
                <b className='text-2xl'>₹ {balance}</b>
                <div>
                    <input value={pin} onChange={(e) => setPin(e.target.value)} className='border-2 border-blue-900 hover:border-blue-400 py-2 px-2 bg-[#F1F5F9] rounded-lg' placeholder='Enter 6 Digit Pin' type="Number" />
                    <button onClick={balancecheck} className='bg-blue-900 text-white rounded-lg text-lg px-2 mx-2 py-2 cursor-pointer hover:bg-blue-700'>Check Balance</button>
                </div>
                <div className='mt-2'>
                    <button onClick={(e) => setBalance("****")} className='bg-blue-900 text-white rounded-lg text-lg px-2 py-2 cursor-pointer hover:bg-blue-700'>Hide Balance</button>
                </div>
            </div>
            <Showusers token={token} />
        </div>
    )
}

export default Dashboard