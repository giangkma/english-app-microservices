import axios from 'axios';
import { tokenStorage } from 'configs/token';
import queryString from 'query-string';

const axiosClient = axios.create({
  baseURL:
    process.env.NODE_ENV === 'development'
      ? process.env.REACT_APP_API_LOCAL_BASE_URL
      : 'https://english-apis.herokuapp.com/',
  headers: {
    'content-type': 'application/json',
  },
  withCredentials: true,
  paramsSerializer: (params) => queryString.stringify(params),
});

axiosClient.interceptors.request.use(
  (config) => {
    const token = tokenStorage.get();
    if (token) {
      config.headers.authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    throw error;
  },
);

axiosClient.interceptors.response.use(
  (res) => {
    return res;
  },
  (error) => {
    if (
      error.response?.status === 401 &&
      error.response?.data?.code === 'UNAUTHORIZED'
    ) {
      tokenStorage.clear();
      alert(error.response?.data?.message || '');
      window.location.reload();
    }
    throw error;
  },
);

export default axiosClient;
