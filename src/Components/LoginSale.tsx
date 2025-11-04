import React, { useState } from "react";
import type { FormEvent, ChangeEvent } from "react";
import { useNavigate } from "react-router-dom";

const LoginSale: React.FC = () => {
  const navigate = useNavigate();

  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);

  // Single allowed credential pair
  const allowedEmail = "admin@example.com";
  const allowedPassword = "password123";

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    // Log attempted credentials
    // eslint-disable-next-line no-console
    console.log("Sales login attempt:", { email, password });

    const isAllowed = email === allowedEmail && password === allowedPassword;

    if (isAllowed) {
      alert("Login successful");
      setLoading(false);
      navigate("/");
      return;
    }

    alert("Invalid email or password");
    setLoading(false);
  };

  return (
    <div className="flex items-center justify-center h-screen bg-gray-50">
      <div className="w-full max-w-sm p-6 border border-gray-200 rounded-lg shadow-lg bg-white">
        <div className="text-center mb-6">
          <h1 className="text-3xl font-bold text-gray-800">
            <span className="text-blue-600">Sales Person</span> Login
          </h1>
          <p className="text-gray-500 text-sm">Enter your credentials to continue</p>
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
<div className="flex flex-row justify-between ">

          <button onClick={()=>navigate('/Login')} className="w-60 bg-blue-600 text-white py-2  mr-2 rounded-lg font-medium hover:bg-blue-700 transition disabled:opacity-60">
            Login as a Admin
          </button>
          <button onClick={()=>navigate('/Login-Counseller')} className="w-60 bg-blue-600 text-white py-2 rounded-lg font-medium hover:bg-blue-700 transition disabled:opacity-60"> <span className="p-1 ">Login as a Counseller</span></button>
</div>
        </form>
      </div>
    </div>
  );
};

export default LoginSale;
