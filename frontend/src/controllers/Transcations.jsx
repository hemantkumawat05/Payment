import React, { useEffect, useState } from 'react'
import axios from "axios"
import Sendmoney from './Sendmoney'
const Transcations = ({ token }) => {
  const [transcation, setTranscation] = useState(null)
  const [selectedUserId, setSelectedUserId] = useState(null)

  const fetchtranscations = async () => {
    try {
      const response = await axios.get("http://localhost:3000/api/transaction/transactionsdata", {
        headers: { token }
      })
      if (!response) {
        return alert("No response")
      }
      if (response.data && response.data.success) {
        setTranscation(response.data.transcations || [])
      } else {
        alert(response.data?.message || "Failed to load transactions")
      }
    }
    catch (error) {
      const msgerror = error.response?.data?.message || error.message || "Something went wrong";
      alert(msgerror)
    }
  }
  useEffect(() => {
    fetchtranscations()
  }, [token])


  if (selectedUserId) {
    return (
      <div>
        <button
          onClick={() => setSelectedUserId(null)}
          className='bg-gray-500 text-white p-2 rounded mb-4 cursor-pointer'
        >
          Back to Users
        </button>
        <Sendmoney userId={selectedUserId} token={token} />
      </div>
    );
  }


  return (
    <div className='mx-25'>
      <div>
        <h1 className='font-bold text-4xl my-2'>PassBook & Transaction History</h1>
        <p className='font-sm '>Detailed audit trail of all peer transfers and wallet activity</p>
      </div>
      <div className='grid grid-cols-3 gap-5 py-3 mt-5'>
        <div className='border-1 bg-[#E2E8F0] px-4 py-2 rounded-lg border-bg-[#E2E8F0]'>
          <p>TOTAL TRANSACTION VOLUME</p>
          <h2 className='font-bold text-2xl'>₹ AMMOUNT</h2>
          <p>X Successful transfers</p>
        </div>

        <div className='border-1 bg-[#E2E8F0] px-4 py-2 rounded-lg border-bg-[#E2E8F0]'>
          <p>TOTAL MONEY SENT (DEBITED)</p>
          <h2 className='font-bold text-2xl'>- ₹ AMMOUNT</h2>
          <p>X Outgoing transfers</p>
        </div>

        <div className='border-1 bg-[#E2E8F0] px-4 py-2 rounded-lg border-bg-[#E2E8F0]'>
          <p>TOTAL MONEY RECIVED (CREDITED)</p>
          <h2 className='font-bold text-2xl'> + ₹ AMMOUNT</h2>
          <p>X Incoming transfers</p>
        </div>
      </div>
      <div>

      
      {!transcation && <p>Loading Transcations...</p>}
      {transcation && transcation.length === 0 && <p>No Trsnscations found.</p>}
      <ul className='px-5 border-1  rounded-xl'>
        <li className='grid grid-cols-7 gap-4 bg-[#E2E8F0] border-[#E2E8F0] rounded-lg border-1 my-2'>
          <div className='px-3 py-2 font-bold'>S No.</div>
          <div className='px-3 py-2 font-bold'>User I'D</div>
          <div className='px-4 py-2 font-bold'>Name</div>
          <div className='px-2 py-2 font-bold'>Ammount</div>
          <div className='px-2 py-2 font-bold'>Date</div>
          <div className='px-2 py-2 font-bold'>Transcation</div>
          <button className='px-10 py-2 font-bold'>Send Money</button>
        </li>
        {transcation && transcation.map((e, index) => (
          <li key={index} className='grid grid-cols-7 gap-4 bg-[#F8FAFC] hover:bg-[#E2E8F0] border-[#E2E8F0] rounded-lg border-1 my-2 px-4'>
            <div className='px-3 py-2'>{index + 1}.</div>
            <div className=' py-2 mx-3 my-2'>{e.id.slice(0,5)}</div>
            <div className='font-bold'>{e.name}</div>
            <div className='text-sm'> {e.amount} </div>
            <div className='text-gray-700 mx-5 my-2'>{e.date ? new Date(e.date).toLocaleDateString() : 'N/A'} </div>
            <div className='text-green-600 bg-green-100 my-2 px-3 py-2 rounded-lg mx-5 text-center font-semibold'>{e.send ? 'Send' : 'Recive'}</div>
            <button onClick={() => setSelectedUserId(e.id)} className='bg-blue-900 text-white hover:bg-blue-800 rounded-lg my-2 px-3'>Send Amount</button>
          </li>
        ))}
      </ul>
      </div>




    </div>
  )
}

export default Transcations