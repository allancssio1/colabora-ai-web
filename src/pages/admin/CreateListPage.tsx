import { useState } from 'react'
import { useForm, useFieldArray } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { useMutation } from '@tanstack/react-query'
import { useNavigate, Link } from 'react-router-dom'
import { createListSchema, type CreateListInput, type ItemInput } from '../../schemas/list.schema'
import { listService } from '../../services/list.service'
import { Header } from '../../components/layout/Header'
import { Button } from '../../components/ui/button'
import { Input } from '../../components/ui/input'
import { Label } from '../../components/ui/label'
import { Card } from '../../components/ui/card'
import { ArrowLeft, Plus, Trash2, Save, CalendarIcon, MapPin, ShoppingCart, Info, PieChart } from 'lucide-react'

const UNITS = ['kg', 'g', 'unidade(s)', 'litro(s)', 'ml', 'metro(s)', 'pacote(s)', 'lata(s)', 'garrafa(s)'] as const

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
      navigate(`/lists/${data.id}`)
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
          <Link to="/my-lists" className="hover:text-primary flex items-center transition-colors">
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
            Preencha os detalhes do seu evento e adicione os itens que os participantes precisarão trazer.
          </p>
        </div>
        
        <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-8">
          {/* Event Details Section */}
          <Card className="overflow-hidden">
            <div className="border-b bg-muted/50 px-6 py-4">
              <h2 className="text-lg font-bold flex items-center gap-2 text-primary">
                <MapPin className="h-5 w-5" />
                Detalhes do Evento
              </h2>
            </div>
            <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="location" className="text-primary font-semibold">Local do evento</Label>
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
                  <p className="text-sm text-destructive">{errors.location.message}</p>
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
                  <p className="text-sm text-destructive">{errors.event_date.message}</p>
                )}
              </div>
            </div>
          </Card>

          {/* Items Section */}
          <Card className="overflow-hidden">
            <div className="border-b bg-muted/50 px-6 py-4 flex justify-between items-center">
              <h2 className="text-lg font-bold flex items-center gap-2 text-primary">
                <ShoppingCart className="h-5 w-5" />
                Itens para Contribuição
              </h2>
              <span className="text-xs font-medium px-2 py-1 rounded bg-primary/10 text-primary">
                {fields.length} itens adicionados
              </span>
            </div>

            {/* Add New Item Form */}
            <div className="p-6 bg-muted/30 border-b">
              <h3 className="text-sm font-bold uppercase tracking-wider text-primary mb-4">
                Adicionar Novo Item
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-12 gap-4 items-start">
                <div className="sm:col-span-2 lg:col-span-4 space-y-1">
                  <label className="text-xs font-medium text-muted-foreground">Nome do item</label>
                  <Input
                    placeholder="Ex: Carne Alcatra"
                    value={newItem.item_name || ''}
                    onChange={(e) => setNewItem({ ...newItem, item_name: e.target.value })}
                  />
                </div>

                <div className="sm:col-span-1 lg:col-span-2 space-y-1">
                  <label className="text-xs font-medium text-muted-foreground">Qtd Total</label>
                  <Input
                    type="number"
                    placeholder="0"
                    value={newItem.quantity_total || ''}
                    onChange={(e) =>
                      setNewItem({ ...newItem, quantity_total: Number(e.target.value) })
                    }
                  />
                </div>

                <div className="sm:col-span-1 lg:col-span-2 space-y-1">
                  <label className="text-xs font-medium text-muted-foreground">Unidade</label>
                  <select
                    className="flex h-10 w-full rounded-lg border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                    value={newItem.unit_type || 'kg'}
                    onChange={(e) =>
                      setNewItem({ ...newItem, unit_type: e.target.value as ItemInput['unit_type'] })
                    }
                  >
                    {UNITS.map((unit) => (
                      <option key={unit} value={unit}>
                        {unit}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="sm:col-span-2 lg:col-span-2 space-y-1">
                  <label className="text-xs font-medium text-muted-foreground">Por Membro</label>
                  <Input
                    type="number"
                    placeholder="0"
                    value={newItem.quantity_per_portion || ''}
                    onChange={(e) =>
                      setNewItem({ ...newItem, quantity_per_portion: Number(e.target.value) })
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
                      Isso gerará <strong className="text-primary">{previewParcels} parcelas</strong> de{' '}
                      <strong className="text-primary">
                        {newItem.quantity_per_portion} {newItem.unit_type}
                      </strong>
                    </p>
                  ) : (
                    <p className="text-sm text-muted-foreground">
                      Preencha os campos acima para calcular as parcelas automaticamente.
                    </p>
                  )}
                </div>
              </div>
            </div>

            {/* Items Table */}
            {fields.length > 0 ? (
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="bg-muted/50 border-b text-xs uppercase tracking-wider text-muted-foreground font-semibold">
                      <th className="px-6 py-4">Nome do Item</th>
                      <th className="px-6 py-4 text-center">Qtd Total</th>
                      <th className="px-6 py-4 text-center">Por Membro</th>
                      <th className="px-6 py-4">Parcelamento (Preview)</th>
                      <th className="px-6 py-4 text-right">Ações</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y">
                    {fields.map((field, index) => {
                      const parcels = calculateParcels(field.quantity_total, field.quantity_per_portion)
                      return (
                        <tr key={field.id} className="hover:bg-muted/50 transition-colors">
                          <td className="px-6 py-4 font-medium">{field.item_name}</td>
                          <td className="px-6 py-4 text-center">
                            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-muted">
                              {field.quantity_total} {field.unit_type}
                            </span>
                          </td>
                          <td className="px-6 py-4 text-center text-muted-foreground">
                            {field.quantity_per_portion} {field.unit_type}
                          </td>
                          <td className="px-6 py-4">
                            <div className="flex items-center gap-2 text-muted-foreground">
                              <PieChart className="h-4 w-4 text-primary" />
                              <span>
                                {parcels} parcelas de {field.quantity_per_portion} {field.unit_type}
                              </span>
                            </div>
                          </td>
                          <td className="px-6 py-4 text-right">
                            <Button
                              type="button"
                              variant="ghost"
                              size="icon"
                              className="text-muted-foreground hover:text-destructive"
                              onClick={() => remove(index)}
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </td>
                        </tr>
                      )
                    })}
                  </tbody>
                </table>
              </div>
            ) : (
              <div className="p-12 flex flex-col items-center justify-center text-center">
                <div className="size-16 bg-muted rounded-full flex items-center justify-center mb-4">
                  <ShoppingCart className="h-8 w-8 text-primary" />
                </div>
                <h3 className="text-lg font-medium mb-1 text-primary">Sua lista está vazia</h3>
                <p className="text-muted-foreground">Adicione o primeiro item usando o formulário acima.</p>
              </div>
            )}
          </Card>

          {/* Actions Footer */}
          <div className="sticky bottom-0 -mx-4 sm:mx-0 px-4 py-4 bg-background/80 backdrop-blur-md border-t flex justify-end gap-3 sm:rounded-xl shadow-lg">
            <Link to="/my-lists">
              <Button type="button" variant="outline">
                Cancelar
              </Button>
            </Link>
            <Button type="submit" disabled={mutation.isPending || fields.length === 0}>
              <Save className="h-4 w-4 mr-2" />
              {mutation.isPending ? 'Salvando...' : 'Salvar Lista'}
            </Button>
          </div>
        </form>
      </main>
    </div>
  )
}
