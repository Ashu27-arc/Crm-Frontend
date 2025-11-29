import React, { useEffect, useState } from "react";
import api from "../api/axiosInstance";

type BookingItem = {
  _id: string;
  name: string;
  email: string;
  phoneNumber: string;
  BookedCounseller: string;
  courses: string;
};

const CounsellerBooking = () => {
  const [bookings, setBookings] = useState<BookingItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchBookings = async () => {
      try {
        const token = localStorage.getItem("token");

        const res = await api.get("/counseller/booking-details", {
          headers: { Authorization: `Bearer ${token}` },
        });

        setBookings(res.data.data || []); // backend must return { data: [...] }
      } catch (error) {
        console.error("Error fetching bookings:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchBookings();
  }, []);

  if (loading) return <p className="ml-5 mt-5 text-lg">Loading...</p>;

  return (
    <div className="p-5">
      <h2 className="text-3xl font-bold mb-5">Booking Details</h2>

      {/* Desktop Table */}
      <div className="hidden sm:block bg-white shadow rounded-xl border border-gray-100 overflow-x-auto">
        <table className="w-full min-w-[900px]">
          <thead className="bg-blue-100">
            <tr>
              <th className="px-6 py-3">#</th>
              <th className="px-6 py-3">Name</th>
              <th className="px-6 py-3">Email</th>
              <th className="px-6 py-3">Phone</th>
              <th className="px-6 py-3">Counsellor</th>
              <th className="px-6 py-3">Course</th>
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
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Mobile Cards */}
      <div className="block sm:hidden space-y-4">
        {bookings.map((item) => (
          <div
            key={item._id}
            className="bg-white shadow rounded-xl border border-gray-100 p-4"
          >
            <h3 className="text-lg font-semibold">{item.name}</h3>
            <p className="text-sm"><strong>Email:</strong> {item.email}</p>
            <p className="text-sm"><strong>Phone:</strong> {item.phoneNumber}</p>
            <p className="text-sm"><strong>Counsellor:</strong> {item.BookedCounseller}</p>
            <p className="text-sm"><strong>Course:</strong> {item.courses}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default CounsellerBooking;
