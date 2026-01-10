import { Moon, Sun } from 'lucide-react'
import { Button } from './button'
import { useTheme } from '../../hooks/useTheme'

export function ThemeToggle() {
  const { theme, setTheme, isMounted } = useTheme()

  if (!isMounted) {
    return <Button variant="ghost" size="icon" disabled />
  }

  return (
    <Button
      variant="ghost"
      size="icon"
      onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
      title={`Alternar para ${theme === 'dark' ? 'modo claro' : 'modo escuro'}`}
    >
      {theme === 'dark' ? (
        <Sun className="h-5 w-5" />
      ) : (
        <Moon className="h-5 w-5" />
      )}
      <span className="sr-only">Alternar tema</span>
    </Button>
  )
}
