export interface User {
  id: string
  name: string
  email: string
  created_at: string
}

export interface AuthResponse {
  token: string
  user: User
}

export interface ListItem {
  id: string
  item_name: string
  quantity_total: number
  unit_type: string
  quantity_per_portion: number
  member_name: string | null
  member_cpf: string | null
  list_id: string
  created_at: string
}

export interface List {
  id: string
  location: string
  event_date: string
  status: 'active' | 'archived'
  user_id: string
  created_at: string
  updated_at: string
  items: ListItem[]
  public_url?: string
}

export interface PublicList {
  id: string
  location: string
  event_date: string
  status: 'active' | 'archived'
  items: PublicListItem[]
}

export interface PublicListItem {
  id: string
  item_name: string
  quantity_per_portion: number
  unit_type: string
  member_name: string | null
}

export interface ApiError {
  message: string
  statusCode?: number
}
