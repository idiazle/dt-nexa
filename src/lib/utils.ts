import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

type Payment = {
  id: string
  amount: number
  status: "pending" | "processing" | "success" | "failed"
  email: string
}

export const payments: Payment[] = [
  {
    id: "728ed52f",
    amount: 100,
    status: "pending",
    email: "m@example.com",
  },
  {
    id: "489e1d42",
    amount: 125,
    status: "processing",
    email: "example@gmail.com",
  },
  // ...
]

export interface moduleListStructure {
  id: number,
  icon_path: string,
  icon_tooltip: string,
  route: string
  enable: boolean
}


export interface UserStructure {
  id: number
  code: string
  role: string
  name: string
  last_name: string
  username: string
  dui: string
  short_name: string
  position: string
  email: string
  groups: any[]
}


export interface EntityStructure {
  id: number
  image: string | null
  description: string | null
  active: boolean
  name: string
  code: string
  type: number
  blocked: boolean
  parent_id: number | null
  user_id: number
  deleted: boolean
  plan_image: string | null
}

export interface Manufacturer {
  id: number
  name: string
}

export interface LevelData {
  id: number
  name: string
  code: string
  parent: number
  description: string | null
}

export interface EquipmentStructure {
  tag: string
  english_name: string | null
  requisition: string
  properties: string | null
  equipment_id: number
  level_data: LevelData
  name: string
  code: string
  parent: number
  manufacturer_id: Manufacturer
  parent_data: EntityStructure
}