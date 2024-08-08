import { authOptions } from '@/lib/authOptions';
import axios from 'axios'
import { getServerSession } from 'next-auth';
import { getSession } from 'next-auth/react';

const axiosInstance = axios.create({
  baseURL: process.env.NEXT_PUBLIC_BACK_URL,
});

axiosInstance.interceptors.request.use(async config => {
  const session = await getServerSession(authOptions);
  console.log(session);
  
  const token = session?.access_token;

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
}, error => {
  return Promise.reject(error);
});

export default axiosInstance;
