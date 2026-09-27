import axios from 'axios'
import React, { useState } from 'react'
import Showusers from '../controllers/Showusers'

const Dashboard = () => {
    const [balance,setBalance]=useState("****")
    const [pin,setPin]=useState()
    const balancecheck=async()=>
    {
        try{
            if(!pin || pin.length!==6)
            {
                alert("Enter 6 Digit Valid Pin")
            }
            const response = await axios.post('http://localhost:3000/api/transaction/balance', { userid: '6ab4e5bcd5a3b8617e3c7c6c', pin });
            if (response.data && response.data.success) {
                setBalance(response.data.balance);
            } else {
                alert(response.data?.message || "Failed to fetch balance");
            }
        } catch (error) {
            console.log(error);
            alert("Error fetching balance: " + (error.response?.data?.message || error.message));
        }
    };
  return (
    <div className=''>
        <div>
            WelCome Account Holder Name
        </div>
        <div className='px-5 py-3'>
            <p className='font-normal'>Check Account Balance <b>(₹{balance})</b></p>
            <input onChange={(e)=>setPin(e.target.value)} className='border-2 py-2 mx-2 rounded-xs'placeholder='Enter 6 Digit Pin' type="Number" />
            <button onClick={balancecheck} className='bg-black text-white rounded-xs px-2 py-2 cursor-pointer hover:bg-gray-500'>Check Balance</button>
            
        </div>
        <Showusers/>
    </div>
  )
}

export default Dashboard