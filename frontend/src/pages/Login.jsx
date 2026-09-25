// import React from 'react'

// const Login = () => {
//   return (
//     <div>Login</div>
//   )
// }

// export default Login

import React, { useEffect, useState } from 'react'
import { Link, NavLink } from 'react-router-dom'
import axios from "axios"
const Login = () => {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [response, setResponse] = useState("Here Show Response")
  useEffect =>
  ({
    formsubmit
  }, [])
  const formsubmit = async () => {
    try {
      const resp = await axios.post('http://localhost:3000/api/user/signin', { email, password })
      if (resp) {
        setResponse(resp.data.message)
        console.log(resp.data.token)
      }
    }
    catch (error) {
      console.log(error)
    }
  }
  return (
    <div className='flex flex-col  m-20 border-2 bg-gray-200 p-5 '>
      <div className='p-5'>
        <p className='font-bold'>This is Login page</p>
        <p className='font-medium'>If Already Then Login Our Account</p>
      </div>
      <div className='p-5 border-1'>
        <div className=' p-2'>
          <label className='font-medium'>E-mali I'd</label>
          <input className='border-2 ml-5' type="email" placeholder='user@gmail.com' onChange={(e) => setEmail(e.target.value)} />
        </div>
        <div className=' p-2'>
          <label className='font-medium'>Password</label>
          <input className='border-2 ml-5' type="password" placeholder='Enter Strong Password (min. 8 char)' onChange={(e) => setPassword(e.target.value)} />
        </div>
        <button className='font-bold border-2 p-2 m-2 bg-yellow-100 hover:bg-yellow-200 cursor-pointer' onClick={formsubmit}>Login</button>
        <div>

          <p className='font-normal'>If  Account Not Exists <NavLink to="/signup"><b>Sign Up </b></NavLink>  </p>
        </div>
        <div>{response}</div>
      </div>

    </div>
  )
}

export default Login