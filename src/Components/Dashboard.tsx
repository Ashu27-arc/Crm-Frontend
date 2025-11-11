import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api/axiosInstance";

type NotificationRow = {
  id: string;
  description: string;
  state: string;
  course: string;
  date: string;
};

type EventRow = {
  id: string;
  description: string;
  state: string;
  city?: string;
  country?: string;
  date?: string;
  time?: string;
};

const Dashboard: React.FC = () => {
  const navigate = useNavigate();
  const [notifications, setNotifications] = useState<NotificationRow[]>([]);
  const [events, setEvents] = useState<EventRow[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;

    (async () => {
      try {
        const [nRes, eRes] = await Promise.all([
          api.get("/notifications/all"),
          api.get("/events/all"),
        ]);

        if (isMounted) {
          const nData = nRes.data?.data || [];
          const mappedN: NotificationRow[] = nData.map((n: any) => ({
            id: n._id,
            description: n.description,
            state: n.state,
            course: n.course,
            date: n.date,
          }));
          setNotifications(
            mappedN
              .sort(
                (a, b) =>
                  new Date(b.date).getTime() - new Date(a.date).getTime()
              )
              .slice(0, 10)
          );


          const eData = eRes.data?.data || [];
          const mappedE: EventRow[] = eData.map((e: any) => ({
            id: e._id,
            description: e.description,
            state: e.state,
            city: e.city,
            country: e.country,
            date: e.date,
            time: e.time,
          }));
          setEvents(
            mappedE
              .sort(
                (a, b) =>
                  new Date(b.date || "").getTime() -
                  new Date(a.date || "").getTime()
              )
              .slice(0, 10)
          );
        }
      } catch (error) {
        console.error("Failed to load dashboard data", error);
      } finally {
        if (isMounted) setLoading(false);
      }
    })();

    return () => {
      isMounted = false;
    };
  }, []);


  const formatDate = (date?: string) =>
    date && !isNaN(new Date(date).getTime())
      ? new Date(date).toLocaleDateString()
      : "-";

  const formatTime = (date?: string | null) =>
    date && !isNaN(new Date(date).getTime())
      ? new Date(date).toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
      })
      : "-";

  return (
    <div className="p-4 sm:p-6 md:p-8">
      <div className="mb-8">
        <h2 className="text-2xl sm:text-3xl font-bold text-gray-800 mb-6">
          Dashboard
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 mb-8">
          <div
            onClick={() => navigate("/Add-Notification")}
            className="bg-white rounded-lg shadow-md p-6 border border-gray-100 cursor-pointer transition transform hover:scale-105 hover:shadow-blue-900"
          >
            <div className="text-3xl sm:text-4xl font-bold text-gray-800 mb-2">
              {notifications.length}
            </div>
            <div className="text-gray-600 text-sm sm:text-base">
              Total Notifications
            </div>
          </div>

          <div
            onClick={() => navigate("/Add-Event")}
            className="bg-white rounded-lg shadow-md p-6 border border-gray-100 cursor-pointer transition transform hover:scale-105 hover:shadow-blue-900"
          >
            <div className="text-3xl sm:text-4xl font-bold text-gray-800 mb-2">
              {events.length}
            </div>
            <div className="text-gray-600 text-sm sm:text-base">
              Total Events
            </div>
          </div>
          {/* total users */}
          {/* <div
            onClick={() => navigate("/Counseller")}
            className="bg-white rounded-lg shadow-md p-6 border border-gray-100 cursor-pointer transition transform hover:scale-105 hover:shadow-blue-900"
          >
            <div className="text-3xl sm:text-4xl font-bold text-gray-800 mb-2">
              {events.length}
            </div>
            <div className="text-gray-600 text-sm sm:text-base">
              Total Users
            </div>
          </div> */}
        </div>
      </div>

      {/* Notifications */}
      <div>
        <h2 className="text-2xl sm:text-3xl font-bold text-gray-800 mb-4 sm:mb-6">
          Notifications
        </h2>
        <div className="bg-white rounded-lg shadow-md overflow-x-auto border border-gray-100">
          <table className="w-full min-w-[600px]">
            <thead className="bg-blue-100">
              <tr>
                <th className="px-4 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  Description
                </th>
                <th className="px-4 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  State
                </th>
                <th className="px-4 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  Course
                </th>
                <th className="px-4 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  Date
                </th>
                <th className="px-4 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  Time
                </th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan={5} className="text-center py-5 text-gray-500">
                    Loading...
                  </td>
                </tr>
              ) : notifications.length === 0 ? (
                <tr>
                  <td colSpan={5} className="text-center py-5 text-gray-500">
                    No notifications
                  </td>
                </tr>
              ) : (
                notifications.map((n) => (
                  <tr key={n.id} className="border-b">
                    <td className="px-4 py-3">{n.description}</td>
                    <td className="px-4 py-3">{n.state}</td>
                    <td className="px-4 py-3">{n.course}</td>
                    <td className="px-4 py-3">{formatDate(n.date)}</td>
                    <td className="px-4 py-3">{formatTime(n.date)}</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Events */}
      <div className="mt-8">
        <h2 className="text-2xl sm:text-3xl font-bold text-gray-800 mb-4 sm:mb-6">
          Events
        </h2>
        <div className="bg-white rounded-lg shadow-md overflow-x-auto border border-gray-100">
          <table className="w-full min-w-[700px]">
            <thead className="bg-blue-100">
              <tr>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  Description
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  State
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  City
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  Country
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  Date
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  Time
                </th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan={6} className="text-center py-5 text-gray-500">
                    Loading...
                  </td>
                </tr>
              ) : events.length === 0 ? (
                <tr>
                  <td colSpan={6} className="text-center py-5 text-gray-500">
                    No events
                  </td>
                </tr>
              ) : (
                events.map((e) => (
                  <tr key={e.id} className="border-b">
                    <td className="px-4 py-3">{e.description}</td>
                    <td className="px-4 py-3">{e.state}</td>
                    <td className="px-4 py-3">{e.city}</td>
                    <td className="px-4 py-3">{e.country}</td>
                    <td className="px-4 py-3">{formatDate(e.date)}</td>
                    <td className="px-4 py-3">{e.time || formatTime(e.date)}</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
