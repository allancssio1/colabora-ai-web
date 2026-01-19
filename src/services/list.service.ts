import { api } from '@/lib/api'
import type { List, PublicList } from '@/types'
import type {
  CreateListInput,
  EditListInput,
  RegisterMemberInput,
} from '@/schemas/list.schema'

export const listService = {
  async getLists(): Promise<List[]> {
    const response = await api.get<{ lists: List[] }>('/lists')
    return response.data.lists // Extrai o array de dentro do objeto
  },
  async getListById(id: string): Promise<List> {
    const response = await api.get<List>(`/lists/${id}`)
    console.log('🚀 ~ response:', response)
    return response.data
  },

  async getPublicList(id: string): Promise<PublicList> {
    const response = await api.get<PublicList>(`/lists/${id}`)
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

  async registerMember(
    data: RegisterMemberInput & { listId: string },
  ): Promise<void> {
    const { listId, ...body } = data
    await api.post(`/lists/${listId}/register`, body)
  },

  async unregisterMember(listId: string, itemId: string): Promise<void> {
    await api.delete(`/lists/${listId}/items/${itemId}/register`)
  },

  async createListFromTemplate(templateListId: string): Promise<List> {
    const response = await api.post<List>('/lists/from-template', {
      template_list_id: templateListId,
    })
    return response.data
  },

  async toggleListStatus(listId: string): Promise<List> {
    const response = await api.patch<List>(`/lists/${listId}/status`)
    return response.data
  },
}
