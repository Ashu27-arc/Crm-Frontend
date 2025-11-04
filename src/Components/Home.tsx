import React from 'react'
import {useNavigate } from 'react-router-dom'

const Home = () => {
    const Navigate=useNavigate()
  return (
    <div className='flex flex-row justify-between  '>
        <h1 className='text-3xl '>
           
            Mock data
        </h1>
        <button 
             onClick={()=>Navigate('/login')}
             className='p-3 bg-gray-400 w-40 hover:bg-gray-700 text-white hover:scale-110 rounded-2xl '> 
             
             Login </button>
    </div>
  )
}

export default Home