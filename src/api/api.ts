import axios from 'axios';

const api = axios.create({
  // baseURL: 'http://localhost:3000/api',
  baseURL: 'https://accounting-automation-tool-backend.vercel.app',
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true
});

export default api