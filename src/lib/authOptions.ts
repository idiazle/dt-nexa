import CredentialsProvider from 'next-auth/providers/credentials';
import { type NextAuthOptions } from 'next-auth';
import { jwtDecode, JwtPayload } from "jwt-decode";
import axios from 'axios';
import { postLogin } from '@/api/auth/auth-api';
import { type UserStructure } from '@/lib/utils';
import { signOut } from 'next-auth/react';
import axiosInstance from '@/api/axios/axios-instance';

interface UserStructureAuth {
  token: string | any;
  user: UserStructure | any;
  account: any;
}

async function refreshAccessToken(token: any) {
  try {
    const response = await axios.post(`${process.env.NEXT_PUBLIC_BACK_URL}/token/refresh`, {
      refresh: token.refresh_token
    });

    if (response.status === 200) {
      return {
        ...token,
        access_token: response.data.access,
        refresh_token: response.data.refresh ?? token.refresh_token,
        accessTokenExpires: jwtDecode(response.data.access).exp * 1000,
      };
    }
    throw response.data;
  } catch (error) {
    console.log(error);
    await signOut({ callbackUrl: '/auth/login' })
    return {
      ...token,
      error: "RefreshAccessTokenError",
    };
  }
}

export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      name: 'credentials',
      credentials: {
        userdata: { label: 'userdata', placeholder: 'username' },
        password: { label: 'password', placeholder: 'password' }
      },
      async authorize(credentials) {
        const sendCredentials = {
          username: credentials?.userdata,
          password: credentials?.password
        };
        try {
          const response = await postLogin(sendCredentials);
          if (response === null || response === undefined) {
            throw new Error('No response from authentication service');
          }

          const token = {
            id: 'a',
            access_token: response?.access_token,
            refresh_token: response?.refresh_token
          };
          // console.log("IN PROVIDER", token);
          return token;
        } catch (e: any) {
          const errorMessage = e.response?.data.message;
          throw new Error(errorMessage ? errorMessage : 'Problema al iniciar sesión');
        }
      }
    })
  ],
  pages: {
    signIn: '/auth/login',
    signOut: '/auth/login',
    error: '/error'
  },
  session: {
    strategy: 'jwt'
  },
  callbacks: {
    async jwt({ token, account, user }: UserStructureAuth) {
      // console.log("IN JWT ", token);

      if (token.access_token) {
        const decodedToken = jwtDecode(token.access_token);
        // console.log(decodedToken);
        token.accessTokenExpires = decodedToken?.exp * 1000;
      }

      if (account && user) {
        return {
          ...token,
          access_token: user.access_token,
          refresh_token: user.refresh_token,
          user,
        };
      }

      if (Date.now() < token.accessTokenExpires) {
        return token;
      } 

      const refreshedToken = await refreshAccessToken(token);

      return refreshedToken;
    },
    async session({ session, token }) {
      // console.log(token);

      if (token.access_token !== null && token.access_token !== undefined) {
        const decoded = jwtDecode(String(token.access_token)) as any;
        session.user = {
          id: decoded?.user_id,
          code: decoded?.code,
          role: decoded?.role,
          name: decoded?.name,
          last_name: decoded?.last_name,
          username: decoded?.username,
          dui: decoded?.dui,
          short_name: decoded?.short_name,
          position: decoded?.position,
          email: decoded?.email,
          groups: decoded?.groups
        };
        session.access_token = token?.access_token as string;
        axiosInstance.defaults.headers["Authorization"] = `Bearer ${token?.access_token}`

      }

      return session;
    }
  }
};
