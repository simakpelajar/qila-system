import axios from "axios";

const Api = axios.create({
   baseURL: 'https://qila.texnoz.com/api/',
   headers: {
     'Content-Type': 'application/json',
     'Accept': 'application/json'
   }
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
