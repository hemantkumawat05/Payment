import axios from 'axios'
import React, { useState } from 'react'

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
            const response=await axios.get('http://localhost:3000/api/transaction/balance',{userid:'6ab4e5bcd5a3b8617e3c7c6c',pin})
            if(response)
            {
                setBalance(response.data.balance)
            }
        }
        catch(error)
        {
            console.log(error)
        }
    }
  return (
    <div className=''>
        <div>
            WelCome Account Holder Name
        </div>
        <div className='px-5 py-3'>
            <p className='font-bold'>Check Account Balance {balance}</p>
            <input onChange={(e)=>setPin(e.target.value)} className='border-2 py-2 mx-2 rounded-xs'placeholder='Enter 6 Digit Pin' type="Number" />
            <button onClick={balancecheck} className='bg-black text-white rounded-xs px-2 py-2 cursor-pointer hover:bg-gray-500'>Check Balance</button>
            
        </div>
        <div>
            Show All Users
            UserName UPI I'd=User _id from database Send Money
        </div>
    </div>
  )
}

export default Dashboard