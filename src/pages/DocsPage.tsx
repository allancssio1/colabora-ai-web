import { Header } from '@/components/layout/Header'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion'
import {
  BookOpen,
  Users,
  ListChecks,
  Shield,
  Calendar,
  Share2,
  Edit,
  Power,
  Copy,
  UserPlus,
  AlertTriangle,
  Crown,
  CreditCard,
} from 'lucide-react'

export function DocsPage() {
  return (
    <div className="min-h-screen bg-background">
      <Header />

      <main className="container max-w-4xl mx-auto px-4 sm:px-6 py-8">
        {/* Header */}
        <div className="flex flex-col gap-2 mb-8">
          <div className="flex items-center gap-3">
            <div className="size-12 rounded-full bg-primary/10 flex items-center justify-center">
              <BookOpen className="h-6 w-6 text-primary" />
            </div>
            <div>
              <h1 className="text-3xl sm:text-4xl font-black leading-tight tracking-tight text-primary">
                Documentacao
              </h1>
              <p className="text-muted-foreground">
                Guia completo de uso da aplicacao Colabora-AI
              </p>
            </div>
          </div>
        </div>

        {/* Visao Geral */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <ListChecks className="h-5 w-5 text-primary" />
              Visao Geral
            </CardTitle>
          </CardHeader>
          <CardContent className="prose prose-sm max-w-none">
            <p>
              O <strong>Colabora-AI</strong> e uma aplicacao para gerenciamento
              de listas colaborativas de contribuicao. Ideal para organizar
              eventos como churrascos, festas, reunioes e outros encontros onde
              os participantes precisam contribuir com itens.
            </p>
            <p>
              O sistema permite criar listas de itens, compartilha-las
              publicamente e permitir que membros se registrem para trazer itens
              especificos.
            </p>
          </CardContent>
        </Card>

        {/* Telas e Funcionalidades */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle>Telas e Funcionalidades</CardTitle>
          </CardHeader>
          <CardContent>
            <Accordion type="single" collapsible className="w-full">
              {/* Minhas Listas */}
              <AccordionItem value="my-lists">
                <AccordionTrigger className="text-left">
                  <div className="flex items-center gap-2">
                    <ListChecks className="h-4 w-4 text-primary" />
                    Minhas Listas (/my-lists)
                  </div>
                </AccordionTrigger>
                <AccordionContent className="space-y-4">
                  <p className="text-muted-foreground">
                    Tela principal para visualizar e gerenciar todas as suas
                    listas de contribuicao.
                  </p>

                  <div className="space-y-2">
                    <h4 className="font-semibold">Funcionalidades:</h4>
                    <ul className="list-disc list-inside space-y-1 text-sm text-muted-foreground">
                      <li>Visualizar todas as listas criadas pelo usuario</li>
                      <li>
                        Filtrar listas por status: Todas, Ativas ou Arquivadas
                      </li>
                      <li>Ver detalhes de cada lista</li>
                      <li>Editar listas existentes</li>
                      <li>Deletar listas</li>
                      <li>Criar nova lista (do zero ou a partir de modelo)</li>
                    </ul>
                  </div>

                  <div className="space-y-2">
                    <h4 className="font-semibold flex items-center gap-2">
                      <Copy className="h-4 w-4" />
                      Criar Lista a partir de Modelo:
                    </h4>
                    <p className="text-sm text-muted-foreground">
                      Se voce ja possui listas, ao clicar em "Criar nova lista",
                      um modal aparecera com duas opcoes:
                    </p>
                    <ul className="list-disc list-inside space-y-1 text-sm text-muted-foreground">
                      <li>
                        <strong>Usar lista existente como modelo:</strong> Copia
                        todos os itens de uma lista anterior (sem os membros
                        registrados) para uma nova lista com data de amanha
                      </li>
                      <li>
                        <strong>Criar lista do zero:</strong> Redireciona para a
                        tela de criacao em branco
                      </li>
                    </ul>
                  </div>
                </AccordionContent>
              </AccordionItem>

              {/* Criar Lista */}
              <AccordionItem value="create-list">
                <AccordionTrigger className="text-left">
                  <div className="flex items-center gap-2">
                    <Calendar className="h-4 w-4 text-primary" />
                    Criar Lista (/lists/create)
                  </div>
                </AccordionTrigger>
                <AccordionContent className="space-y-4">
                  <p className="text-muted-foreground">
                    Tela para criar uma nova lista de contribuicao do zero.
                  </p>

                  <div className="space-y-2">
                    <h4 className="font-semibold">Campos obrigatorios:</h4>
                    <ul className="list-disc list-inside space-y-1 text-sm text-muted-foreground">
                      <li>
                        <strong>Local do evento:</strong> Endereco ou nome do
                        local
                      </li>
                      <li>
                        <strong>Data e hora:</strong> Quando o evento acontecera
                      </li>
                      <li>
                        <strong>Itens:</strong> Pelo menos 1 item deve ser
                        adicionado
                      </li>
                    </ul>
                  </div>

                  <div className="space-y-2">
                    <h4 className="font-semibold">Campos opcionais:</h4>
                    <ul className="list-disc list-inside space-y-1 text-sm text-muted-foreground">
                      <li>
                        <strong>Descricao:</strong> Detalhes adicionais sobre o
                        evento
                      </li>
                    </ul>
                  </div>

                  <div className="space-y-2">
                    <h4 className="font-semibold">Sistema de Parcelas:</h4>
                    <p className="text-sm text-muted-foreground">
                      Cada item e dividido em parcelas. Por exemplo: se voce
                      precisa de 10kg de carne e cada pessoa deve trazer 2kg, o
                      sistema cria 5 parcelas (10/2=5). Cada parcela pode ser
                      assumida por um membro diferente.
                    </p>
                  </div>
                </AccordionContent>
              </AccordionItem>

              {/* Editar Lista */}
              <AccordionItem value="edit-list">
                <AccordionTrigger className="text-left">
                  <div className="flex items-center gap-2">
                    <Edit className="h-4 w-4 text-primary" />
                    Editar Lista (/lists/:id/edit)
                  </div>
                </AccordionTrigger>
                <AccordionContent className="space-y-4">
                  <p className="text-muted-foreground">
                    Tela para editar uma lista existente.
                  </p>

                  <div className="space-y-2">
                    <h4 className="font-semibold">O que pode ser editado:</h4>
                    <ul className="list-disc list-inside space-y-1 text-sm text-muted-foreground">
                      <li>Data e hora do evento</li>
                      <li>Descricao do evento</li>
                      <li>Adicionar novos itens</li>
                      <li>Remover itens (com restricoes)</li>
                      <li>Editar quantidade total dos itens</li>
                    </ul>
                  </div>

                  <div className="space-y-2">
                    <h4 className="font-semibold flex items-center gap-2 text-amber-600">
                      <AlertTriangle className="h-4 w-4" />
                      Restricoes importantes:
                    </h4>
                    <ul className="list-disc list-inside space-y-1 text-sm text-muted-foreground">
                      <li>
                        <strong>Local:</strong> Nao pode ser alterado apos a
                        criacao
                      </li>
                      <li>
                        <strong>Itens com membros registrados:</strong>
                        <ul className="list-disc list-inside ml-4 mt-1">
                          <li>Nao podem ser removidos</li>
                          <li>Nome, unidade e quantidade por membro nao podem ser alterados</li>
                          <li>
                            Quantidade total pode ser aumentada, mas nao
                            reduzida abaixo do numero de parcelas ja assumidas
                          </li>
                        </ul>
                      </li>
                    </ul>
                  </div>

                  <div className="space-y-2">
                    <h4 className="font-semibold flex items-center gap-2">
                      <Power className="h-4 w-4" />
                      Ativar/Desativar Lista:
                    </h4>
                    <p className="text-sm text-muted-foreground">
                      No rodape da pagina de edicao existe um botao para
                      ativar/desativar a lista. Uma lista desativada (arquivada)
                      nao permite novos registros de membros.
                    </p>
                  </div>
                </AccordionContent>
              </AccordionItem>

              {/* Detalhes da Lista */}
              <AccordionItem value="list-details">
                <AccordionTrigger className="text-left">
                  <div className="flex items-center gap-2">
                    <Share2 className="h-4 w-4 text-primary" />
                    Detalhes da Lista (/lists/:id)
                  </div>
                </AccordionTrigger>
                <AccordionContent className="space-y-4">
                  <p className="text-muted-foreground">
                    Tela para visualizar todos os detalhes de uma lista e
                    compartilha-la.
                  </p>

                  <div className="space-y-2">
                    <h4 className="font-semibold">Informacoes exibidas:</h4>
                    <ul className="list-disc list-inside space-y-1 text-sm text-muted-foreground">
                      <li>Local e data do evento</li>
                      <li>Descricao (se houver)</li>
                      <li>Status da lista (ativa/arquivada)</li>
                      <li>Lista de itens com parcelas</li>
                      <li>Membros registrados em cada parcela</li>
                      <li>Progresso de preenchimento</li>
                    </ul>
                  </div>

                  <div className="space-y-2">
                    <h4 className="font-semibold">Compartilhamento:</h4>
                    <p className="text-sm text-muted-foreground">
                      Voce pode copiar o link publico da lista para compartilhar
                      com os participantes. Eles poderao acessar e se registrar
                      sem precisar de conta.
                    </p>
                  </div>
                </AccordionContent>
              </AccordionItem>

              {/* Lista Publica */}
              <AccordionItem value="public-list">
                <AccordionTrigger className="text-left">
                  <div className="flex items-center gap-2">
                    <UserPlus className="h-4 w-4 text-primary" />
                    Lista Publica (/lists/:id/public)
                  </div>
                </AccordionTrigger>
                <AccordionContent className="space-y-4">
                  <p className="text-muted-foreground">
                    Tela publica onde membros podem se registrar para contribuir
                    com itens.
                  </p>

                  <div className="space-y-2">
                    <h4 className="font-semibold">Para se registrar:</h4>
                    <ul className="list-disc list-inside space-y-1 text-sm text-muted-foreground">
                      <li>Nome completo</li>
                      <li>CPF (11 digitos)</li>
                      <li>Selecionar o item desejado</li>
                    </ul>
                  </div>

                  <div className="space-y-2">
                    <h4 className="font-semibold flex items-center gap-2 text-amber-600">
                      <AlertTriangle className="h-4 w-4" />
                      Restricoes para registro:
                    </h4>
                    <ul className="list-disc list-inside space-y-1 text-sm text-muted-foreground">
                      <li>
                        <strong>Lista inativa:</strong> Nao permite registros
                      </li>
                      <li>
                        <strong>Data expirada:</strong> Apos a data do evento,
                        nao e possivel se registrar
                      </li>
                      <li>
                        <strong>Item ja assumido:</strong> Cada parcela so pode
                        ter um responsavel
                      </li>
                    </ul>
                  </div>

                  <div className="space-y-2">
                    <h4 className="font-semibold">Cancelar registro:</h4>
                    <p className="text-sm text-muted-foreground">
                      Membros podem cancelar seu registro informando o CPF
                      utilizado no momento do registro.
                    </p>
                  </div>
                </AccordionContent>
              </AccordionItem>
            </Accordion>
          </CardContent>
        </Card>

        {/* Planos e Assinatura */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Crown className="h-5 w-5 text-primary" />
              Planos e Assinatura
            </CardTitle>
          </CardHeader>
          <CardContent>
            <Accordion type="single" collapsible className="w-full">
              {/* Planos Disponiveis */}
              <AccordionItem value="plans">
                <AccordionTrigger className="text-left">
                  <div className="flex items-center gap-2">
                    <ListChecks className="h-4 w-4 text-primary" />
                    Planos Disponiveis
                  </div>
                </AccordionTrigger>
                <AccordionContent className="space-y-4">
                  <p className="text-muted-foreground">
                    O Colabora-AI oferece diferentes planos para atender as suas
                    necessidades de organizacao de eventos.
                  </p>

                  <div className="grid gap-3">
                    <div className="p-3 bg-muted rounded-lg border-l-4 border-muted-foreground">
                      <div className="flex justify-between items-center">
                        <h4 className="font-semibold">Gratuito</h4>
                        <span className="text-sm font-mono">R$ 0,00</span>
                      </div>
                      <p className="text-sm text-muted-foreground mt-1">
                        1 lista ativa - Ideal para experimentar a plataforma
                      </p>
                    </div>

                    <div className="p-3 bg-muted rounded-lg border-l-4 border-blue-500">
                      <div className="flex justify-between items-center">
                        <h4 className="font-semibold">Basico</h4>
                        <span className="text-sm font-mono">R$ 20,00/mes</span>
                      </div>
                      <p className="text-sm text-muted-foreground mt-1">
                        Ate 5 listas ativas - Para quem organiza eventos
                        ocasionalmente
                      </p>
                    </div>

                    <div className="p-3 bg-muted rounded-lg border-l-4 border-purple-500">
                      <div className="flex justify-between items-center">
                        <h4 className="font-semibold">Intermediario</h4>
                        <span className="text-sm font-mono">R$ 35,00/mes</span>
                      </div>
                      <p className="text-sm text-muted-foreground mt-1">
                        Ate 10 listas ativas - Para organizadores frequentes
                      </p>
                    </div>

                    <div className="p-3 bg-muted rounded-lg border-l-4 border-amber-500">
                      <div className="flex justify-between items-center">
                        <h4 className="font-semibold">Max</h4>
                        <span className="text-sm font-mono">R$ 50,00/mes</span>
                      </div>
                      <p className="text-sm text-muted-foreground mt-1">
                        Ate 15 listas ativas - Maximo poder para profissionais
                      </p>
                    </div>
                  </div>
                </AccordionContent>
              </AccordionItem>

              {/* Pagamento */}
              <AccordionItem value="payment">
                <AccordionTrigger className="text-left">
                  <div className="flex items-center gap-2">
                    <CreditCard className="h-4 w-4 text-primary" />
                    Pagamento e Renovacao
                  </div>
                </AccordionTrigger>
                <AccordionContent className="space-y-4">
                  <div className="space-y-2">
                    <h4 className="font-semibold">Metodo de Pagamento:</h4>
                    <ul className="list-disc list-inside space-y-1 text-sm text-muted-foreground">
                      <li>
                        <strong>PIX:</strong> Pagamento instantaneo e seguro via
                        QR Code ou codigo copia e cola
                      </li>
                      <li>
                        O pagamento e processado automaticamente e a assinatura
                        e ativada imediatamente apos a confirmacao
                      </li>
                    </ul>
                  </div>

                  <div className="space-y-2">
                    <h4 className="font-semibold">Validade e Renovacao:</h4>
                    <ul className="list-disc list-inside space-y-1 text-sm text-muted-foreground">
                      <li>
                        Cada assinatura tem validade de <strong>30 dias</strong>{' '}
                        a partir da data de pagamento
                      </li>
                      <li>
                        A renovacao e <strong>manual</strong> - voce escolhe
                        quando renovar
                      </li>
                      <li>
                        Voce pode renovar antes do vencimento para manter o
                        acesso ininterrupto
                      </li>
                      <li>
                        Ao expirar, sua assinatura retorna ao plano gratuito (1
                        lista)
                      </li>
                    </ul>
                  </div>

                  <div className="space-y-2">
                    <h4 className="font-semibold flex items-center gap-2 text-amber-600">
                      <AlertTriangle className="h-4 w-4" />
                      Importante:
                    </h4>
                    <ul className="list-disc list-inside space-y-1 text-sm text-muted-foreground">
                      <li>
                        Se sua assinatura expirar e voce tiver mais listas que o
                        limite gratuito, suas listas serao preservadas mas voce
                        nao podera criar novas ate renovar
                      </li>
                      <li>
                        O QR Code do PIX tem validade limitada - finalize o
                        pagamento antes de expirar
                      </li>
                    </ul>
                  </div>
                </AccordionContent>
              </AccordionItem>

              {/* Limites */}
              <AccordionItem value="limits">
                <AccordionTrigger className="text-left">
                  <div className="flex items-center gap-2">
                    <Shield className="h-4 w-4 text-primary" />
                    Limites e Recursos
                  </div>
                </AccordionTrigger>
                <AccordionContent className="space-y-4">
                  <p className="text-muted-foreground">
                    Cada plano define o numero maximo de listas ativas que voce
                    pode ter simultaneamente.
                  </p>

                  <div className="space-y-2">
                    <h4 className="font-semibold">O que conta como lista ativa:</h4>
                    <ul className="list-disc list-inside space-y-1 text-sm text-muted-foreground">
                      <li>
                        Todas as listas criadas, independente do status
                        (ativa/arquivada)
                      </li>
                      <li>
                        Ao deletar uma lista, o espaco e liberado imediatamente
                      </li>
                    </ul>
                  </div>

                  <div className="space-y-2">
                    <h4 className="font-semibold">Recursos inclusos em todos os planos:</h4>
                    <ul className="list-disc list-inside space-y-1 text-sm text-muted-foreground">
                      <li>Itens ilimitados por lista</li>
                      <li>Membros ilimitados por item</li>
                      <li>Compartilhamento publico de listas</li>
                      <li>Criacao a partir de modelo</li>
                      <li>Suporte completo</li>
                    </ul>
                  </div>
                </AccordionContent>
              </AccordionItem>
            </Accordion>
          </CardContent>
        </Card>

        {/* Regras de Negocio */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Shield className="h-5 w-5 text-primary" />
              Regras de Negocio
            </CardTitle>
          </CardHeader>
          <CardContent>
            <Accordion type="single" collapsible className="w-full">
              {/* Autenticacao */}
              <AccordionItem value="auth">
                <AccordionTrigger className="text-left">
                  Autenticacao e Autorizacao
                </AccordionTrigger>
                <AccordionContent className="space-y-2">
                  <ul className="list-disc list-inside space-y-1 text-sm text-muted-foreground">
                    <li>
                      Apenas usuarios autenticados podem criar, editar e deletar
                      listas
                    </li>
                    <li>
                      Cada usuario so pode gerenciar suas proprias listas
                    </li>
                    <li>
                      A visualizacao e registro em listas publicas nao requer
                      autenticacao
                    </li>
                    <li>
                      Tokens JWT sao utilizados para autenticacao
                    </li>
                  </ul>
                </AccordionContent>
              </AccordionItem>

              {/* Status da Lista */}
              <AccordionItem value="list-status">
                <AccordionTrigger className="text-left">
                  Status da Lista
                </AccordionTrigger>
                <AccordionContent className="space-y-2">
                  <ul className="list-disc list-inside space-y-1 text-sm text-muted-foreground">
                    <li>
                      <strong>Ativa (active):</strong> Permite registro de
                      membros (se a data nao expirou)
                    </li>
                    <li>
                      <strong>Arquivada (archived):</strong> Nao permite novos
                      registros, independente da data
                    </li>
                    <li>
                      O status pode ser alterado a qualquer momento pelo dono da
                      lista
                    </li>
                  </ul>
                </AccordionContent>
              </AccordionItem>

              {/* Parcelas */}
              <AccordionItem value="parcels">
                <AccordionTrigger className="text-left">
                  Sistema de Parcelas
                </AccordionTrigger>
                <AccordionContent className="space-y-2">
                  <ul className="list-disc list-inside space-y-1 text-sm text-muted-foreground">
                    <li>
                      Cada item e dividido em parcelas baseado na quantidade
                      total e quantidade por membro
                    </li>
                    <li>
                      Formula: Parcelas = ceil(quantidade_total /
                      quantidade_por_membro)
                    </li>
                    <li>
                      Cada parcela pode ser assumida por apenas um membro
                    </li>
                    <li>
                      Ao aumentar a quantidade total, novas parcelas sao criadas
                      automaticamente
                    </li>
                    <li>
                      Ao reduzir, parcelas vazias sao removidas (parcelas com
                      membros sao preservadas)
                    </li>
                  </ul>
                </AccordionContent>
              </AccordionItem>

              {/* Validacoes */}
              <AccordionItem value="validations">
                <AccordionTrigger className="text-left">
                  Validacoes e Restricoes
                </AccordionTrigger>
                <AccordionContent className="space-y-2">
                  <ul className="list-disc list-inside space-y-1 text-sm text-muted-foreground">
                    <li>
                      <strong>CPF:</strong> Deve ter exatamente 11 digitos
                    </li>
                    <li>
                      <strong>Nome:</strong> Minimo de 1 caractere
                    </li>
                    <li>
                      <strong>Local:</strong> Minimo de 3 caracteres
                    </li>
                    <li>
                      <strong>Itens:</strong> Quantidade total e por membro
                      devem ser positivas
                    </li>
                    <li>
                      <strong>Data do evento:</strong> Validada no momento do
                      registro de membros
                    </li>
                  </ul>
                </AccordionContent>
              </AccordionItem>

              {/* Delecao */}
              <AccordionItem value="deletion">
                <AccordionTrigger className="text-left">
                  Delecao de Dados
                </AccordionTrigger>
                <AccordionContent className="space-y-2">
                  <ul className="list-disc list-inside space-y-1 text-sm text-muted-foreground">
                    <li>
                      Ao deletar uma lista, todos os itens associados sao
                      deletados automaticamente (cascade)
                    </li>
                    <li>
                      Ao deletar um usuario, suas credenciais de autenticacao
                      sao deletadas (cascade)
                    </li>
                    <li>
                      Itens com membros registrados nao podem ser removidos
                      individualmente
                    </li>
                  </ul>
                </AccordionContent>
              </AccordionItem>
            </Accordion>
          </CardContent>
        </Card>

        {/* API Endpoints */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Users className="h-5 w-5 text-primary" />
              Endpoints da API
            </CardTitle>
          </CardHeader>
          <CardContent>
            <Accordion type="single" collapsible className="w-full">
              {/* Rotas Publicas */}
              <AccordionItem value="public-routes">
                <AccordionTrigger className="text-left">
                  Rotas Publicas (sem autenticacao)
                </AccordionTrigger>
                <AccordionContent>
                  <div className="space-y-3">
                    <div className="p-3 bg-muted rounded-lg">
                      <code className="text-sm font-mono">
                        GET /lists/:listId
                      </code>
                      <p className="text-sm text-muted-foreground mt-1">
                        Obter dados de uma lista publica
                      </p>
                    </div>
                    <div className="p-3 bg-muted rounded-lg">
                      <code className="text-sm font-mono">
                        POST /lists/:listId/register
                      </code>
                      <p className="text-sm text-muted-foreground mt-1">
                        Registrar membro em um item (body: item_id, name, cpf)
                      </p>
                    </div>
                    <div className="p-3 bg-muted rounded-lg">
                      <code className="text-sm font-mono">
                        DELETE /lists/:listId/items/:itemId/register
                      </code>
                      <p className="text-sm text-muted-foreground mt-1">
                        Cancelar registro de membro
                      </p>
                    </div>
                  </div>
                </AccordionContent>
              </AccordionItem>

              {/* Rotas Protegidas */}
              <AccordionItem value="protected-routes">
                <AccordionTrigger className="text-left">
                  Rotas Protegidas (requer JWT)
                </AccordionTrigger>
                <AccordionContent>
                  <div className="space-y-3">
                    <div className="p-3 bg-muted rounded-lg">
                      <code className="text-sm font-mono">GET /lists</code>
                      <p className="text-sm text-muted-foreground mt-1">
                        Listar todas as listas do usuario autenticado
                      </p>
                    </div>
                    <div className="p-3 bg-muted rounded-lg">
                      <code className="text-sm font-mono">POST /lists</code>
                      <p className="text-sm text-muted-foreground mt-1">
                        Criar nova lista (body: location, event_date, items[],
                        description?)
                      </p>
                    </div>
                    <div className="p-3 bg-muted rounded-lg">
                      <code className="text-sm font-mono">
                        POST /lists/from-template
                      </code>
                      <p className="text-sm text-muted-foreground mt-1">
                        Criar lista a partir de modelo (body: template_list_id)
                      </p>
                    </div>
                    <div className="p-3 bg-muted rounded-lg">
                      <code className="text-sm font-mono">
                        PUT /lists/:listId
                      </code>
                      <p className="text-sm text-muted-foreground mt-1">
                        Editar lista (body: event_date?, description?, items?)
                      </p>
                    </div>
                    <div className="p-3 bg-muted rounded-lg">
                      <code className="text-sm font-mono">
                        PATCH /lists/:listId/status
                      </code>
                      <p className="text-sm text-muted-foreground mt-1">
                        Alternar status da lista (active/archived)
                      </p>
                    </div>
                    <div className="p-3 bg-muted rounded-lg">
                      <code className="text-sm font-mono">
                        DELETE /lists/:listId
                      </code>
                      <p className="text-sm text-muted-foreground mt-1">
                        Deletar lista e todos os seus itens
                      </p>
                    </div>
                  </div>
                </AccordionContent>
              </AccordionItem>

              {/* Autenticacao */}
              <AccordionItem value="auth-routes">
                <AccordionTrigger className="text-left">
                  Rotas de Autenticacao
                </AccordionTrigger>
                <AccordionContent>
                  <div className="space-y-3">
                    <div className="p-3 bg-muted rounded-lg">
                      <code className="text-sm font-mono">
                        POST /auth/register
                      </code>
                      <p className="text-sm text-muted-foreground mt-1">
                        Criar nova conta (body: name, email, password)
                      </p>
                    </div>
                    <div className="p-3 bg-muted rounded-lg">
                      <code className="text-sm font-mono">POST /auth/login</code>
                      <p className="text-sm text-muted-foreground mt-1">
                        Fazer login (body: email, password) - retorna JWT
                      </p>
                    </div>
                  </div>
                </AccordionContent>
              </AccordionItem>
            </Accordion>
          </CardContent>
        </Card>
      </main>
    </div>
  )
}
