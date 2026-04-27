import { useEffect, useState } from "react";
import api from "../api/axiosInstance";
import { io } from "socket.io-client";
type BookingItem = {
  _id: string;
  name: string;
  email: string;
  phoneNumber: string;
  BookedCounseller: string;
  courses: string;
  Date: string;
  action?: "pending" | "attended";
};
const socket = io('https://crm-backend-1-jsce.onrender.com');
// const socket = io("http://localhost:5000");

const CounsellerBooking = () => {
  const [bookings, setBookings] = useState<BookingItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [updatingIds, setUpdatingIds] = useState<string[]>([]);

  const handleActionChange = async (item: BookingItem, checked: boolean) => {
    const nextAction = checked ? "attended" : "pending";
    const previousAction = item.action ?? "pending";

    // Optimistic UI update so checkbox responds instantly on click.
    setBookings((prev) =>
      prev.map((booking) =>
        booking._id === item._id ? { ...booking, action: nextAction } : booking
      )
    );
    setUpdatingIds((prev) => [...prev, item._id]);

    try {
      await api.patch("/counseller/action-taken", {
        id: item._id,
        action: nextAction,
      });
    } catch (error) {
      // Roll back if API fails.
      setBookings((prev) =>
        prev.map((booking) =>
          booking._id === item._id ? { ...booking, action: previousAction } : booking
        )
      );
      console.error("Error updating booking action:", error);
    } finally {
      setUpdatingIds((prev) => prev.filter((id) => id !== item._id));
    }
  };

  useEffect(() => {
    const fetchBookings = async () => {
      try {
        const token = localStorage.getItem("token");
        const res = await api.get("/counseller/booking-details", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setBookings(res.data.data || []);
      } catch (error) {
        console.error("Error fetching bookings:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchBookings();
  }, []);
  useEffect(() => {
    socket.on("booking-created", (newBooking: BookingItem) => {
      setBookings((prev) => [newBooking, ...prev]);
    });

    return () => {
      socket.off("booking-created");
    };
  }, []);

  if (loading) return <p className="ml-5 mt-5 text-lg">Loading...</p>;

  return (
    <div className="p-5">
      <h2 className="text-3xl font-bold mb-5">Booking Details</h2>

      {/* Desktop Table */}
      <div className="hidden lg:block bg-white shadow rounded-xl border border-gray-100 overflow-x-auto">
        <table className="w-full min-w-[900px]">
          <thead className="bg-blue-100">
            <tr>
              <th className="px-6 py-3">#</th>
              <th className="px-6 py-3">Name</th>
              <th className="px-6 py-3">Email</th>
              <th className="px-6 py-3">Phone</th>
              <th className="px-6 py-3">Counsellor</th>
              <th className="px-6 py-3">Course</th>
              <th className="px-6 py-3">Date</th>
              <th className="px-6 py-3">Actions</th>
            </tr>
          </thead>

          <tbody className="divide-y divide-gray-100">
            {bookings.length === 0 ? (
              <tr>
                <td colSpan={6} className="px-6 py-6 text-center text-gray-500">
                  No bookings found
                </td>
              </tr>
            ) : (
              bookings.map((item, index) => (
                <tr key={item._id} className={index % 2 === 1 ? "bg-gray-50" : ""}>
                  <td className="px-6 py-4">{index + 1}</td>
                  <td className="px-6 py-4">{item.name}</td>
                  <td className="px-6 py-4">{item.email}</td>
                  <td className="px-6 py-4">{item.phoneNumber}</td>
                  <td className="px-6 py-4">{item.BookedCounseller}</td>
                  <td className="px-6 py-4">{item.courses}</td>
                  <td className="px-6 py-4">{item.Date}</td>
                  <td className="px-6 py-4">
                    <input
                      type="checkbox"
                      checked={item.action === "attended"}
                      disabled={updatingIds.includes(item._id)}
                      onChange={(e) => handleActionChange(item, e.target.checked)}
                      className="w-5 h-5 text-blue-500 rounded focus:ring-blue-400"
                    />
                  </td>

                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Mobile Cards */}
      <div className="block lg:hidden space-y-4">
        {bookings.map((item) => (
          <div
            key={item._id}
            className="bg-white shadow rounded-xl border border-gray-100 p-4"
          >
            <div className="flex justify-between items-start mb-2">
              <h3 className="text-lg font-semibold">{item.name}</h3>
              <div className="flex items-center gap-2">
                <span className="text-xs text-gray-500">Attended:</span>
                <input
                  type="checkbox"
                  checked={item.action === "attended"}
                  disabled={updatingIds.includes(item._id)}
                  onChange={(e) => handleActionChange(item, e.target.checked)}
                  className="w-5 h-5 text-blue-500 rounded focus:ring-blue-400"
                />
              </div>
            </div>
            <p className="text-sm"><strong>Email:</strong> {item.email}</p>
            <p className="text-sm"><strong>Phone:</strong> {item.phoneNumber}</p>
            <p className="text-sm"><strong>Counsellor:</strong> {item.BookedCounseller}</p>
            <p className="text-sm"><strong>Course:</strong> {item.courses}</p>
            <p className="text-sm flex flex-wrap"><strong>Date:</strong>{item.Date}</p>
          </div>
        ))}
      </div>

    </div>
  );
};

export default CounsellerBooking;
