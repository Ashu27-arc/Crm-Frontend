import Dashboard from './Components/Dashboard'
import Login from './Components/Login'
import './App.css'
import { Route, Routes } from 'react-router-dom'
import AddNotification from './Components/AddNotification'
import AddEvent from './Components/AddEvent'
import Layout from './Components/Layout'
import { Toaster } from "react-hot-toast";
import ProtectedRoute from './ProtectedRoutes'

function App() {
  return (
    <>
      {/* Global toast notification handler */}
      <Toaster position="top-center" reverseOrder={false} />

      <Routes>
        <Route path='/' element={<Login />} />
        <Route element={<Layout />}>
          <Route
  path="/Dashboard"
  element={
    <ProtectedRoute>
      <Dashboard />
    </ProtectedRoute>
  }
/>

<Route
  path="/Add-Notification"
  element={
    <ProtectedRoute>
      <AddNotification />
    </ProtectedRoute>
  }
/>

<Route
  path="/Add-Event"
  element={
    <ProtectedRoute>
      <AddEvent />
    </ProtectedRoute>
  }
/>
        </Route>
      </Routes>
    </>
  )
}

export default App
