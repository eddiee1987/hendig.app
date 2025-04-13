export interface Customer {
  id: string
  name: string
  address: string
  postalCode: string
  city: string
  phone: string
  email: string
  hasActiveSubscription: boolean
  nextInspection?: Date
}

export interface Subscription {
  id: string
  customerId: string
  startDate: Date
  endDate?: Date
  type: 'basic' | 'premium'
  status: 'active' | 'pending' | 'cancelled'
  price: number
}

export interface Inspection {
  id: string
  customerId: string
  date: Date
  status: 'scheduled' | 'completed' | 'cancelled'
  notes?: string
  images?: string[]
} 