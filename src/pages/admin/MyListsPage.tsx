import { useState } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { Link, useNavigate } from 'react-router-dom'
import { toast } from 'sonner'
import { listService } from '@/services/list.service'
import { subscriptionService } from '@/services/subscription.service'
import { toastMessages } from '@/utils/toast-messages'
import { extractErrorMessage } from '@/utils/error-handler'
import { Header } from '@/components/layout/Header'
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'
import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import {
  AlertTriangle,
  Crown,
  Plus,
  MapPin,
  Calendar,
  Edit,
  Eye,
  Trash2,
  Copy,
} from 'lucide-react'
import { format } from 'date-fns'
import { ptBR } from 'date-fns/locale'

export function MyListsPage() {
  const [filter, setFilter] = useState<'all' | 'active' | 'archived'>('all')
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
  const [listToDelete, setListToDelete] = useState<string | null>(null)
  const [createModalOpen, setCreateModalOpen] = useState(false)
  const [selectedTemplateId, setSelectedTemplateId] = useState<string | null>(
    null,
  )
  const queryClient = useQueryClient()
  const navigate = useNavigate()

  const { data: lists, isLoading } = useQuery({
    queryKey: ['lists'],
    queryFn: listService.getLists,
  })

  const { data: subscriptionStatus } = useQuery({
    queryKey: ['subscription-status'],
    queryFn: subscriptionService.getStatus,
  })

  const deleteMutation = useMutation({
    mutationFn: listService.deleteList,
    onSuccess: () => {
      toast.success(toastMessages.list.deleteSuccess)
      queryClient.invalidateQueries({ queryKey: ['lists'] })
      setDeleteDialogOpen(false)
      setListToDelete(null)
    },
    onError: (error) => {
      toast.error(extractErrorMessage(error, toastMessages.list.deleteError))
    },
  })

  const createFromTemplateMutation = useMutation({
    mutationFn: (templateId: string) =>
      listService.createListFromTemplate(templateId),
    onSuccess: (newList) => {
      toast.success('Lista criada com sucesso!')
      queryClient.invalidateQueries({ queryKey: ['lists'] })
      setCreateModalOpen(false)
      setSelectedTemplateId(null)
      navigate(`/lists/${newList.id}/edit`)
    },
    onError: (error) => {
      toast.error(extractErrorMessage(error, 'Erro ao criar lista'))
    },
  })

  const handleDeleteClick = (listId: string) => {
    setListToDelete(listId)
    setDeleteDialogOpen(true)
  }

  const confirmDelete = () => {
    if (listToDelete) {
      deleteMutation.mutate(listToDelete)
    }
  }

  const isEventAvailable = (eventDate: string) => {
    const date = new Date(eventDate)
    const now = new Date()
    return date > now
  }

  const formatDate = (dateString: string) => {
    try {
      return format(new Date(dateString), "dd/MM/yyyy 'às' HH:mm", {
        locale: ptBR,
      })
    } catch {
      return dateString
    }
  }

  const filteredLists =
    lists?.filter((list) => {
      if (filter === 'all') return true
      return list.status === filter
    }) ?? []

  const isSubscriptionExpired = subscriptionStatus?.status === 'expired'
  const canCreateList = subscriptionStatus?.canCreateList ?? false
  const listsUsed = subscriptionStatus?.listsCount ?? 0
  const listsLimit = subscriptionStatus?.listsLimit ?? 1

  return (
    <div className="min-h-screen bg-background">
      <Header />

      <main className="container max-w-7xl mx-auto px-4 md:px-8 py-8">
        {/* Banner de assinatura expirada */}
        {isSubscriptionExpired && (
          <Alert variant="destructive" className="mb-6">
            <AlertTriangle className="h-4 w-4" />
            <AlertTitle>Assinatura expirada</AlertTitle>
            <AlertDescription className="flex flex-col sm:flex-row sm:items-center gap-3">
              <span>
                Suas listas estao em modo somente leitura. Renove sua assinatura
                para continuar editando.
              </span>
              <Link to="/subscription/plans">
                <Button size="sm" variant="outline" className="shrink-0">
                  <Crown className="h-4 w-4 mr-2" />
                  Ver planos
                </Button>
              </Link>
            </AlertDescription>
          </Alert>
        )}

        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-8">
          <div className="flex flex-col gap-2">
            <h1 className="text-3xl md:text-4xl font-black leading-tight tracking-tight text-primary">
              Minhas Listas
            </h1>
            <p className="text-base text-muted-foreground">
              Gerencie seus eventos e contribuições
            </p>
            {/* Contador de listas */}
            <p className="text-sm text-muted-foreground">
              <span
                className={
                  listsUsed >= listsLimit ? 'text-destructive font-medium' : ''
                }
              >
                {listsUsed}/{listsLimit}
              </span>{' '}
              listas utilizadas
              {!subscriptionStatus?.plan && listsUsed >= listsLimit && (
                <Link
                  to="/subscription/plans"
                  className="ml-2 text-primary hover:underline"
                >
                  Assine para criar mais
                </Link>
              )}
            </p>
          </div>
          {lists && lists.length > 0 ? (
            <Button
              size="lg"
              className="shadow-lg shadow-primary/20"
              onClick={() => {
                if (!canCreateList) {
                  toast.error('Voce atingiu o limite de listas do seu plano')
                  return
                }
                setCreateModalOpen(true)
              }}
              disabled={isSubscriptionExpired}
            >
              <Plus className="h-5 w-5 mr-2" />
              Criar nova lista
            </Button>
          ) : (
            <Link to="/lists/create">
              <Button
                size="lg"
                className="shadow-lg shadow-primary/20"
                disabled={isSubscriptionExpired || !canCreateList}
              >
                <Plus className="h-5 w-5 mr-2" />
                Criar nova lista
              </Button>
            </Link>
          )}
        </div>

        {/* Filter Tabs */}
        <div className="flex gap-3 mb-8 overflow-x-auto pb-2">
          <button
            onClick={() => setFilter('all')}
            className={`flex h-9 shrink-0 items-center justify-center gap-x-2 rounded-full pl-3 pr-5 transition-colors ${
              filter === 'all'
                ? 'bg-primary text-primary-foreground'
                : 'bg-secondary border border-border/40 hover:bg-secondary/80 text-secondary-foreground'
            }`}
          >
            <span className="text-sm font-medium">Todas</span>
          </button>
          <button
            onClick={() => setFilter('active')}
            className={`flex h-9 shrink-0 items-center justify-center gap-x-2 rounded-full pl-3 pr-5 transition-colors ${
              filter === 'active'
                ? 'bg-primary text-primary-foreground'
                : 'bg-secondary border border-border/40 hover:bg-secondary/80 text-secondary-foreground'
            }`}
          >
            <span className="text-sm font-medium">Ativas</span>
          </button>
          <button
            onClick={() => setFilter('archived')}
            className={`flex h-9 shrink-0 items-center justify-center gap-x-2 rounded-full pl-3 pr-5 transition-colors ${
              filter === 'archived'
                ? 'bg-primary text-primary-foreground'
                : 'bg-secondary border border-border/40 hover:bg-secondary/80 text-secondary-foreground'
            }`}
          >
            <span className="text-sm font-medium">Arquivadas</span>
          </button>
        </div>

        {/* Lists Grid */}
        {isLoading ? (
          <div className="text-center py-12">
            <p className="text-muted-foreground">Carregando...</p>
          </div>
        ) : filteredLists && filteredLists.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredLists.map((list) => {
              return (
                <Card
                  key={list.id}
                  className="flex flex-col hover:shadow-md transition-all hover:-translate-y-1"
                >
                  <CardHeader className="flex-row justify-between items-start space-y-0 pb-3">
                    <div className="size-12 rounded-full bg-primary/10 flex items-center justify-center text-primary shrink-0">
                      <Calendar className="h-6 w-6" />
                    </div>
                    <div className="flex flex-col gap-2 items-end">
                      <span
                        className={`inline-flex items-center gap-1 rounded-full px-2 py-1 text-xs font-medium ring-1 ring-inset ${
                          list.status === 'active'
                            ? 'bg-white text-emerald-700 ring-emerald-300 dark:bg-emerald-900/30 dark:text-emerald-400 dark:ring-emerald-600/20'
                            : 'bg-white text-gray-600 ring-gray-300 dark:bg-gray-700 dark:text-gray-300 dark:ring-gray-500/10'
                        }`}
                      >
                        {list.status === 'active' ? (
                          <>
                            <span className="size-1.5 rounded-full bg-emerald-600 dark:bg-emerald-400" />
                            Ativa
                          </>
                        ) : (
                          'Arquivada'
                        )}
                      </span>
                      {list.status === 'active' && (
                        <span
                          className={`inline-flex items-center gap-1 rounded-full px-2 py-1 text-xs font-medium ring-1 ring-inset ${
                            isEventAvailable(list.event_date)
                              ? 'bg-white text-emerald-700 ring-emerald-300 dark:bg-emerald-900/30 dark:text-emerald-400 dark:ring-emerald-600/20'
                              : 'bg-white text-red-700 ring-red-300 dark:bg-red-900/30 dark:text-red-400 dark:ring-red-600/20'
                          }`}
                        >
                          <span
                            className={`size-1.5 rounded-full ${isEventAvailable(list.event_date) ? 'bg-emerald-600 dark:bg-emerald-400' : 'bg-red-600 dark:bg-red-400'}`}
                          />
                          {isEventAvailable(list.event_date)
                            ? 'Disponível'
                            : 'Expirada'}
                        </span>
                      )}
                    </div>
                  </CardHeader>

                  <CardContent className="flex-1 space-y-3">
                    <CardTitle className="text-lg leading-tight">
                      {list.location}
                    </CardTitle>
                    <div className="flex flex-col gap-2">
                      <p className="text-sm text-muted-foreground flex items-start gap-2">
                        <MapPin className="h-4 w-4 shrink-0 mt-0.5" />
                        <span>{list.location}</span>
                      </p>
                      <p className="text-sm text-muted-foreground flex items-center gap-2">
                        <Calendar className="h-4 w-4 shrink-0" />
                        <span>{formatDate(list.event_date)}</span>
                      </p>
                    </div>
                  </CardContent>

                  <CardFooter className="flex items-center gap-2 pt-4">
                    <Link to={`/lists/${list.id}`} className="flex-1">
                      <Button variant="outline" className="w-full" size="sm">
                        <Eye className="h-4 w-4 mr-2" />
                        Ver detalhes
                      </Button>
                    </Link>
                    <Link to={`/lists/${list.id}/edit`}>
                      <Button variant="outline" size="icon" title="Editar">
                        <Edit className="h-4 w-4" />
                      </Button>
                    </Link>
                    <Button
                      variant="outline"
                      size="icon"
                      title="Deletar"
                      onClick={() => handleDeleteClick(list.id)}
                      className="text-destructive hover:text-destructive hover:bg-destructive/10"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </CardFooter>
                </Card>
              )
            })}
          </div>
        ) : (
          <div className="text-center py-12">
            <div className="mb-4">
              <Calendar className="h-16 w-16 mx-auto text-primary" />
            </div>
            <h3 className="text-lg font-medium mb-2 text-primary">
              Nenhuma lista encontrada
            </h3>
            <p className="text-muted-foreground mb-4">
              Você ainda não possui listas. Crie a primeira!
            </p>
            <Link to="/lists/create">
              <Button>
                <Plus className="h-4 w-4 mr-2" />
                Criar nova lista
              </Button>
            </Link>
          </div>
        )}
      </main>

      {/* Delete Confirmation Dialog */}
      <Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <DialogContent className="bg-white dark:bg-black">
          <DialogHeader>
            <DialogTitle>Deletar Lista</DialogTitle>
            <DialogDescription>
              Tem certeza que deseja deletar esta lista? Esta ação não pode ser
              desfeita e todos os dados serão permanentemente removidos.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setDeleteDialogOpen(false)}
              disabled={deleteMutation.isPending}
            >
              Cancelar
            </Button>
            <Button
              variant="destructive"
              onClick={confirmDelete}
              disabled={deleteMutation.isPending}
            >
              {deleteMutation.isPending ? 'Deletando...' : 'Deletar'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Create List Modal */}
      <Dialog
        open={createModalOpen}
        onOpenChange={(open) => {
          setCreateModalOpen(open)
          if (!open) setSelectedTemplateId(null)
        }}
      >
        <DialogContent className="bg-white dark:bg-black">
          <DialogHeader>
            <DialogTitle>Como deseja criar sua lista?</DialogTitle>
            <DialogDescription>
              Escolha uma opcao para comecar
            </DialogDescription>
          </DialogHeader>

          <div className="flex flex-col gap-4 py-4">
            {/* Opcao 1: Usar modelo */}
            <div className="space-y-3">
              <Label>Usar lista existente como modelo</Label>
              <Select
                value={selectedTemplateId || ''}
                onValueChange={setSelectedTemplateId}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Selecione uma lista" />
                </SelectTrigger>
                <SelectContent className="bg-white dark:bg-black">
                  {lists?.map((list) => (
                    <SelectItem key={list.id} value={list.id}>
                      {list.location} -{' '}
                      {format(new Date(list.event_date), 'dd/MM/yyyy')}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Button
                className="w-full"
                disabled={
                  !selectedTemplateId || createFromTemplateMutation.isPending
                }
                onClick={() =>
                  selectedTemplateId &&
                  createFromTemplateMutation.mutate(selectedTemplateId)
                }
              >
                <Copy className="h-4 w-4 mr-2" />
                {createFromTemplateMutation.isPending
                  ? 'Criando...'
                  : 'Criar a partir do modelo'}
              </Button>
            </div>

            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <span className="w-full border-t" />
              </div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-white dark:bg-black px-2 text-muted-foreground">
                  ou
                </span>
              </div>
            </div>

            {/* Opcao 2: Criar do zero */}
            <Link to="/lists/create" onClick={() => setCreateModalOpen(false)}>
              <Button variant="outline" className="w-full">
                <Plus className="h-4 w-4 mr-2" />
                Criar lista do zero
              </Button>
            </Link>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}
