'use client'

import { useEffect, useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabase'
import Link from 'next/link'
import { Button } from '@/components/ui/button'

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

export default function InspectionDetail() {
  const params = useParams()
  const router = useRouter()
  const [inspection, setInspection] = useState<Inspection | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [isEditing, setIsEditing] = useState(false)
  const [newBeforeImages, setNewBeforeImages] = useState<File[]>([])
  const [newAfterImages, setNewAfterImages] = useState<File[]>([])
  const [tempBeforeImageUrls, setTempBeforeImageUrls] = useState<string[]>([])
  const [tempAfterImageUrls, setTempAfterImageUrls] = useState<string[]>([])

  useEffect(() => {
    fetchInspection()
  }, [params.id])

  async function fetchInspection() {
    try {
      setLoading(true)
      
      const { data, error } = await supabase
        .from('inspections')
        .select(`
          *,
          abonnementer:customer_id (etternavn),
          before_images,
          after_images
        `)
        .eq('id', params.id)
        .single()

      if (error) throw error
      setInspection(data)
    } catch (err) {
      console.error('Error fetching inspection:', err)
      setError('Kunne ikke hente inspeksjon')
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-900 p-8 ml-64">
        <div className="max-w-7xl mx-auto text-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white mx-auto"></div>
          <p className="mt-4 text-gray-400">Laster inspeksjon...</p>
        </div>
      </div>
    )
  }

  if (error || !inspection) {
    return (
      <div className="min-h-screen bg-gray-900 p-8 ml-64">
        <div className="max-w-7xl mx-auto">
          <div className="bg-red-900/20 text-red-400 p-6 rounded-xl text-center">
            {error || 'Inspeksjon ikke funnet'}
          </div>
          <div className="mt-4 text-center">
            <Link href="/inspeksjoner">
              <Button variant="outline">Tilbake til liste</Button>
            </Link>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-900 p-8 ml-64">
      <div className="max-w-7xl mx-auto">
          <div className="flex justify-between items-center mb-8">
            <div>
              <h1 className="text-3xl font-bold text-white">
                Inspeksjon for {inspection.abonnementer?.etternavn || inspection.customer_name || 'Ukjent kunde'}
              </h1>
              <p className="text-gray-400 mt-2">
                {new Date(inspection.inspection_date).toLocaleDateString('nb-NO')} • 
                <span className={`ml-2 px-2 py-1 rounded-full text-xs font-medium ${
                  inspection.status === 'planlagt' 
                    ? 'bg-yellow-900/50 text-yellow-400' 
                    : 'bg-green-900/50 text-green-400'
                }`}>
                  {inspection.status}
                </span>
              </p>
            </div>
            <div className="flex gap-2">
              {isEditing ? (
                <>
                  <Button 
                    variant="outline" 
                    onClick={() => setIsEditing(false)}
                  >
                    Avbryt
                  </Button>
                  <Button 
                    onClick={saveChanges}
                    disabled={loading}
                  >
                    {loading ? 'Lagrer...' : 'Lagre endringer'}
                  </Button>
                </>
              ) : (
                <>
                  <Button 
                    variant="outline" 
                    onClick={() => setIsEditing(true)}
                  >
                    Rediger
                  </Button>
                  <Link href="/inspeksjoner">
                    <Button variant="outline">Tilbake til liste</Button>
                  </Link>
                </>
              )}
            </div>
          </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Main inspection details */}
          <div className="md:col-span-2 bg-gray-800 rounded-2xl p-6 border border-gray-700">
            <h2 className="text-xl font-semibold text-white mb-4">Detaljer</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <p className="text-gray-400">Kunde</p>
                <p className="text-white">
                  {inspection.abonnementer?.etternavn || inspection.customer_name || 'Ukjent'}
                </p>
              </div>
              <div>
                <p className="text-gray-400">Adresse</p>
                <p className="text-white">{inspection.customer_address}</p>
              </div>
              <div>
                <p className="text-gray-400">Dato</p>
                <p className="text-white">
                  {new Date(inspection.inspection_date).toLocaleDateString('nb-NO')}
                </p>
              </div>
              <div>
                <p className="text-gray-400">Type</p>
                <p className="text-white capitalize">{inspection.inspection_type}</p>
              </div>
              <div>
                <p className="text-gray-400">Inspektør</p>
                <p className="text-white">{inspection.inspector || 'Ikke angitt'}</p>
              </div>
              <div>
                <p className="text-gray-400">Takstatus</p>
                <p className="text-white">{inspection.roof_condition || 'Ikke angitt'}</p>
              </div>
            </div>

            <div className="mt-6">
              <p className="text-gray-400">Notater</p>
              <p className="text-white mt-2 whitespace-pre-line">
                {inspection.notes || 'Ingen notater'}
              </p>
            </div>
          </div>

          {/* Images section */}
          <div className="bg-gray-800 rounded-2xl p-6 border border-gray-700">
            <h2 className="text-xl font-semibold text-white mb-4">Bilder</h2>
            
            <div className="mb-6">
              <h3 className="text-gray-400 mb-2">Før-bilder</h3>
              <div className="grid grid-cols-2 gap-2">
                {inspection.before_images?.map((url, idx) => {
                  const fullUrl = url.startsWith('http') ? url : 
                    `https://${process.env.NEXT_PUBLIC_SUPABASE_PROJECT_ID}.supabase.co/storage/v1/object/public/inspeksjonsbilder/${url}`
                  return (
                    <div key={`before-${idx}`} className="relative">
                      <img 
                        src={fullUrl}
                        alt={`Før-bilde ${idx + 1}`}
                        className="w-full h-32 object-cover rounded"
                        onError={(e) => {
                          const target = e.target as HTMLImageElement
                          target.src = '/image-placeholder.png'
                        }}
                      />
                      {isEditing && (
                        <button 
                          className="absolute top-1 right-1 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center"
                          onClick={() => handleRemoveImage('before', idx)}
                        >
                          ×
                        </button>
                      )}
                    </div>
                  )
                })}
                {tempBeforeImageUrls.map((url, idx) => (
                  <img 
                    key={`temp-before-${idx}`}
                    src={url}
                    alt={`Midlertidig før-bilde ${idx + 1}`}
                    className="w-full h-32 object-cover rounded"
                  />
                ))}
              </div>
              {isEditing && (
                <div className="mt-2">
                  <input
                    type="file"
                    accept="image/*"
                    multiple
                    onChange={(e) => handleImageUpload(e, 'before')}
                    className="text-sm text-gray-400"
                  />
                </div>
              )}
            </div>

            <div>
              <h3 className="text-gray-400 mb-2">Etter-bilder</h3>
              <div className="grid grid-cols-2 gap-2">
                {inspection.after_images?.map((url, idx) => {
                  const fullUrl = url.startsWith('http') ? url : 
                    `https://${process.env.NEXT_PUBLIC_SUPABASE_PROJECT_ID}.supabase.co/storage/v1/object/public/inspeksjonsbilder/${url}`
                  return (
                    <div key={`after-${idx}`} className="relative">
                      <img 
                        src={fullUrl}
                        alt={`Etter-bilde ${idx + 1}`}
                        className="w-full h-32 object-cover rounded"
                        onError={(e) => {
                          const target = e.target as HTMLImageElement
                          target.src = '/image-placeholder.png'
                        }}
                      />
                      {isEditing && (
                        <button 
                          className="absolute top-1 right-1 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center"
                          onClick={() => handleRemoveImage('after', idx)}
                        >
                          ×
                        </button>
                      )}
                    </div>
                  )
                })}
                {tempAfterImageUrls.map((url, idx) => (
                  <img 
                    key={`temp-after-${idx}`}
                    src={url}
                    alt={`Midlertidig etter-bilde ${idx + 1}`}
                    className="w-full h-32 object-cover rounded"
                  />
                ))}
              </div>
              {isEditing && (
                <div className="mt-2">
                  <input
                    type="file"
                    accept="image/*"
                    multiple
                    onChange={(e) => handleImageUpload(e, 'after')}
                    className="text-sm text-gray-400"
                  />
                </div>
              )}
              {!inspection.after_images?.length && !tempAfterImageUrls.length && (
                <p className="text-gray-400">Ingen bilder lagt til</p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )

  async function handleImageUpload(e: React.ChangeEvent<HTMLInputElement>, type: 'before' | 'after') {
    if (e.target.files) {
      const files = Array.from(e.target.files)
      if (type === 'before') {
        setNewBeforeImages(prev => [...prev, ...files])
        setTempBeforeImageUrls(prev => [...prev, ...files.map(file => URL.createObjectURL(file))])
      } else {
        setNewAfterImages(prev => [...prev, ...files])
        setTempAfterImageUrls(prev => [...prev, ...files.map(file => URL.createObjectURL(file))])
      }
    }
  }

  function handleRemoveImage(type: 'before' | 'after', index: number) {
    if (type === 'before') {
      const updatedImages = [...(inspection?.before_images || [])]
      updatedImages.splice(index, 1)
      setInspection(prev => prev ? {...prev, before_images: updatedImages} : null)
    } else {
      const updatedImages = [...(inspection?.after_images || [])]
      updatedImages.splice(index, 1)
      setInspection(prev => prev ? {...prev, after_images: updatedImages} : null)
    }
  }

  async function saveChanges() {
    try {
      setLoading(true)
      
      // Ensure bucket exists
      try {
        await supabase.storage.createBucket('inspeksjonsbilder', { public: true })
      } catch (err: unknown) {
        if (err instanceof Error && !err.message.includes('Bucket already exists')) {
          console.error('Error creating bucket:', err)
          throw new Error('Kunne ikke opprette bilde-lager')
        }
      }

      // Upload new images
      const folder = `inspeksjoner/${inspection?.id}`
      const beforeUrls = [...(inspection?.before_images || [])]
      const afterUrls = [...(inspection?.after_images || [])]

      for (const file of newBeforeImages) {
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
        beforeUrls.push(publicUrl)
      }

      for (const file of newAfterImages) {
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
        afterUrls.push(publicUrl)
      }

      // Update inspection
      const { data, error } = await supabase
        .from('inspections')
        .update({
          before_images: beforeUrls,
          after_images: afterUrls
        })
        .eq('id', params.id)
        .select()

      if (error) {
        console.error('Supabase update error:', error)
        throw new Error(`Databasefeil: ${error.message}`)
      }

      setIsEditing(false)
      setNewBeforeImages([])
      setNewAfterImages([])
      setTempBeforeImageUrls([])
      setTempAfterImageUrls([])
      setInspection(data[0])
    } catch (err) {
      console.error('Error saving changes:', err)
      setError(err instanceof Error ? err.message : 'Kunne ikke lagre endringer')
    } finally {
      setLoading(false)
    }
  }
}
