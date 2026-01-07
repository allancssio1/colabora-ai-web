import { z } from 'zod/v4'

export const itemSchema = z.object({
  name: z.string().min(1, 'Nome do item é obrigatório'),
  total_quantity: z.number().min(1, 'Quantidade total deve ser maior que 0'),
  unit: z.enum(['kg', 'g', 'unidade(s)', 'litro(s)', 'ml', 'metro(s)', 'pacote(s)', 'lata(s)', 'garrafa(s)']),
  quantity_per_member: z.number().min(1, 'Quantidade por membro deve ser maior que 0'),
})

export const createListSchema = z.object({
  location: z.string().min(3, 'Local do evento é obrigatório'),
  event_date: z.string().min(1, 'Data e hora do evento são obrigatórias'),
  items: z.array(itemSchema).min(1, 'Adicione pelo menos um item'),
})

export const editListSchema = z.object({
  location: z.string().min(3, 'Local do evento é obrigatório'),
  event_date: z.string().min(1, 'Data e hora do evento são obrigatórias'),
  description: z.string().optional(),
  mode: z.enum(['continue', 'reset']),
  items: z.array(itemSchema).min(1, 'Adicione pelo menos um item'),
})

export const registerMemberSchema = z.object({
  cpf: z.string().length(11, 'CPF deve conter 11 dígitos'),
  name: z.string().min(3, 'Nome é obrigatório'),
  item_id: z.string().min(1, 'Item é obrigatório'),
})

export type ItemInput = z.infer<typeof itemSchema>
export type CreateListInput = z.infer<typeof createListSchema>
export type EditListInput = z.infer<typeof editListSchema>
export type RegisterMemberInput = z.infer<typeof registerMemberSchema>
