'use client'

import { useState, useEffect } from 'react'

interface Customer {
  etternavn: string
  adresse: string
  sted: string
  fornyelsesdato: string
}

export default function RecentCustomersWidget() {
  const [recentCustomers, setRecentCustomers] = useState<Customer[]>([])

  useEffect(() => {
    // Her kan du hente data fra din backend/database
    // For nå bruker vi eksempeldata
    const mockData: Customer[] = [
      {
        etternavn: "Hansen",
        adresse: "Testveien 1",
        sted: "Bergen",
        fornyelsesdato: "2024-03-20"
      },
      {
        etternavn: "Olsen",
        adresse: "Eksempelgata 2",
        sted: "Oslo",
        fornyelsesdato: "2024-03-19"
      },
      {
        etternavn: "Pedersen",
        adresse: "Søppelgata 3",
        sted: "Trondheim",
        fornyelsesdato: "2024-03-18"
      }
    ]
    setRecentCustomers(mockData)
  }, [])

  return (
    <div className="bg-white rounded-lg shadow-lg p-6">
      <h2 className="text-xl font-semibold mb-4">Siste oppdaterte kunder</h2>
      <div className="space-y-4">
        {recentCustomers.map((customer, index) => (
          <div key={index} className="border-b pb-3 last:border-b-0">
            <div className="flex justify-between items-start">
              <div>
                <h3 className="font-medium">{customer.etternavn}</h3>
                <p className="text-sm text-gray-600">{customer.adresse}, {customer.sted}</p>
              </div>
              <span className="text-sm text-gray-500">
                {new Date(customer.fornyelsesdato).toLocaleDateString('nb-NO')}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
} 