import { api } from '../lib/api'
import type { AuthResponse } from '../types'
import type { LoginInput, RegisterInput } from '../schemas/auth.schema'

export const authService = {
  async login(data: LoginInput): Promise<AuthResponse> {
    const response = await api.post<AuthResponse>('/auth/login', data)
    return response.data
  },

  async register(data: RegisterInput): Promise<AuthResponse> {
    const response = await api.post<AuthResponse>('/auth/register', data)
    return response.data
  },

  async logout(): Promise<void> {
    localStorage.removeItem('token')
  },
}
