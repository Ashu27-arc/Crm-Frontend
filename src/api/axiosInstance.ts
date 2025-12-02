import axios from "axios";
const api = axios.create({
  // baseURL:isdev
  // ?"http://localhost:5000/api"
  // :"https://crm-backend-1-jsce.onrender.com/api"
  baseURL:"https://crm-backend-1-jsce.onrender.com/api"
  
});
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default api;
