import { AxiosError } from 'axios'

export function extractErrorMessage(error: unknown, fallback: string): string {
  if (error instanceof AxiosError) {
    // Mensagem da API
    if (error.response?.data?.message) {
      return error.response.data.message
    }

    // Erros de rede/timeout
    if (error.message) {
      return error.message
    }
  }

  // Fallback genérico
  return fallback
}
