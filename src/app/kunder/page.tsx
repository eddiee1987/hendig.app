'use client'

import { useState } from 'react'

interface Customer {
  id: string
  name: string
  email: string
  phone: string
  address: string
  status: 'active' | 'inactive'
}

export default function KunderPage() {
  const [customers, setCustomers] = useState<Customer[]>([
    {
      id: '1',
      name: 'Acme AS',
      email: 'kontakt@acme.no',
      phone: '123 45 678',
      address: 'Storgata 1, 0123 Oslo',
      status: 'active'
    },
    // ... flere kunder
  ])

  const [showAddModal, setShowAddModal] = useState(false)
  const [newCustomer, setNewCustomer] = useState<Partial<Customer>>({})

  return (
    <div className="min-h-screen bg-gray-900 p-8 ml-64">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex justify-between items-center mb-12">
          <div>
            <h1 className="text-4xl font-bold text-white">Kunder</h1>
            <p className="text-gray-400 mt-2">Administrer kundelisten</p>
          </div>
          <button
            onClick={() => setShowAddModal(true)}
            className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-full flex items-center gap-2 shadow-sm transition-all duration-200"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
            <span>Ny kunde</span>
          </button>
        </div>

        {/* Søk og filtrering */}
        <div className="bg-gray-800 rounded-2xl p-6 mb-8 border border-gray-700">
          <div className="flex flex-wrap gap-4">
            <input
              type="text"
              placeholder="Søk etter kunde..."
              className="flex-1 min-w-[200px] rounded-xl border-gray-700 focus:ring-blue-500 focus:border-blue-500 bg-gray-700 text-gray-300"
            />
            <select className="rounded-xl border-gray-700 focus:ring-blue-500 focus:border-blue-500 bg-gray-700 text-gray-300">
              <option value="all">Alle kunder</option>
              <option value="active">Aktive</option>
              <option value="inactive">Inaktive</option>
            </select>
          </div>
        </div>

        {/* Kundeliste */}
        <div className="bg-gray-800 rounded-2xl border border-gray-700 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-700">
                  <th className="px-6 py-4 text-left text-sm font-medium text-gray-400">Kunde</th>
                  <th className="px-6 py-4 text-left text-sm font-medium text-gray-400">Kontakt</th>
                  <th className="px-6 py-4 text-left text-sm font-medium text-gray-400">Status</th>
                  <th className="px-6 py-4 text-right text-sm font-medium text-gray-400">Handling</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-700">
                {customers.map(customer => (
                  <tr key={customer.id} className="hover:bg-gray-700/50">
                    <td className="px-6 py-4">
                      <div className="text-white font-medium">{customer.name}</div>
                      <div className="text-sm text-gray-400">{customer.address}</div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-white">{customer.email}</div>
                      <div className="text-sm text-gray-400">{customer.phone}</div>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                        customer.status === 'active'
                          ? 'bg-green-900/50 text-green-400'
                          : 'bg-red-900/50 text-red-400'
                      }`}>
                        {customer.status === 'active' ? 'Aktiv' : 'Inaktiv'}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex justify-end gap-2">
                        <button className="text-blue-400 hover:text-blue-300">
                          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                          </svg>
                        </button>
                        <button className="text-red-400 hover:text-red-300">
                          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                          </svg>
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Modal for å legge til ny kunde */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center">
          <div className="bg-gray-800 rounded-2xl p-8 max-w-md w-full mx-4">
            <h2 className="text-2xl font-semibold text-white mb-6">Ny kunde</h2>
            <form className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-400 mb-2">Kundenavn</label>
                <input
                  type="text"
                  className="w-full rounded-xl border-gray-700 focus:ring-blue-500 focus:border-blue-500 bg-gray-700 text-gray-300"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-400 mb-2">E-post</label>
                <input
                  type="email"
                  className="w-full rounded-xl border-gray-700 focus:ring-blue-500 focus:border-blue-500 bg-gray-700 text-gray-300"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-400 mb-2">Telefon</label>
                <input
                  type="tel"
                  className="w-full rounded-xl border-gray-700 focus:ring-blue-500 focus:border-blue-500 bg-gray-700 text-gray-300"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-400 mb-2">Adresse</label>
                <textarea
                  className="w-full rounded-xl border-gray-700 focus:ring-blue-500 focus:border-blue-500 bg-gray-700 text-gray-300"
                  rows={3}
                />
              </div>
              <div className="flex justify-end gap-4 mt-6">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-4 py-2 text-gray-400 hover:text-white"
                >
                  Avbryt
                </button>
                <button
                  type="submit"
                  className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-xl"
                >
                  Lagre
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
} 