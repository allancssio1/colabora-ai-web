import { Network } from 'lucide-react'
import { cn } from '../../lib/utils'

interface AppLogoProps {
  className?: string
}

export function AppLogo({ className }: AppLogoProps) {
  return <Network className={cn('h-6 w-6', className)} />
}
