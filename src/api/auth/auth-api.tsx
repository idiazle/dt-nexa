import { type UserStructure } from '@/lib/utils'
import axios from 'axios'
export const postLogin = async (data: {
  username: string | undefined
  password: string | undefined
}) => {
  const res = await axios.post(`${process.env.NEXT_PUBLIC_BACK_URL}/login`, JSON.stringify(data), { headers: { 'Content-Type': 'application/json' } })
  return res.data
}
export const postRegister = async (data: UserStructure) => {
  const res = await axios.post(`${process.env.NEXT_PUBLIC_BACK_URL}/register`, JSON.stringify(data), { headers: { 'Content-Type': 'application/json' } })
  return res
}