import { useNavigate } from 'react-router-dom'
import {
  ListChecks,
  Users,
  Share2,
  CheckCircle2,
  Sparkles,
  Clock,
  Shield,
  Zap,
} from 'lucide-react'
import { Button } from '@/components/ui/button'

export function LandingPage() {
  const navigate = useNavigate()

  return (
    <div className="min-h-screen bg-linear-to-b from-background to-secondary/20">
      {/* Header */}
      <header className="container mx-auto px-4 py-6 flex justify-between items-center">
        <div className="flex items-center gap-2">
          <ListChecks className="h-8 w-8 text-primary" />
          <span className="text-2xl font-bold">Colabora-AI</span>
        </div>
        <div className="flex gap-3">
          <Button variant="ghost" onClick={() => navigate('/auth')}>
            Login
          </Button>
          <Button onClick={() => navigate('/auth')}>Começar Grátis</Button>
        </div>
      </header>

      {/* Hero Section */}
      <section className="container mx-auto px-4 py-20 text-center">
        <div className="max-w-4xl mx-auto">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-primary/10 rounded-full mb-6">
            <Sparkles className="h-4 w-4 text-primary" />
            <span className="text-sm font-medium text-primary">
              Sistema Inteligente de Listas Colaborativas
            </span>
          </div>

          <h1 className="text-5xl md:text-6xl font-bold mb-6 bg-linear-to-r from-foreground to-foreground/70 bg-clip-text text-transparent">
            Organize Eventos com{' '}
            <span className="text-primary">Colaboração em Tempo Real</span>
          </h1>

          <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
            Crie listas para seus eventos, compartilhe com os participantes e
            acompanhe em tempo real quem vai trazer cada item. Simples, rápido e
            eficiente.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
            <Button
              size="lg"
              onClick={() => navigate('/auth')}
              className="text-lg"
            >
              Criar Minha Primeira Lista
              <Sparkles className="ml-2 h-5 w-5" />
            </Button>
            <Button
              size="lg"
              variant="outline"
              onClick={() => navigate('/auth')}
            >
              Ver Como Funciona
            </Button>
          </div>

          <div className="flex flex-wrap justify-center gap-8 text-sm text-muted-foreground">
            <div className="flex items-center gap-2">
              <CheckCircle2 className="h-4 w-4 text-primary" />
              <span>100% Grátis</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle2 className="h-4 w-4 text-primary" />
              <span>Sem Limite de Listas</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle2 className="h-4 w-4 text-primary" />
              <span>Colaboração em Tempo Real</span>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="container mx-auto px-4 py-20">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Tudo que você precisa para organizar eventos
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Uma plataforma completa para gerenciar listas colaborativas de forma
            simples e eficiente
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {/* Feature 1 */}
          <div className="bg-card border rounded-lg p-6 hover:shadow-lg transition-shadow">
            <div className="h-12 w-12 bg-primary/10 rounded-lg flex items-center justify-center mb-4">
              <ListChecks className="h-6 w-6 text-primary" />
            </div>
            <h3 className="text-xl font-semibold mb-2">
              Criação Fácil de Listas
            </h3>
            <p className="text-muted-foreground">
              Crie listas com múltiplos itens, defina quantidades, descrições e
              organize tudo em poucos cliques.
            </p>
          </div>

          {/* Feature 2 */}
          <div className="bg-card border rounded-lg p-6 hover:shadow-lg transition-shadow">
            <div className="h-12 w-12 bg-primary/10 rounded-lg flex items-center justify-center mb-4">
              <Share2 className="h-6 w-6 text-primary" />
            </div>
            <h3 className="text-xl font-semibold mb-2">
              Compartilhamento Público
            </h3>
            <p className="text-muted-foreground">
              Gere um link público único e compartilhe com os participantes do
              evento. Não precisa de cadastro para visualizar.
            </p>
          </div>

          {/* Feature 3 */}
          <div className="bg-card border rounded-lg p-6 hover:shadow-lg transition-shadow">
            <div className="h-12 w-12 bg-primary/10 rounded-lg flex items-center justify-center mb-4">
              <Users className="h-6 w-6 text-primary" />
            </div>
            <h3 className="text-xl font-semibold mb-2">
              Registro de Participantes
            </h3>
            <p className="text-muted-foreground">
              Participantes podem reservar itens informando nome e CPF. Sistema
              valida automaticamente duplicatas.
            </p>
          </div>

          {/* Feature 4 */}
          <div className="bg-card border rounded-lg p-6 hover:shadow-lg transition-shadow">
            <div className="h-12 w-12 bg-primary/10 rounded-lg flex items-center justify-center mb-4">
              <Clock className="h-6 w-6 text-primary" />
            </div>
            <h3 className="text-xl font-semibold mb-2">
              Acompanhamento em Tempo Real
            </h3>
            <p className="text-muted-foreground">
              Veja instantaneamente quando alguém reserva um item. Acompanhe o
              status de cada item da sua lista.
            </p>
          </div>

          {/* Feature 5 */}
          <div className="bg-card border rounded-lg p-6 hover:shadow-lg transition-shadow">
            <div className="h-12 w-12 bg-primary/10 rounded-lg flex items-center justify-center mb-4">
              <Shield className="h-6 w-6 text-primary" />
            </div>
            <h3 className="text-xl font-semibold mb-2">Validação de Data</h3>
            <p className="text-muted-foreground">
              Sistema bloqueia automaticamente reservas após a data do evento.
              Seus dados sempre seguros.
            </p>
          </div>

          {/* Feature 6 */}
          <div className="bg-card border rounded-lg p-6 hover:shadow-lg transition-shadow">
            <div className="h-12 w-12 bg-primary/10 rounded-lg flex items-center justify-center mb-4">
              <Zap className="h-6 w-6 text-primary" />
            </div>
            <h3 className="text-xl font-semibold mb-2">Edição Flexível</h3>
            <p className="text-muted-foreground">
              Continue adicionando itens ou resete completamente a lista. Você
              tem controle total sobre seus eventos.
            </p>
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="container mx-auto px-4 py-20 bg-secondary/30 rounded-3xl my-20">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Como Funciona?
          </h2>
          <p className="text-lg text-muted-foreground">
            Em 3 passos simples você organiza seu evento
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
          <div className="text-center">
            <div className="h-16 w-16 bg-primary rounded-full flex items-center justify-center text-2xl font-bold text-primary-foreground mx-auto mb-4">
              1
            </div>
            <h3 className="text-xl font-semibold mb-2">Crie sua Lista</h3>
            <p className="text-muted-foreground">
              Cadastre-se, crie uma lista, adicione os itens necessários com
              quantidades e descrições.
            </p>
          </div>

          <div className="text-center">
            <div className="h-16 w-16 bg-primary rounded-full flex items-center justify-center text-2xl font-bold text-primary-foreground mx-auto mb-4">
              2
            </div>
            <h3 className="text-xl font-semibold mb-2">Compartilhe</h3>
            <p className="text-muted-foreground">
              Copie o link público e envie para os participantes via WhatsApp,
              email ou qualquer meio.
            </p>
          </div>

          <div className="text-center">
            <div className="h-16 w-16 bg-primary rounded-full flex items-center justify-center text-2xl font-bold text-primary-foreground mx-auto mb-4">
              3
            </div>
            <h3 className="text-xl font-semibold mb-2">Acompanhe</h3>
            <p className="text-muted-foreground">
              Veja em tempo real quem reservou cada item. Relaxe, tudo está sob
              controle!
            </p>
          </div>
        </div>
      </section>

      {/* Use Cases Section */}
      <section className="container mx-auto px-4 py-20">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Perfeito para Diversos Tipos de Eventos
          </h2>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-6xl mx-auto">
          <div className="bg-card border rounded-lg p-6 text-center hover:shadow-lg transition-shadow">
            <div className="text-4xl mb-3">🎂</div>
            <h3 className="font-semibold mb-2">Festas de Aniversário</h3>
            <p className="text-sm text-muted-foreground">
              Organize bebidas, comidas e decoração
            </p>
          </div>

          <div className="bg-card border rounded-lg p-6 text-center hover:shadow-lg transition-shadow">
            <div className="text-4xl mb-3">🏢</div>
            <h3 className="font-semibold mb-2">Eventos Corporativos</h3>
            <p className="text-sm text-muted-foreground">
              Coordene materiais e responsabilidades
            </p>
          </div>

          <div className="bg-card border rounded-lg p-6 text-center hover:shadow-lg transition-shadow">
            <div className="text-4xl mb-3">👰</div>
            <h3 className="font-semibold mb-2">Casamentos</h3>
            <p className="text-sm text-muted-foreground">
              Gerencie lista de presentes e itens
            </p>
          </div>

          <div className="bg-card border rounded-lg p-6 text-center hover:shadow-lg transition-shadow">
            <div className="text-4xl mb-3">🎓</div>
            <h3 className="font-semibold mb-2">Formaturas</h3>
            <p className="text-sm text-muted-foreground">
              Organize contribuições da turma
            </p>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="container mx-auto px-4 py-20">
        <div className="bg-primary rounded-3xl p-12 text-center text-primary-foreground">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Pronto para Organizar seu Próximo Evento?
          </h2>
          <p className="text-lg mb-8 opacity-90 max-w-2xl mx-auto">
            Junte-se a centenas de pessoas que já usam o Colabora-AI para
            organizar eventos incríveis. É grátis e leva menos de 1 minuto para
            começar!
          </p>
          <Button
            size="lg"
            variant="secondary"
            onClick={() => navigate('/auth')}
            className="text-lg"
          >
            Criar Minha Conta Grátis
            <Sparkles className="ml-2 h-5 w-5" />
          </Button>
        </div>
      </section>

      {/* Footer */}
      <footer className="container mx-auto px-4 py-8 border-t">
        <div className="flex flex-col md:flex-row justify-between items-center gap-4">
          <div className="flex items-center gap-2">
            <ListChecks className="h-6 w-6 text-primary" />
            <span className="font-semibold">Colabora-AI</span>
          </div>
          <p className="text-sm text-muted-foreground">
            © 2026 Colabora-AI. Sistema de listas colaborativas para eventos.
          </p>
        </div>
      </footer>
    </div>
  )
}
