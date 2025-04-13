'use client'

import { useState, FormEvent } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Input } from "@/components/ui/input"

interface CustomerFormValues {
  name: string
  email: string
  phone: string
  address: string
  postalCode: string
  city: string
}

export default function NyKunde() {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)
  const [formData, setFormData] = useState<CustomerFormValues>({
    name: '',
    email: '',
    phone: '',
    address: '',
    postalCode: '',
    city: ''
  })

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
  }

  async function onSubmit(e: FormEvent) {
    e.preventDefault()
    setIsLoading(true)
    try {
      // Hent eksisterende kunder eller start med tom array
      const existingCustomers = JSON.parse(localStorage.getItem('customers') || '[]')
      
      // Lag ny kunde med unik ID
      const newCustomer = {
        id: Date.now().toString(),
        ...formData
      }
      
      // Legg til ny kunde i listen
      const updatedCustomers = [...existingCustomers, newCustomer]
      
      // Lagre oppdatert liste
      localStorage.setItem('customers', JSON.stringify(updatedCustomers))
      
      alert('Kunden ble opprettet')
      router.push('/kunder')
    } catch (error) {
      alert('Kunne ikke opprette kunde')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="max-w-2xl mx-auto">
      <h1 className="text-2xl font-bold mb-6">Opprett ny kunde</h1>
      
      <Card className="p-6">
        <form onSubmit={onSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1">Navn</label>
            <Input 
              name="name"
              value={formData.name}
              onChange={handleChange}
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">E-post</label>
            <Input 
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Telefon</label>
            <Input 
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Adresse</label>
            <Input 
              name="address"
              value={formData.address}
              onChange={handleChange}
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-1">Postnummer</label>
              <Input 
                name="postalCode"
                value={formData.postalCode}
                onChange={handleChange}
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">Sted</label>
              <Input 
                name="city"
                value={formData.city}
                onChange={handleChange}
                required
              />
            </div>
          </div>

          <div className="flex justify-end space-x-4 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => router.back()}
            >
              Avbryt
            </Button>
            <Button
              type="submit"
              disabled={isLoading}
            >
              {isLoading ? "Oppretter..." : "Opprett kunde"}
            </Button>
          </div>
        </form>
      </Card>
    </div>
  )
} 