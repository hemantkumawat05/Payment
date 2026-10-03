import React from 'react'
import Navbar from './Navbar'
import Dashboard from './Dashboard'

const Home = ({token}) => {
  return (
    <div className=''>
      <Dashboard token={token}/>
    </div>
  )
}

export default Home