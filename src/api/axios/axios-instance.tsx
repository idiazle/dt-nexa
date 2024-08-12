import { authOptions } from '@/lib/authOptions';
import axios from 'axios'
import { getServerSession } from 'next-auth';
import { getSession, signOut } from 'next-auth/react';



const axiosInstance = axios.create({
  baseURL: process.env.NEXT_PUBLIC_BACK_URL,
});

axiosInstance.interceptors.request.use(async config => {
  const session = await getSession()
  // console.log(session);

  const token = session?.access_token;

  if (token) {
    config.headers.Authorization = `Bearer ${token}`
    config.headers['Accept-Language'] = 'es-es'
  }

  return config;
}, async error => {
  return await Promise.reject(error);
});


axiosInstance.interceptors.response.use(response => response,
  async error => {
    // console.log(error)
    // console.log(error.response)
    if (error.response) {
      console.log("AQUI");
      if (error.response.status === 401) {
        console.log("AQUI 2");
        // await signOut({ callbackUrl: '/auth/login' })
        if (typeof window !== 'undefined') {

          // await signOut({ callbackUrl: '/auth/login' });
          // logoutAction()
        } else {
          console.log('Unauthorized - Server Side');
          // Aquí podrías manejar el error en el servidor o simplemente lanzar un error
          throw new Error("401");
        }
      } else {
        throw new Error('Prohibited')
      }
    } else {
      console.log('Error')
    }
    return await Promise.reject(error)
  }
)

export default axiosInstance;
