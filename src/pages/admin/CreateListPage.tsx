import { useState } from 'react'
import { useForm, useFieldArray } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { useMutation } from '@tanstack/react-query'
import { useNavigate, Link } from 'react-router-dom'
import { toast } from 'sonner'
import {
  createListSchema,
  type CreateListInput,
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
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
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
  Plus,
  Trash2,
  Save,
  CalendarIcon,
  MapPin,
  ShoppingCart,
  Info,
  PieChart,
} from 'lucide-react'

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

export function CreateListPage() {
  const navigate = useNavigate()
  const [newItem, setNewItem] = useState<Partial<ItemInput>>({
    unit_type: 'kg',
  })

  const {
    register,
    handleSubmit,
    formState: { errors },
    control,
  } = useForm<CreateListInput>({
    resolver: zodResolver(createListSchema),
    defaultValues: {
      items: [],
    },
  })

  const { fields, append, remove } = useFieldArray({
    control,
    name: 'items',
  })

  const mutation = useMutation({
    mutationFn: listService.createList,
    onSuccess: (data) => {
      toast.success(toastMessages.list.createSuccess)
      navigate(`/lists/${data.id}`)
    },
    onError: (error) => {
      toast.error(extractErrorMessage(error, toastMessages.list.createError))
    },
  })

  const onSubmit = (data: CreateListInput) => {
    mutation.mutate(data)
  }

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

  const calculateParcels = (total: number, perMember: number) => {
    if (!total || !perMember) return 0
    return Math.ceil(total / perMember)
  }

  const previewParcels =
    newItem.quantity_total && newItem.quantity_per_portion
      ? calculateParcels(newItem.quantity_total, newItem.quantity_per_portion)
      : null

  return (
    <div className="min-h-screen bg-background">
      <Header />

      <main className="container max-w-[1040px] mx-auto px-4 sm:px-6 py-8">
        {/* Breadcrumbs */}
        <div className="flex items-center gap-2 text-sm text-muted-foreground mb-2">
          <Link
            to="/my-lists"
            className="hover:text-primary flex items-center transition-colors"
          >
            <ArrowLeft className="h-4 w-4 mr-1" />
            Voltar
          </Link>
          <span>/</span>
          <span>Nova Lista</span>
        </div>

        {/* Page Heading */}
        <div className="flex flex-col gap-2 mb-8">
          <h1 className="text-3xl sm:text-4xl font-black leading-tight tracking-tight text-primary">
            Criar Nova Lista
          </h1>
          <p className="text-muted-foreground text-base max-w-2xl">
            Preencha os detalhes do seu evento e adicione os itens que os
            participantes precisarão trazer.
          </p>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-8">
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
                {fields.length} itens adicionados
              </span>
            </CardHeader>

            <CardContent className="p-0">
              {/* Add New Item Form */}
              <div className="p-6 bg-muted/30 border-b">
                <h3 className="text-sm font-bold uppercase tracking-wider text-primary mb-4">
                  Adicionar Novo Item
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-12 gap-4 items-start">
                  <div className="sm:col-span-2 lg:col-span-4 space-y-1">
                    <Label className="text-xs">Nome do item</Label>
                    <Input
                      placeholder="Ex: Carne Alcatra"
                      value={newItem.item_name || ''}
                      onChange={(e) =>
                        setNewItem({ ...newItem, item_name: e.target.value })
                      }
                    />
                  </div>

                  <div className="sm:col-span-1 lg:col-span-2 space-y-1">
                    <Label className="text-xs">Qtd Total</Label>
                    <Input
                      type="number"
                      placeholder="0"
                      value={newItem.quantity_total || ''}
                      onChange={(e) =>
                        setNewItem({
                          ...newItem,
                          quantity_total: Number(e.target.value),
                        })
                      }
                    />
                  </div>

                  <div className="sm:col-span-1 lg:col-span-2 space-y-1">
                    <Label className="text-xs">Unidade</Label>
                    <Select
                      value={newItem.unit_type || 'kg'}
                      onValueChange={(value) =>
                        setNewItem({
                          ...newItem,
                          unit_type: value as ItemInput['unit_type'],
                        })
                      }
                    >
                      <SelectTrigger className="w-full bg-white dark:bg-zinc-900">
                        <SelectValue placeholder="Selecione" />
                      </SelectTrigger>
                      <SelectContent className="bg-white dark:bg-zinc-900">
                        {UNITS.map((unit) => (
                          <SelectItem key={unit} value={unit}>
                            {unit}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="sm:col-span-2 lg:col-span-2 space-y-1">
                    <Label className="text-xs">Por Membro</Label>
                    <Input
                      type="number"
                      placeholder="0"
                      value={newItem.quantity_per_portion || ''}
                      onChange={(e) =>
                        setNewItem({
                          ...newItem,
                          quantity_per_portion: Number(e.target.value),
                        })
                      }
                    />
                  </div>

                  <div className="sm:col-span-2 lg:col-span-2 flex items-end h-full">
                    <Button
                      type="button"
                      variant="outline"
                      className="w-full h-10 border-primary text-primary hover:bg-primary hover:text-primary-foreground"
                      onClick={addItem}
                    >
                      <Plus className="h-4 w-4 mr-2" />
                      Adicionar
                    </Button>
                  </div>
                </div>

                {/* Preview */}
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

              {/* Items Table */}
              {fields.length > 0 ? (
                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow className="bg-muted/50 border-b">
                        <TableHead className="px-6 py-4 text-xs uppercase tracking-wider font-semibold text-muted-foreground">
                          Nome do Item
                        </TableHead>
                        <TableHead className="px-6 py-4 text-xs uppercase tracking-wider font-semibold text-muted-foreground text-center">
                          Qtd Total
                        </TableHead>
                        <TableHead className="px-6 py-4 text-xs uppercase tracking-wider font-semibold text-muted-foreground text-center">
                          Por Membro
                        </TableHead>
                        <TableHead className="px-6 py-4 text-xs uppercase tracking-wider font-semibold text-muted-foreground">
                          Parcelamento (Preview)
                        </TableHead>
                        <TableHead className="px-6 py-4 text-xs uppercase tracking-wider font-semibold text-muted-foreground text-right">
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
                        return (
                          <TableRow
                            key={field.id}
                            className="hover:bg-muted/50 transition-colors"
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
                            <TableCell className="px-6 py-4 text-right">
                              <Button
                                type="button"
                                variant="ghost"
                                size="icon"
                                className="text-muted-foreground hover:text-destructive"
                                onClick={() => remove(index)}
                              >
                                <Trash2 className="h-4 w-4" />
                              </Button>
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

          {/* Actions Footer */}
          <div className="sticky bottom-0 -mx-4 sm:mx-0 px-4 py-4 bg-background/80 backdrop-blur-md border-t flex justify-end gap-3 sm:rounded-xl shadow-lg">
            <Link to="/my-lists">
              <Button type="button" variant="outline">
                Cancelar
              </Button>
            </Link>
            <Button
              type="submit"
              disabled={mutation.isPending || fields.length === 0}
            >
              <Save className="h-4 w-4 mr-2" />
              {mutation.isPending ? 'Salvando...' : 'Salvar Lista'}
            </Button>
          </div>
        </form>
      </main>
    </div>
  )
}
