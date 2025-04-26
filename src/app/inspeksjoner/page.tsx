'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabase'
import { Button } from "@/components/ui/button"
import Link from "next/link"

interface Inspection {
  id: string
  customer_id: string
  customer_name: string
  customer_address: string
  inspection_date: string
  inspection_type: 'vårvedlikehold' | 'høstvedlikehold' | 'rehabilitering'
  status: 'planlagt' | 'utført'
  inspector: string
  notes: string
  roof_condition: string
  before_images?: string[]
  after_images?: string[]
  abonnementer?: {
    etternavn: string
  }
}

export default function InspeksjonerDashboard() {
  const router = useRouter()
  const [inspections, setInspections] = useState<Inspection[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  
  // Statistics
  const [stats, setStats] = useState({
    planned: 0,
    completed: 0,
    cancelled: 0
  })
  
  // Filters
  const [searchTerm, setSearchTerm] = useState('')
  const [typeFilter, setTypeFilter] = useState('all')
  const [statusFilter, setStatusFilter] = useState('all')
  
  useEffect(() => {
    fetchInspections()
  }, [])
  
  async function fetchInspections() {
    try {
      setLoading(true)
      
      // Fetch inspections with customer name from abonnementer
      const { data, error } = await supabase
        .from('inspections')
        .select(`
          *,
          abonnementer:customer_id (etternavn)
        `)
        .order('inspection_date', { ascending: false })
      
      if (error) {
        console.error('Error fetching inspections:', error)
        
        // Check if the error is because the table doesn't exist
        if (error.message.includes('relation "inspections" does not exist') || 
            error.message.includes('does not exist') ||
            error.code === '42P01') {
          console.log('Inspections table not found or not accessible yet')
          setInspections([])
          setStats({
            planned: 0,
            completed: 0,
            cancelled: 0
          })
        } else {
          setError('Kunne ikke hente inspeksjoner')
        }
        return
      }
      
      setInspections(data || [])
      
      // Calculate statistics
      if (data) {
        const planned = data.filter(i => i.status === 'planlagt').length
        const completed = data.filter(i => i.status === 'utført').length
        
        setStats({
          planned,
          completed,
          cancelled: 0 // Not used in this implementation
        })
      }
    } catch (err) {
      console.error('Unexpected error:', err)
      setError('En uventet feil oppstod')
    } finally {
      setLoading(false)
    }
  }
  
  // Filter inspections based on search term and filters
  const filteredInspections = inspections.filter(inspection => {
    // Search term filter
    const searchMatch = 
      (inspection.abonnementer?.etternavn || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
      inspection.customer_address.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (inspection.inspector && inspection.inspector.toLowerCase().includes(searchTerm.toLowerCase()))
    
    // Type filter
    const typeMatch = 
      typeFilter === 'all' || 
      inspection.inspection_type === typeFilter
    
    // Status filter
    const statusMatch = 
      statusFilter === 'all' || 
      inspection.status === statusFilter
    
    return searchMatch && typeMatch && statusMatch
  })
  
  // Handle inspection deletion
  const handleDeleteInspection = async (id: string) => {
    if (confirm('Er du sikker på at du vil slette denne inspeksjonen?')) {
      try {
        const { error } = await supabase
          .from('inspections')
          .delete()
          .eq('id', id)
        
        if (error) {
          console.error('Error deleting inspection:', error)
          return
        }
        
        // Refresh inspections
        fetchInspections()
      } catch (err) {
        console.error('Unexpected error:', err)
      }
    }
  }

  return (
    <div className="min-h-screen bg-gray-900 p-8 ml-64">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex justify-between items-center mb-12">
          <div>
            <h1 className="text-4xl font-bold text-white">Inspeksjoner</h1>
            <p className="text-gray-400 mt-2">Administrer inspeksjoner og rapporter</p>
          </div>
          <Link href="/inspeksjoner/ny">
            <button
              className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-full flex items-center gap-2 shadow-sm transition-all duration-200"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
              <span>Ny inspeksjon</span>
            </button>
          </Link>
        </div>

        {/* Statistikk-kort */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-gray-800 rounded-2xl p-6 border border-gray-700">
            <div className="flex items-center justify-between">
              <h3 className="text-gray-400">Planlagte inspeksjoner</h3>
              <div className="w-10 h-10 rounded-full bg-blue-900/50 flex items-center justify-center">
                <svg className="w-5 h-5 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
              </div>
            </div>
            <p className="text-2xl font-bold text-white mt-2">
              {loading ? (
                <span className="inline-block w-8 h-6 bg-gray-700 animate-pulse rounded"></span>
              ) : (
                stats.planned
              )}
            </p>
          </div>

          <div className="bg-gray-800 rounded-2xl p-6 border border-gray-700">
            <div className="flex items-center justify-between">
              <h3 className="text-gray-400">Utførte inspeksjoner</h3>
              <div className="w-10 h-10 rounded-full bg-green-900/50 flex items-center justify-center">
                <svg className="w-5 h-5 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </div>
            </div>
            <p className="text-2xl font-bold text-white mt-2">
              {loading ? (
                <span className="inline-block w-8 h-6 bg-gray-700 animate-pulse rounded"></span>
              ) : (
                stats.completed
              )}
            </p>
          </div>

          <div className="bg-gray-800 rounded-2xl p-6 border border-gray-700">
            <div className="flex items-center justify-between">
              <h3 className="text-gray-400">Totalt antall inspeksjoner</h3>
              <div className="w-10 h-10 rounded-full bg-purple-900/50 flex items-center justify-center">
                <svg className="w-5 h-5 text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                </svg>
              </div>
            </div>
            <p className="text-2xl font-bold text-white mt-2">
              {loading ? (
                <span className="inline-block w-8 h-6 bg-gray-700 animate-pulse rounded"></span>
              ) : (
                inspections.length
              )}
            </p>
          </div>
        </div>

        {/* Filtrering og søk */}
        <div className="bg-gray-800 rounded-2xl p-6 mb-8 border border-gray-700">
          <div className="flex flex-wrap gap-4">
            <input
              type="text"
              placeholder="Søk etter kunde eller inspektør..."
              className="flex-1 min-w-[200px] rounded-xl border-gray-700 focus:ring-blue-500 focus:border-blue-500 bg-gray-700 text-gray-300"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <select 
              className="rounded-xl border-gray-700 focus:ring-blue-500 focus:border-blue-500 bg-gray-700 text-gray-300"
              value={typeFilter}
              onChange={(e) => setTypeFilter(e.target.value)}
            >
              <option value="all">Alle typer</option>
              <option value="vårvedlikehold">Vårvedlikehold</option>
              <option value="høstvedlikehold">Høstvedlikehold</option>
              <option value="rehabilitering">Rehabilitering</option>
            </select>
            <select 
              className="rounded-xl border-gray-700 focus:ring-blue-500 focus:border-blue-500 bg-gray-700 text-gray-300"
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
            >
              <option value="all">Alle status</option>
              <option value="planlagt">Planlagt</option>
              <option value="utført">Utført</option>
            </select>
          </div>
        </div>

        {/* Inspeksjonsliste */}
        {loading ? (
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white mx-auto"></div>
            <p className="mt-4 text-gray-400">Laster inspeksjoner...</p>
          </div>
        ) : error ? (
          <div className="bg-red-900/20 text-red-400 p-6 rounded-xl text-center">
            {error}
          </div>
        ) : filteredInspections.length === 0 ? (
          <div className="bg-gray-800 rounded-2xl border border-gray-700 p-12 text-center">
            <p className="text-gray-400">Ingen inspeksjoner funnet</p>
            <Link href="/inspeksjoner/ny">
              <button className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
                Opprett ny inspeksjon
              </button>
            </Link>
          </div>
        ) : (
          <div className="bg-gray-800 rounded-2xl border border-gray-700 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-gray-700">
                    <th className="px-6 py-4 text-left text-sm font-medium text-gray-400">Kunde</th>
                    <th className="px-6 py-4 text-left text-sm font-medium text-gray-400">Dato</th>
                    <th className="px-6 py-4 text-left text-sm font-medium text-gray-400">Type</th>
                    <th className="px-6 py-4 text-left text-sm font-medium text-gray-400">Status</th>
                    <th className="px-6 py-4 text-left text-sm font-medium text-gray-400">Inspektør</th>
                    <th className="px-6 py-4 text-right text-sm font-medium text-gray-400">Handling</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-700">
                  {filteredInspections.map(inspection => (
                    <tr key={inspection.id} className="hover:bg-gray-700/50">
                      <td className="px-6 py-4">
                        <div className="text-white">{inspection.abonnementer?.etternavn || inspection.customer_name || 'Ukjent kunde'}</div>
                        <div className="text-sm text-gray-400">{inspection.customer_address}</div>
                        {/* Før/etter-bilder */}
                        <div className="flex gap-2 mt-2">
                          {inspection.before_images && inspection.before_images.length > 0 && (
                            <div>
                              <div className="text-xs text-gray-400">Før</div>
                              <div className="flex gap-1">
                                {inspection.before_images.slice(0,2).map((url, idx) => (
                                  <img key={idx} src={url} alt="Før-bilde" className="w-10 h-10 object-cover rounded" />
                                ))}
                              </div>
                            </div>
                          )}
                          {inspection.after_images && inspection.after_images.length > 0 && (
                            <div>
                              <div className="text-xs text-gray-400">Etter</div>
                              <div className="flex gap-1">
                                {inspection.after_images.slice(0,2).map((url, idx) => (
                                  <img key={idx} src={url} alt="Etter-bilde" className="w-10 h-10 object-cover rounded" />
                                ))}
                              </div>
                            </div>
                          )}
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="text-white">
                          {new Date(inspection.inspection_date).toLocaleDateString('nb-NO')}
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                          inspection.inspection_type === 'vårvedlikehold'
                            ? 'bg-green-900/50 text-green-400'
                            : inspection.inspection_type === 'høstvedlikehold'
                            ? 'bg-yellow-900/50 text-yellow-400'
                            : 'bg-blue-900/50 text-blue-400'
                        }`}>
                          {inspection.inspection_type}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                          inspection.status === 'planlagt'
                            ? 'bg-yellow-900/50 text-yellow-400'
                            : 'bg-green-900/50 text-green-400'
                        }`}>
                          {inspection.status}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <div className="text-white">{inspection.inspector || '-'}</div>
                      </td>
                      <td className="px-6 py-4 text-right">
                        <div className="text-white flex justify-end">
                          <Link href={`/inspeksjoner/${inspection.id}`} className="text-blue-400 hover:text-blue-500 mr-4">
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.478 0-8.268-2.943-9.542-7z" />
                            </svg>
                          </Link>
                          <button 
                            className="text-red-400 hover:text-red-500"
                            onClick={() => handleDeleteInspection(inspection.id)}
                          >
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
        )}
      </div>
    </div>
  )
}
