import { useQuery } from '@tanstack/react-query'
import { useParams, Link } from 'react-router-dom'
import { listService } from '../../services/list.service'
import { Header } from '../../components/layout/Header'
import { Button } from '../../components/ui/button'
import { Card } from '../../components/ui/card'
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
} from 'lucide-react'
import { format } from 'date-fns'
import { ptBR } from 'date-fns/locale'
import { useState } from 'react'
import { cn } from '../../lib/utils'

export function ListDetailsPage() {
  const { id } = useParams<{ id: string }>()
  const [copied, setCopied] = useState(false)

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

  const copyLink = () => {
    const url = `${window.location.origin}/lists/${id}/public`
    navigator.clipboard.writeText(url)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

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
  const groupedItems = list.items.reduce((acc, item) => {
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
  }, {} as Record<string, { name: string; unit: string; quantityPerMember: number; totalQuantity: number; items: typeof list.items }>)

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
          <Card className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-primary/10 rounded-lg text-primary">
                <Activity className="h-5 w-5" />
              </div>
              <div>
                <p className="text-sm font-medium text-muted-foreground">
                  Status Atual
                </p>
                <p className="text-xl font-bold">
                  {list.status === 'active' ? 'Ativa' : 'Arquivada'}
                </p>
              </div>
            </div>
          </Card>
          <Card className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-primary/10 rounded-lg text-primary">
                <Users className="h-5 w-5" />
              </div>
              <div>
                <p className="text-sm font-medium text-muted-foreground">
                  Participantes
                </p>
                <p className="text-xl font-bold">{totalParticipants}</p>
              </div>
            </div>
          </Card>
          <Card className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-primary/10 rounded-lg text-primary">
                <ShoppingCart className="h-5 w-5" />
              </div>
              <div>
                <p className="text-sm font-medium text-muted-foreground">
                  Itens Cadastrados
                </p>
                <p className="text-xl font-bold">{list.items.length}</p>
              </div>
            </div>
          </Card>
        </div>

        {/* Page Header */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
          {/* Event Details */}
          <Card className="lg:col-span-2 p-6">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
              <div>
                <div className="flex items-center gap-3 mb-2">
                  <h2 className="text-3xl font-black tracking-tight text-primary">
                    {list.location}
                  </h2>
                  <span
                    className={cn(
                      `inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${
                        list.status === 'active'
                          ? 'bg-green-50 text-green-800 dark:bg-green-900/30 dark:text-green-400 border-green-200 dark:border-green-800'
                          : 'bg-gray-100 text-gray-600 dark:bg-gray-700 dark:text-gray-300'
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
                </div>
                <p className="text-muted-foreground">
                  Gerencie os itens e acompanhe as contribuições para este
                  evento.
                </p>
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
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 pt-6 border-t">
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
            </div>
          </Card>

          {/* Share Link */}
          <Card className="p-6 flex flex-col justify-center">
            <div className="mb-4">
              <h3 className="text-lg font-bold mb-1 text-primary">
                Compartilhar Lista
              </h3>
              <p className="text-sm text-muted-foreground">
                Envie este link para os convidados contribuírem.
              </p>
            </div>
            <div className="flex rounded-lg shadow-sm">
              <input
                type="text"
                readOnly
                value={`${window.location.origin}/lists/${id}/public`}
                className="flex-1 rounded-l-lg border border-r-0 bg-muted px-3 py-2 text-sm"
              />
              <Button
                onClick={copyLink}
                variant="outline"
                className="rounded-l-none border-l-0"
              >
                {copied ? (
                  <CheckCircle2 className="h-4 w-4" />
                ) : (
                  <Copy className="h-4 w-4" />
                )}
              </Button>
            </div>
          </Card>
        </div>

        {/* Items List */}
        <Card className="overflow-hidden">
          <div className="px-6 py-5 border-b flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div>
              <h3 className="text-lg font-bold text-primary">
                Itens Solicitados
              </h3>
              <p className="text-sm text-muted-foreground mt-1">
                Acompanhe o preenchimento das parcelas.
              </p>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-muted/50 border-b text-xs uppercase tracking-wider text-muted-foreground">
                  <th className="px-6 py-4 font-semibold">Item</th>
                  <th className="px-6 py-4 font-semibold text-center">
                    Qtd / Parcela
                  </th>
                  <th className="px-6 py-4 font-semibold text-center">
                    Unidade
                  </th>
                  <th className="px-6 py-4 font-semibold">Progresso</th>
                  <th className="px-6 py-4 font-semibold text-center">
                    Preenchidas
                  </th>
                  <th className="px-6 py-4 font-semibold text-center">
                    Disponíveis
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y">
                {itemsSummary.map((item, index) => (
                  <tr
                    key={index}
                    className="hover:bg-muted/50 transition-colors"
                  >
                    <td className="px-6 py-4 font-medium">{item.name}</td>
                    <td className="px-6 py-4 text-sm text-muted-foreground text-center">
                      {item.quantityPerMember}
                    </td>
                    <td className="px-6 py-4 text-sm text-muted-foreground text-center">
                      {item.unit}
                    </td>
                    <td className="px-6 py-4">
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
                    </td>
                    <td className="px-6 py-4 text-center">
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300">
                        {item.filled} de {item.totalParcels}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-center">
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300">
                        {item.available}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="px-6 py-4 border-t flex items-center justify-between">
            <p className="text-sm text-muted-foreground">
              <span className="font-medium">{itemsWithMembers.length}</span> de{' '}
              <span className="font-medium">{list.items.length}</span> itens
              preenchidos
            </p>
          </div>
        </Card>
      </main>
    </div>
  )
}
