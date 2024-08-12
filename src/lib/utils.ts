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

export interface PermissionsStructure {
  id: number
  model: string
  codename: string
  content_type: number
  content_type_name: string
}

export interface PermissionsListStructure {
  content_type_name: string
  permissions: PermissionsStructure[]
}

export interface AuthorizationStructure {
  id: number
  name: string
  user_permissions: any[]
  permissions: PermissionsStructure[]
}

export interface ColumnsPropsStructure {
  onEdit: (obj: any) => void;
  onDelete: (obj: any) => void;
}

export interface ModuleStructure {
  id: number
  name: string
  code: string
  initials: string
  parent: number
}

export interface DocumentStructure {
  id: number
  title: string
  filename: string | null
  author: string
  aux_type_id: ModuleStructure
  aux_discipline_id: ModuleStructure
  aux_module_id: ModuleStructure
  confidential: number
  file_url: string
  date_doc: any
  date_load: any
  date_expired: any
  days_expired: number
  user_id: number
  deleted: boolean
  vendor: any | null
  client: any | null
}

export interface ObjVsDocStructure {
  document_id: any[]
  entity_id: any[]
  type: number
  user_id: number
}

export interface OneAuxStructure {
  id: number
  name: string
  code: string
  initials: string
  icon_url: string
  parent: number
}

export interface AllAuxListStructure {
  modules: OneAuxStructure[]
  disciplines: OneAuxStructure[]
  types: OneAuxStructure[]
}