export type RepeatInterval = 'never' | 'daily' | 'weekly' | 'monthly' | 'yearly'

export interface MaintenanceTask {
  id: string
  title: string
  description: string
  customerId: string
  customerName: string
  address: string
  startDate: Date
  endDate: Date
  type: 'vedlikehold' | 'inspeksjon' | 'annet'
  status: 'planlagt' | 'pågående' | 'fullført' | 'kansellert'
  repeatInterval: RepeatInterval
  repeatUntil?: Date
  notifications: {
    customer: boolean
    worker: boolean
    reminderDays: number // Dager før oppgaven
  }
} 