import React, { useState, FormEvent, ChangeEvent } from "react";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import api from "../api/axiosInstance.ts"

const Login: React.FC = () => {
  const navigate = useNavigate();

  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);

    try {
      // ✅ Use your axios instance (it automatically uses baseURL)
      const res = await api.post("/admin/login", { email, password });

      if (res.data?.token) {
        localStorage.setItem("token", res.data.token); // Save JWT token
        toast.success("Login successful!");
        navigate("/Dashboard");
      } else {
        toast.error("Token not received from server");
      }
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Login failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center h-screen bg-blue-200">
      <div className="w-full max-w-sm p-6 border border-gray-200 rounded-lg shadow-lg bg-white">
        <div className="text-center mb-6">
          <h1 className="text-3xl font-bold text-gray-800">
            <span className="text-blue-600">Admin</span> Login
          </h1>
          <p className="text-gray-500 text-sm">
            Enter your credentials to continue
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="block text-gray-700 text-sm mb-2">Email</label>
            <input
              type="email"
              className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="admin@example.com"
              value={email}
              onChange={(e: ChangeEvent<HTMLInputElement>) =>
                setEmail(e.target.value)
              }
              required
            />
          </div>

          <div>
            <label className="block text-gray-700 text-sm mb-2">Password</label>
            <input
              type="password"
              className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="••••••••"
              value={password}
              onChange={(e: ChangeEvent<HTMLInputElement>) =>
                setPassword(e.target.value)
              }
              required
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-blue-600 text-white py-2 rounded-lg font-medium hover:bg-blue-700 transition disabled:opacity-60"
          >
            {loading ? "Logging in..." : "Login"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default Login;
