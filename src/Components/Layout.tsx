import { Outlet, useLocation, useNavigate } from 'react-router-dom';
import { useState } from 'react';

const Layout = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const isActive = (path: string) =>
    location.pathname.toLowerCase() === path.toLowerCase();

  const itemBase =
    'flex items-center space-x-3 px-4 py-3 rounded-lg cursor-pointer transition-colors';
  const activeCls = 'bg-white shadow-md border border-gray-200';
  const hoverCls = 'hover:bg-gray-200';

  const handleLogout = () => {
    localStorage.removeItem("token")
    alert('Logout');
    navigate('/');
  };

  const NavLinks = () => (
    <nav className="space-y-2">
      <div
        className={`${itemBase} ${hoverCls} ${
          isActive('/Dashboard') ? activeCls : ''
        }`}
        onClick={() => {
          navigate('/Dashboard');
          setSidebarOpen(false);
        }}
      >
        <svg
          className="w-5 h-5 text-gray-700"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z"
          />
        </svg>
        <span className="text-gray-700 font-medium">Dashboard</span>
      </div>

      <div
        onClick={() => {
          navigate('/Add-Notification');
          setSidebarOpen(false);
        }}
        className={`${itemBase} ${hoverCls} ${
          isActive('/Add-Notification') ? activeCls : ''
        }`}
      >
        <svg
          className="w-5 h-5 text-gray-600"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z"
          />
        </svg>
        <span className="text-gray-600">Add Notification</span>
      </div>

      <div
        onClick={() => {
          navigate('/Add-Event');
          setSidebarOpen(false);
        }}
        className={`${itemBase} ${hoverCls} ${
          isActive('/Add-Event') ? activeCls : ''
        }`}
      >
        <svg
          className="w-5 h-5 text-gray-600"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z"
          />
        </svg>
        <span className="text-gray-600">Add Event</span>
      </div>
    </nav>
  );

  return (
    <>
      {/* Header */}
      <header className="bg-blue-400 from-white text-white px-6 py-4 flex justify-between items-center">
        <h1 className="text-xl sm:text-2xl font-bold">CRM Admin</h1>

        {/* Desktop Logout */}
        <button
          className="hidden md:block cursor-pointer"
          onClick={handleLogout}
        >
          <svg
            className="w-6 h-6 text-white"
            fill="currentColor"
            viewBox="0 0 24 24"
          >
            <path d="M12 12c2.7 0 5-2.3 5-5s-2.3-5-5-5-5 2.3-5 5 2.3 5 5 5zm0 2c-3.3 0-10 1.7-10 5v3h20v-3c0-3.3-6.7-5-10-5z" />
          </svg>
        </button>

        {/* Hamburger (mobile only) */}
        <button
          className="md:hidden focus:outline-none"
          onClick={() => setSidebarOpen(!sidebarOpen)}
        >
          {sidebarOpen ? (
            <svg
              className="w-6 h-6 text-white"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          ) : (
            <svg
              className="w-6 h-6 text-white"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M4 6h16M4 12h16M4 18h16"
              />
            </svg>
          )}
        </button>
      </header>

      <div className="flex flex-1 min-h-0 relative">
        {/* Sidebar (desktop) */}
        <aside className="hidden md:block w-64 bg-blue-200 p-4 overflow-y-auto">
          <NavLinks />
        </aside>

        {/* Animated Sidebar (mobile) */}
        <div
          className={`fixed inset-0 z-40 md:hidden transition-all duration-300 ${
            sidebarOpen ? 'visible bg-black bg-opacity-40' : 'invisible bg-transparent'
          }`}
          onClick={() => setSidebarOpen(false)}
        >
          <div
            className={`absolute top-0 left-0 h-full w-64 bg-blue-200 p-4 shadow-lg transform transition-transform duration-300 ${
              sidebarOpen ? 'translate-x-0' : '-translate-x-full'
            }`}
            onClick={(e) => e.stopPropagation()} // prevent close when clicking inside
          >
            <NavLinks />
            <button
              onClick={handleLogout}
              className="mt-6 w-full bg-blue-400 text-white py-2 rounded-lg hover:bg-blue-600 hover:scale-110 transition"
            >
              Logout
            </button>
          </div>
        </div>

        {/* Main Content */}
        <main className="flex-1 min-h-0 overflow-y-auto p-4 sm:p-6 md:p-8 bg-white">
          <Outlet />
        </main>
      </div>
    </>
  );
};

export default Layout;
