import axios from 'axios';

const axiosInstance = axios.create({
  baseURL: 'http://localhost:5001', // local
  //baseURL: 'http://3.26.96.188:5001', // live
  headers: { 'Content-Type': 'application/json' },
  timeout: 10000,
});

axiosInstance.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('userToken');
    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    console.error('Request error:', error);
    return Promise.reject(error);
  }
);

axiosInstance.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    console.error('API Error:', error);
    
    if (error.code === 'ECONNABORTED') {
      console.error('Request timeout');
    }
    
    if (error.response) {
      console.error(
        `Server error: ${error.response.status} - ${error.response.statusText}`,
        error.response.data
      );
      
      if (error.response.status === 401) {
        console.log('Authentication error - you may need to log in again');
      }
    } else if (error.request) {
      console.error('No response received from server');
    }
    
    return Promise.reject(error);
  }
);

export default axiosInstance;
