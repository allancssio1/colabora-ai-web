import { useQuery, useMutation } from '@tanstack/react-query'
import { useParams, useNavigate, Link } from 'react-router-dom'
import { useForm, useFieldArray } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { toast } from 'sonner'
import {
  editListSchema,
  type EditListInput,
  type ItemInput,
} from '@/schemas/list.schema'
import { listService } from '@/services/list.service'
import { toastMessages } from '@/utils/toast-messages'
import { extractErrorMessage } from '@/utils/error-handler'
import { Header } from '@/components/layout/Header'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Card, CardContent, CardTitle, CardHeader } from '@/components/ui/card'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import {
  ArrowLeft,
  Save,
  RefreshCw,
  Edit,
  ShoppingCart,
  Plus,
  Trash2,
  PieChart,
  Info,
  MapPin,
  CalendarIcon,
} from 'lucide-react'
import { useState, useMemo } from 'react'

const UNITS = [
  'kg',
  'g',
  'unidade(s)',
  'litro(s)',
  'ml',
  'metro(s)',
  'pacote(s)',
  'lata(s)',
  'garrafa(s)',
] as const

export function EditListPage() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const [mode, setMode] = useState<'continue' | 'reset'>('continue')

  const { data: list, isLoading } = useQuery({
    queryKey: ['list', id],
    queryFn: () => listService.getListById(id!),
    enabled: !!id,
  })

  // Agrupar parcelas por item_name para obter itens únicos
  const groupedItems = useMemo(() => {
    if (!list?.items) return []

    const grouped = list.items.reduce(
      (acc, parcel) => {
        if (!acc[parcel.item_name]) {
          acc[parcel.item_name] = {
            item_name: parcel.item_name,
            unit_type: parcel.unit_type,
            quantity_per_portion: parcel.quantity_per_portion,
            parcels: [],
          }
        }
        acc[parcel.item_name].parcels.push(parcel)
        return acc
      },
      {} as Record<
        string,
        {
          item_name: string
          unit_type: string
          quantity_per_portion: number
          parcels: typeof list.items
        }
      >,
    )

    return Object.values(grouped).map((group) => ({
      item_name: group.item_name,
      unit_type: group.unit_type as ItemInput['unit_type'],
      quantity_per_portion: group.quantity_per_portion,
      quantity_total: group.parcels.length * group.quantity_per_portion,
    }))
  }, [list?.items])

  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
  } = useForm<EditListInput>({
    resolver: zodResolver(editListSchema),
    values: list
      ? {
          location: list.location,
          event_date: list.event_date,
          mode,
          items: groupedItems,
        }
      : undefined,
  })

  const { fields, append, remove, update } = useFieldArray({
    control,
    name: 'items',
  })

  const [newItem, setNewItem] = useState<Partial<ItemInput>>({
    unit_type: 'kg',
  })
  const [editingIndex, setEditingIndex] = useState<number | null>(null)

  // Helper: Verificar se item tem membros
  const checkIfItemHasMembers = (itemName: string): boolean => {
    if (!list?.items) return false

    return list.items.some(
      (parcel) => parcel.item_name === itemName && parcel.member_name !== null,
    )
  }

  // Helper: Contar parcelas assumidas de um item
  const countTakenParcels = (itemName: string): number => {
    if (!list?.items) return 0

    return list.items.filter(
      (parcel) => parcel.item_name === itemName && parcel.member_name !== null,
    ).length
  }

  // Calcular preview de parcelas
  const calculateParcels = (total: number, perMember: number) => {
    if (!total || !perMember) return 0
    return Math.ceil(total / perMember)
  }

  const previewParcels = useMemo(() => {
    if (newItem.quantity_total && newItem.quantity_per_portion) {
      return calculateParcels(
        newItem.quantity_total,
        newItem.quantity_per_portion,
      )
    }
    return 0
  }, [newItem.quantity_total, newItem.quantity_per_portion])

  // Adicionar Item
  const addItem = () => {
    if (
      newItem.item_name &&
      newItem.quantity_total &&
      newItem.quantity_per_portion &&
      newItem.unit_type
    ) {
      append(newItem as ItemInput)
      setNewItem({ unit_type: 'kg' })
    }
  }

  // Editar Item
  const startEdit = (index: number) => {
    const item = fields[index]
    setEditingIndex(index)
    setNewItem(item)
  }

  const saveEdit = () => {
    if (editingIndex !== null && newItem.item_name) {
      const originalItem = fields[editingIndex]
      const hasMembers = checkIfItemHasMembers(originalItem.item_name)

      if (hasMembers) {
        // Item com membros: só pode alterar quantity_total
        const takenCount = countTakenParcels(originalItem.item_name)
        const newParcels = calculateParcels(
          newItem.quantity_total || 0,
          originalItem.quantity_per_portion,
        )

        if (newParcels < takenCount) {
          toast.error(
            `Este item possui ${takenCount} parcelas assumidas. Não é possível reduzir para menos de ${takenCount} parcelas.`,
          )
          return
        }

        // Manter quantity_per_portion e unit_type originais
        update(editingIndex, {
          ...originalItem,
          quantity_total: newItem.quantity_total || originalItem.quantity_total,
        })
      } else {
        // Item sem membros: pode alterar tudo
        update(editingIndex, newItem as ItemInput)
      }

      setEditingIndex(null)
      setNewItem({ unit_type: 'kg' })
    }
  }

  const cancelEdit = () => {
    setEditingIndex(null)
    setNewItem({ unit_type: 'kg' })
  }

  // Remover Item
  const removeItem = (index: number) => {
    const item = fields[index]
    const hasMembersInBackend = checkIfItemHasMembers(item.item_name)

    if (hasMembersInBackend) {
      toast.error(
        'Este item já possui membros cadastrados e não pode ser removido',
      )
      return
    }

    remove(index)
  }

  const mutation = useMutation({
    mutationFn: (data: EditListInput) => listService.updateList(id!, data),
    onSuccess: () => {
      toast.success(toastMessages.list.updateSuccess)
      navigate(`/lists/${id}`)
    },
    onError: (error) => {
      toast.error(extractErrorMessage(error, toastMessages.list.updateError))
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

      <main className="container max-w-[1040px] mx-auto px-4 sm:px-6 py-8">
        {/* Breadcrumbs */}
        <div className="flex items-center gap-2 text-sm text-muted-foreground mb-2">
          <Link
            to={`/lists/${id}`}
            className="hover:text-primary flex items-center transition-colors"
          >
            <ArrowLeft className="h-4 w-4 mr-1" />
            Voltar
          </Link>
          <span>/</span>
          <span>Editar Lista</span>
        </div>

        {/* Page Heading */}
        <div className="flex flex-col gap-2 mb-8">
          <h1 className="text-3xl sm:text-4xl font-black leading-tight tracking-tight text-primary">
            Editar Lista de Contribuição
          </h1>
          <p className="text-muted-foreground text-base max-w-2xl">
            Gerencie os detalhes do evento ou inicie um novo ciclo de
            arrecadação.
          </p>
        </div>

        <form
          id="edit-list-form"
          onSubmit={handleSubmit(onSubmit)}
          className="flex flex-col gap-8"
        >
          {/* Event Details Section */}
          <Card className="overflow-hidden">
            <CardHeader className="border-b bg-muted/50">
              <CardTitle className="text-lg flex items-center gap-2">
                <MapPin className="h-5 w-5" />
                Detalhes do Evento
              </CardTitle>
            </CardHeader>
            <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label
                  htmlFor="location"
                  className="text-primary font-semibold"
                >
                  Local do evento
                </Label>
                <div className="relative">
                  <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-primary" />
                  <Input
                    id="location"
                    placeholder="Ex: Churrasco na casa do João"
                    className="pl-10"
                    {...register('location')}
                  />
                </div>
                {errors.location && (
                  <p className="text-sm text-destructive">
                    {errors.location.message}
                  </p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="event_date">Data e hora</Label>
                <div className="relative">
                  <CalendarIcon className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="event_date"
                    type="datetime-local"
                    className="pl-10"
                    {...register('event_date')}
                  />
                </div>
                {errors.event_date && (
                  <p className="text-sm text-destructive">
                    {errors.event_date.message}
                  </p>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Items Section */}
          <Card className="overflow-hidden">
            <CardHeader className="border-b bg-muted/50 flex-row justify-between items-center space-y-0">
              <CardTitle className="text-lg flex items-center gap-2">
                <ShoppingCart className="h-5 w-5" />
                Itens para Contribuição
              </CardTitle>
              <span className="text-xs font-medium px-2 py-1 rounded bg-primary/10 text-primary">
                {fields.length} itens
              </span>
            </CardHeader>

            <CardContent className="p-0">
              {/* Formulário de Adicionar/Editar */}
              {(() => {
                // Verificar se o item sendo editado tem membros
                const isEditingItemWithMembers =
                  editingIndex !== null &&
                  checkIfItemHasMembers(fields[editingIndex]?.item_name)
                const takenParcelsCount =
                  editingIndex !== null
                    ? countTakenParcels(fields[editingIndex]?.item_name)
                    : 0

                return (
                  <div className="p-6 border-b">
                    <h3 className="text-sm font-bold uppercase tracking-wider text-primary mb-4">
                      {editingIndex !== null
                        ? 'Editar Item'
                        : 'Adicionar Novo Item'}
                      {isEditingItemWithMembers && (
                        <span className="ml-2 text-xs font-normal text-amber-600 bg-amber-100 px-2 py-0.5 rounded">
                          {takenParcelsCount} parcela(s) assumida(s) - alguns
                          campos bloqueados
                        </span>
                      )}
                    </h3>

                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-12 gap-4 items-end">
                      {/* Nome do Item */}
                      <div className="sm:col-span-2 lg:col-span-4 space-y-1">
                        <Label className="text-xs">Nome do item</Label>
                        <Input
                          placeholder="Ex: Carne Alcatra"
                          value={newItem.item_name || ''}
                          disabled={isEditingItemWithMembers}
                          onChange={(e) =>
                            setNewItem({
                              ...newItem,
                              item_name: e.target.value,
                            })
                          }
                        />
                      </div>

                      {/* Quantidade Total */}
                      <div className="sm:col-span-1 lg:col-span-2 space-y-1">
                        <Label className="text-xs">Qtd Total</Label>
                        <Input
                          type="number"
                          placeholder="0"
                          min={
                            isEditingItemWithMembers
                              ? takenParcelsCount *
                                (newItem.quantity_per_portion || 1)
                              : 1
                          }
                          value={newItem.quantity_total || ''}
                          onChange={(e) =>
                            setNewItem({
                              ...newItem,
                              quantity_total: Number(e.target.value),
                            })
                          }
                        />
                        {isEditingItemWithMembers && (
                          <p className="text-xs text-amber-600">
                            Mínimo:{' '}
                            {takenParcelsCount *
                              (newItem.quantity_per_portion || 1)}{' '}
                            (parcelas assumidas)
                          </p>
                        )}
                      </div>

                      {/* Unidade */}
                      <div className="sm:col-span-1 lg:col-span-2 space-y-1">
                        <Label className="text-xs">Unidade</Label>
                        <Select
                          value={newItem.unit_type || 'kg'}
                          disabled={isEditingItemWithMembers}
                          onValueChange={(value) =>
                            setNewItem({
                              ...newItem,
                              unit_type: value as ItemInput['unit_type'],
                            })
                          }
                        >
                          <SelectTrigger
                            className="bg-background"
                          >
                            <SelectValue placeholder="Selecione" />
                          </SelectTrigger>
                          <SelectContent className="bg-white dark:bg-zinc-900 ">
                            {UNITS.map((unit) => (
                              <SelectItem key={unit} value={unit}>
                                {unit}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>

                      {/* Por Membro */}
                      <div className="sm:col-span-2 lg:col-span-2 space-y-1">
                        <Label className="text-xs">Por Membro</Label>
                        <Input
                          type="number"
                          placeholder="0"
                          disabled={isEditingItemWithMembers}
                          value={newItem.quantity_per_portion || ''}
                          onChange={(e) =>
                            setNewItem({
                              ...newItem,
                              quantity_per_portion: Number(e.target.value),
                            })
                          }
                        />
                      </div>

                      {/* Botões */}
                      <div className="sm:col-span-2 lg:col-span-2 space-y-1">
                        <Label className="text-xs invisible">Ação</Label>
                        {editingIndex !== null ? (
                          <div className="flex gap-2">
                            <Button
                              type="button"
                              variant="outline"
                              className="flex-1"
                              onClick={cancelEdit}
                            >
                              Cancelar
                            </Button>
                            <Button
                              type="button"
                              className="flex-1"
                              onClick={saveEdit}
                            >
                              Salvar
                            </Button>
                          </div>
                        ) : (
                          <Button
                            type="button"
                            variant="outline"
                            className="w-full h-10 border-primary text-primary hover:bg-primary hover:text-primary-foreground"
                            onClick={addItem}
                          >
                            <Plus className="h-4 w-4 mr-2" />
                            Adicionar
                          </Button>
                        )}
                      </div>
                    </div>

                    {/* Preview de Parcelas */}
                    <div className="mt-4 flex items-start gap-3 p-3 bg-primary/5 rounded-lg border border-primary/20">
                      <Info className="h-5 w-5 text-primary shrink-0" />
                      <div className="flex flex-col sm:flex-row sm:items-center gap-1">
                        <p className="text-sm font-medium">Previsão:</p>
                        {previewParcels ? (
                          <p className="text-sm text-muted-foreground">
                            Isso gerará{' '}
                            <strong className="text-primary">
                              {previewParcels} parcelas
                            </strong>{' '}
                            de{' '}
                            <strong className="text-primary">
                              {newItem.quantity_per_portion} {newItem.unit_type}
                            </strong>
                          </p>
                        ) : (
                          <p className="text-sm text-muted-foreground">
                            Preencha os campos acima para calcular as parcelas
                            automaticamente.
                          </p>
                        )}
                      </div>
                    </div>
                  </div>
                )
              })()}

              {/* Tabela de Itens */}
              {fields.length > 0 ? (
                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow className="bg-muted/50 border-b">
                        <TableHead className="px-6 py-4">
                          Nome do Item
                        </TableHead>
                        <TableHead className="px-6 py-4 text-center">
                          Qtd Total
                        </TableHead>
                        <TableHead className="px-6 py-4 text-center">
                          Por Membro
                        </TableHead>
                        <TableHead className="px-6 py-4">
                          Parcelamento
                        </TableHead>
                        <TableHead className="px-6 py-4 text-center">
                          Status
                        </TableHead>
                        <TableHead className="px-6 py-4 text-right">
                          Ações
                        </TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody className="divide-y">
                      {fields.map((field, index) => {
                        const parcels = calculateParcels(
                          field.quantity_total,
                          field.quantity_per_portion,
                        )
                        const hasMembers = checkIfItemHasMembers(
                          field.item_name,
                        )

                        return (
                          <TableRow
                            key={field.id}
                            className="hover:bg-muted/50"
                          >
                            <TableCell className="px-6 py-4 font-medium">
                              {field.item_name}
                            </TableCell>
                            <TableCell className="px-6 py-4 text-center">
                              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-muted">
                                {field.quantity_total} {field.unit_type}
                              </span>
                            </TableCell>
                            <TableCell className="px-6 py-4 text-center text-muted-foreground">
                              {field.quantity_per_portion} {field.unit_type}
                            </TableCell>
                            <TableCell className="px-6 py-4">
                              <div className="flex items-center gap-2 text-muted-foreground">
                                <PieChart className="h-4 w-4 text-primary" />
                                <span>
                                  {parcels} parcelas de{' '}
                                  {field.quantity_per_portion} {field.unit_type}
                                </span>
                              </div>
                            </TableCell>
                            <TableCell className="px-6 py-4 text-center">
                              {hasMembers ? (
                                <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                                  Com membros
                                </span>
                              ) : (
                                <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-600">
                                  Disponível
                                </span>
                              )}
                            </TableCell>
                            <TableCell className="px-6 py-4 text-right">
                              <div className="flex items-center justify-end gap-1">
                                <Button
                                  type="button"
                                  variant="ghost"
                                  size="icon"
                                  title={
                                    hasMembers
                                      ? 'Editar quantidade (alguns campos bloqueados)'
                                      : 'Editar item'
                                  }
                                  onClick={() => startEdit(index)}
                                >
                                  <Edit className="h-4 w-4" />
                                </Button>
                                <Button
                                  type="button"
                                  variant="ghost"
                                  size="icon"
                                  disabled={hasMembers}
                                  title={
                                    hasMembers
                                      ? 'Item com membros não pode ser removido'
                                      : 'Remover item'
                                  }
                                  className="text-muted-foreground hover:text-destructive"
                                  onClick={() => removeItem(index)}
                                >
                                  <Trash2 className="h-4 w-4" />
                                </Button>
                              </div>
                            </TableCell>
                          </TableRow>
                        )
                      })}
                    </TableBody>
                  </Table>
                </div>
              ) : (
                <div className="p-12 flex flex-col items-center justify-center text-center">
                  <div className="size-16 bg-muted rounded-full flex items-center justify-center mb-4">
                    <ShoppingCart className="h-8 w-8 text-primary" />
                  </div>
                  <h3 className="text-lg font-medium mb-1 text-primary">
                    Sua lista está vazia
                  </h3>
                  <p className="text-muted-foreground">
                    Adicione o primeiro item usando o formulário acima.
                  </p>
                </div>
              )}
            </CardContent>
          </Card>
        </form>

        {/* Ação da Lista - FORA DO CARD */}
        <div className="mt-8">
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
                <span className="font-bold text-primary">
                  Continuar lista existente
                </span>
              </div>
              <p className="text-sm text-muted-foreground pl-[52px]">
                Mantém todos os participantes, itens e histórico atual. Ideal
                para correções e atualizações.
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
                <span className="font-bold text-primary">
                  Criar nova lista (Resetar)
                </span>
              </div>
              <p className="text-sm text-muted-foreground pl-[52px]">
                Inicia um novo ciclo. Todos os dados atuais serão arquivados e a
                contagem reiniciada.
              </p>
            </label>
          </div>
        </div>

        {/* Actions Footer */}
        <div className="sticky bottom-0 -mx-4 sm:mx-0 px-4 py-4 bg-background/80 backdrop-blur-md border-t flex justify-end gap-3 sm:rounded-xl shadow-lg">
          <Link to={`/lists/${id}`}>
            <Button type="button" variant="outline">
              Cancelar
            </Button>
          </Link>
          <Button
            form="edit-list-form"
            type="submit"
            disabled={mutation.isPending}
          >
            <Save className="h-4 w-4 mr-2" />
            {mutation.isPending ? 'Salvando...' : 'Salvar Alterações'}
          </Button>
        </div>
      </main>
    </div>
  )
}
