import { useQuery } from '@tanstack/react-query'
import { useParams, Link } from 'react-router-dom'
import { toast } from 'sonner'
import { listService } from '@/services/list.service'
import { toastMessages } from '@/utils/toast-messages'
import { Header } from '@/components/layout/Header'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import {
  MapPin,
  Calendar,
  Eye,
  Edit,
  Copy,
  CheckCircle2,
  Users,
  ShoppingCart,
  Activity,
  ListChecks,
  Download,
} from 'lucide-react'
import { format } from 'date-fns'
import { ptBR } from 'date-fns/locale'
import { useState } from 'react'
import { cn } from '@/lib/utils'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from '@/components/ui/dialog'
import { maskCPF } from '@/utils/masks'

export function ListDetailsPage() {
  const { id } = useParams<{ id: string }>()
  const [isDialogOpen, setIsDialogOpen] = useState(false)

  const { data: list, isLoading } = useQuery({
    queryKey: ['list', id],
    queryFn: () => listService.getListById(id!),
    enabled: !!id,
  })

  const formatDate = (dateString: string) => {
    try {
      return format(new Date(dateString), "dd/MM/yyyy 'às' HH:mm", {
        locale: ptBR,
      })
    } catch {
      return dateString
    }
  }

  const isEventAvailable = () => {
    if (!list?.event_date) return false
    const eventDate = new Date(list.event_date)
    const now = new Date()
    return eventDate > now
  }

  const copyLink = () => {
    const url = `${window.location.origin}/lists/${id}/public`
    navigator.clipboard
      .writeText(url)
      .then(() => {
        toast.success(toastMessages.list.copySuccess)
      })
      .catch(() => {
        toast.error(toastMessages.list.copyError)
      })
  }

  const handleDownloadList = () => {
    toast.info('Funcionalidade em desenvolvimento', {
      description: 'O download em PDF/DOCX será implementado em breve.',
    })
  }

  // Itens preenchidos (com membro)
  const filledItems = list?.items.filter((item) => item.member_name) || []

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <div className="container max-w-7xl mx-auto px-4 py-8">
          <p>Carregando...</p>
        </div>
      </div>
    )
  }

  if (!list) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <div className="container max-w-7xl mx-auto px-4 py-8">
          <p>Lista não encontrada</p>
        </div>
      </div>
    )
  }

  const itemsWithMembers = list.items.filter((item) => item.member_name)
  const totalParticipants = new Set(
    list.items
      .filter((item) => item.member_name)
      .map((item) => item.member_cpf),
  ).size

  // Group items by name to calculate progress
  const groupedItems = list.items.reduce(
    (acc, item) => {
      if (!acc[item.item_name]) {
        acc[item.item_name] = {
          name: item.item_name,
          unit: item.unit_type,
          quantityPerMember: item.quantity_per_portion,
          totalQuantity: item.quantity_total,
          items: [],
        }
      }
      acc[item.item_name].items.push(item)
      return acc
    },
    {} as Record<
      string,
      {
        name: string
        unit: string
        quantityPerMember: number
        totalQuantity: number
        items: typeof list.items
      }
    >,
  )

  const itemsSummary = Object.values(groupedItems).map((group) => ({
    name: group.name,
    unit: group.unit,
    quantityPerMember: group.quantityPerMember,
    totalQuantity: group.totalQuantity,
    totalParcels: group.items.length,
    filled: group.items.filter((i) => i.member_name).length,
    available: group.items.filter((i) => !i.member_name).length,
    progress:
      (group.items.filter((i) => i.member_name).length / group.items.length) *
      100,
  }))

  return (
    <div className="min-h-screen bg-background">
      <Header />

      <main className="container max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Breadcrumbs */}
        <nav className="flex mb-6 text-sm font-medium text-muted-foreground">
          <ol className="flex items-center space-x-2">
            <li>
              <Link
                to="/my-lists"
                className="hover:text-primary transition-colors"
              >
                Minhas Listas
              </Link>
            </li>
            <li>
              <span className="mx-2">/</span>
            </li>
            <li className="text-foreground">{list.location}</li>
          </ol>
        </nav>

        {/* Statistics Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
          <Card>
            <CardHeader className="flex-row items-center gap-3 space-y-0 pb-3">
              <div className="p-2 bg-primary/10 rounded-lg text-primary">
                <Activity className="h-5 w-5" />
              </div>
              <div>
                <CardDescription className="text-sm">
                  Status Atual
                </CardDescription>
                <CardTitle className="text-xl">
                  {list.status === 'active' ? 'Ativa' : 'Arquivada'}
                </CardTitle>
              </div>
            </CardHeader>
          </Card>
          <Card>
            <CardHeader className="flex-row items-center gap-3 space-y-0 pb-3">
              <div className="p-2 bg-primary/10 rounded-lg text-primary">
                <Users className="h-5 w-5" />
              </div>
              <div>
                <CardDescription className="text-sm">
                  Participantes
                </CardDescription>
                <CardTitle className="text-xl">{totalParticipants}</CardTitle>
              </div>
            </CardHeader>
          </Card>
          <Card>
            <CardHeader className="flex-row items-center gap-3 space-y-0 pb-3">
              <div className="p-2 bg-primary/10 rounded-lg text-primary">
                <ShoppingCart className="h-5 w-5" />
              </div>
              <div>
                <CardDescription className="text-sm">
                  Itens Cadastrados
                </CardDescription>
                <CardTitle className="text-xl">{list.items.length}</CardTitle>
              </div>
            </CardHeader>
          </Card>
        </div>

        {/* Page Header */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
          {/* Event Details */}
          <Card className="lg:col-span-2">
            <CardHeader className="flex-col sm:flex-row justify-between items-start sm:items-center gap-4 space-y-4 sm:space-y-0">
              <div>
                <div className="flex items-center gap-3 mb-2 flex-wrap">
                  <CardTitle className="text-3xl">{list.location}</CardTitle>
                  <span
                    className={cn(
                      `inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${
                        list.status === 'active'
                          ? 'bg-white text-green-700 border-green-300 dark:bg-green-900/40 dark:text-green-400 dark:border-green-800'
                          : 'bg-white text-gray-600 border-gray-300 dark:bg-gray-700 dark:text-gray-300'
                      }`,
                    )}
                  >
                    {list.status === 'active' ? (
                      <>
                        <span className="w-1.5 h-1.5 bg-green-500 rounded-full mr-1.5" />
                        Ativa
                      </>
                    ) : (
                      'Arquivada'
                    )}
                  </span>
                  {list.status === 'active' && (
                    <span
                      className={cn(
                        `inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${
                          isEventAvailable()
                            ? 'bg-white text-green-700 border-green-300 dark:bg-green-900/40 dark:text-green-400 dark:border-green-800'
                            : 'bg-white text-red-700 border-red-300 dark:bg-red-900/40 dark:text-red-400 dark:border-red-800'
                        }`,
                      )}
                    >
                      <span
                        className={`w-1.5 h-1.5 ${
                          isEventAvailable() ? 'bg-green-500' : 'bg-red-500'
                        } rounded-full mr-1.5`}
                      />
                      {isEventAvailable() ? 'Disponível' : 'Expirada'}
                    </span>
                  )}
                </div>
                <CardDescription>
                  Gerencie os itens e acompanhe as contribuições para este
                  evento.
                </CardDescription>
              </div>
              <div className="flex gap-3 w-full sm:w-auto">
                <Button variant="outline" size="sm" asChild>
                  <a
                    href={`/lists/${id}/public`}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <Eye className="h-4 w-4 mr-2" />
                    Ver como membro
                  </a>
                </Button>
                <Button size="sm" asChild>
                  <Link to={`/lists/${id}/edit`}>
                    <Edit className="h-4 w-4 mr-2" />
                    Editar lista
                  </Link>
                </Button>
              </div>
            </CardHeader>

            <CardContent className="grid grid-cols-1 sm:grid-cols-2 gap-6 pt-0">
              <div className="flex items-start gap-3">
                <div className="p-2 bg-primary/10 rounded-lg text-primary">
                  <MapPin className="h-5 w-5" />
                </div>
                <div>
                  <p className="text-sm font-medium text-muted-foreground">
                    Local
                  </p>
                  <p className="text-base font-semibold mt-0.5">
                    {list.location}
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="p-2 bg-primary/10 rounded-lg text-primary">
                  <Calendar className="h-5 w-5" />
                </div>
                <div>
                  <p className="text-sm font-medium text-muted-foreground">
                    Data e Hora
                  </p>
                  <p className="text-base font-semibold mt-0.5">
                    {formatDate(list.event_date)}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Share Link */}
          <Card className="flex flex-col justify-center">
            <CardHeader>
              <CardTitle className="text-lg">Compartilhar Lista</CardTitle>
              <CardDescription>
                Envie este link para os convidados contribuírem.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex rounded-lg shadow-sm">
                <Input
                  type="text"
                  readOnly
                  value={`${window.location.origin}/lists/${id}/public`}
                  className="flex-1 rounded-r-none border-r-0"
                />
                <Button
                  onClick={copyLink}
                  variant="outline"
                  className="rounded-l-none border-l-0"
                >
                  <Copy className="h-4 w-4" />
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Items List */}
        <Card className="overflow-hidden">
          <CardHeader className="flex-col sm:flex-row justify-between items-start sm:items-center gap-4 space-y-4 sm:space-y-0 border-b border-border/10">
            <div>
              <CardTitle className="text-lg">Itens Solicitados</CardTitle>
              <CardDescription className="mt-1">
                Acompanhe o preenchimento das parcelas.
              </CardDescription>
            </div>
            <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
              <DialogTrigger asChild>
                <Button variant="outline" size="sm">
                  <ListChecks className="h-4 w-4 mr-2" />
                  Ver Preenchidos
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto bg-white dark:bg-black">
                <DialogHeader>
                  <DialogTitle>Itens Preenchidos</DialogTitle>
                  <DialogDescription>
                    {filledItems.length === 0
                      ? 'Nenhum item foi preenchido ainda.'
                      : `${filledItems.length} ${
                          filledItems.length === 1
                            ? 'item preenchido'
                            : 'itens preenchidos'
                        }`}
                  </DialogDescription>
                </DialogHeader>

                <div className="space-y-4 mt-4">
                  {filledItems.length === 0 ? (
                    <div className="text-center py-8 text-muted-foreground">
                      <p>Nenhum membro assumiu um item ainda.</p>
                    </div>
                  ) : (
                    filledItems.map((item) => (
                      <div
                        key={item.id}
                        className="flex items-start justify-between p-4 border rounded-lg bg-muted/20"
                      >
                        <div className="flex items-center justify-center gap-3 flex-1">
                          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
                            <CheckCircle2 className="h-5 w-5 text-primary" />
                          </div>
                          <div className="flex justify-around items-center gap-1 flex-1">
                            <p className="font-semibold text-base">
                              {item.quantity_per_portion} {item.unit_type} de{' '}
                              {item.item_name}
                            </p>
                            <div className="flex gap-0.5">
                              <p className="text-sm text-muted-foreground">
                                <span className="font-medium text-foreground">
                                  Nome:
                                </span>{' '}
                                {item.member_name}
                              </p>
                              <p className="text-sm text-muted-foreground">
                                <span className="font-medium text-foreground">
                                  CPF:
                                </span>{' '}
                                {maskCPF(item.member_cpf || '')}
                              </p>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))
                  )}
                </div>

                <DialogFooter className="mt-6">
                  <Button
                    variant="outline"
                    onClick={handleDownloadList}
                    disabled={filledItems.length === 0}
                  >
                    <Download className="h-4 w-4 mr-2" />
                    Baixar Lista
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </CardHeader>

          <CardContent className="p-0">
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow className="bg-muted/30 border-b border-border/40">
                    <TableHead className="px-6 py-4 text-xs uppercase tracking-wider text-muted-foreground font-semibold">
                      Item
                    </TableHead>
                    <TableHead className="px-6 py-4 text-xs uppercase tracking-wider text-muted-foreground font-semibold text-center">
                      Qtd / Parcela
                    </TableHead>
                    <TableHead className="px-6 py-4 text-xs uppercase tracking-wider text-muted-foreground font-semibold text-center">
                      Unidade
                    </TableHead>
                    <TableHead className="px-6 py-4 text-xs uppercase tracking-wider text-muted-foreground font-semibold">
                      Progresso
                    </TableHead>
                    <TableHead className="px-6 py-4 text-xs uppercase tracking-wider text-muted-foreground font-semibold text-center">
                      Preenchidas
                    </TableHead>
                    <TableHead className="px-6 py-4 text-xs uppercase tracking-wider text-muted-foreground font-semibold text-center">
                      Disponíveis
                    </TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody className="divide-y divide-border/30">
                  {itemsSummary.map((item, index) => (
                    <TableRow
                      key={index}
                      className="hover:bg-muted/50 transition-colors"
                    >
                      <TableCell className="px-6 py-4 font-medium">
                        {item.name}
                      </TableCell>
                      <TableCell className="px-6 py-4 text-sm text-muted-foreground text-center">
                        {item.quantityPerMember}
                      </TableCell>
                      <TableCell className="px-6 py-4 text-sm text-muted-foreground text-center">
                        {item.unit}
                      </TableCell>
                      <TableCell className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div className="flex-1 bg-muted rounded-full h-2 overflow-hidden">
                            <div
                              className={`h-full transition-all ${
                                item.progress === 100
                                  ? 'bg-green-500'
                                  : item.progress > 0
                                    ? 'bg-blue-500'
                                    : 'bg-gray-300'
                              }`}
                              style={{ width: `${item.progress}%` }}
                            />
                          </div>
                          <span className="text-xs font-medium text-muted-foreground min-w-[45px] text-right">
                            {Math.round(item.progress)}%
                          </span>
                        </div>
                      </TableCell>
                      <TableCell className="px-6 py-4 text-center">
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-white text-green-700 border border-green-300 dark:bg-green-900/30 dark:text-green-300 dark:border-green-800">
                          {item.filled} de {item.totalParcels}
                        </span>
                      </TableCell>
                      <TableCell className="px-6 py-4 text-center">
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-white text-gray-700 border border-gray-300 dark:bg-gray-700 dark:text-gray-300 dark:border-gray-600">
                          {item.available}
                        </span>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>

            <div className="px-6 py-4 border-t border-border/40 flex items-center justify-between">
              <p className="text-sm text-muted-foreground">
                <span className="font-medium">{itemsWithMembers.length}</span>{' '}
                de <span className="font-medium">{list.items.length}</span>{' '}
                itens preenchidos
              </p>
            </div>
          </CardContent>
        </Card>
      </main>
    </div>
  )
}
