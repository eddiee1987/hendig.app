export interface FikenCustomer {
  customerNumber: string
  name: string
  email: string
  organizationNumber?: string
  phoneNumber?: string
  postalAddress?: {
    address: string
    postalCode: string
    city: string
    country: string
  }
}

export interface FikenApiResponse {
  success: boolean
  data?: FikenCustomer[]
  error?: string
} 