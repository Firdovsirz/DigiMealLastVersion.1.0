import axios from "axios";
import store from "../redux/store";

const apiClient = axios.create({
  baseURL: "http://192.168.171.192:5001",
});

apiClient.interceptors.request.use(
  (config) => {
    const token = store.getState().token.token;
    if (token) {
      config.headers["Authorization"] = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

export default apiClient;