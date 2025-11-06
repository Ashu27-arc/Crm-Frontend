import Dashboard from './Components/Dashboard'
// import Home from './Components/Home'
import Login from './Components/Login'
import './App.css'
import { Route, Routes } from 'react-router-dom'
import AddNotification from './Components/AddNotification'
import AddEvent from './Components/AddEvent'
import Layout from './Components/Layout'
function App() {
  return (
    <Routes>

      {/* <Route path='/' element={<Home />} /> */}
      <Route path='/' element={<Login />} />
      <Route element={<Layout />}>
        <Route path='/Dashboard' element={<Dashboard />} />
        <Route path='/Add-Notification' element={<AddNotification />} />
        <Route path='/Add-Event' element={<AddEvent/>}/>
      </Route>
      


    </Routes>

  )
}

export default App
