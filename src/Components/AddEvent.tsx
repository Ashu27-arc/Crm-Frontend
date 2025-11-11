import React, { useEffect, useState,useRef } from "react";
import api from "../api/axiosInstance";
import toast from "react-hot-toast";

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


const BASE_URL = "http://localhost:5000";

const AddEvent: React.FC = () => {
  const [inputValue, setInputValue] = useState("");
  const [inputState, setInputState] = useState("");
  const [inputCity, setInputCity] = useState("");
  const [inputCountry, setInputCountry] = useState("");
  const [inputDate, setInputDate] = useState("");
  const [inputTime, setInputTime] = useState("");
  const [inputImage, setInputImage] = useState<File | null>(null);
  const [previewImage, setPreviewImage] = useState<string | null>(null);

  const [events, setEvents] = useState<EventItem[]>([]);
  const [editingId, setEditingId] = useState<string | null>(null);

  const [fetchLoading, setFetchLoading] = useState(true);
  const [submitLoading, setSubmitLoading] = useState(false);

  // Fetch Events
  useEffect(() => {
    const fetchEvents = async () => {
      try {
        setFetchLoading(true);
        const res = await api.get("/events/all");

        if (res.data?.success && Array.isArray(res.data.data)) {
          const mapped = res.data.data
            .map((n: any) => ({
              id: n._id,
              text: n.description,
              state: n.state,
              city: n.city,
              country: n.country,
              image: n.image,
              date: n.date,
              time: n.time,
              createdAt: new Date(n.createdAt).toLocaleString(),
            }))
            .sort((a:EventItem, b:EventItem) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

          setEvents(mapped);
        }
      } catch {
        toast.error("Failed to fetch events");
      } finally {
        setFetchLoading(false);
      }
    };

    fetchEvents();
  }, []);
const fileInputRef=useRef<HTMLInputElement |null>(null);
  // Image Preview
  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setInputImage(file);
    const reader = new FileReader();
    reader.onloadend = () => setPreviewImage(reader.result as string);
    reader.readAsDataURL(file);
  };

  // Add or Update
  const onAddOrSave = async () => {
    if (!inputValue || !inputState || !inputCity || !inputCountry || !inputDate || !inputTime) {
      return toast.error("Please fill all required fields");
    }
  
    const form = new FormData();
    form.append("description", inputValue);
    form.append("state", inputState);
    form.append("city", inputCity);
    form.append("country", inputCountry);
    form.append("date", inputDate);
    form.append("time", inputTime);
    if (inputImage) form.append("image", inputImage);
  
    try {
      setSubmitLoading(true);
  
      const res = editingId
        ? await api.put(`/events/update/${editingId}`, form)
        : await api.post("/events/add", form);
  
      const d = res.data.data;
  
      const updatedEvent: EventItem = {
        id: d._id,
        text: d.description,
        state: d.state,
        city: d.city,
        country: d.country,
        image: d.image,
        date: d.date,
        time: d.time,
        createdAt: new Date(d.createdAt).toLocaleString(),
      };
      setEvents((prev) => {
        if (editingId) {
          // Update existing
          return prev.map((e) => (e.id === updatedEvent.id ? updatedEvent : e));
        } else {
          // Add new
          return [updatedEvent, ...prev];
        }
      });
      
      toast.success(editingId ? "Event updated successfully" : "Event added successfully");
      resetForm();
    } catch {
      toast.error("Failed to save event");
    } finally {
      setSubmitLoading(false);
    }
  };
  

  const resetForm = () => {
    setEditingId(null);
    setInputValue("");
    setInputState("");
    setInputCity("");
    setInputCountry("");
    setInputDate("");
    setInputTime("");
    setInputImage(null);
    setPreviewImage(null);
    if(fileInputRef.current){
      fileInputRef.current.value=""
    }
  };

  const onEdit = (id: string) => {
    const e = events.find((ev) => ev.id === id);
    if (!e) return;
  
    setEditingId(id);
    setInputValue(e.text);
    setInputState(e.state);
    setInputCity(e.city);
    setInputCountry(e.country || "");
    setInputDate(e.date || "");
    setInputTime(e.time || "");
    setPreviewImage(e.image ? `${BASE_URL}${e.image}` : null);
  };
  

  const onDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this event?")) return;

    try {
      setSubmitLoading(true);
      await api.delete(`/events/delete/${id}`);
      setEvents((prev) => prev.filter((ev) => ev.id !== id));
      toast.success("Event deleted");
    } catch {
      toast.error("Failed to delete");
    } finally {
      setSubmitLoading(false);
    }
  };

  return (
    <div className="p-4">

      <h2 className="text-3xl font-bold mb-6">Manage Events</h2>

      {/* FORM */}
      <form
        onSubmit={(e) => { e.preventDefault(); onAddOrSave(); }}
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3 bg-white p-4 rounded-xl shadow-sm mb-6"
      >
        <input className="bg-gray-100 rounded-lg p-3 outline-none" placeholder="Event Description" value={inputValue} onChange={(e) => setInputValue(e.target.value)} />
        <input className="bg-gray-100 rounded-lg p-3 outline-none" placeholder="State" value={inputState} onChange={(e) => setInputState(e.target.value)} />
        <input className="bg-gray-100 rounded-lg p-3 outline-none" placeholder="City" value={inputCity} onChange={(e) => setInputCity(e.target.value)} />
        <input className="bg-gray-100 rounded-lg p-3 outline-none" placeholder="Country" value={inputCountry} onChange={(e) => setInputCountry(e.target.value)} />
        <input type="date" className="bg-gray-100 rounded-lg p-3 outline-none" value={inputDate} onChange={(e) => setInputDate(e.target.value)} />
        <input type="time" className="bg-gray-100 rounded-lg p-3 outline-none" value={inputTime} onChange={(e) => setInputTime(e.target.value)} />
        <input ref={fileInputRef} type="file" accept="image/*" onChange={handleImageChange} />

        <button disabled={submitLoading} className="bg-blue-600 text-white rounded-lg px-5 py-3">
          {submitLoading ? "Submitting..." : editingId ? "Update Event" : "Add Event"}
        </button>
      </form>

      {previewImage && (
        <div className="flex justify-center mb-6">
          <img src={previewImage} className="w-32 h-32 object-cover rounded-lg border" />
        </div>
      )}

      {/* DESKTOP TABLE */}
      <div className="hidden md:block bg-white rounded-xl shadow-sm overflow-x-auto">
        <table className="w-full text-sm">
          <thead className="bg-blue-100">
            <tr>
              <th className="px-4 py-3">#</th>
              <th className="px-4 py-3">Image</th>
              <th className="px-4 py-3">Description</th>
              <th className="px-4 py-3">State</th>
              <th className="px-4 py-3">City</th>
              <th className="px-4 py-3">Country</th>
              <th className="px-4 py-3">Date</th>
              <th className="px-4 py-3">Time</th>
              <th className="px-4 py-3">Actions</th>
            </tr>
          </thead>
          <tbody>
            {fetchLoading ? (
              <tr><td colSpan={9} className="text-center py-5">Loading...</td></tr>
            ) : events.map((e, i) => (
              <tr key={e.id} className="border-t hover:bg-gray-50">
                <td className="px-4 py-3">{i + 1}</td>

                {/* ✅ FIXED IMAGE RENDER */}
                <td className="px-4 py-3">
                  {e.image ? (
                    <img src={`${BASE_URL}${e.image}`} className="w-14 h-14 rounded-md object-cover" />
                  ) : "─"}
                </td>

                <td className="px-4 py-3">{e.text}</td>
                <td className="px-4 py-3">{e.state}</td>
                <td className="px-4 py-3">{e.city}</td>
                <td className="px-4 py-3">{e.country}</td>
                <td className="px-4 py-3">{e.date}</td>
                <td className="px-4 py-3">{e.time}</td>
                <td className="px-4 py-3 flex gap-2">
                  <button onClick={() => onEdit(e.id)} className="px-3 py-1 bg-yellow-200 rounded-md text-xs">Edit</button>
                  <button onClick={() => onDelete(e.id)} className="px-3 py-1 bg-red-200 rounded-md text-xs">Delete</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* MOBILE CARDS */}
      <div className="md:hidden space-y-4 mt-6 flex flex-col items-center px-2">
        {fetchLoading ? (
          <p className="text-center text-gray-500">Loading...</p>
        ) : events.length === 0 ? (
          <p className="text-center text-gray-500">No events yet</p>
        ) : (
          events.map((e, index) => (
            <div key={e.id} className="w-full max-w-sm bg-white shadow-sm rounded-xl border border-gray-200 p-4">
              
              <div className="flex justify-between text-sm mb-2">
                <span className="font-semibold text-gray-800">#{index + 1} — {e.text}</span>
                <span className="text-gray-500">{e.date} {e.time}</span>
              </div>

              {/* ✅ FIXED IMAGE RENDER */}
              {e.image && <img src={`${BASE_URL}${e.image}`} className="w-full h-40 rounded-lg object-cover mb-3" />}

              <p className="text-sm text-gray-700"><strong>State:</strong> {e.state}</p>
              <p className="text-sm text-gray-700"><strong>City:</strong> {e.city}</p>
              <p className="text-sm text-gray-700 mb-3"><strong>Country:</strong> {e.country}</p>

              <div className="flex gap-2">
                <button onClick={() => onEdit(e.id)} className="flex-1 bg-yellow-100 text-yellow-800 rounded-md text-xs py-2">Edit</button>
                <button onClick={() => onDelete(e.id)} className="flex-1 bg-red-100 text-red-800 rounded-md text-xs py-2">Delete</button>
              </div>

            </div>
          ))
        )}
      </div>

    </div>
  );
};

export default AddEvent;
