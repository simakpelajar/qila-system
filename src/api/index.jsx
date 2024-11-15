
import axios from "axios";

const Api = axios.create({
  baseURL: "http://127.0.0.1:8000/api/",
});


Api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers["Authorization"] = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error); 
  }
);

export default Api;
