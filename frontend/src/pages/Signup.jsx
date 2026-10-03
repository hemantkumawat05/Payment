import React, { useEffect, useState } from 'react'
import Login from './Login'
import { Link, NavLink } from 'react-router-dom'
import axios from "axios"
const Signup = () => {

  const [name, setName] = useState("")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [pin, setPin] = useState("")
  const [amount, setAmount] = useState("10000")
  const [response, setResponse] = useState("Here Show Response")

  const formsubmit = async () => {
    try {
      const resp = await axios.post('http://localhost:3000/api/user/signup', { name, email, password, pin, amount, })
      if (resp) {
        setResponse(resp.data.message)
      }

    }
    catch (error) {
      console.log(error)
    }
  }
  return (
    <div className='bg-[#EFF8FF] px-[2%] py-[2%] w-[100%] min-h-screen flex '>
      <div className='border-2 m-2 mx-[2%] my-[2%] bg-[#0F4A8A] w-[45%] text-white px-5 rounded-xl'>
        <div className='flex mt-5'>
          <p className='bg-[#0284C7] px-3 py-2 mx-5 rounded-lg font-bold'>₹</p> <p className='font-bold py-2'>Payment</p>
        </div>
        <div className=''>
          <h2 className='text-4xl pt-5'>Fast, Secure & Semless Digital <p className='text-[#00BAF2] font-bold'>Payments</p></h2>
          <p className='pt-5 text-[#CBD5E1] text-2sm'>Open your verified Payment wallet account with <br /> instant ₹10000 initial balance & 6-digit PIN security</p>
        </div>
        <div className='bg-[#0284C7] rounded-lg p-5 my-5'>
          <div className='flex py-2'>
            <div className='p-3 rounded-lg bg-black'>Logo</div>
            <div>
              <h3 className='font-bold mx-3'>Zero-Delay Transfers</h3>
              <p className='mx-3 text-[#CBD5E1]'>Send money instantly across users with live ledger</p>
            </div>
          </div>

          <div className='flex py-2'>
            <div className='p-3 rounded-lg bg-black'>Logo</div>
            <div>
              <h3 className='font-bold mx-3'>6-Digit PIN Encryption</h3>
              <p className='mx-3 text-[#CBD5E1]'>Every debit operation requires personal PIN authorization</p>
            </div>
          </div>

          <div className='flex py-2'>
            <div className='p-3 rounded-lg bg-black'>Logo</div>
            <div>
              <h3 className='font-bold mx-3'>₹10,000 Welcome Bonus</h3>
              <p className='mx-3 text-[#CBD5E1]'>Pre-funded wallet balance ready for test transactions</p>
            </div>
          </div>
        </div>
      </div>




      <div className='border-2 m-2 mx-[2%] my-[2%] w-[55%]'>
        <div className=''>
          <p className='font-bold text-center border-2 border-gray-900 p-2 bg-black text-white text-3xl'>Create Your Account</p>
          <p className='font-xl text-center pt-5 text-[#64748B]'>Start your digital wallet journey. </p>
        </div>
        <div className='px-3'>
          <div className='p-2 flex flex-col'>
            <label className='font-medium text-[#64748B]'>Full Name</label>
            <input className='border-2 rounded-lg py-2 px-2 text-[#64748B]' placeholder='Account Holder Full Name' type="text" onChange={(e) => setName(e.target.value)} />
          </div>

          <div className='p-2 flex flex-col'>
            <label className='font-medium text-[#64748B]'>E-mail Address</label>
            <input className='border-2 rounded-lg py-2 px-2 text-[#64748B]' type="email" placeholder='user@gmail.com' onChange={(e) => setEmail(e.target.value)} />
          </div>


          <div className='p-2 flex flex-col'>
            <label className='font-medium text-[#64748B]'>Password</label>
            <input className='border-2 rounded-lg py-2 px-2 text-[#64748B]' type="password" placeholder='Enter Strong Password (min. 8 char)' onChange={(e) => setPassword(e.target.value)}/>
          </div>

          <div className='p-2 flex flex-col'>
            <label className='font-medium text-[#64748B]'>6-Digit Transaction PIN</label>
            <input className='border-2 rounded-lg py-2 px-2 text-[#64748B]' type="Number" placeholder='6 Digit Transcation Pin' onChange={(e) => setPin(e.target.value)}/>
          </div>


          <div className='p-2 flex flex-col'>
            <label className='font-medium text-[#64748B]'>Initial wallet Funding (₹)</label>
            <input className='border-2 rounded-lg py-2 px-2 text-[#64748B]' type="Number" placeholder='Amount ₹10000 Only' onChange={(e) => setAmount(e.target.value)}/>
          </div>

          <button className='font-bold border-2 bg-[#53B1FD] hover:bg-[#0284C7] text-white p-3 rounded-xl text-center cursor-pointer w-full ' onClick={formsubmit}>Create Payment Account</button>
          
          
          <div>
            <NavLink to="/login"><p className='font-normal text-[#64748B]'>Already have a payment account ? <b className='text-[#0284C7]'>Login Here</b>  </p></NavLink>
          </div>
          <div>{response}</div>
        </div>
      </div>

    </div>
  )
}

export default Signup


