'use client'

import { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabase'
import AbonnementImport from '@/components/AbonnementImport'

interface AbonnementData {
  id?: string
  etternavn: string
  adresse: string
  sted: string
  kommune: string
  var: string
  host: string
  epost: string
  fakturert: string
  mail_var: string
  mail_host: string
  tidsbruk_slatt: string
  fornyelsesdato: string
  sum: string
  notat: string
  tak_storrelse?: string
}

interface DuplicateWarning {
  customer: AbonnementData
  existingCustomer: AbonnementData
  reason: string
}

interface Betaling {
  dato: string
  belop: number
  status: 'betalt' | 'ubetalt' | 'forsinket'
}

interface Inspeksjon {
  dato: string
  utfort_av: string
  kommentar: string
  status: 'godkjent' | 'mangler'
}

interface Besok {
  dato: string
  ansatt: string
  varighet: string
  kommentar: string
}

interface NyKundeForm {
  etternavn: string
  adresse: string
  kommune: string
  fornyelsesdato: string
  tak_storrelse: string
}

export default function Abonnement() {
  const [abonnementer, setAbonnementer] = useState<AbonnementData[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [visNyKundeSkjema, setVisNyKundeSkjema] = useState(false)
  const [nyKunde, setNyKunde] = useState<NyKundeForm>({
    etternavn: '',
    adresse: '',
    kommune: '',
    fornyelsesdato: '',
    tak_storrelse: ''
  })
  const [submitStatus, setSubmitStatus] = useState<string>('')
  
  // Customer detail view state
  const [selectedCustomer, setSelectedCustomer] = useState<AbonnementData | null>(null)
  const [activeTab, setActiveTab] = useState<'betalinger' | 'inspeksjoner' | 'besok' | 'kontakt'>('kontakt')
  const [editMode, setEditMode] = useState(false)
  const [editedCustomer, setEditedCustomer] = useState<AbonnementData | null>(null)
  
  // Multi-select and delete state
  const [selectedCustomers, setSelectedCustomers] = useState<string[]>([])
  const [bulkDeleteMode, setBulkDeleteMode] = useState(false)
  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false)
  
  // Duplicate verification state
  const [duplicateWarnings] = useState<DuplicateWarning[]>([])
  const [showDuplicateWarnings, setShowDuplicateWarnings] = useState(false)
  
  // Mock data for customer details
  const [mockBetalinger] = useState<Betaling[]>([
    { dato: '2025-01-15', belop: 2500, status: 'betalt' },
    { dato: '2024-07-20', belop: 2500, status: 'betalt' },
    { dato: '2024-01-15', belop: 2300, status: 'betalt' },
    { dato: '2023-07-20', belop: 2300, status: 'betalt' }
  ])
  
  const [mockInspeksjoner] = useState<Inspeksjon[]>([
    { dato: '2025-03-10', utfort_av: 'Ole Hansen', kommentar: 'Alt ser bra ut', status: 'godkjent' },
    { dato: '2024-09-05', utfort_av: 'Kari Olsen', kommentar: 'Noen områder trenger ekstra vedlikehold', status: 'mangler' },
    { dato: '2024-03-12', utfort_av: 'Ole Hansen', kommentar: 'Fikset mangler fra forrige inspeksjon', status: 'godkjent' },
    { dato: '2023-09-08', utfort_av: 'Kari Olsen', kommentar: 'Alt ser bra ut', status: 'godkjent' }
  ])
  
  const [mockBesok] = useState<Besok[]>([
    { dato: '2025-03-10', ansatt: 'Ole Hansen', varighet: '2 timer', kommentar: 'Vanlig vedlikehold' },
    { dato: '2024-09-05', ansatt: 'Kari Olsen', varighet: '3 timer', kommentar: 'Ekstra arbeid på nordside' },
    { dato: '2024-03-12', ansatt: 'Ole Hansen', varighet: '2 timer', kommentar: 'Vanlig vedlikehold' },
    { dato: '2023-09-08', ansatt: 'Kari Olsen', varighet: '2 timer', kommentar: 'Vanlig vedlikehold' }
  ])

  useEffect(() => {
    fetchAbonnementer()
  }, [])

  async function fetchAbonnementer(searchTerm?: string) {
    try {
      console.log('Henter abonnementer...')
      let query = supabase
        .from('abonnementer')
        .select('*')

      if (searchTerm) {
        query = query.or(
          `etternavn.ilike.%${searchTerm}%,adresse.ilike.%${searchTerm}%,kommune.ilike.%${searchTerm}%`
        )
      }

      const { data, error } = await query
      
      if (error) {
        console.error('Supabase error:', error)
        throw error
      }
      
      console.log('Mottatt data:', data)
      setAbonnementer(data || [])
    } catch (error) {
      console.error('Fetch error:', error)
      setError('Kunne ikke hente abonnementer')
    } finally {
      setLoading(false)
    }
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setNyKunde(prev => ({
      ...prev,
      [name]: value
    }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    try {
      setSubmitStatus('Lagrer ny kunde...')
      
      // Prepare data for insertion
      const nyKundeData = {
        etternavn: nyKunde.etternavn,
        adresse: nyKunde.adresse,
        kommune: nyKunde.kommune,
        fornyelsesdato: nyKunde.fornyelsesdato,
        tak_storrelse: nyKunde.tak_storrelse,
        // Set default values for required fields
        sted: '',
        var: '',
        host: '',
        epost: '',
        fakturert: '',
        mail_var: '',
        mail_host: '',
        tidsbruk_slatt: '',
        sum: '',
        notat: ''
      }
      
      const { error } = await supabase
        .from('abonnementer')
        .insert([nyKundeData])
      
      if (error) {
        console.error('Supabase insert error:', error)
        throw error
      }
      
      // Reset form and refresh data
      setNyKunde({
        etternavn: '',
        adresse: '',
        kommune: '',
        fornyelsesdato: '',
        tak_storrelse: ''
      })
      setSubmitStatus('Kunde lagt til!')
      setVisNyKundeSkjema(false)
      fetchAbonnementer()
      
      // Clear status message after 3 seconds
      setTimeout(() => {
        setSubmitStatus('')
      }, 3000)
      
    } catch (error) {
      console.error('Submit error:', error)
      setSubmitStatus('Kunne ikke lagre ny kunde')
    }
  }


  if (loading) return (
    <div className="text-center text-white">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white mx-auto"></div>
      <p className="mt-4">Laster abonnementer...</p>
    </div>
  )

  return (
    <div>
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold text-white mb-4">Vedlikeholdsabonnementer</h1>
        <p className="text-gray-400">Administrer torvtak vedlikeholdsabonnementer</p>
      </div>

      {/* Import seksjon */}
      <div className="mb-8">
        <AbonnementImport onImportSuccess={fetchAbonnementer} />
      </div>

      {/* Abonnementsliste */}
      <div className="bg-gray-800 rounded-xl p-6 border border-gray-700">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold text-white">
            {error ? 'Feil ved lasting av abonnementer' : 'Abonnementer'}
          </h2>
          <div className="relative w-64">
            <input
              type="text"
              placeholder="Søk i kunder..."
              className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
              onChange={(e) => {
                const searchTerm = e.target.value.toLowerCase()
                fetchAbonnementer(searchTerm)
              }}
            />
            <svg
              className="absolute right-3 top-2.5 h-5 w-5 text-gray-400"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
              />
            </svg>
          </div>
          <div className="flex space-x-2">
            {bulkDeleteMode ? (
              <>
                <button 
                  className={`px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors flex items-center ${selectedCustomers.length === 0 ? 'opacity-50 cursor-not-allowed' : ''}`}
                  onClick={() => {
                    if (selectedCustomers.length > 0) {
                      setDeleteConfirmOpen(true)
                    }
                  }}
                  disabled={selectedCustomers.length === 0}
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                  </svg>
                  Slett ({selectedCustomers.length})
                </button>
                <button 
                  className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors"
                  onClick={() => {
                    setBulkDeleteMode(false)
                    setSelectedCustomers([])
                  }}
                >
                  Avbryt
                </button>
              </>
            ) : (
              <>
                <button 
                  className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors flex items-center"
                  onClick={() => setBulkDeleteMode(true)}
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                  </svg>
                  Slett kunder
                </button>
                <button 
                  className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors flex items-center"
                  onClick={() => setVisNyKundeSkjema(true)}
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                  </svg>
                  Legg til ny kunde
                </button>
              </>
            )}
          </div>
        </div>
        {error ? (
          <p className="text-red-500">{error}</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="text-left text-gray-400 border-b border-gray-700">
                  {bulkDeleteMode && (
                    <th className="pb-3 w-10">
                      <input 
                        type="checkbox" 
                        className="w-4 h-4 rounded border-gray-600 bg-gray-700 text-blue-600 focus:ring-blue-500"
                        onChange={(e) => {
                          if (e.target.checked) {
                            // Select all
                            setSelectedCustomers(abonnementer.filter(a => a.id).map(a => a.id as string))
                          } else {
                            // Deselect all
                            setSelectedCustomers([])
                          }
                        }}
                        checked={selectedCustomers.length === abonnementer.filter(a => a.id).length && abonnementer.length > 0}
                      />
                    </th>
                  )}
                  <th className="pb-3">Navn</th>
                  <th className="pb-3">Adresse</th>
                  <th className="pb-3">Kommune</th>
                  <th className="pb-3">Vår</th>
                  <th className="pb-3">Høst</th>
                  <th className="pb-3">Fornyelsesdato</th>
                  <th className="pb-3">Status</th>
                </tr>
              </thead>
              <tbody>
                {abonnementer.map((abonnement, index) => (
                  <tr 
                    key={index} 
                    className="border-b border-gray-700 text-gray-300 hover:bg-gray-700 cursor-pointer transition-colors"
                    onClick={(e) => {
                      if (bulkDeleteMode) {
                        // Don't open customer detail in bulk delete mode unless clicking checkbox
                        const target = e.target as HTMLElement
                        if (target.tagName !== 'INPUT') {
                          e.preventDefault()
                          // Toggle selection
                          if (abonnement.id) {
                            if (selectedCustomers.includes(abonnement.id)) {
                              setSelectedCustomers(prev => prev.filter(id => id !== abonnement.id))
                            } else {
                              setSelectedCustomers(prev => [...prev, abonnement.id as string])
                            }
                          }
                        }
                      } else {
                        setSelectedCustomer(abonnement)
                      }
                    }}
                  >
                    {bulkDeleteMode && (
                      <td className="py-3 pl-3">
                        <input 
                          type="checkbox" 
                          className="w-4 h-4 rounded border-gray-600 bg-gray-700 text-blue-600 focus:ring-blue-500"
                          checked={abonnement.id ? selectedCustomers.includes(abonnement.id) : false}
                          onChange={(e) => {
                            if (abonnement.id) {
                              if (e.target.checked) {
                                setSelectedCustomers(prev => [...prev, abonnement.id as string])
                              } else {
                                setSelectedCustomers(prev => prev.filter(id => id !== abonnement.id))
                              }
                            }
                          }}
                          onClick={(e) => e.stopPropagation()}
                        />
                      </td>
                    )}
                    <td className="py-3">{abonnement.etternavn}</td>
                    <td className="py-3">{abonnement.adresse}</td>
                    <td className="py-3">{abonnement.kommune || '-'}</td>
                    <td className="py-3">{abonnement.var}</td>
                    <td className="py-3">{abonnement.host}</td>
                    <td className="py-3">{abonnement.fornyelsesdato}</td>
                    <td className="py-3">
                      <span className="px-2 py-1 text-xs rounded-full bg-green-900/20 text-green-400">
                        Aktiv
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Customer detail modal */}
      {selectedCustomer && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-gray-800 rounded-xl p-6 border border-gray-700 w-full max-w-4xl max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-xl font-semibold text-white">{selectedCustomer.etternavn}</h3>
              <button 
                onClick={() => setSelectedCustomer(null)}
                className="text-gray-400 hover:text-white"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            
            {/* Tabs */}
            <div className="flex border-b border-gray-700 mb-6">
              <button
                className={`px-4 py-2 font-medium ${activeTab === 'betalinger' ? 'text-blue-400 border-b-2 border-blue-400' : 'text-gray-400 hover:text-gray-300'}`}
                onClick={() => setActiveTab('betalinger')}
              >
                Betalinger
              </button>
              <button
                className={`px-4 py-2 font-medium ${activeTab === 'inspeksjoner' ? 'text-blue-400 border-b-2 border-blue-400' : 'text-gray-400 hover:text-gray-300'}`}
                onClick={() => setActiveTab('inspeksjoner')}
              >
                Inspeksjoner
              </button>
              <button
                className={`px-4 py-2 font-medium ${activeTab === 'besok' ? 'text-blue-400 border-b-2 border-blue-400' : 'text-gray-400 hover:text-gray-300'}`}
                onClick={() => setActiveTab('besok')}
              >
                Besøk
              </button>
              <button
                className={`px-4 py-2 font-medium ${activeTab === 'kontakt' ? 'text-blue-400 border-b-2 border-blue-400' : 'text-gray-400 hover:text-gray-300'}`}
                onClick={() => setActiveTab('kontakt')}
              >
                Kontaktinfo
              </button>
            </div>
            
            {/* Tab content */}
            <div>
              {/* Betalinger tab */}
              {activeTab === 'betalinger' && (
                <div>
                  <div className="flex justify-between items-center mb-4">
                    <h4 className="text-lg font-medium text-white">Betalingshistorikk</h4>
                    <button className="px-3 py-1 bg-blue-600 text-white rounded hover:bg-blue-700 text-sm">
                      Registrer ny betaling
                    </button>
                  </div>
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead>
                        <tr className="text-left text-gray-400 border-b border-gray-700">
                          <th className="pb-2">Dato</th>
                          <th className="pb-2">Beløp</th>
                          <th className="pb-2">Status</th>
                        </tr>
                      </thead>
                      <tbody>
                        {mockBetalinger.map((betaling, index) => (
                          <tr key={index} className="border-b border-gray-700 text-gray-300">
                            <td className="py-3">{betaling.dato}</td>
                            <td className="py-3">{betaling.belop} kr</td>
                            <td className="py-3">
                              <span className={`px-2 py-1 text-xs rounded-full ${
                                betaling.status === 'betalt' 
                                  ? 'bg-green-900/20 text-green-400' 
                                  : betaling.status === 'ubetalt' 
                                    ? 'bg-yellow-900/20 text-yellow-400'
                                    : 'bg-red-900/20 text-red-400'
                              }`}>
                                {betaling.status === 'betalt' ? 'Betalt' : betaling.status === 'ubetalt' ? 'Ubetalt' : 'Forsinket'}
                              </span>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}
              
              {/* Inspeksjoner tab */}
              {activeTab === 'inspeksjoner' && (
                <div>
                  <div className="flex justify-between items-center mb-4">
                    <h4 className="text-lg font-medium text-white">Inspeksjonshistorikk</h4>
                    <button className="px-3 py-1 bg-blue-600 text-white rounded hover:bg-blue-700 text-sm">
                      Registrer ny inspeksjon
                    </button>
                  </div>
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead>
                        <tr className="text-left text-gray-400 border-b border-gray-700">
                          <th className="pb-2">Dato</th>
                          <th className="pb-2">Utført av</th>
                          <th className="pb-2">Kommentar</th>
                          <th className="pb-2">Status</th>
                        </tr>
                      </thead>
                      <tbody>
                        {mockInspeksjoner.map((inspeksjon, index) => (
                          <tr key={index} className="border-b border-gray-700 text-gray-300">
                            <td className="py-3">{inspeksjon.dato}</td>
                            <td className="py-3">{inspeksjon.utfort_av}</td>
                            <td className="py-3">{inspeksjon.kommentar}</td>
                            <td className="py-3">
                              <span className={`px-2 py-1 text-xs rounded-full ${
                                inspeksjon.status === 'godkjent' 
                                  ? 'bg-green-900/20 text-green-400' 
                                  : 'bg-yellow-900/20 text-yellow-400'
                              }`}>
                                {inspeksjon.status === 'godkjent' ? 'Godkjent' : 'Mangler'}
                              </span>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}
              
              {/* Besøk tab */}
              {activeTab === 'besok' && (
                <div>
                  <div className="flex justify-between items-center mb-4">
                    <h4 className="text-lg font-medium text-white">Besøkshistorikk</h4>
                    <button className="px-3 py-1 bg-blue-600 text-white rounded hover:bg-blue-700 text-sm">
                      Registrer nytt besøk
                    </button>
                  </div>
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead>
                        <tr className="text-left text-gray-400 border-b border-gray-700">
                          <th className="pb-2">Dato</th>
                          <th className="pb-2">Ansatt</th>
                          <th className="pb-2">Varighet</th>
                          <th className="pb-2">Kommentar</th>
                        </tr>
                      </thead>
                      <tbody>
                        {mockBesok.map((besok, index) => (
                          <tr key={index} className="border-b border-gray-700 text-gray-300">
                            <td className="py-3">{besok.dato}</td>
                            <td className="py-3">{besok.ansatt}</td>
                            <td className="py-3">{besok.varighet}</td>
                            <td className="py-3">{besok.kommentar}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}
              
              {/* Kontaktinfo tab */}
              {activeTab === 'kontakt' && (
                <div>
                  <div className="flex justify-between items-center mb-4">
                    <h4 className="text-lg font-medium text-white">Kontaktinformasjon</h4>
                    {!editMode ? (
                      <button 
                        className="px-3 py-1 bg-blue-600 text-white rounded hover:bg-blue-700 text-sm"
                        onClick={() => {
                          setEditMode(true)
                          setEditedCustomer(selectedCustomer)
                        }}
                      >
                        Rediger
                      </button>
                    ) : (
                      <div className="flex space-x-2">
                        <button 
                          className="px-3 py-1 bg-gray-600 text-white rounded hover:bg-gray-700 text-sm"
                          onClick={() => {
                            setEditMode(false)
                            setEditedCustomer(null)
                          }}
                        >
                          Avbryt
                        </button>
                        <button 
                          className="px-3 py-1 bg-green-600 text-white rounded hover:bg-green-700 text-sm"
                          onClick={async () => {
                            if (!editedCustomer) return;
                            
                            try {
                              const { error } = await supabase
                                .from('abonnementer')
                                .update({
                                  etternavn: editedCustomer.etternavn,
                                  adresse: editedCustomer.adresse,
                                  kommune: editedCustomer.kommune,
                                  epost: editedCustomer.epost,
                                  fornyelsesdato: editedCustomer.fornyelsesdato,
                                  tak_storrelse: editedCustomer.tak_storrelse,
                                  notat: editedCustomer.notat
                                })
                                .eq('id', editedCustomer.id)
                              
                              if (error) {
                                console.error('Update error:', error)
                                throw error
                              }
                              
                              // Update the selected customer with the edited values
                              setSelectedCustomer(editedCustomer)
                              setEditMode(false)
                              
                              // Refresh the subscription list
                              fetchAbonnementer()
                            } catch (error) {
                              console.error('Update error:', error)
                              // Show error message
                            }
                          }}
                        >
                          Lagre
                        </button>
                      </div>
                    )}
                  </div>
                  
                  {!editMode ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <h5 className="text-sm font-medium text-gray-400 mb-1">Navn</h5>
                        <p className="text-white">{selectedCustomer.etternavn}</p>
                      </div>
                      <div>
                        <h5 className="text-sm font-medium text-gray-400 mb-1">Adresse</h5>
                        <p className="text-white">{selectedCustomer.adresse}</p>
                      </div>
                      <div>
                        <h5 className="text-sm font-medium text-gray-400 mb-1">Kommune</h5>
                        <p className="text-white">{selectedCustomer.kommune || '-'}</p>
                      </div>
                      <div>
                        <h5 className="text-sm font-medium text-gray-400 mb-1">E-post</h5>
                        <p className="text-white">{selectedCustomer.epost || '-'}</p>
                      </div>
                      <div>
                        <h5 className="text-sm font-medium text-gray-400 mb-1">Fornyelsesdato</h5>
                        <p className="text-white">{selectedCustomer.fornyelsesdato || '-'}</p>
                      </div>
                      <div>
                        <h5 className="text-sm font-medium text-gray-400 mb-1">Takstørrelse</h5>
                        <p className="text-white">{selectedCustomer.tak_storrelse || '-'}</p>
                      </div>
                      <div className="md:col-span-2">
                        <h5 className="text-sm font-medium text-gray-400 mb-1">Notat</h5>
                        <p className="text-white">{selectedCustomer.notat || '-'}</p>
                      </div>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      <div>
                        <label htmlFor="edit-etternavn" className="block text-sm font-medium text-gray-400 mb-1">
                          Navn
                        </label>
                        <input
                          type="text"
                          id="edit-etternavn"
                          value={editedCustomer?.etternavn || ''}
                          onChange={(e) => {
                            if (editedCustomer) {
                              setEditedCustomer({
                                ...editedCustomer,
                                etternavn: e.target.value
                              })
                            }
                          }}
                          className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                      </div>
                      
                      <div>
                        <label htmlFor="edit-adresse" className="block text-sm font-medium text-gray-400 mb-1">
                          Adresse
                        </label>
                        <input
                          type="text"
                          id="edit-adresse"
                          value={editedCustomer?.adresse || ''}
                          onChange={(e) => {
                            if (editedCustomer) {
                              setEditedCustomer({
                                ...editedCustomer,
                                adresse: e.target.value
                              })
                            }
                          }}
                          className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                      </div>
                      
                      <div>
                        <label htmlFor="edit-kommune" className="block text-sm font-medium text-gray-400 mb-1">
                          Kommune
                        </label>
                        <input
                          type="text"
                          id="edit-kommune"
                          value={editedCustomer?.kommune || ''}
                          onChange={(e) => {
                            if (editedCustomer) {
                              setEditedCustomer({
                                ...editedCustomer,
                                kommune: e.target.value
                              })
                            }
                          }}
                          className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                      </div>
                      
                      <div>
                        <label htmlFor="edit-epost" className="block text-sm font-medium text-gray-400 mb-1">
                          E-post
                        </label>
                        <input
                          type="email"
                          id="edit-epost"
                          value={editedCustomer?.epost || ''}
                          onChange={(e) => {
                            if (editedCustomer) {
                              setEditedCustomer({
                                ...editedCustomer,
                                epost: e.target.value
                              })
                            }
                          }}
                          className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                      </div>
                      
                      <div>
                        <label htmlFor="edit-fornyelsesdato" className="block text-sm font-medium text-gray-400 mb-1">
                          Fornyelsesdato
                        </label>
                        <input
                          type="date"
                          id="edit-fornyelsesdato"
                          value={editedCustomer?.fornyelsesdato || ''}
                          onChange={(e) => {
                            if (editedCustomer) {
                              setEditedCustomer({
                                ...editedCustomer,
                                fornyelsesdato: e.target.value
                              })
                            }
                          }}
                          className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                      </div>
                      
                      <div>
                        <label htmlFor="edit-tak_storrelse" className="block text-sm font-medium text-gray-400 mb-1">
                          Takstørrelse
                        </label>
                        <input
                          type="text"
                          id="edit-tak_storrelse"
                          value={editedCustomer?.tak_storrelse || ''}
                          onChange={(e) => {
                            if (editedCustomer) {
                              setEditedCustomer({
                                ...editedCustomer,
                                tak_storrelse: e.target.value
                              })
                            }
                          }}
                          className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                          placeholder="f.eks. 120 m²"
                        />
                      </div>
                      
                      <div>
                        <label htmlFor="edit-notat" className="block text-sm font-medium text-gray-400 mb-1">
                          Notat
                        </label>
                        <textarea
                          id="edit-notat"
                          value={editedCustomer?.notat || ''}
                          onChange={(e) => {
                            if (editedCustomer) {
                              setEditedCustomer({
                                ...editedCustomer,
                                notat: e.target.value
                              })
                            }
                          }}
                          rows={3}
                          className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      )}
      
      {/* Delete confirmation modal */}
      {deleteConfirmOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-gray-800 rounded-xl p-6 border border-gray-700 w-full max-w-md">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-xl font-semibold text-white">Bekreft sletting</h3>
              <button 
                onClick={() => setDeleteConfirmOpen(false)}
                className="text-gray-400 hover:text-white"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            
            <div className="mb-6">
              <p className="text-white mb-2">Er du sikker på at du vil slette {selectedCustomers.length} kunde{selectedCustomers.length !== 1 ? 'r' : ''}?</p>
              <p className="text-gray-400 text-sm">Dette kan ikke angres.</p>
            </div>
            
            <div className="flex justify-end space-x-3">
              <button
                type="button"
                onClick={() => setDeleteConfirmOpen(false)}
                className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors"
              >
                Avbryt
              </button>
              <button
                type="button"
                onClick={async () => {
                  try {
                    const { error } = await supabase
                      .from('abonnementer')
                      .delete()
                      .in('id', selectedCustomers)
                    
                    if (error) {
                      console.error('Delete error:', error)
                      throw error
                    }
                    
                    // Reset state and refresh data
                    setDeleteConfirmOpen(false)
                    setBulkDeleteMode(false)
                    setSelectedCustomers([])
                    fetchAbonnementer()
                  } catch (error) {
                    console.error('Delete error:', error)
                    // Show error message
                  }
                }}
                className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
              >
                Slett
              </button>
            </div>
          </div>
        </div>
      )}
      
      {/* Duplicate warnings modal */}
      {showDuplicateWarnings && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-gray-800 rounded-xl p-6 border border-gray-700 w-full max-w-4xl max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-xl font-semibold text-white">Potensielle duplikater funnet</h3>
              <button 
                onClick={() => setShowDuplicateWarnings(false)}
                className="text-gray-400 hover:text-white"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            
            <div className="mb-6">
              <p className="text-white mb-2">
                Følgende kunder i importfilen kan være duplikater av eksisterende kunder:
              </p>
              <p className="text-gray-400 text-sm mb-4">
                Vennligst gjennomgå listen og bekreft om du vil fortsette med importen.
              </p>
              
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="text-left text-gray-400 border-b border-gray-700">
                      <th className="pb-3">Ny kunde</th>
                      <th className="pb-3">Eksisterende kunde</th>
                      <th className="pb-3">Årsak</th>
                    </tr>
                  </thead>
                  <tbody>
                    {duplicateWarnings.map((warning, index) => (
                      <tr key={index} className="border-b border-gray-700 text-gray-300">
                        <td className="py-3">
                          <div className="font-medium">{warning.customer.etternavn}</div>
                          <div className="text-sm text-gray-400">{warning.customer.adresse}</div>
                        </td>
                        <td className="py-3">
                          <div className="font-medium">{warning.existingCustomer.etternavn}</div>
                          <div className="text-sm text-gray-400">{warning.existingCustomer.adresse}</div>
                        </td>
                        <td className="py-3">
                          <span className="px-2 py-1 text-xs rounded-full bg-yellow-900/20 text-yellow-400">
                            {warning.reason}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
            
            <div className="flex justify-end space-x-3">
              <button
                type="button"
                onClick={() => {
                  setShowDuplicateWarnings(false)
                  console.log('Import avbrutt')
                }}
                className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors"
              >
                Avbryt import
              </button>
              <button
                type="button"
                onClick={async () => {
                  try {
                    // Extract just the customer data from the warnings
                    const customersToImport = duplicateWarnings.map(warning => warning.customer)
                    
                    const { error } = await supabase
                      .from('abonnementer')
                      .insert(customersToImport)

                    if (error) {
                      console.error('Supabase insert error:', error)
                      console.error(`Import feilet: ${error.message || 'Ukjent feil'}`)
                      return
                    }
                    
                  console.log(`Import fullført! ${customersToImport.length} abonnementer lagt til.`)
                    setShowDuplicateWarnings(false)
                    // Refresh the subscription list
                    fetchAbonnementer()
                  } catch (error) {
                    console.error('Import error:', error)
                    console.error('Import feilet: Kunne ikke legge til abonnementer')
                  }
                }}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                Fortsett import likevel
              </button>
            </div>
          </div>
        </div>
      )}
      
      {/* Modal for å legge til ny kunde */}
      {visNyKundeSkjema && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-gray-800 rounded-xl p-6 border border-gray-700 w-full max-w-md">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-xl font-semibold text-white">Legg til ny kunde</h3>
              <button 
                onClick={() => setVisNyKundeSkjema(false)}
                className="text-gray-400 hover:text-white"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            
            <form onSubmit={handleSubmit}>
              <div className="space-y-4">
                <div>
                  <label htmlFor="etternavn" className="block text-sm font-medium text-gray-400 mb-1">
                    Navn
                  </label>
                  <input
                    type="text"
                    id="etternavn"
                    name="etternavn"
                    value={nyKunde.etternavn}
                    onChange={handleInputChange}
                    required
                    className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                
                <div>
                  <label htmlFor="adresse" className="block text-sm font-medium text-gray-400 mb-1">
                    Adresse
                  </label>
                  <input
                    type="text"
                    id="adresse"
                    name="adresse"
                    value={nyKunde.adresse}
                    onChange={handleInputChange}
                    required
                    className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                
                <div>
                  <label htmlFor="kommune" className="block text-sm font-medium text-gray-400 mb-1">
                    Kommune
                  </label>
                  <input
                    type="text"
                    id="kommune"
                    name="kommune"
                    value={nyKunde.kommune}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                
                <div>
                  <label htmlFor="fornyelsesdato" className="block text-sm font-medium text-gray-400 mb-1">
                    Fornyelsesdato
                  </label>
                  <input
                    type="date"
                    id="fornyelsesdato"
                    name="fornyelsesdato"
                    value={nyKunde.fornyelsesdato}
                    onChange={handleInputChange}
                    required
                    className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                
                <div>
                  <label htmlFor="tak_storrelse" className="block text-sm font-medium text-gray-400 mb-1">
                    Størrelse på tak
                  </label>
                  <input
                    type="text"
                    id="tak_storrelse"
                    name="tak_storrelse"
                    value={nyKunde.tak_storrelse}
                    onChange={handleInputChange}
                    required
                    className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="f.eks. 120 m²"
                  />
                </div>
              </div>
              
              {submitStatus && (
                <p className={`mt-4 ${submitStatus.includes('ikke') ? 'text-red-500' : 'text-green-500'}`}>
                  {submitStatus}
                </p>
              )}
              
              <div className="mt-6 flex justify-end space-x-3">
                <button
                  type="button"
                  onClick={() => setVisNyKundeSkjema(false)}
                  className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors"
                >
                  Avbryt
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
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
