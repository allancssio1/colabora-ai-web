import { api } from '@/lib/api'
import type {
  SubscriptionPlan,
  SubscriptionStatus,
  CheckoutResponse,
  PaymentStatus,
  SubscriptionPlanType,
} from '@/types/subscription'

export const subscriptionService = {
  async getPlans(): Promise<{ plans: SubscriptionPlan[] }> {
    const response = await api.get('/subscription/plans')
    return response.data
  },

  async getStatus(): Promise<SubscriptionStatus> {
    const response = await api.get('/subscription/status')
    return response.data
  },

  async createCheckout(plan: SubscriptionPlanType): Promise<CheckoutResponse> {
    const response = await api.post('/subscription/checkout', { plan })
    return response.data
  },

  async getPaymentStatus(transactionId: string): Promise<PaymentStatus> {
    const response = await api.get(`/subscription/payment/${transactionId}`)
    return response.data
  },
}
