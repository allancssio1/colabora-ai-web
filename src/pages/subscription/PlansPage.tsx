import { useNavigate } from 'react-router-dom'
import { useQuery, useMutation } from '@tanstack/react-query'
import { Header } from '@/components/layout/Header'
import { Button } from '@/components/ui/button'
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { subscriptionService } from '@/services/subscription.service'
import { Check, Crown, Loader2, Sparkles, Zap } from 'lucide-react'
import { toast } from 'sonner'
import { extractErrorMessage } from '@/utils/error-handler'
import type { SubscriptionPlanType } from '@/types/subscription'

const planIcons: Record<SubscriptionPlanType, React.ReactNode> = {
  basic: <Zap className="h-8 w-8" />,
  intermediate: <Sparkles className="h-8 w-8" />,
  max: <Crown className="h-8 w-8" />,
}

const planColors: Record<SubscriptionPlanType, string> = {
  basic: 'from-blue-500 to-blue-600',
  intermediate: 'from-purple-500 to-purple-600',
  max: 'from-amber-500 to-amber-600',
}

export function PlansPage() {
  const navigate = useNavigate()

  const { data: plansData, isLoading: isLoadingPlans } = useQuery({
    queryKey: ['subscription-plans'],
    queryFn: subscriptionService.getPlans,
  })

  const { data: statusData, isLoading: isLoadingStatus } = useQuery({
    queryKey: ['subscription-status'],
    queryFn: subscriptionService.getStatus,
  })

  const checkoutMutation = useMutation({
    mutationFn: subscriptionService.createCheckout,
    onSuccess: (data) => {
      navigate(`/subscription/checkout`, { state: data })
    },
    onError: (error) => {
      toast.error(extractErrorMessage(error, 'Erro ao criar checkout'))
    },
  })

  const isLoading = isLoadingPlans || isLoadingStatus
  const plans = plansData?.plans || []
  const currentPlan = statusData?.plan
  const isActive = statusData?.status === 'active'

  const handleSelectPlan = (planId: SubscriptionPlanType) => {
    checkoutMutation.mutate(planId)
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />

      <main className="container max-w-5xl mx-auto px-4 sm:px-6 py-8">
        <div className="text-center mb-10">
          <h1 className="text-3xl sm:text-4xl font-black tracking-tight text-primary mb-3">
            Escolha seu Plano
          </h1>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Selecione o plano que melhor atende suas necessidades. Todos os
            planos incluem acesso completo a todas as funcionalidades.
          </p>
        </div>

        {isActive && statusData?.expiresAt && (
          <div className="mb-8 p-4 bg-green-50 dark:bg-green-950 border border-green-200 dark:border-green-800 rounded-lg text-center">
            <p className="text-green-700 dark:text-green-300">
              Seu plano <strong>{statusData.planName}</strong> esta ativo ate{' '}
              <strong>
                {new Date(statusData.expiresAt).toLocaleDateString('pt-BR')}
              </strong>
            </p>
          </div>
        )}

        {isLoading ? (
          <div className="flex justify-center py-20">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
          </div>
        ) : (
          <div className="grid md:grid-cols-3 gap-6">
            {plans.map((plan) => {
              const isCurrentPlan = currentPlan === plan.id && isActive
              const isPending = checkoutMutation.isPending

              return (
                <Card
                  key={plan.id}
                  className={`relative overflow-hidden transition-all hover:shadow-lg ${
                    plan.id === 'intermediate'
                      ? 'border-primary border-2 scale-105'
                      : ''
                  } ${isCurrentPlan ? 'ring-2 ring-green-500' : ''}`}
                >
                  {plan.id === 'intermediate' && (
                    <div className="absolute top-0 right-0 bg-primary text-primary-foreground text-xs font-bold px-3 py-1 rounded-bl-lg">
                      Popular
                    </div>
                  )}

                  {isCurrentPlan && (
                    <div className="absolute top-0 left-0 bg-green-500 text-white text-xs font-bold px-3 py-1 rounded-br-lg">
                      Plano Atual
                    </div>
                  )}

                  <CardHeader className="text-center pb-2">
                    <div
                      className={`w-16 h-16 mx-auto mb-4 rounded-full bg-gradient-to-br ${planColors[plan.id]} flex items-center justify-center text-white`}
                    >
                      {planIcons[plan.id]}
                    </div>
                    <CardTitle className="text-2xl">{plan.name}</CardTitle>
                    <CardDescription>
                      Ate {plan.maxLists} listas
                    </CardDescription>
                  </CardHeader>

                  <CardContent className="text-center pb-4">
                    <div className="mb-6">
                      <span className="text-4xl font-black">
                        {plan.priceFormatted}
                      </span>
                      <span className="text-muted-foreground">/mes</span>
                    </div>

                    <ul className="space-y-3 text-sm text-left">
                      <li className="flex items-center gap-2">
                        <Check className="h-4 w-4 text-green-500 shrink-0" />
                        <span>Ate {plan.maxLists} listas simultaneas</span>
                      </li>
                      <li className="flex items-center gap-2">
                        <Check className="h-4 w-4 text-green-500 shrink-0" />
                        <span>Itens ilimitados por lista</span>
                      </li>
                      <li className="flex items-center gap-2">
                        <Check className="h-4 w-4 text-green-500 shrink-0" />
                        <span>Membros ilimitados</span>
                      </li>
                      <li className="flex items-center gap-2">
                        <Check className="h-4 w-4 text-green-500 shrink-0" />
                        <span>Compartilhamento via link</span>
                      </li>
                      <li className="flex items-center gap-2">
                        <Check className="h-4 w-4 text-green-500 shrink-0" />
                        <span>Suporte por email</span>
                      </li>
                    </ul>
                  </CardContent>

                  <CardFooter>
                    <Button
                      className="w-full"
                      size="lg"
                      variant={
                        plan.id === 'intermediate' ? 'default' : 'outline'
                      }
                      disabled={isCurrentPlan || isPending}
                      onClick={() => handleSelectPlan(plan.id)}
                    >
                      {isPending ? (
                        <Loader2 className="h-4 w-4 animate-spin mr-2" />
                      ) : null}
                      {isCurrentPlan ? 'Plano Atual' : 'Assinar'}
                    </Button>
                  </CardFooter>
                </Card>
              )
            })}
          </div>
        )}

        <div className="mt-10 text-center text-sm text-muted-foreground">
          <p>Pagamento seguro via PIX. Renovacao manual mensal.</p>
          <p className="mt-1">
            Duvidas? Acesse nossa{' '}
            <a href="/docs" className="text-primary hover:underline">
              documentacao
            </a>
          </p>
        </div>
      </main>
    </div>
  )
}
