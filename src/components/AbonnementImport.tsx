'use client'

import { useState } from 'react'
import { toast } from 'react-hot-toast'
import * as XLSX from 'xlsx'
import { createAbonnement } from '@/services/abonnementService'

interface AbonnementData {
  fornavn: string
  etternavn: string
  adresse: string
  kommune: string
  var_utfort: boolean
  host_utfort: boolean
  epost: string
  fakturert: boolean
  fornyelsesdato: string
  sum: number
  notat: string
}

interface AbonnementImportProps {
  onImportSuccess?: () => void;
}

export default function AbonnementImport({ onImportSuccess }: AbonnementImportProps) {
  const [isUploading, setIsUploading] = useState(false)
  const [progress, setProgress] = useState(0)
  const [totalRows, setTotalRows] = useState(0)
  const [processedRows, setProcessedRows] = useState(0)

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    setIsUploading(true)
    setProgress(0)
    setProcessedRows(0)
    
    try {
      const data = await readExcelFile(file)
      if (data.length === 0) {
        toast.error('Ingen data funnet i filen')
        setIsUploading(false)
        return
      }
      
      setTotalRows(data.length)
      await processAbonnements(data)
      
      toast.success(`${data.length} abonnementer importert`)
      e.target.value = ''
    } catch (error) {
      console.error('Error importing abonnements:', error)
      toast.error('Kunne ikke importere abonnementer')
    } finally {
      setIsUploading(false)
    }
  }

  const readExcelFile = (file: File): Promise<AbonnementData[]> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader()
      
      reader.onload = (e) => {
        try {
          const data = e.target?.result
          const workbook = XLSX.read(data, { type: 'binary' })
          const sheetName = workbook.SheetNames[0]
          const worksheet = workbook.Sheets[sheetName]
          
          // Convert Excel data to JSON
          const jsonData = XLSX.utils.sheet_to_json(worksheet)
          
          // Map Excel columns to our data structure
          const mappedData = jsonData.map((row: any) => ({
            fornavn: row['Fornavn'] || '',
            etternavn: row['Etternavn'] || '',
            adresse: row['Adresse'] || '',
            kommune: row['Kommune'] || '',
            var_utfort: Boolean(row['Vår']),
            host_utfort: Boolean(row['Høst']),
            epost: row['E-post'] || '',
            fakturert: Boolean(row['Fakturert']),
            fornyelsesdato: row['Fornyelsesdato'] ? formatDate(row['Fornyelsesdato']) : '',
            sum: Number(row['Sum']) || 0,
            notat: row['Notat'] || ''
          }))
          
          resolve(mappedData)
        } catch (error) {
          reject(error)
        }
      }
      
      reader.onerror = (error) => reject(error)
      reader.readAsBinaryString(file)
    })
  }

  const formatDate = (date: any): string => {
    // Handle Excel date format
    if (typeof date === 'number') {
      // Excel dates are number of days since 1900-01-01
      const excelEpoch = new Date(1900, 0, 1)
      const dateObj = new Date(excelEpoch.getTime() + (date - 1) * 24 * 60 * 60 * 1000)
      return dateObj.toISOString().split('T')[0]
    }
    
    // Handle string date format
    if (typeof date === 'string') {
      const parts = date.split('.')
      if (parts.length === 3) {
        // DD.MM.YYYY format
        return `${parts[2]}-${parts[1].padStart(2, '0')}-${parts[0].padStart(2, '0')}`
      }
    }
    
    return ''
  }

  const processAbonnements = async (data: AbonnementData[]) => {
    for (let i = 0; i < data.length; i++) {
      const abonnement = data[i]
      
      try {
        await createAbonnement({
          fornavn: abonnement.fornavn,
          etternavn: abonnement.etternavn,
          adresse: abonnement.adresse,
          kommune: abonnement.kommune,
          var: abonnement.var_utfort ? 'utført' : 'ikke utført',
          host: abonnement.host_utfort ? 'utført' : 'ikke utført',
          epost: abonnement.epost,
          fakturert: abonnement.fakturert,
          fornyelsesdato: abonnement.fornyelsesdato,
          sum: abonnement.sum,
          notat: abonnement.notat
        })
        
        setProcessedRows(i + 1)
        setProgress(Math.round(((i + 1) / data.length) * 100))
      } catch (error) {
        console.error(`Error creating abonnement ${abonnement.etternavn}:`, error)
        // Continue with next abonnement
      }
    }
    
    // Call the onImportSuccess callback if provided
    if (onImportSuccess) {
      onImportSuccess();
    }
  }

  return (
    <div className="bg-gray-900 rounded-xl border border-gray-800 p-6">
      <h2 className="text-xl font-semibold text-white mb-4">Importer abonnementer</h2>
      
      <div className="mb-6">
        <p className="text-gray-400 mb-2">
          Last opp en Excel-fil med abonnementer. Filen må inneholde følgende kolonner:
        </p>
        <ul className="text-gray-400 text-sm list-disc pl-5 mb-4">
          <li>Fornavn</li>
          <li>Etternavn</li>
          <li>Adresse</li>
          <li>Kommune</li>
          <li>Vår (sjekkboks)</li>
          <li>Høst (sjekkboks)</li>
          <li>E-post</li>
          <li>Fakturert (sjekkboks)</li>
          <li>Fornyelsesdato</li>
          <li>Sum</li>
          <li>Notat</li>
        </ul>
      </div>
      
      <div className="mb-6">
        <label className="block mb-2 text-sm font-medium text-white">
          Velg Excel-fil
        </label>
        <input
          type="file"
          accept=".xlsx, .xls"
          onChange={handleFileUpload}
          disabled={isUploading}
          className="block w-full text-sm text-gray-400 border border-gray-700 rounded-lg cursor-pointer bg-gray-800 focus:outline-none"
        />
      </div>
      
      {isUploading && (
        <div className="mb-4">
          <div className="flex justify-between mb-1">
            <span className="text-sm font-medium text-white">Importerer...</span>
            <span className="text-sm font-medium text-white">{progress}%</span>
          </div>
          <div className="w-full bg-gray-700 rounded-full h-2.5">
            <div 
              className="bg-blue-600 h-2.5 rounded-full" 
              style={{ width: `${progress}%` }}
            ></div>
          </div>
          <p className="text-sm text-gray-400 mt-2">
            {processedRows} av {totalRows} abonnementer importert
          </p>
        </div>
      )}
    </div>
  )
}
