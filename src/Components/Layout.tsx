import { Outlet, useLocation, useNavigate } from "react-router-dom";
import { useState } from "react";

const Layout = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const isActive = (path: string) =>
    location.pathname.toLowerCase() === path.toLowerCase();

  const linkClass = (path: string) =>
    `flex items-center space-x-3 px-4 py-3 rounded-lg cursor-pointer transition 
     ${isActive(path) ? "bg-white shadow border border-gray-200" : "hover:bg-gray-200"}`;

  const handleLogout = () => {
     if (!confirm("Are you sure you ")) return;
    localStorage.removeItem("token");
    navigate("/");
  };

  const NavLinks = () => (
    <nav className="space-y-2">
      <div onClick={() => navigate("/Dashboard")} className={linkClass("/Dashboard")}>
        <span className="text-gray-700 font-medium">Dashboard</span>
      </div>

      <div
        onClick={() => navigate("/Add-Notification")}
        className={linkClass("/Add-Notification")}
      >
        <span className="text-gray-700 font-medium">Add Notification</span>
      </div>

      <div onClick={() => navigate("/Add-Event")} className={linkClass("/Add-Event")}>
        <span className="text-gray-700 font-medium">Add Event</span>
      </div>

      {/* <div onClick={() => navigate("/Register")} className={linkClass("/Register")}>
        <span className="text-gray-700 font-medium">Add User</span>
      </div> */}
    </nav>
  );

  return (
    <div className="flex flex-col h-screen overflow-hidden">

      {/* HEADER */}
      <header className="bg-blue-400 text-white px-6 py-4 flex justify-between items-center">
        <h1 className="text-xl sm:text-2xl font-bold">CRM Admin</h1>

        {/* Desktop Logout */}
        <button onClick={handleLogout} className="hidden md:block">
          Logout
        </button>

        {/* Hamburger for mobile */}
        <button className="md:hidden" onClick={() => setSidebarOpen(!sidebarOpen)}>
          {sidebarOpen ? "✖" : "☰"}
        </button>
      </header>

      {/* MAIN LAYOUT AREA */}
      <div className="flex flex-1 overflow-hidden">

        {/* SIDEBAR DESKTOP */}
        <aside className="hidden md:block w-64 bg-blue-200 p-4 h-full overflow-y-auto ">
          <NavLinks />
        </aside>

        {/* MOBILE SIDEBAR */}
        <div
          className={`fixed inset-0 z-40 md:hidden transition duration-300 ${sidebarOpen ? "visible bg-black bg-opacity-40" : "invisible"
            }`}
          onClick={() => setSidebarOpen(false)}
        >
          <div
            className={`absolute top-0 left-0 w-64 h-full bg-blue-200 p-4 shadow-lg transform transition-transform duration-300 ${sidebarOpen ? "translate-x-0" : "-translate-x-full"
              }`}
            onClick={(e) => e.stopPropagation()}
          >
            <NavLinks />
            <button
              onClick={handleLogout}
              className="mt-6 w-full bg-blue-500 text-white py-2 rounded-lg"
            >
              Logout
            </button>
          </div>
        </div>

        {/* MAIN CONTENT (only this scrolls) */}
        <main className="flex-1 overflow-y-auto p-5 bg-white">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default Layout;
