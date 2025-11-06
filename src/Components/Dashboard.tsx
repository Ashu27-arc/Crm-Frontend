import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

type NotificationRow = { id: string; description: string; state: string; date: string }
type EventRow = { id: string; description: string; state: string; city?: string; country?: string; date?: string; time?: string }

const Dashboard: React.FC = () => {
  const navigate=useNavigate()
  const [notifications, setNotifications] = useState<NotificationRow[]>([])
  const [events, setEvents] = useState<EventRow[]>([])

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [nRes, eRes] = await Promise.all([
          fetch('http://localhost:3000/api/notifications/all'),
          fetch('http://localhost:3000/api/events/all'),
        ])
        const nJson = await nRes.json()
        const eJson = await eRes.json()
        if (nJson?.success && Array.isArray(nJson.data)) {
          setNotifications(
            nJson.data.map((n: any) => ({
              id: n._id,
              description: n.description,
              state: n.state,
              date: n.date,
            }))
          )
        }
        if (eJson?.success && Array.isArray(eJson.data)) {
          setEvents(
            eJson.data.map((n: any) => ({
              id: n._id,
              description: n.description,
              state: n.state,
              city: n.city,
              country: n.country,
              date: n.date,
              time: n.time,
            }))
          )
        }
      } catch (e) {
        // eslint-disable-next-line no-console
        console.error('Failed to load dashboard data', e)
      }
    }
    fetchData()
  }, [])

  const formatDate = (d?: string) => (d ? new Date(d).toLocaleDateString() : '')
  const formatTime = (d?: string) => (d ? new Date(d).toLocaleTimeString() : '')

  return (
    <>
      <div className="mb-8">
        <h2 className="text-3xl font-bold text-gray-800 mb-6">Dashboard</h2>

        <div  className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8 ">
          <div onClick={()=>navigate('/Add-Notification')} className="bg-white rounded-lg shadow-md p-6 border border-gray-100 cursor-pointer hover:scale-110 hover:shadow-blue-900">
            <div className="text-4xl font-bold text-gray-800 mb-2">{notifications.length}</div>
            <div  className="text-gray-600 text-sm">Total Notifications</div>
          </div>
          <div onClick={()=>navigate('/Add-Event')} className="bg-white cursor-pointer rounded-lg shadow-md p-6 border border-gray-100 hover:scale-110 hover:shadow-blue-900">
            <div className="text-4xl font-bold text-gray-800 mb-2">{events.length}</div>
            <div className="text-gray-600 text-sm">Total Events</div>
          </div>
        </div>
      </div>

      <div>
        <h2 className="text-3xl font-bold text-gray-800 mb-6 flex items-start">Notifications</h2>
        <div className="bg-white rounded-lg shadow-md overflow-hidden border border-gray-100">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Description</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">State</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Time</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {notifications.map((n) => (
                <tr key={n.id}>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{n.description}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{n.state}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{formatDate(n.date)}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{formatTime(n.date)}</td>
                </tr>
              ))}
              {notifications.length === 0 && (
                <tr>
                  <td className="px-6 py-6 text-center text-gray-500" colSpan={3}>No notifications</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      <div className='mt-8'>
        <h2 className="text-3xl font-bold text-gray-800 mb-6 flex items-start">Events</h2>
        <div className="bg-white rounded-lg shadow-md overflow-hidden border border-gray-100">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Description</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">State</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">City</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Country</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Time</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {events.map((e) => (
                <tr key={e.id}>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{e.description}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{e.state}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{e.city}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{e.country}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{formatDate(e.date)}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{e.time ?? formatTime(e.date)}</td>
                </tr>
              ))}
              {events.length === 0 && (
                <tr>
                  <td className="px-6 py-6 text-center text-gray-500" colSpan={5}>No events</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </>
  )
}

export default Dashboard;

