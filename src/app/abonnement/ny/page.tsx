'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Select, SelectItem } from "@/components/ui/select"

interface Customer {
  id: string
  name: string
  email: string
}

export default function NyttAbonnement() {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)
  const [customers, setCustomers] = useState<Customer[]>([])
  const [selectedCustomer, setSelectedCustomer] = useState<string>('')
  const [showFikenImport, setShowFikenImport] = useState(false)

  // Last inn eksisterende kunder
  useEffect(() => {
    const savedCustomers = JSON.parse(localStorage.getItem('customers') || '[]')
    setCustomers(savedCustomers)
  }, [])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    try {
      const formData = new FormData(e.target as HTMLFormElement)
      const subscription = {
        id: Date.now().toString(),
        customerId: formData.get('customerId'),
        startDate: formData.get('startDate'),
        type: formData.get('type'),
        price: parseFloat(formData.get('price') as string),
        billingInterval: formData.get('billingInterval'),
      }

      const existingSubscriptions = JSON.parse(localStorage.getItem('subscriptions') || '[]')
      localStorage.setItem('subscriptions', JSON.stringify([...existingSubscriptions, subscription]))

      alert('Abonnementet ble opprettet')
      router.push('/abonnement')
    } catch (error) {
      alert('Kunne ikke opprette abonnement')
    } finally {
      setIsLoading(false)
    }
  }

  const handleFikenImport = () => {
    // Simuler import fra Fiken
    alert('Fiken-integrasjon kommer snart!')
  }

  return (
    <div className="max-w-2xl mx-auto">
      <h1 className="text-2xl font-bold mb-6">Opprett nytt abonnement</h1>

      <div className="space-y-6">
        <Card className="p-6">
          <div className="space-y-4">
            <h2 className="text-lg font-semibold">Velg kunde</h2>
            
            <div className="flex space-x-4">
              <Button
                type="button"
                variant={!showFikenImport ? "default" : "outline"}
                onClick={() => setShowFikenImport(false)}
                className="flex-1"
              >
                Velg eksisterende kunde
              </Button>
              <Button
                type="button"
                variant={showFikenImport ? "default" : "outline"}
                onClick={() => setShowFikenImport(true)}
                className="flex-1"
              >
                Importer fra Fiken
              </Button>
            </div>

            {!showFikenImport ? (
              <div>
                <label className="block text-sm font-medium mb-1">Kunde</label>
                <Select 
                  name="customerId"
                  value={selectedCustomer}
                  onChange={(e) => setSelectedCustomer(e.target.value)}
                  required
                >
                  <option value="">Velg kunde...</option>
                  {customers.map((customer) => (
                    <SelectItem key={customer.id} value={customer.id}>
                      {customer.name}
                    </SelectItem>
                  ))}
                </Select>
              </div>
            ) : (
              <div className="space-y-4">
                <Input placeholder="Fiken API-nøkkel" type="password" />
                <Button onClick={handleFikenImport} className="w-full">
                  Koble til Fiken
                </Button>
              </div>
            )}
          </div>
        </Card>

        <Card className="p-6">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-1">Startdato</label>
              <Input type="date" name="startDate" required />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">Type abonnement</label>
              <Select name="type" defaultValue="standard" required>
                <option value="basic">Basis</option>
                <option value="standard">Standard</option>
                <option value="premium">Premium</option>
              </Select>
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">Månedspris (NOK)</label>
              <Input type="number" name="price" min="0" step="1" required />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">Fakturaintervall</label>
              <Select name="billingInterval" defaultValue="monthly" required>
                <option value="monthly">Månedlig</option>
                <option value="quarterly">Kvartalsvis</option>
                <option value="yearly">Årlig</option>
              </Select>
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
                disabled={isLoading || (!showFikenImport && !selectedCustomer)}
              >
                {isLoading ? "Oppretter..." : "Opprett abonnement"}
              </Button>
            </div>
          </form>
        </Card>
      </div>
    </div>
  )
} 