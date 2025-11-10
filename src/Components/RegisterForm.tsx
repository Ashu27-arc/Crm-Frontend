import React, { useState } from "react";
import axios from "../api/axiosInstance"; // your axios instance path
import toast from "react-hot-toast";

const RegisterForm = () => {
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!form.name || !form.email || !form.password || !form.confirmPassword) {
      return toast.error("All fields are required");
    }

    if (form.password !== form.confirmPassword) {
      return toast.error("Passwords do not match");
    }

    try {
      setLoading(true);
      const response = await axios.post("/user/register", {
        name: form.name,
        email: form.email,
        password: form.password,
      });

      toast.success(response.data.message || "Registration Successful");

      setForm({
        name: "",
        email: "",
        password: "",
        confirmPassword: "",
      });
    } catch (err) {
      toast.error(err.rresponse?.data?.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen px-4">
      <form
        onSubmit={handleSubmit}
        className="bg-gray-100 shadow-lg rounded-xl p-6 w-full max-w-sm"
      >
        <h2 className="text-2xl font-semibold text-center mb-4">Create Account</h2>

        <input
          type="text"
          name="name"
          value={form.name}
          onChange={handleChange}
          placeholder="Enter Name"
          className="w-full p-2 border rounded-md mb-3 focus:outline-blue-500"
        />

        <input
          type="email"
          name="email"
          value={form.email}
          onChange={handleChange}
          placeholder="Enter Email"
          className="w-full p-2 border rounded-md mb-3 focus:outline-blue-500"
        />

        <div className="relative mb-3">
          <input
            type={showPassword ? "text" : "password"}
            name="password"
            value={form.password}
            onChange={handleChange}
            placeholder="Enter Password"
            className="w-full p-2 border rounded-md pr-10 focus:outline-blue-500"
          />
          <span
            className="absolute right-3 top-2 cursor-pointer text-gray-500"
            onClick={() => setShowPassword(!showPassword)}
          >
            {showPassword ? "🙈" : "👁️"}
          </span>
        </div>

        <div className="relative mb-4">
          <input
            type={showPassword ? "text" : "password"}
            name="confirmPassword"
            value={form.confirmPassword}
            onChange={handleChange}
            placeholder="Confirm Password"
            className="w-full p-2 border rounded-md pr-10 focus:outline-blue-500"
          />
          <span
            className="absolute right-3 top-2 cursor-pointer text-gray-500"
            onClick={() => setShowPassword(!showPassword)}
          >
            {showPassword ? "🙈" : "👁️"}
          </span>
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full py-2 bg-blue-600 text-white font-semibold rounded-md hover:bg-blue-700 transition disabled:bg-blue-400"
        >
          {loading ? "Creating account..." : "Register"}
        </button>
      </form>
    </div>
  );
};

export default RegisterForm;
