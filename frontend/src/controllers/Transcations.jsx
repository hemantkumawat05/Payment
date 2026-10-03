import React, { useEffect, useState } from 'react'
import axios from "axios"
import Sendmoney from './Sendmoney'
const Transcations = ({token}) => {
  const [transcation, setTranscation] = useState(null)
  const [selectedUserId,setSelectedUserId]=useState(null)

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
                <Sendmoney userId={selectedUserId} token={token}/>
            </div>
        );
    }


  return (
    <div>
      <h2>Transcations DashBoard</h2>
      {!transcation && <p>Loading Transcations...</p>}
      {transcation && transcation.length === 0 && <p>No Trsnscations found.</p>}

      <ul>
        {transcation && transcation.map((e, index) => (
          <li key={index}>
            <strong>No.</strong> {index+1} |<strong>e.id</strong> {e.id} | <strong>Name:</strong> {e.name}  |<strong>Amount:</strong> {e.amount}  | <strong>Date:</strong> {e.date ? new Date(e.date).toLocaleDateString() : 'N/A'}  | <strong>Transcation:</strong> {e.send ? 'Send' : 'Recive'}  |
            <button  onClick={() => setSelectedUserId(e.id)}  className='bg-black text-white rounded-xs m-1 p-1 hover:bg-blue-500 cursor-pointer'>Send Amount</button>
          </li>
        ))}
      </ul>
    </div>
  )
}

export default Transcations