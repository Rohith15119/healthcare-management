import axios from "axios";
import useAuthStore from "../store/auth.js";
const api = axios.create({
  baseURL: "/api",
  withCredentials: true,
});
api.interceptors.request.use((config) => {
  const { token } = useAuthStore.getState();
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});
export default api;
