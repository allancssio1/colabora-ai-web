export type SubscriptionPlanType = 'basic' | 'intermediate' | 'max'

export interface SubscriptionPlan {
  id: SubscriptionPlanType
  name: string
  price: number
  priceFormatted: string
  maxLists: number
}

export interface SubscriptionStatus {
  plan: SubscriptionPlanType | null
  planName: string | null
  status: 'none' | 'active' | 'expired'
  expiresAt: string | null
  listsCount: number
  listsLimit: number
  canCreateList: boolean
}

export interface CheckoutResponse {
  subscriptionId: string
  transactionId: string
  pix: {
    brCode: string
    brCodeBase64: string
    amount: number
    expiresAt: string
  }
}

export interface PaymentStatus {
  status: 'PENDING' | 'PAID' | 'EXPIRED' | 'CANCELLED'
  paidAt: string | null
  subscriptionActivated: boolean
}
