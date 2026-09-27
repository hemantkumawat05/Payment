import axios from 'axios'
import React from 'react'
import { useEffect } from 'react'
import { useState } from 'react'

const Sendmoney = ({userId}) => {
    const [pin,setPin]=useState()
    const [ammount,setAmmount]=useState()

    const sendammount=async()=>
    {
        try
        {
            if(!pin || pin.length!==6)
            {
                return alert("Enter 6 Digit Valid Pin")
            }
            if(!ammount || Number(ammount) <= 0)
            {
                return alert("Enter a valid amount")
            }
            const response= await axios.post('http://localhost:3000/api/transaction/sendamount',{reciverid:userId,amount:ammount,senderPin:pin,senderId:'6ab4e5bcd5a3b8617e3c7c6c'})
            if(!response.data.success)
            {
                return alert(response.data.message)
            }
            alert("Amount Sent Successfully! Remaining Balance: ₹" + response.data.blance)
            setPin('')
            setAmmount('')
        }
        catch(error)
        {
            const errorMsg = error.response?.data?.message || error.message;
            alert("Transaction Failed: " + errorMsg);
        }
    }
  return (
    <div>
        <div>
           {userId}

              {/* <div className='p-4 border rounded max-w-md bg-white shadow-sm mt-3'>
        <div className='mb-2'>
           <strong>Receiver ID:</strong> {userId} */}


        </div>
        <div>
            <label>Enter the Ammount</label>
            <input type="Number" placeholder='₹ 5000' onChange={(e)=>setAmmount(e.target.value)} />
        
        
        
         {/* <div className='mb-2'>
            <label className='block font-medium'>Enter the Amount</label>
            <input 
                type="number" 
                placeholder='₹ 5000' 
                value={ammount}
                className='border p-2 w-full rounded'
                onChange={(e)=>setAmmount(e.target.value)} 
            /> */}
        </div>
        <div>
            <label>Enter The Pin</label>
            <input type="Number"placeholder='123456' onChange={(e)=>setPin(e.target.value)}/>
        
        


         {/* <div className='mb-3'>
            <label className='block font-medium'>Enter 6-Digit PIN</label>
            <input 
                type="password"
                placeholder='123456' 
                maxLength={6}
                value={pin}
                className='border p-2 w-full rounded'
                onChange={(e)=>setPin(e.target.value)}
            /> */}
        
        </div>
        <button onClick={sendammount}>Send Money</button>

        <button 
            // disabled={loading}
            onClick={sendammount} 
            className='bg-black text-white px-4 py-2 rounded hover:bg-gray-800 cursor-pointer disabled:bg-gray-400'
        >
            {'Send Money'}
        </button>
    </div>
  )
}

export default Sendmoney