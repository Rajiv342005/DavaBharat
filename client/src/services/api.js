import axios from "axios";

const api = axios.create({ baseURL: import.meta.env.VITE_API_URL });

// Attach the login token to every request automatically
api.interceptors.request.use((config) => {
  try {
    const user = JSON.parse(localStorage.getItem("user"));
    if (user?.token) config.headers.Authorization = `Bearer ${user.token}`;
  } catch {
    /* ignore corrupted storage */
  }
  return config;
});

export const getErrorMessage = (err) =>
  err.response?.data?.message || err.message || "Something went wrong";

export default api;