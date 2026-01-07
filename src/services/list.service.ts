import { api } from '../lib/api'
import type { List, PublicList } from '../types'
import type { CreateListInput, EditListInput, RegisterMemberInput } from '../schemas/list.schema'

export const listService = {
  async getLists(): Promise<List[]> {
    const response = await api.get<List[]>('/lists')
    return response.data
  },

  async getListById(id: string): Promise<List> {
    const response = await api.get<List>(`/lists/${id}`)
    return response.data
  },

  async getPublicList(id: string): Promise<PublicList> {
    const response = await api.get<PublicList>(`/lists/public/${id}`)
    return response.data
  },

  async createList(data: CreateListInput): Promise<List> {
    const response = await api.post<List>('/lists', data)
    return response.data
  },

  async updateList(id: string, data: EditListInput): Promise<List> {
    const response = await api.put<List>(`/lists/${id}`, data)
    return response.data
  },

  async deleteList(id: string): Promise<void> {
    await api.delete(`/lists/${id}`)
  },

  async registerMember(data: RegisterMemberInput): Promise<void> {
    await api.post(`/lists/register-member`, data)
  },
}
