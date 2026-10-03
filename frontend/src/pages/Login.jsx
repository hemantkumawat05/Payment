import React, { useEffect, useState } from 'react'
import { Link, NavLink } from 'react-router-dom'
import axios from "axios"
const Login = ({ setToken }) => {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [response, setResponse] = useState("Here Show Response")

  const formsubmit = async () => {
    try {
      const resp = await axios.post('http://localhost:3000/api/user/signin', { email, password })
      if (resp.data.success) {
        setResponse(resp.data.message)
        setToken(resp.data.token);
        console.log(resp.data.token)
      }

    }
    catch (error) {
      console.log(error)
    }
  }
  return (
    <div className='flex flex-col min-h-screen bg-[#EFF8FF] px-[2%] py-[2%] w-[100%] flex '>
      <div className='flex justify-between py-2 mx-[10%]'>
        <div className='flex'>
          <p className='bg-blue-400 text-white px-3 py-2 font-bold rounded-lg'>₹</p> <p className='px-1 py-2 font-bold'>Payment</p>
        </div>
        <div>
          <NavLink to="/signup"><p className='font-normal py-2 text-[#64748B]'>Don't have an account ? <b className='text-[#0284C7] bg-blue-200 rounded-lg p-3 hover:bg-blue-300'>Sign-up</b>  </p></NavLink>
        </div>
      </div>


      <div className='mx-auto w-[25%] border-2 rounded-lg'>
        <p className='font-bold bg-black text-white text-xl text-center py-3'>Welcome Back</p>

        <div className='p-5'>
          <h2 className='font-bold text-center bg-blue-400 w-fit px-4 py-3 text-white mx-auto rounded-lg'>Payments</h2>
          <p className='text-center'>Sign in with your e-mail & secure password</p>
        </div>
        <div className='px-3'>
          <div className='p-2 flex flex-col my-2'>
            <label className='font-medium text-[#64748B]'>E-mail I'D</label>
            <input className='border-2 rounded-lg py-2 px-2 text-[#64748B]' type="email" placeholder='user@gmail.com' onChange={(e) => setEmail(e.target.value)} />
          </div>
          <div className='p-2 flex flex-col my-2'>
            <label className='font-medium text-[#64748B]'>Password</label>
            <input className='border-2 rounded-lg py-2 px-2 text-[#64748B]' type="password" placeholder='Enter Strong Password (min. 8 char)' onChange={(e) => setPassword(e.target.value)} />
          </div>

          <button className='font-bold border-2 my-3 bg-[#53B1FD] hover:bg-[#0284C7] text-white p-3 rounded-xl text-center cursor-pointer w-full ' onClick={formsubmit}>Login to Payments</button>
          <div>
            <NavLink to="/signup"><p className='font-normal text-[#64748B]'>New To Payment ?<b className='text-[#0284C7] hover:text-blue-800'>Create an account</b>  </p></NavLink>
          </div>
          <div className='my-3'>{response}</div>
        </div>
      </div>

    </div>
  )
}

export default Login