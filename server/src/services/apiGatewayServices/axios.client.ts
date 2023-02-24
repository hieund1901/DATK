import axios, { AxiosRequestConfig } from "axios";

const axiosClient = axios.create({
  baseURL: process.env.HOST,
  headers: {
    "Content-Type": "application/json",
  },
});

//Interceptors
// Add a request interceptor
axiosClient.interceptors.request.use(
  function (config: AxiosRequestConfig) {
    return config;
  },
  function (error) {
    // Do something with request error
    return Promise.reject(error);
  }
);

// Add a response interceptor
axiosClient.interceptors.response.use(
  function (response) {
    return response.data;
  },
  function (error) {
    return Promise.reject(error);
  }
);
export default axiosClient;
