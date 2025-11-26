import React, { useEffect, useState } from "react";
import type { MouseEvent } from "react";
import api from "../api/axiosInstance.ts"

type NotificationItem = {
  id: string;
  text: string;
  state: string;
  course: string;
  createdAt: string;
};

const INDIAN_STATES = [
  "Andhra Pradesh", "Arunachal Pradesh", "Assam", "Bihar", "Chhattisgarh",
  "Goa", "Gujarat", "Haryana", "Himachal Pradesh", "Jharkhand",
  "Karnataka", "Kerala", "Madhya Pradesh", "Maharashtra", "Manipur",
  "Meghalaya", "Mizoram", "Nagaland", "Odisha", "Punjab",
  "Rajasthan", "Sikkim", "Tamil Nadu", "Telangana", "Tripura",
  "Uttar Pradesh", "Uttarakhand", "West Bengal",
  "Andaman and Nicobar Islands", "Chandigarh", "Dadra and Nagar Haveli and Daman and Diu",
  "Delhi", "Jammu and Kashmir", "Ladakh", "Lakshadweep", "Puducherry"
];

const AddNotification: React.FC = () => {
  const [inputValue, setInputValue] = useState("");
  const [inputState, setInputState] = useState("");
  const [inputCourse, setInputCourse] = useState("");
  const [notifications, setNotifications] = useState<NotificationItem[]>([]);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  useEffect(() => {
    const fetchAll = async () => {
      try {
        setLoading(true);
        const res = await api.get("/notifications/all");
        if (res.data?.success && Array.isArray(res.data.data)) {
          const mapped: NotificationItem[] = res.data.data.map((n: any) => ({
            id: n._id,
            text: n.description,
            state: n.state,
            course: n.course,
            createdAt: new Date(n.date).toLocaleString(),
          }));
          setNotifications(mapped);
        }
      } catch (e) {
        console.error("Failed to fetch notifications", e);
      } finally {
        setLoading(false);
      }
    };
    fetchAll();
  }, []);

  const onAddOrSave = async () => {
    const trimmed = inputValue.trim();
    const trimmedState = inputState.trim();
    const trimmedCourse = inputCourse.trim();
    if (!trimmed || !trimmedState || !trimmedCourse) return;

    if (editingId) {
      setNotifications((prev) =>
        prev.map((item) =>
          item.id === editingId
            ? { ...item, text: trimmed, state: trimmedState, course: trimmedCourse }
            : item
        )
      );
      setEditingId(null);
      setInputValue("");
      setInputState("");
      setInputCourse("");
      return;
    }

    try {
      setLoading(true);
      const payload = {
        description: trimmed,
        course: trimmedCourse,
        state: trimmedState,
        date: new Date().toISOString(),
      };

      const res = await api.post("/notifications/add", payload);

      if (res.data?.success && res.data?.data) {
        const n = res.data.data;
        const added: NotificationItem = {
          id: n._id,
          text: n.description,
          state: n.state,
          course: n.course,
          createdAt: new Date(n.date).toLocaleString(),
        };
        setNotifications((prev) => [added, ...prev]);
        setInputValue("");
        setInputState("");
        setInputCourse("");
      }
    } catch (e) {
      console.error("Failed to add notification", e);
    } finally {
      setLoading(false);
    }
  };

  const onEdit = (id: string) => {
    const item = notifications.find((n) => n.id === id);
    if (!item) return;
    setEditingId(id);
    setInputValue(item.text);
    setInputState(item.state);
    setInputCourse(item.course);
  };
// Add notification delete function
  const onDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this Notification ?")) return;

    try {
      setLoading(true);
      await api.delete(`/notifications/delete/${id}`); 
      setNotifications((prev) => prev.filter((n) => n.id !== id));
      if (editingId === id) {
        setEditingId(null);
        setInputValue("");
        setInputState("");
        setInputCourse("");
      }
    } catch (e) {
      console.error("Failed to delete notification", e);
    } finally {
      setLoading(false);
    }
  };

  const onCancelEdit = (e: MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    setEditingId(null);
    setInputValue("");
    setInputState("");
    setInputCourse("");
  };

  return (
    <div className="p-4 sm:p-6">
      <h2 className="text-2xl sm:text-3xl font-bold mb-6 text-gray-800 text-center sm:text-left">
        Add Notification
      </h2>

      {/* Input Form */}
      <form
        className="flex flex-col sm:flex-row sm:items-center gap-3 mb-8"
        onSubmit={(e) => {
          e.preventDefault();
          onAddOrSave();
        }}
      >
        <input
          type="text"
          placeholder="Notification description"
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          className="flex-1 rounded-xl bg-gray-100 p-3 sm:p-4 outline-none text-gray-800 placeholder-gray-400 w-full"
        />

        <select
          value={inputState}
          onChange={(e) => setInputState(e.target.value)}
          className="rounded-xl bg-gray-100 p-3 sm:p-4 outline-none text-gray-800 w-full sm:w-52"
        >
          <option value="">Select State</option>
          {INDIAN_STATES.map((state) => (
            <option key={state} value={state}>
              {state}
            </option>
          ))}
        </select>

        <input
          type="text"
          placeholder="Course"
          value={inputCourse}
          onChange={(e) => setInputCourse(e.target.value)}
          className="rounded-xl bg-gray-100 p-3 sm:p-4 outline-none text-gray-800 w-full sm:w-52"
        />

        <div className="flex gap-2">
          <button
            type="submit"
            className="bg-blue-600 text-white px-5 py-3 rounded-xl hover:bg-blue-700 active:scale-95 transition w-full sm:w-auto"
            disabled={loading}
          >
            {editingId ? "Save" : loading ? "Submitting..." : "Add"}
          </button>

          {editingId && (
            <button
              type="button"
              onClick={onCancelEdit}
              className="bg-gray-200 text-gray-800 px-4 py-3 rounded-xl hover:bg-gray-300 active:scale-95 transition w-full sm:w-auto"
            >
              Cancel
            </button>
          )}
        </div>
      </form>

      {/* Notifications Table */}
      <div className="hidden sm:block bg-white shadow rounded-xl border border-gray-100 overflow-x-auto">
        <table className="w-full min-w-[600px]">
          <thead className="bg-blue-100">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">#</th>
              <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Notification</th>
              <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">State</th>
              <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Course</th>
              <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Created</th>
              <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {notifications.length === 0 ? (
              <tr>
                <td colSpan={6} className="px-6 py-6 text-center text-gray-500">No notifications yet</td>
              </tr>
            ) : (
              notifications.map((item, index) => (
                <tr key={item.id} className={index % 2 === 1 ? "bg-gray-50" : ""}>
                  <td className="px-6 py-4 text-sm text-gray-700">{index + 1}</td>
                  <td className="px-6 py-4 text-sm text-gray-900">{item.text}</td>
                  <td className="px-6 py-4 text-sm text-gray-900">{item.state}</td>
                  <td className="px-6 py-4 text-sm text-gray-900">{item.course}</td>
                  <td className="px-6 py-4 text-sm text-gray-500">{item.createdAt}</td>
                  <td className="px-6 py-4">
                    <div className="flex gap-2">
                      <button
                        className="px-3 py-1 rounded-md text-xs font-medium bg-yellow-100 text-yellow-800 hover:bg-yellow-200"
                        onClick={() => onEdit(item.id)}
                      >
                        Edit
                      </button>
                      <button
                        className="px-3 py-1 rounded-md text-xs font-medium bg-red-100 text-red-800 hover:bg-red-200"
                        onClick={() => onDelete(item.id)}
                      >
                        Delete
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Mobile View */}
      <div className="sm:hidden space-y-4">
        {notifications.length === 0 ? (
          <p className="text-center text-gray-500 py-4">No notifications yet</p>
        ) : (
          notifications.map((item, index) => (
            <div key={item.id} className="bg-white shadow-sm rounded-xl border border-gray-100 p-4">
              <div className="flex justify-between items-center mb-2">
                <h3 className="font-semibold text-gray-900">
                  #{index + 1} — {item.course}
                </h3>
                <span className="text-xs text-gray-500">{item.createdAt}</span>
              </div>
              <p className="text-gray-700 mb-2">{item.text}</p>
              <p className="text-sm text-gray-600 mb-3">
                <strong>State:</strong> {item.state}
              </p>
              <div className="flex gap-2">
                <button
                  className="flex-1 px-3 py-1 rounded-md text-xs font-medium bg-yellow-100 text-yellow-800 hover:bg-yellow-200"
                  onClick={() => onEdit(item.id)}
                >
                  Edit
                </button>
                <button
                  className="flex-1 px-3 py-1 rounded-md text-xs font-medium bg-red-100 text-red-800 hover:bg-red-200"
                  onClick={() => onDelete(item.id)}
                >
                  Delete
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default AddNotification;
