import React, { useEffect, useState } from "react";
import type { ChangeEvent, MouseEvent } from "react";

type EventItem = {
  id: string;
  text: string;
  state: string;
  city: string;
  country?: string;
  image?: string;
  createdAt: string;
  date?: string;
  time?: string;
};

const AddEvent: React.FC = () => {
  const [inputValue, setInputValue] = useState<string>(""); // description
  const [inputState, setInputState] = useState<string>(""); // state
  const [inputCity, setInputCity] = useState<string>("");   // city
  const [inputCountry, setInputCountry] = useState<string>(""); // country
  const [inputDate, setInputDate] = useState<string>(""); // date
  const [inputImage, setInputImage] = useState<File | null>(null);
  const [previewImage, setPreviewImage] = useState<string | null>(null);
  const [events, setEvents] = useState<EventItem[]>([]);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [inputTime, setInputTime] = useState<string>(""); // time (HH:MM)

  const API_BASE = "http://localhost:3000/api/events";

  // Fetch events
  useEffect(() => {
    const fetchAll = async () => {
      try {
        setLoading(true);
        const res = await fetch(`${API_BASE}/all`);
        const json = await res.json();
        if (json?.success && Array.isArray(json.data)) {
          const mapped: EventItem[] = json.data.map((n: any) => ({
            id: n._id,
            text: n.description,
            state: n.state,
            city: n.city,
            country: n.country,
            image: n.image,
            date: n.date,
            time: n.time,
            createdAt: new Date(n.date).toLocaleString(),
          }));
          setEvents(mapped);
        }
      } catch (e) {
        console.error("Failed to fetch events", e);
      } finally {
        setLoading(false);
      }
    };
    fetchAll();
  }, []);

  // Image selection
  const handleImageChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setInputImage(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewImage(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  // Add or Save Event
  const onAddOrSave = async () => {
    const trimmed = inputValue.trim();
    const trimmedState = inputState.trim();
    const trimmedCity = inputCity.trim();
    const trimmedCountry = inputCountry.trim();
    const trimmedDate = inputDate.trim();
    const trimmedTime = inputTime.trim();

    if (!trimmed || !trimmedState || !trimmedCity || !trimmedCountry || !trimmedDate || !trimmedTime) {
      alert("Please fill all required fields");
      return;
    }

    // Edit locally if editingId is set (no backend update route yet)
    if (editingId) {
      setEvents(prev => prev.map(ev => ev.id === editingId ? {
        ...ev,
        text: trimmed,
        state: trimmedState,
        city: trimmedCity,
        country: trimmedCountry,
        date: trimmedDate,
        time: trimmedTime,
      } : ev))
      setEditingId(null)
      setInputValue("")
      setInputState("")
      setInputCity("")
      setInputCountry("")
      setInputDate("")
      setInputTime("")
      setInputImage(null)
      setPreviewImage(null)
      setLoading(false)
      return
    }

    try {
      setLoading(true);

      const form = new FormData();
      form.append("description", trimmed);
      form.append("state", trimmedState);
      form.append("city", trimmedCity);
      form.append("country", trimmedCountry);
      form.append("date", trimmedDate); 
      form.append("time", trimmedTime);
      if (inputImage) form.append("image", inputImage);

      const res = await fetch(`${API_BASE}/add`, {
        method: "POST",
        body: form,
      });

      const json = await res.json();
      if (json?.success && json?.data) {
        const n = json.data;
        const added: EventItem = {
          id: n._id,
          text: n.description,
          state: n.state,
          city: n.city,
          country: n.country,
          image: n.image,
          date: n.date,
          time: n.time,
          createdAt: new Date(n.date).toLocaleString(),
        };
        setEvents((prev) => [added, ...prev]);
        setInputValue("");
        setInputState("");
        setInputCity("");
        setInputCountry("");
        setInputDate("");
        setInputTime("");
        setInputImage(null);
        setPreviewImage(null);
      } else {
        console.error("Failed:", json);
      }
    } catch (e) {
      console.error("Failed to add event", e);
    } finally {
      setLoading(false);
    }
  };

  const onEdit = (id: string) => {
    const item = events.find(e => e.id === id)
    if (!item) return
    setEditingId(id)
    setInputValue(item.text)
    setInputState(item.state)
    setInputCity(item.city || "")
    setInputCountry(item.country || "")
    setInputDate(item.date || "")
    setPreviewImage(item.image || null)
    setInputImage(null)
  }

  const onDelete = async (id: string) => {
    try {
      setLoading(true);
      await fetch(`${API_BASE}/delete/${id}`, { method: "DELETE" });
      setEvents((prev) => prev.filter((n) => n.id !== id));
    } catch (e) {
      console.error("Failed to delete event", e);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-4">

        <h2 className="text-3xl font-bold  m-4 ">
            Add Event 
        </h2>
      {/* Form */}
      <form
        className="flex flex-wrap items-center gap-3 mb-6"
        onSubmit={(e) => {
          e.preventDefault();
          onAddOrSave();
        }}
      >
        <input
          type="text"
          placeholder="Event description"
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          className="flex-1 rounded-2xl bg-gray-100 p-4 outline-none"
        />
        <input
          type="text"
          placeholder="State"
          value={inputState}
          onChange={(e) => setInputState(e.target.value)}
          className="w-48 rounded-2xl bg-gray-100 p-4 outline-none"
        />
        <input
          type="text"
          placeholder="City"
          value={inputCity}
          onChange={(e) => setInputCity(e.target.value)}
          className="w-48 rounded-2xl bg-gray-100 p-4 outline-none"
        />
        <input
          type="text"
          placeholder="Country"
          value={inputCountry}
          onChange={(e) => setInputCountry(e.target.value)}
          className="w-48 rounded-2xl bg-gray-100 p-4 outline-none"
        />
        <input
          type="date"
          value={inputDate}
          onChange={(e) => setInputDate(e.target.value)}
          className="w-48 rounded-2xl bg-gray-100 p-4 outline-none"
        />
        <input
          type="time"
          value={inputTime}
          onChange={(e) => setInputTime(e.target.value)}
          className="w-40 rounded-2xl bg-gray-100 p-4 outline-none"
        />
        <input
          type="file"
          accept="image/*"
          onChange={handleImageChange}
          className="w-60 text-sm text-gray-600 file:mr-4 file:py-2 file:px-4
                     file:rounded-full file:border-0 file:text-sm file:font-semibold
                     file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
        />
        <button
          type="submit"
          className="bg-blue-600 text-white px-5 py-3 rounded-xl hover:bg-blue-700 active:scale-95 transition disabled:opacity-60"
          disabled={loading}
        >
          {loading ? "Submitting..." : "Add"}
        </button>
      </form>

      {previewImage && (
        <div className="mb-6">
          <img src={previewImage} alt="Preview" className="w-32 h-32 object-cover rounded-xl border" />
        </div>
      )}

      {/* Table */}
      <div className="bg-white shadow rounded-xl overflow-hidden border border-gray-100">
        <table className="w-full">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase">#</th>
              <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase">Image</th>
              <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase">Description</th>
              <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase">State</th>
              <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase">City</th>
              <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase">Country</th>
              <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase">Date</th>
              <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase">Time</th>
              <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {events.length === 0 ? (
              <tr>
                <td colSpan={8} className="px-6 py-6 text-center text-gray-500">
                  No events yet
                </td>
              </tr>
            ) : (
              events.map((item, index) => (
                <tr key={item.id} className={index % 2 === 1 ? "bg-gray-50" : ""}>
                  <td className="px-6 py-4 text-sm text-gray-700">{index+1}</td>
                  <td className="px-6 py-4">
                    {item.image ? (
                      <img src={item.image} alt="Event" className="w-16 h-16 rounded-md object-cover border" />
                    ) : (
                      <span className="text-gray-400 text-sm">No Image</span>
                    )}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-900">{item.text}</td>
                  <td className="px-6 py-4 text-sm text-gray-900">{item.state}</td>
                  <td className="px-6 py-4 text-sm text-gray-900">{item.city}</td>
                  <td className="px-6 py-4 text-sm text-gray-900">{item.country}</td>
                  <td className="px-6 py-4 text-sm text-gray-500">{item.date}</td>
                  <td className="px-6 py-4 text-sm text-gray-500">{item.time}</td>
                  <td className="px-6 py-4">
                    <button
                      className="mr-2 px-3 py-1 rounded-md text-xs font-medium bg-yellow-100 text-yellow-800 hover:bg-yellow-200"
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
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AddEvent;
