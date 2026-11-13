 
import axios from "axios";

// Backend API base URL
const api = axios.create({
  baseURL:
    import.meta.env.VITE_API_BASE_URL ||
    "http://localhost:5000/api",

  timeout: 15000,

  headers: {
    "Content-Type": "application/json"
  }
});

// Add authentication token when available
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("adminToken");

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
  },
  (error) => Promise.reject(error)
);

// Fetch dashboard statistics and transactions
export async function getDashboardData(period = "7d") {
  const response = await api.get("/dashboard", {
    params: { period }
  });

  return response.data?.data ?? response.data;
}

export default api;