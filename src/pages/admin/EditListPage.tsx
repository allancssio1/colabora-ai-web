import { useQuery, useMutation } from '@tanstack/react-query'
import { useParams, useNavigate, Link } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { editListSchema, type EditListInput } from '@/schemas/list.schema'
import { listService } from '@/services/list.service'
import { Header } from '@/components/layout/Header'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
  Card,
  CardContent,
  CardTitle,
} from '@/components/ui/card'
import { Textarea } from '@/components/ui/textarea'
import { ArrowLeft, Save, RefreshCw, Edit } from 'lucide-react'
import { useState } from 'react'

export function EditListPage() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const [mode, setMode] = useState<'continue' | 'reset'>('continue')

  const { data: list, isLoading } = useQuery({
    queryKey: ['list', id],
    queryFn: () => listService.getListById(id!),
    enabled: !!id,
  })

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<EditListInput>({
    resolver: zodResolver(editListSchema),
    values: list
      ? {
          location: list.location,
          event_date: list.event_date,
          mode,
          items: list.items.map((item) => ({
            item_name: item.item_name,
            quantity_total: item.quantity_total,
            unit_type: item.unit_type as any,
            quantity_per_portion: item.quantity_per_portion,
          })),
        }
      : undefined,
  })

  const mutation = useMutation({
    mutationFn: (data: EditListInput) => listService.updateList(id!, data),
    onSuccess: () => {
      navigate(`/lists/${id}`)
    },
  })

  const onSubmit = (data: EditListInput) => {
    mutation.mutate({ ...data, mode })
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <div className="container py-8">
          <p>Carregando...</p>
        </div>
      </div>
    )
  }

  if (!list) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <div className="container py-8">
          <p>Lista não encontrada</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />

      <main className="container max-w-[960px] mx-auto px-4 sm:px-6 py-8">
        <div className="flex items-center gap-2 text-sm text-muted-foreground mb-2">
          <Link to={`/lists/${id}`} className="hover:text-primary flex items-center transition-colors">
            <ArrowLeft className="h-4 w-4 mr-1" />
            Voltar
          </Link>
          <span>/</span>
          <span>Editar Lista</span>
        </div>

        <div className="flex flex-col gap-2 mb-8">
          <h1 className="text-3xl md:text-4xl font-black leading-tight tracking-tight text-primary">
            Editar Lista de Contribuição
          </h1>
          <p className="text-muted-foreground text-base">
            Gerencie os detalhes do evento ou inicie um novo ciclo de arrecadação.
          </p>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
          <Card className="overflow-hidden">
            <CardContent className="p-6 md:p-8 space-y-8">
              <div>
                <CardTitle className="text-lg mb-4 flex items-center gap-2">
                  <Edit className="h-5 w-5" />
                  Informações Gerais
                </CardTitle>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="location" className="text-primary font-semibold">Nome do Evento</Label>
                    <Input
                      id="location"
                      placeholder="Ex: Café da Manhã da Equipe"
                      {...register('location')}
                    />
                    {errors.location && (
                      <p className="text-sm text-destructive">{errors.location.message}</p>
                    )}
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="event_date" className="text-primary font-semibold">Data do Evento</Label>
                    <Input id="event_date" type="datetime-local" {...register('event_date')} />
                    {errors.event_date && (
                      <p className="text-sm text-destructive">{errors.event_date.message}</p>
                    )}
                  </div>
                </div>
                <div className="space-y-2 mt-6">
                  <Label htmlFor="description" className="text-primary font-semibold">Descrição / Observações</Label>
                  <Textarea
                    id="description"
                    placeholder="Trazer bebidas de preferência. O local possui geladeira."
                    rows={4}
                    {...register('description')}
                  />
                  <p className="text-xs text-muted-foreground">
                    Adicione informações importantes sobre o evento (opcional)
                  </p>
                </div>
              </div>

              <hr className="border-border" />

              <div>
                <h3 className="text-lg font-bold mb-4 flex items-center gap-2 text-primary">
                  <RefreshCw className="h-5 w-5" />
                  Ação da Lista
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <label
                    className={`cursor-pointer relative flex flex-col p-5 rounded-xl border-2 transition-all ${
                      mode === 'continue'
                        ? 'border-primary bg-primary/5 dark:bg-primary/10'
                        : 'border-border hover:border-muted-foreground/30'
                    }`}
                  >
                    <input
                      type="radio"
                      name="mode"
                      value="continue"
                      checked={mode === 'continue'}
                      onChange={() => setMode('continue')}
                      className="sr-only"
                    />
                    <div className="flex items-center gap-3 mb-2">
                      <div
                        className={`flex items-center justify-center size-10 rounded-full ${
                          mode === 'continue'
                            ? 'bg-primary/20 text-primary'
                            : 'bg-muted text-muted-foreground'
                        }`}
                      >
                        <Edit className="h-5 w-5" />
                      </div>
                      <span className="font-bold text-primary">Continuar lista existente</span>
                    </div>
                    <p className="text-sm text-muted-foreground pl-[52px]">
                      Mantém todos os participantes, itens e histórico atual. Ideal para correções e
                      atualizações.
                    </p>
                  </label>

                  <label
                    className={`cursor-pointer relative flex flex-col p-5 rounded-xl border-2 transition-all ${
                      mode === 'reset'
                        ? 'border-primary bg-primary/5 dark:bg-primary/10'
                        : 'border-border hover:border-muted-foreground/30'
                    }`}
                  >
                    <input
                      type="radio"
                      name="mode"
                      value="reset"
                      checked={mode === 'reset'}
                      onChange={() => setMode('reset')}
                      className="sr-only"
                    />
                    <div className="flex items-center gap-3 mb-2">
                      <div
                        className={`flex items-center justify-center size-10 rounded-full ${
                          mode === 'reset'
                            ? 'bg-primary/20 text-primary'
                            : 'bg-muted text-muted-foreground'
                        }`}
                      >
                        <RefreshCw className="h-5 w-5" />
                      </div>
                      <span className="font-bold text-primary">Criar nova lista (Resetar)</span>
                    </div>
                    <p className="text-sm text-muted-foreground pl-[52px]">
                      Inicia um novo ciclo. Todos os dados atuais serão arquivados e a contagem reiniciada.
                    </p>
                  </label>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row items-center justify-between gap-4 border-t bg-muted/50 -mx-6 md:-mx-8 px-6 py-4 md:px-8 -mb-6 md:-mb-8">
                <p className="text-sm text-muted-foreground order-2 sm:order-1">
                  Última edição em {new Date(list.updated_at).toLocaleDateString('pt-BR')}
                </p>
                <div className="flex items-center gap-3 w-full sm:w-auto order-1 sm:order-2">
                  <Link to={`/lists/${id}`} className="flex-1 sm:flex-none">
                    <Button type="button" variant="outline" className="w-full">
                      Cancelar
                    </Button>
                  </Link>
                  <Button type="submit" disabled={mutation.isPending} className="flex-1 sm:flex-none">
                    <Save className="h-4 w-4 mr-2" />
                    {mutation.isPending ? 'Salvando...' : 'Salvar Alterações'}
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </form>
      </main>
    </div>
  )
}
