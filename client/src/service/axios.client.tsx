import axios, { AxiosRequestConfig } from "axios";
import { APP_STATUS } from "../const/appStatus";

const axiosClient = axios.create({
  baseURL: process.env.REACT_APP_ENDPOINT,
  headers: {
    "Content-Type": "application/json",
  },
  withCredentials: true,
});

async function refreshToken() {
  return await axiosClient.post(`/web/auth/refresh-token`);
}

//Interceptors
// Add a request interceptor
axiosClient.interceptors.request.use(
  function (config: AxiosRequestConfig | any) {
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
    return response;
  },
  function (error) {
    const appStatus = error.response ? error.response.data.appStatus : null;
    if (appStatus == APP_STATUS.TOKEN_EXPIRED) {
      return refreshToken().then((_) => {
        return axios.request(error.config);
      });
    }
    return Promise.reject(error);
  }
);
export default axiosClient;
