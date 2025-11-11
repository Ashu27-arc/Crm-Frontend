import Dashboard from './Components/Dashboard'
import Login from './Components/Login'
import './App.css'
import { Route, Routes } from 'react-router-dom'
import AddNotification from './Components/AddNotification'
import AddEvent from './Components/AddEvent'
import Layout from './Components/Layout'
import { Toaster } from "react-hot-toast";


function App() {
  return (
    <>
      {/* Global toast notification handler */}
      <Toaster position="top-center" reverseOrder={false} />

      <Routes>
        <Route path='/' element={<Login />} />
        <Route element={<Layout />}>
          <Route path='/Dashboard' element={<Dashboard />} />
          <Route path='/Add-Notification' element={<AddNotification />} />
          <Route path='/Add-Event' element={<AddEvent />} />
        
        </Route>
      </Routes>
    </>
  )
}

export default App
