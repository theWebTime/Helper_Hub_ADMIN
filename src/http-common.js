import router from "@/router";
import axios from "axios";
import ls from "localstorage-slim";

const axiosIns = axios.create({
  baseURL: import.meta.env.VITE_API_ENDPOINT,
});

axiosIns.interceptors.request.use((config) => {
  const token = ls.get("user-info", { decrypt: true });

  if (token) {
    config.headers = config.headers || {};
    config.headers.Authorization = token ? `Bearer ${token.token}` : "";
  }

  return config;
});

axiosIns.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    if (error.response.status === 401) {
      localStorage.removeItem("user-info");
      router.push("/");
    } else {
      return Promise.reject(error);
    }
  }
);

export default axiosIns;
