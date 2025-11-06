import React from 'react';
import { useNavigate } from 'react-router-dom';

interface Lead {
  name: string;
  email: string;
  status: 'New' | 'Contacted' | 'Converted';
}


const Dashboard: React.FC = () => {
  const navigate = useNavigate()
  const handleLogout = () => {
    alert('Logout');
    navigate('/Login')
  };


  const leads: Lead[] = [
    { name: 'John Doe', email: 'john@example.com', status: 'New' },
    { name: 'Jane Smith', email: 'jane@example.com', status: 'Contacted' },
    { name: 'Bob Johnson', email: 'bob@example.com', status: 'Converted' },
    { name: 'Alice Williams', email: 'alice@example.com', status: 'New' },
  ];

  const getStatusBadgeClass = (status: string) => {
    switch (status) {
      case 'New':
        return 'bg-green-100 text-green-800';
      case 'Contacted':
        return 'bg-orange-100 text-orange-800';
      case 'Converted':
        return 'bg-green-100 text-green-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }

  };


  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-blue-600 text-white px-6 py-4 flex justify-between items-center">
        <h1 className="text-2xl font-bold">CRM Admin</h1>

        <div className="cursor-pointer" onClick={handleLogout}>
          <svg
            className="w-6 h-6 text-white"
            fill="currentColor"
            viewBox="0 0 24 24"
          >
            <path d="M12 12c2.7 0 5-2.3 5-5s-2.3-5-5-5-5 2.3-5 5 2.3 5 5 5zm0 2c-3.3 0-10 1.7-10 5v3h20v-3c0-3.3-6.7-5-10-5z" />
          </svg>


        </div>
      </header>

      <div className="flex">
        {/* Sidebar */}
        <aside className="w-64 bg-gray-100 min-h-screen p-4">
          <nav className="space-y-2">
            {/* Dashboard - Active */}
            <div className="flex items-center space-x-3 px-4 py-3 bg-gray-200 rounded-lg border-l-4 border-gray-400 cursor-pointer">
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

            {/* Users */}
            <div onClick={() => navigate('/Add-Notification')} className="flex items-center space-x-3 px-4 py-3 rounded-lg hover:bg-gray-200 cursor-pointer transition-colors">
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


          </nav>
        </aside>

        {/* Main Content */}
        <main className="flex-1 p-8 bg-white">
          {/* Dashboard Section */}
          <div className="mb-8">
            <h2 className="text-3xl font-bold text-gray-800 mb-6">Dashboard</h2>

            {/* Metrics Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
              {/* Total Users Card */}
              <div className="bg-white rounded-lg shadow-md p-6 border border-gray-100">
                <div className="text-4xl font-bold text-gray-800 mb-2">120</div>
                <div className="text-gray-600 text-sm">Total Notifications</div>
              </div>

              {/* Leads Card */}
              <div className="bg-white rounded-lg shadow-md p-6 border border-gray-100">
                <div className="text-4xl font-bold text-gray-800 mb-2">350</div>
                <div className="text-gray-600 text-sm">Drafts</div>
              </div>
              {/* 
              Conversions Card
              <div className="bg-white rounded-lg shadow-md p-6 border border-gray-100">
                <div className="text-4xl font-bold text-gray-800 mb-2">200</div>
                <div className="text-gray-600 text-sm">Conversions</div>
              </div> */}


              {/* <div className="bg-white rounded-lg shadow-md p-6 border border-gray-100">
                <div className="text-4xl font-bold text-gray-800 mb-2">80</div>
                <div className="text-gray-600 text-sm">Active Users</div>
              </div> */}
            </div>
          </div>

          {/* Recent Leads Section */}
          <div>
            <h2 className="text-3xl font-bold text-gray-800 mb-6">Notifications</h2>

            <div className="bg-white rounded-lg shadow-md overflow-hidden border border-gray-100">
              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Name
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Email
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Status
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {leads.map((lead, index) => (
                    <tr
                      key={index}
                      className={index % 2 === 0 ? 'bg-white' : 'bg-gray-50'}
                    >
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                        {lead.name}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {lead.email}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span
                          className={`px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusBadgeClass(
                            lead.status
                          )}`}
                        >
                          {lead.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default Dashboard;

