import { Outlet, useLocation, useNavigate } from 'react-router-dom'

const Layout = () => {
  const navigate = useNavigate()
  const location = useLocation()

  const isActive = (path: string) => location.pathname.toLowerCase() === path.toLowerCase()
  const itemBase = 'flex items-center space-x-3 px-4 py-3 rounded-lg cursor-pointer transition-colors'
  const activeCls = 'bg-white shadow-md border border-gray-200'
  const hoverCls = 'hover:bg-gray-200'

  const handleLogout = () => {
    alert('Logout')
    navigate('/')
  }

  return (
<>
      {/* Header */}
      <header className="bg-blue-600 text-white px-6 py-4 flex justify-between items-center">
        <h1 className="text-2xl font-bold">CRM Admin</h1>
        <button className="cursor-pointer" onClick={handleLogout}>
          <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 24 24">
            <path d="M12 12c2.7 0 5-2.3 5-5s-2.3-5-5-5-5 2.3-5 5 2.3 5 5 5zm0 2c-3.3 0-10 1.7-10 5v3h20v-3c0-3.3-6.7-5-10-5z" />
          </svg>
        </button>
      </header>

      <div className="flex flex-1 min-h-0">
        {/* Sidebar */}
        <aside className="w-64 bg-gray-100 p-4 overflow-y-auto">
          <nav className="space-y-2">
            <div className={`${itemBase} ${hoverCls} ${isActive('/Dashboard') ? activeCls : ''}`} onClick={()=>navigate('/Dashboard')}>
              <svg className="w-5 h-5 text-gray-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
              </svg>
              <span className="text-gray-700 font-medium">Dashboard</span>
            </div>

            <div onClick={()=>navigate('/Add-Notification')} className={`${itemBase} ${hoverCls} ${isActive('/Add-Notification') ? activeCls : ''}`}>
              <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
              </svg>
              <span className="text-gray-600">Add Notification</span>
            </div>

            <div onClick={()=>navigate('/Add-Event')} className={`${itemBase} ${hoverCls} ${isActive('/Add-Event') ? activeCls : ''}`}>
              <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
              </svg>
              <span className="text-gray-600">Add Event</span>
            </div>
          </nav>
        </aside>

        {/* Main content */}
        <main className="flex-1 min-h-0 overflow-y-auto p-8 bg-white">
          <Outlet />
        </main>
      </div>
</>
  )
}

export default Layout


