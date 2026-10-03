import axios from 'axios'
import React from 'react'
import { useEffect } from 'react'
import { useState } from 'react'

const Sendmoney = ({ userId, token }) => {
    const [pin, setPin] = useState('')
    const [ammount, setAmmount] = useState('')

    const sendammount = async () => {
        try {
            if (!pin) {
                return alert("Enter Valid Pin")
            }
            if (!ammount || Number(ammount) <= 0) {
                return alert("Enter a valid amount")
            }
            const response = await axios.post('http://localhost:3000/api/transaction/sendamount', { reciverid: userId, amount: ammount, senderPin: pin }, { headers: { token } })
            if (!response.data.success) {
                return alert(response.data.message)
            }
            alert("Amount Sent Successfully! Remaining Balance: ₹" + response.data.blance)
            setPin('')
            setAmmount('')
        }
        catch (error) {
            const errorMsg = error.response?.data?.message || error.message;
            alert("Transaction Failed: " + errorMsg);
        }
    }
    return (
        <div className='px-5 border-2 rounded-xl mx-auto w-[25%] py-5'>
            <div>
                <h2 className='font-bold text-2xl '>Send Money Instantly</h2>
                <p className='text-sm'>Direct wallet-to-wallet transfer</p>
            </div>
            <div className='flex justify-between border-1 rounded-xl py-3 px-5 bg-gray-100'>
                <div className='flex'>
                    <div className='bg-black text-white rounded-full px-3 py-2 font-bold'>H</div>
                    <div className='px-2'>
                        <h4>Name</h4>
                        <p className='text-sm text-gray-600'>{userId}</p>
                    </div>
                </div>
                <div className='text-green-400 py-1'>
                    VERIFIED
                </div>
            </div>
            <div className='flex flex-col py-2'>
                <label className='text-gray-800 py-1'>Enter Transfer Ammount</label>
                <input className='border border-1 border-gray-700 px-3 py-3 rounded-xl' value={ammount} type="Number" placeholder='₹ 5000' onChange={(e) => setAmmount(e.target.value)} />

            </div>
            <div className='flex flex-col py-2'>
                <label className='text-gray-800 py-1'>Enter 6-Digit Transaction PIN</label>
                <input className='border border-1 border-gray-700 px-3 py-3 rounded-xl' value={pin} type="Number" placeholder='123456' onChange={(e) => setPin(e.target.value)} />
                <p className='text-gray-600 text-sm'>Never share your 6-digit transaction PIN with anyone</p>
            </div>
            <div className='py-3 my-2 border-1 rounded-xl bg-blue-900 hover:bg-blue-700 cursor-pointer text-white font-bold text-center text-xl' onClick={sendammount}>Send Money</div>
            <div className='py-3 my-2 border-1 rounded-xl bg-gray-500 hover:bg-gray-400 cursor-pointer text-white font-bold text-center text-xl' onClick={sendammount}>Back To Users List</div>
        </div>
    )
}

export default Sendmoney