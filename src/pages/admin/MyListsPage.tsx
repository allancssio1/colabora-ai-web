import { useState } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { Link } from 'react-router-dom'
import { listService } from '../../services/list.service'
import { Header } from '../../components/layout/Header'
import { Button } from '../../components/ui/button'
import { Card } from '../../components/ui/card'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '../../components/ui/dialog'
import { Plus, MapPin, Calendar, Edit, Eye, Trash2 } from 'lucide-react'
import { format } from 'date-fns'
import { ptBR } from 'date-fns/locale'

export function MyListsPage() {
  const [filter, setFilter] = useState<'all' | 'active' | 'archived'>('all')
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
  const [listToDelete, setListToDelete] = useState<string | null>(null)
  const queryClient = useQueryClient()

  const { data: lists, isLoading } = useQuery({
    queryKey: ['lists'],
    queryFn: listService.getLists,
  })

  const deleteMutation = useMutation({
    mutationFn: listService.deleteList,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['lists'] })
      setDeleteDialogOpen(false)
      setListToDelete(null)
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

  const formatDate = (dateString: string) => {
    try {
      return format(new Date(dateString), "dd/MM/yyyy 'às' HH:mm", {
        locale: ptBR,
      })
    } catch {
      return dateString
    }
  }

  const filteredLists = lists?.filter((list) => {
    if (filter === 'all') return true
    return list.status === filter
  }) ?? []

  return (
    <div className="min-h-screen bg-background">
      <Header />

      <main className="container max-w-7xl mx-auto px-4 md:px-8 py-8">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-8">
          <div className="flex flex-col gap-2">
            <h1 className="text-3xl md:text-4xl font-black leading-tight tracking-tight text-primary">
              Minhas Listas
            </h1>
            <p className="text-base text-muted-foreground">
              Gerencie seus eventos e contribuições
            </p>
          </div>
          <Link to="/lists/create">
            <Button size="lg" className="shadow-lg shadow-primary/20">
              <Plus className="h-5 w-5 mr-2" />
              Criar nova lista
            </Button>
          </Link>
        </div>

        {/* Filter Tabs */}
        <div className="flex gap-3 mb-8 overflow-x-auto pb-2">
          <button
            onClick={() => setFilter('all')}
            className={`flex h-9 shrink-0 items-center justify-center gap-x-2 rounded-full pl-3 pr-5 transition-colors ${
              filter === 'all'
                ? 'bg-primary text-primary-foreground'
                : 'bg-secondary border border-border hover:bg-secondary/80 text-secondary-foreground'
            }`}
          >
            <span className="text-sm font-medium">Todas</span>
          </button>
          <button
            onClick={() => setFilter('active')}
            className={`flex h-9 shrink-0 items-center justify-center gap-x-2 rounded-full pl-3 pr-5 transition-colors ${
              filter === 'active'
                ? 'bg-primary text-primary-foreground'
                : 'bg-secondary border border-border hover:bg-secondary/80 text-secondary-foreground'
            }`}
          >
            <span className="text-sm font-medium">Ativas</span>
          </button>
          <button
            onClick={() => setFilter('archived')}
            className={`flex h-9 shrink-0 items-center justify-center gap-x-2 rounded-full pl-3 pr-5 transition-colors ${
              filter === 'archived'
                ? 'bg-primary text-primary-foreground'
                : 'bg-secondary border border-border hover:bg-secondary/80 text-secondary-foreground'
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
            {filteredLists.map((list) => (
              <Card
                key={list.id}
                className="flex flex-col p-5 hover:shadow-md transition-all hover:-translate-y-1"
              >
                <div className="flex justify-between items-start mb-4">
                  <div className="size-12 rounded-full bg-primary/10 flex items-center justify-center text-primary shrink-0">
                    <Calendar className="h-6 w-6" />
                  </div>
                  <span
                    className={`inline-flex items-center gap-1 rounded-full px-2 py-1 text-xs font-medium ring-1 ring-inset ${
                      list.status === 'active'
                        ? 'bg-emerald-50 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-400 ring-emerald-600/20'
                        : 'bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 ring-gray-500/10'
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
                </div>

                <div className="flex-1 mb-4">
                  <h3 className="text-lg font-bold leading-tight mb-3 text-primary">
                    {list.location}
                  </h3>
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
                </div>

                <div className="flex items-center gap-2 mt-auto pt-4 border-t">
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
                </div>
              </Card>
            ))}
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
        <DialogContent>
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
    </div>
  )
}
