import { Link, useNavigate } from 'react-router-dom'
import { useQuery } from '@tanstack/react-query'
import { useAuthStore } from '@/stores/auth.store'
import { subscriptionService } from '@/services/subscription.service'
import { Crown, HelpCircle, LogOut, Search } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { AppLogo } from '@/components/ui/app-logo'
import { ThemeToggle } from '@/components/ui/theme-toggle'
import { Badge } from '@/components/ui/badge'

export function Header() {
  const user = useAuthStore((state) => state.user)
  const logout = useAuthStore((state) => state.logout)
  const navigate = useNavigate()

  const { data: subscriptionStatus } = useQuery({
    queryKey: ['subscription-status'],
    queryFn: subscriptionService.getStatus,
    staleTime: 1000 * 60 * 5, // 5 minutos
  })

  const handleLogout = () => {
    logout()
    navigate('/auth')
  }

  const getPlanBadge = () => {
    if (!subscriptionStatus) return null

    if (subscriptionStatus.status === 'active' && subscriptionStatus.plan) {
      const planNames: Record<string, string> = {
        basic: 'Basico',
        intermediate: 'Intermediario',
        max: 'Max',
      }
      return (
        <Link to="/subscription/plans">
          <Badge
            variant="default"
            className="gap-1 cursor-pointer hover:bg-primary/80"
          >
            <Crown className="h-3 w-3" />
            {planNames[subscriptionStatus.plan]}
          </Badge>
        </Link>
      )
    }

    if (subscriptionStatus.status === 'expired') {
      return (
        <Link to="/subscription/plans">
          <Badge
            variant="destructive"
            className="cursor-pointer hover:bg-destructive/80"
          >
            Expirado
          </Badge>
        </Link>
      )
    }

    return (
      <Link to="/subscription/plans">
        <Badge variant="outline" className="cursor-pointer hover:bg-muted">
          Assinar
        </Badge>
      </Link>
    )
  }

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center justify-between gap-4 px-4 md:px-8">
        <div className="flex items-center gap-4 md:gap-8">
          <Link
            to="/my-lists"
            className="flex items-center gap-2 text-primary shrink-0"
          >
            <AppLogo className="h-8 w-8" />
            <h2 className="hidden sm:block text-xl font-bold tracking-tight">
              Colabora-AI
            </h2>
          </Link>
          <nav className="hidden lg:flex items-center gap-6">
            <Link
              to="/my-lists"
              className="text-sm font-medium text-muted-foreground hover:text-primary transition-colors"
            >
              Minhas Listas
            </Link>
          </nav>
        </div>

        <div className="flex items-center gap-2 md:gap-4 flex-1 max-w-md">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              type="search"
              placeholder="Buscar listas..."
              className="pl-9 h-9"
            />
          </div>
          <div className="hidden md:flex items-center gap-3">
            {getPlanBadge()}
            <div className="text-right">
              <p className="text-sm font-medium">{user?.name}</p>
              <p className="text-xs text-muted-foreground">{user?.email}</p>
            </div>
          </div>
          <ThemeToggle />
          <Button variant="ghost" size="icon" asChild title="Ajuda">
            <Link to="/docs">
              <HelpCircle className="h-5 w-5" />
            </Link>
          </Button>
          <Button
            variant="ghost"
            size="icon"
            onClick={handleLogout}
            title="Sair"
          >
            <LogOut className="h-5 w-5" />
          </Button>
        </div>
      </div>
    </header>
  )
}
