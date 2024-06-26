import axios from 'axios';

const defaultHeader = {
  'Access-Control-Allow-Origin': '*',
  'Content-Type': 'application/json',
  Accept: 'application/json',
};

const baseUrl: string = String(import.meta.env.VITE_API_URL);

const axiosClient = axios.create({
  baseURL: baseUrl,
  headers: defaultHeader,
});

axiosClient.interceptors.request.use(
  (config) => {
    return config;
  },
  (error) => {
    Promise.reject(error);
  }
);

axiosClient.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    throw error;
  }
);

export default axiosClient;
