import { Link, useNavigate } from 'react-router-dom'
import { useAuthStore } from '@/stores/auth.store'
import { LogOut, Search } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { AppLogo } from '@/components/ui/app-logo'
import { ThemeToggle } from '@/components/ui/theme-toggle'

export function Header() {
  const user = useAuthStore((state) => state.user)
  const logout = useAuthStore((state) => state.logout)
  const navigate = useNavigate()

  const handleLogout = () => {
    logout()
    navigate('/auth')
  }

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center justify-between gap-4 px-4 md:px-8">
        <div className="flex items-center gap-4 md:gap-8">
          <Link to="/my-lists" className="flex items-center gap-2 text-primary shrink-0">
            <AppLogo className="h-8 w-8" />
            <h2 className="hidden sm:block text-xl font-bold tracking-tight">Colabora-AI</h2>
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
          <div className="hidden md:block text-right">
            <p className="text-sm font-medium">{user?.name}</p>
            <p className="text-xs text-muted-foreground">{user?.email}</p>
          </div>
          <ThemeToggle />
          <Button variant="ghost" size="icon" onClick={handleLogout} title="Sair">
            <LogOut className="h-5 w-5" />
          </Button>
        </div>
      </div>
    </header>
  )
}
