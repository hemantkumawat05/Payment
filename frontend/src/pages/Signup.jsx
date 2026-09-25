import React, { useEffect, useState } from 'react'
import Login from './Login'
import { Link, NavLink } from 'react-router-dom'
import axios from "axios"
const Signup = () => {

  const [name, setName] = useState("")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [pin, setPin] = useState("")
  const [amount, setAmount] = useState("")
  const [response, setResponse] = useState("Here Show Response")
  console.log(name)
  useEffect =>
  ({
    formsubmit
  }, [])
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
    <div className='flex flex-col  m-20 border-2 bg-gray-200 p-5 '>
      <div className='p-5'>
        <p className='font-bold'>This is sign up page</p>
        <p className='font-medium'>User comes and Create a New Account If already account then login else create new account</p>
      </div>
      <div className='p-5 border-1'>
        <div className='p-2'>
          <label className='font-medium'>Name</label>
          <input className='border-2 ml-5' placeholder='Account Holder Name' type="text" onChange={(e) => setName(e.target.value)} />
        </div>
        <div className=' p-2'>
          <label className='font-medium'>E-mali I'd</label>
          <input className='border-2 ml-5' type="email" placeholder='user@gmail.com' onChange={(e) => setEmail(e.target.value)} />
        </div>
        <div className=' p-2'>
          <label className='font-medium'>Password</label>
          <input className='border-2 ml-5' type="password" placeholder='Enter Strong Password (min. 8 char)' onChange={(e) => setPassword(e.target.value)} />
        </div>
        <div className=' p-2'>
          <label className='font-medium'>Transcation-Pin</label>
          <input className='border-2 ml-5' type="Number" placeholder='6 Digit Transcation Pin' onChange={(e) => setPin(e.target.value)} />
        </div>
        <div className=' p-2'>
          <label className='font-medium'>Initial Amount</label>
          <input className='border-2 ml-5' type="Number" placeholder='Amount ₹10000 Only' onChange={(e) => setAmount(e.target.value)} />
        </div>
        <button className='font-bold border-2 p-2 m-2 bg-yellow-100 hover:bg-yellow-200 cursor-pointer' onClick={formsubmit}>Sign Up</button>
        <div>

          <p className='font-normal'>If Already Account then <NavLink to="/login"><b>Login </b></NavLink>  </p>
        </div>
        <div>{response}</div>
      </div>

    </div>
  )
}

export default Signup