import axios from "axios";

const ticketApi = axios.create({
  baseURL: "http://localhost:4002/api/tickets",
});

ticketApi.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});

export default ticketApi;
