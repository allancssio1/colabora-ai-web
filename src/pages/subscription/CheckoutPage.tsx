import { useEffect, useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { useQuery } from '@tanstack/react-query'
import { Header } from '@/components/layout/Header'
import { Button } from '@/components/ui/button'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { subscriptionService } from '@/services/subscription.service'
import { Check, Clock, Copy, Loader2, QrCode } from 'lucide-react'
import { toast } from 'sonner'
import type { CheckoutResponse } from '@/types/subscription'

export function CheckoutPage() {
  const location = useLocation()
  const navigate = useNavigate()
  const checkoutData = location.state as CheckoutResponse | null

  const [copied, setCopied] = useState(false)
  const [timeLeft, setTimeLeft] = useState<number>(0)

  // Polling para verificar status do pagamento
  const { data: paymentStatus } = useQuery({
    queryKey: ['payment-status', checkoutData?.transactionId],
    queryFn: () =>
      subscriptionService.getPaymentStatus(checkoutData!.transactionId),
    enabled: !!checkoutData?.transactionId,
    refetchInterval: (query) => {
      const data = query.state.data
      if (
        data?.status === 'PAID' ||
        data?.status === 'EXPIRED' ||
        data?.status === 'CANCELLED'
      ) {
        return false
      }
      return 5000 // Poll a cada 5 segundos
    },
  })

  // Timer de expiracao
  useEffect(() => {
    if (!checkoutData?.pix.expiresAt) return

    const updateTimer = () => {
      const now = new Date().getTime()
      const expires = new Date(checkoutData.pix.expiresAt).getTime()
      const diff = Math.max(0, Math.floor((expires - now) / 1000))
      setTimeLeft(diff)
    }

    updateTimer()
    const interval = setInterval(updateTimer, 1000)

    return () => clearInterval(interval)
  }, [checkoutData?.pix.expiresAt])

  // Redirecionar quando pago
  useEffect(() => {
    if (paymentStatus?.status === 'PAID') {
      toast.success('Pagamento confirmado! Sua assinatura foi ativada.')
      setTimeout(() => navigate('/my-lists'), 2000)
    }
  }, [paymentStatus?.status, navigate])

  const handleCopyCode = async () => {
    if (!checkoutData?.pix.brCode) return

    try {
      await navigator.clipboard.writeText(checkoutData.pix.brCode)
      setCopied(true)
      toast.success('Codigo PIX copiado!')
      setTimeout(() => setCopied(false), 3000)
    } catch {
      toast.error('Erro ao copiar codigo')
    }
  }

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`
  }

  const formatPrice = (cents: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
    }).format(cents / 100)
  }

  if (!checkoutData) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <main className="container max-w-lg mx-auto px-4 py-20 text-center">
          <p className="text-muted-foreground mb-4">
            Nenhum checkout encontrado.
          </p>
          <Button onClick={() => navigate('/subscription/plans')}>
            Ver Planos
          </Button>
        </main>
      </div>
    )
  }

  const isPaid = paymentStatus?.status === 'PAID'
  const isExpired = paymentStatus?.status === 'EXPIRED' || timeLeft === 0

  return (
    <div className="min-h-screen bg-background">
      <Header />

      <main className="container max-w-lg mx-auto px-4 sm:px-6 py-8">
        <Card>
          <CardHeader className="text-center">
            <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-primary/10 flex items-center justify-center">
              {isPaid ? (
                <Check className="h-8 w-8 text-green-500" />
              ) : (
                <QrCode className="h-8 w-8 text-primary" />
              )}
            </div>
            <CardTitle className="text-2xl">
              {isPaid ? 'Pagamento Confirmado!' : 'Pague com PIX'}
            </CardTitle>
            <CardDescription>
              {isPaid
                ? 'Sua assinatura foi ativada com sucesso'
                : 'Escaneie o QR Code ou copie o codigo'}
            </CardDescription>
          </CardHeader>

          <CardContent className="space-y-6">
            {isPaid ? (
              <div className="text-center py-8">
                <div className="w-20 h-20 mx-auto mb-4 rounded-full bg-green-100 dark:bg-green-900 flex items-center justify-center">
                  <Check className="h-10 w-10 text-green-500" />
                </div>
                <p className="text-lg font-medium text-green-600 dark:text-green-400">
                  Redirecionando para suas listas...
                </p>
                <Loader2 className="h-5 w-5 animate-spin mx-auto mt-4 text-muted-foreground" />
              </div>
            ) : isExpired ? (
              <div className="text-center py-8">
                <p className="text-lg font-medium text-red-600 dark:text-red-400 mb-4">
                  QR Code expirado
                </p>
                <Button onClick={() => navigate('/subscription/plans')}>
                  Tentar Novamente
                </Button>
              </div>
            ) : (
              <>
                {/* Timer */}
                <div className="flex items-center justify-center gap-2 text-sm text-muted-foreground">
                  <Clock className="h-4 w-4" />
                  <span>Expira em {formatTime(timeLeft)}</span>
                </div>

                {/* QR Code */}
                <div className="flex justify-center">
                  <div className="p-4 bg-white rounded-lg">
                    <img
                      src={checkoutData.pix.brCodeBase64}
                      alt="QR Code PIX"
                      className="w-64 h-64"
                    />
                  </div>
                </div>

                {/* Valor */}
                <div className="text-center">
                  <p className="text-sm text-muted-foreground">Valor</p>
                  <p className="text-2xl font-bold">
                    {formatPrice(checkoutData.pix.amount)}
                  </p>
                </div>

                {/* Botao Copiar */}
                <Button
                  variant="outline"
                  className="w-full"
                  onClick={handleCopyCode}
                >
                  {copied ? (
                    <>
                      <Check className="h-4 w-4 mr-2" />
                      Copiado!
                    </>
                  ) : (
                    <>
                      <Copy className="h-4 w-4 mr-2" />
                      Copiar codigo PIX
                    </>
                  )}
                </Button>

                {/* Status */}
                <div className="flex items-center justify-center gap-2 text-sm">
                  <Loader2 className="h-4 w-4 animate-spin" />
                  <span className="text-muted-foreground">
                    Aguardando pagamento...
                  </span>
                </div>
              </>
            )}
          </CardContent>
        </Card>

        {!isPaid && !isExpired && (
          <p className="text-center text-sm text-muted-foreground mt-6">
            O pagamento sera confirmado automaticamente apos a transferencia.
          </p>
        )}
      </main>
    </div>
  )
}
