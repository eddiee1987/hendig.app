'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabase'
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"

interface Customer {
  id: string
  etternavn: string
  adresse: string
  kommune: string
}

export default function NyInspeksjon() {
  const router = useRouter()
  const [customers, setCustomers] = useState<Customer[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [submitStatus, setSubmitStatus] = useState<string | null>(null)
  
  // Form state
  const [selectedCustomerId, setSelectedCustomerId] = useState('')
  const [selectedCustomerName, setSelectedCustomerName] = useState('')
  const [selectedCustomerAddress, setSelectedCustomerAddress] = useState('')
  const [inspectionType, setInspectionType] = useState<'vårvedlikehold' | 'høstvedlikehold' | 'rehabilitering' | ''>('')
  const [inspectionStatus, setInspectionStatus] = useState<'planlagt' | 'utført'>('planlagt')
  const [inspectionDate, setInspectionDate] = useState('')
  const [roofCondition, setRoofCondition] = useState('')
  const [notes, setNotes] = useState('')
  const [inspector, setInspector] = useState('')
  const [sendSms, setSendSms] = useState(false)
  
  // Image handling
  const [beforeImages, setBeforeImages] = useState<File[]>([])
  const [afterImages, setAfterImages] = useState<File[]>([])
  const [beforeImageUrls, setBeforeImageUrls] = useState<string[]>([])
  const [afterImageUrls, setAfterImageUrls] = useState<string[]>([])

  useEffect(() => {
    fetchCustomers()
  }, [])

  async function fetchCustomers() {
    try {
      setLoading(true)
      const { data, error } = await supabase
        .from('abonnementer')
        .select('id, etternavn, adresse, kommune')
      
      if (error) {
        console.error('Error fetching customers:', error)
        setError('Kunne ikke hente kunder')
        return
      }
      
      setCustomers(data || [])
    } catch (err) {
      console.error('Unexpected error:', err)
      setError('En uventet feil oppstod')
    } finally {
      setLoading(false)
    }
  }

  const handleCustomerChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const customerId = e.target.value
    setSelectedCustomerId(customerId)
    
    if (customerId) {
      const customer = customers.find(c => c.id === customerId)
      if (customer) {
        setSelectedCustomerName(customer.etternavn)
        setSelectedCustomerAddress(customer.adresse)
      }
    } else {
      setSelectedCustomerName('')
      setSelectedCustomerAddress('')
    }
  }

  const handleBeforeImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const newImages = Array.from(e.target.files)
      setBeforeImages(prev => [...prev, ...newImages])
      const newUrls = newImages.map(file => URL.createObjectURL(file))
      setBeforeImageUrls(prev => [...prev, ...newUrls])
    }
  }

  const handleAfterImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const newImages = Array.from(e.target.files)
      setAfterImages(prev => [...prev, ...newImages])
      const newUrls = newImages.map(file => URL.createObjectURL(file))
      setAfterImageUrls(prev => [...prev, ...newUrls])
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!selectedCustomerId || !inspectionType || !inspectionDate) {
      setSubmitStatus('Vennligst fyll ut alle påkrevde felt')
      return
    }
    try {
      setSubmitStatus('Lagrer inspeksjon...')
      // 1. Ensure bucket exists
      try {
        await supabase.storage.createBucket('inspeksjonsbilder', { public: true })
      } catch (err: unknown) {
        if (err instanceof Error && !err.message.includes('Bucket already exists')) {
          console.error('Error creating bucket:', err)
          throw new Error('Kunne ikke opprette bilde-lager')
        }
      }

      // 2. Upload images with unique filenames
      const beforeImageUrlsUpload: string[] = []
      const afterImageUrlsUpload: string[] = []
      const folder = `inspeksjoner/${selectedCustomerId}_${Date.now()}`
      
      for (const file of beforeImages) {
        const uniqueName = `${Date.now()}-${file.name}`
        const { error } = await supabase.storage
          .from('inspeksjonsbilder')
          .upload(`${folder}/for/${uniqueName}`, file, {
            cacheControl: '3600',
            upsert: false
          })
        
        if (error) {
          console.error('Error uploading before image:', error)
          throw new Error(`Kunne ikke laste opp før-bilde: ${error.message}`)
        }
        
        const { data: { publicUrl } } = supabase.storage
          .from('inspeksjonsbilder')
          .getPublicUrl(`${folder}/for/${uniqueName}`)
        beforeImageUrlsUpload.push(publicUrl)
      }

      for (const file of afterImages) {
        const uniqueName = `${Date.now()}-${file.name}`
        const { error } = await supabase.storage
          .from('inspeksjonsbilder')
          .upload(`${folder}/etter/${uniqueName}`, file, {
            cacheControl: '3600',
            upsert: false
          })
        
        if (error) {
          console.error('Error uploading after image:', error)
          throw new Error(`Kunne ikke laste opp etter-bilde: ${error.message}`)
        }
        
        const { data: { publicUrl } } = supabase.storage
          .from('inspeksjonsbilder')
          .getPublicUrl(`${folder}/etter/${uniqueName}`)
        afterImageUrlsUpload.push(publicUrl)
      }
      // 2. Lagre inspeksjonen med bilde-URLer
      const inspectionData = {
        customer_id: selectedCustomerId,
        customer_name: selectedCustomerName,
        customer_address: selectedCustomerAddress,
        inspection_date: inspectionDate,
        inspection_type: inspectionType,
        status: inspectionStatus,
        roof_condition: roofCondition,
        notes: notes,
        inspector: inspector,
        before_images: beforeImageUrlsUpload,
        after_images: afterImageUrlsUpload
      }
      const { error } = await supabase
        .from('inspections')
        .insert([inspectionData])
      if (error) {
        console.error('Error saving inspection:', error)
        if (error.message.includes('relation "inspections" does not exist') || 
            error.message.includes('does not exist') ||
            error.code === '42P01') {
          setSubmitStatus(`Inspeksjonstabellen eksisterer ikke ennå. Vennligst kjør migrasjonen først.`)
        } else {
          setSubmitStatus(`Kunne ikke lagre inspeksjon: ${error.message}`)
        }
        return
      }
      // Oppdater abonnement ved utført vedlikehold
      if (inspectionStatus === 'utført') {
        if (inspectionType === 'vårvedlikehold' || inspectionType === 'høstvedlikehold') {
          const fieldToUpdate = inspectionType === 'vårvedlikehold' ? 'var' : 'host'
          const { error: updateError } = await supabase
            .from('abonnementer')
            .update({ [fieldToUpdate]: 'Ja' })
            .eq('id', selectedCustomerId)
          if (updateError) {
            console.error('Error updating customer maintenance status:', updateError)
          }
        }
      }
      if (sendSms) {
        console.log('SMS would be sent:', {
          to: 'customer phone',
          message: `Vi kommer for å utføre ${inspectionType} på taket ditt den ${inspectionDate}`
        })
      }
      setSubmitStatus('Inspeksjon lagret!')
      setTimeout(() => {
        router.push('/inspeksjoner')
      }, 1500)
    } catch (err) {
      console.error('Unexpected error:', err)
      setSubmitStatus('En uventet feil oppstod')
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-900 p-8 ml-64">
        <div className="max-w-3xl mx-auto text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto"></div>
          <p className="mt-4 text-gray-400">Laster kunder...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-900 p-8 ml-64">
      <div className="max-w-3xl mx-auto">
        <h1 className="text-3xl font-bold text-white mb-6">Ny inspeksjon</h1>

        {error && (
          <div className="bg-red-900/20 border border-red-800 text-red-400 px-4 py-3 rounded-xl mb-6">
            {error}
          </div>
        )}

        {submitStatus && !submitStatus.includes('Kunne ikke') && !submitStatus.includes('Vennligst') && (
          <div className="bg-green-900/20 border border-green-800 text-green-400 px-4 py-3 rounded-xl mb-6">
            {submitStatus}
          </div>
        )}

        {submitStatus && (submitStatus.includes('Kunne ikke') || submitStatus.includes('Vennligst')) && (
          <div className="bg-red-900/20 border border-red-800 text-red-400 px-4 py-3 rounded-xl mb-6">
            {submitStatus}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          <Card className="p-6 bg-gray-800 border border-gray-700">
            <h2 className="text-lg font-semibold text-white mb-4">Kundeinformasjon</h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1">Velg kunde</label>
                <select
                  className="w-full p-2 border border-gray-600 rounded bg-gray-700 text-white"
                  value={selectedCustomerId}
                  onChange={handleCustomerChange}
                  required
                >
                  <option value="">Velg kunde...</option>
                  {customers.map((customer) => (
                    <option key={customer.id} value={customer.id}>
                      {customer.etternavn} - {customer.adresse}, {customer.kommune}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1">Type inspeksjon</label>
                <select
                  className="w-full p-2 border border-gray-600 rounded bg-gray-700 text-white"
                  value={inspectionType}
                  onChange={(e) => setInspectionType(e.target.value as any)}
                  required
                >
                  <option value="">Velg type...</option>
                  <option value="vårvedlikehold">Vårvedlikehold</option>
                  <option value="høstvedlikehold">Høstvedlikehold</option>
                  <option value="rehabilitering">Rehabilitering</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1">Status</label>
                <select
                  className="w-full p-2 border border-gray-600 rounded bg-gray-700 text-white"
                  value={inspectionStatus}
                  onChange={(e) => setInspectionStatus(e.target.value as 'planlagt' | 'utført')}
                >
                  <option value="planlagt">Planlagt</option>
                  <option value="utført">Utført</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1">Dato</label>
                <Input
                  type="date"
                  value={inspectionDate}
                  onChange={(e) => setInspectionDate(e.target.value)}
                  required
                  className="bg-gray-700 border-gray-600 text-white"
                />
              </div>
            </div>
          </Card>

          {inspectionStatus === 'utført' && (
            <Card className="p-6 bg-gray-800 border border-gray-700">
              <h2 className="text-lg font-semibold text-white mb-4">Inspeksjonsdetaljer</h2>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-1">Taktilstand</label>
                  <select
                    className="w-full p-2 border border-gray-600 rounded bg-gray-700 text-white"
                    value={roofCondition}
                    onChange={(e) => setRoofCondition(e.target.value)}
                  >
                    <option value="">Velg tilstand...</option>
                    <option value="god">God</option>
                    <option value="normal">Normal</option>
                    <option value="dårlig">Dårlig</option>
                    <option value="kritisk">Kritisk</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-1">Inspektør</label>
                  <Input
                    type="text"
                    value={inspector}
                    onChange={(e) => setInspector(e.target.value)}
                    placeholder="Navn på inspektør"
                    className="bg-gray-700 border-gray-600 text-white"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-1">Før-bilder</label>
                  <Input
                    type="file"
                    accept="image/*"
                    multiple
                    onChange={handleBeforeImageUpload}
                    className="bg-gray-700 border-gray-600 text-white"
                  />
                  {beforeImageUrls.length > 0 && (
                    <div className="grid grid-cols-3 gap-2 mt-2">
                      {beforeImageUrls.map((url, index) => (
                        <img
                          key={index}
                          src={url}
                          alt={`Før-bilde ${index + 1}`}
                          className="w-full h-24 object-cover rounded"
                        />
                      ))}
                    </div>
                  )}
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-1">Etter-bilder</label>
                  <Input
                    type="file"
                    accept="image/*"
                    multiple
                    onChange={handleAfterImageUpload}
                    className="bg-gray-700 border-gray-600 text-white"
                  />
                  {afterImageUrls.length > 0 && (
                    <div className="grid grid-cols-3 gap-2 mt-2">
                      {afterImageUrls.map((url, index) => (
                        <img
                          key={index}
                          src={url}
                          alt={`Etter-bilde ${index + 1}`}
                          className="w-full h-24 object-cover rounded"
                        />
                      ))}
                    </div>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-1">Notater</label>
                  <Textarea
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    placeholder="Beskriv takets tilstand og eventuelle problemer..."
                    rows={4}
                    className="bg-gray-700 border-gray-600 text-white"
                  />
                </div>

                <div className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    id="sendSms"
                    checked={sendSms}
                    onChange={(e) => setSendSms(e.target.checked)}
                    className="rounded border-gray-600 bg-gray-700 text-blue-600"
                  />
                  <label htmlFor="sendSms" className="text-gray-300">
                    Send SMS til kunde om utført vedlikehold
                  </label>
                </div>
              </div>
            </Card>
          )}

          <div className="flex justify-end space-x-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => router.push('/inspeksjoner')}
              className="border-gray-600 text-gray-300 hover:bg-gray-700"
            >
              Avbryt
            </Button>
            <Button type="submit" className="bg-blue-600 hover:bg-blue-700">
              {inspectionStatus === 'planlagt' ? 'Planlegg inspeksjon' : 'Registrer utført inspeksjon'}
            </Button>
          </div>
        </form>
      </div>
    </div>
  )
}
