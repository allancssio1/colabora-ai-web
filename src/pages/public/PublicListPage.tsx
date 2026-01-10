import { useState } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { useParams } from 'react-router-dom'
import { useForm, useWatch } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import {
  registerMemberSchema,
  type RegisterMemberInput,
} from '../../schemas/list.schema'
import { listService } from '../../services/list.service'
import { Button } from '../../components/ui/button'
import { Input } from '../../components/ui/input'
import { Card } from '../../components/ui/card'
import { Label } from '../../components/ui/label'
import {
  MapPin,
  Calendar,
  User,
  CheckCircle2,
  AlertCircle,
  Undo2,
} from 'lucide-react'
import { format } from 'date-fns'
import { ptBR } from 'date-fns/locale'
import { AppLogo } from '../../components/ui/app-logo'
import { ThemeToggle } from '../../components/ui/theme-toggle'
import { maskCPF } from '../../utils/masks'

export function PublicListPage() {
  const { id } = useParams<{ id: string }>()
  const [selectedItemId, setSelectedItemId] = useState<string | null>(null)
  const queryClient = useQueryClient()

  const { data: list, isLoading } = useQuery({
    queryKey: ['publicList', id],
    queryFn: () => listService.getPublicList(id!),
    enabled: !!id,
  })

  const {
    register,
    formState: { errors },
    setValue,
    control,
  } = useForm<RegisterMemberInput>({
    resolver: zodResolver(registerMemberSchema),
  })

  const cpf = useWatch({ control, name: 'cpf' })
  const name = useWatch({ control, name: 'name' })

  const mutation = useMutation({
    mutationFn: listService.registerMember,
    onSuccess: (data) => {
      console.log('✅ Mutation SUCCESS:', data)
      queryClient.invalidateQueries({ queryKey: ['publicList', id] })
      setSelectedItemId(null)
    },
    onError: (error) => {
      console.error('❌ Mutation ERROR:', error)
    },
  })

  const unregisterMutation = useMutation({
    mutationFn: ({ listId, itemId }: { listId: string; itemId: string }) =>
      listService.unregisterMember(listId, itemId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['publicList', id] })
    },
  })

  const handleAssumeItem = (itemId: string) => {
    const data = {
      name: name || '',
      cpf: cpf?.replace(/\D/g, '') || '',
      item_id: itemId,
    }

    const payload = { ...data, listId: id! }

    setSelectedItemId(itemId)
    mutation.mutate(payload)
  }

  const handleUnregister = (itemId: string) => {
    unregisterMutation.mutate({ listId: id!, itemId })
  }

  const formatDate = (dateString: string) => {
    try {
      return format(new Date(dateString), "dd 'de' MMMM, yyyy", {
        locale: ptBR,
      })
    } catch {
      return dateString
    }
  }

  const isEventPassed = list ? new Date(list.event_date) <= new Date() : false
  const canRegister = !isEventPassed && list?.status === 'active'

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background">
        <div className="container py-8">
          <p>Carregando...</p>
        </div>
      </div>
    )
  }

  if (!list) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-2">Lista não encontrada</h1>
          <p className="text-muted-foreground">
            Verifique se o link está correto.
          </p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Navbar */}
      <nav className="relative flex w-full flex-col bg-card border-b">
        <div className="container max-w-240 mx-auto px-4 md:px-10 lg:px-40">
          <header className="flex items-center justify-between py-3">
            <div className="flex items-center gap-4">
              <AppLogo className="h-8 w-8 text-primary" />
              <h2 className="text-lg font-bold leading-tight tracking-tight">
                Colabora-AI
              </h2>
            </div>
            <ThemeToggle />
          </header>
        </div>
      </nav>

      {/* Main Content */}
      <main className="relative flex min-h-screen w-full flex-col">
        <div className="container max-w-240 mx-auto px-4 md:px-10 lg:px-40 py-8">
          <div className="flex flex-col gap-6">
            {/* Event Header */}
            <Card className="p-6">
              <div className="flex flex-wrap justify-between gap-4">
                <div className="flex flex-col gap-2">
                  <div className="flex items-center gap-2">
                    <span
                      className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${
                        canRegister
                          ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-100'
                          : 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200'
                      }`}
                    >
                      {canRegister ? 'Lista Aberta' : 'Lista Encerrada'}
                    </span>
                  </div>
                  <h1 className="text-3xl font-bold tracking-tight text-primary">
                    {list.location}
                  </h1>
                  <p className="text-sm text-muted-foreground">
                    Confira os detalhes e contribua com o evento.
                  </p>
                </div>
                <div className="flex flex-col items-center justify-center rounded-lg bg-muted p-3 min-w-[80px] border">
                  <span className="text-xs font-bold uppercase text-muted-foreground">
                    {format(new Date(list.event_date), 'MMM', {
                      locale: ptBR,
                    }).toUpperCase()}
                  </span>
                  <span className="text-2xl font-bold text-primary">
                    {format(new Date(list.event_date), 'dd')}
                  </span>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-4 border-t mt-6">
                <div className="flex items-start gap-3">
                  <div className="mt-1 flex h-8 w-8 items-center justify-center rounded-full bg-primary/10 text-primary">
                    <MapPin className="h-4 w-4" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">
                      Local
                    </p>
                    <p className="text-base font-semibold leading-normal">
                      {list.location}
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="mt-1 flex h-8 w-8 items-center justify-center rounded-full bg-primary/10 text-primary">
                    <Calendar className="h-4 w-4" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">
                      Data e Hora
                    </p>
                    <p className="text-base font-semibold leading-normal">
                      {formatDate(list.event_date)}
                    </p>
                    <p className="text-sm text-muted-foreground">
                      Início às {format(new Date(list.event_date), 'HH:mm')}
                    </p>
                  </div>
                </div>
              </div>
            </Card>

            {/* User Form */}
            {canRegister && (
              <Card className="p-6">
                <div className="flex items-center gap-2 mb-6">
                  <User className="h-5 w-5 text-primary" />
                  <h3 className="text-lg font-bold leading-tight text-primary">
                    Seus Dados
                  </h3>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="name">Seu nome</Label>
                    <Input
                      id="name"
                      placeholder="Ex: João da Silva"
                      {...register('name')}
                      className={errors.name ? 'border-destructive' : ''}
                    />
                    {errors.name && (
                      <p className="text-sm font-medium text-destructive flex items-center gap-1">
                        <AlertCircle className="h-3 w-3" />
                        {errors.name.message}
                      </p>
                    )}
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="cpf">CPF</Label>
                    <Input
                      id="cpf"
                      placeholder="000.000.000-00"
                      maxLength={14}
                      {...register('cpf', {
                        onChange: (e) => {
                          const formatted = maskCPF(e.target.value)
                          setValue('cpf', formatted)
                        },
                      })}
                      className={errors.cpf ? 'border-destructive' : ''}
                    />
                    {errors.cpf && (
                      <p className="text-sm font-medium text-destructive flex items-center gap-1">
                        <AlertCircle className="h-3 w-3" />
                        {errors.cpf.message}
                      </p>
                    )}
                  </div>
                </div>
                <div className="mt-4 p-3 bg-primary/5 rounded-lg border border-primary/20">
                  <p className="text-xs text-primary flex items-center gap-2">
                    <AlertCircle className="h-4 w-4" />
                    Preencha seus dados para habilitar os botões de contribuição
                    abaixo.
                  </p>
                </div>
              </Card>
            )}

            {/* Items List */}
            <Card className="overflow-hidden">
              <div className="px-6 py-4 border-b flex items-center justify-between bg-muted/50">
                <div className="flex items-center gap-2">
                  <h3 className="text-lg font-bold leading-tight text-primary">
                    Itens da Lista
                  </h3>
                </div>
                <span className="text-sm text-muted-foreground">
                  {list.items.filter((i) => !i.member_name).length} de{' '}
                  {list.items.length} itens disponíveis
                </span>
              </div>
              {list.items.map((item) => (
                <div
                  key={item.id}
                  className={`flex flex-col sm:flex-row items-start sm:items-center justify-between p-5 border-b last:border-b-0 transition-colors ${
                    item.member_name ? 'bg-muted/20' : 'hover:bg-muted/50'
                  }`}
                >
                  <div
                    className={`flex items-start gap-4 mb-4 sm:mb-0 ${
                      item.member_name ? 'opacity-75' : ''
                    }`}
                  >
                    <div
                      className={`flex h-10 w-10 items-center justify-center rounded-lg ${
                        item.member_name
                          ? 'bg-muted text-muted-foreground'
                          : 'bg-muted text-foreground'
                      }`}
                    >
                      {item.member_name ? (
                        <CheckCircle2 className="h-5 w-5" />
                      ) : (
                        <span className="text-lg">📦</span>
                      )}
                    </div>
                    <div className="flex flex-col">
                      <p
                        className={`font-semibold text-base ${
                          item.member_name
                            ? 'line-through text-muted-foreground'
                            : ''
                        }`}
                      >
                        {item.quantity_per_portion} {item.unit_type} de{' '}
                        {item.item_name}
                      </p>
                    </div>
                  </div>

                  {item.member_name ? (
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-medium text-muted-foreground">
                        Reservado por{' '}
                        <span className="font-bold text-foreground">
                          {item.member_name}
                        </span>
                      </span>

                      {item.member_name === name &&
                        item.member_cpf === cpf.replace(/\D/g, '') && (
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => handleUnregister(item.id)}
                            disabled={unregisterMutation.isPending}
                            title="Desfazer reserva"
                          >
                            <Undo2 className="h-4 w-4" />
                          </Button>
                        )}
                    </div>
                  ) : canRegister ? (
                    <Button
                      onClick={() => handleAssumeItem(item.id)}
                      disabled={!cpf || !name || mutation.isPending}
                      className="w-full sm:w-auto"
                    >
                      {mutation.isPending && selectedItemId === item.id
                        ? 'Registrando...'
                        : 'Assumir este item'}
                    </Button>
                  ) : (
                    <span className="text-sm text-muted-foreground">
                      Lista encerrada
                    </span>
                  )}
                </div>
              ))}
            </Card>

            {!canRegister && (
              <div className="flex justify-center mt-4">
                <p className="text-xs text-muted-foreground text-center max-w-md">
                  Este evento já aconteceu. As listas são fechadas
                  automaticamente após o horário de início.
                </p>
              </div>
            )}
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="w-full border-t bg-card py-6">
        <div className="flex justify-center text-center px-4">
          <p className="text-sm text-muted-foreground">
            © 2024 Colabora-AI. Facilidade para seus eventos.
          </p>
        </div>
      </footer>
    </div>
  )
}
