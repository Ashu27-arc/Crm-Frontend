import Dashboard from './Components/Dashboard'
import Home from './Components/Home'
import Login from './Components/Login'
import './App.css'
import { Route, Routes } from 'react-router-dom'
import AddNotification from './Components/AddNotification'
function App() {
  return (
    <Routes>
      <Route path='/' element={<Home />} />
      <Route path='/Login' element={<Login />} />
      <Route path='/Dashboard' element={<Dashboard />} />
      <Route path='/Add-Notification' element={<AddNotification />} />
    </Routes>

  )
}

export default App
