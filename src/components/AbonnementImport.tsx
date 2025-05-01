'use client'

import { useState } from 'react'
import { toast } from 'react-hot-toast'
import * as ExcelJS from 'exceljs'
import { createAbonnement } from '@/services/abonnementService'
import { ExcelRow } from '@/types/excel'

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
  const [showImport, setShowImport] = useState(false)

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

  const convertExcelValue = (value: unknown): string | number | boolean => {
    if (value === null || value === undefined) return ''
    if (typeof value === 'string' || typeof value === 'number' || typeof value === 'boolean') {
      return value
    }
    if (value instanceof Date) {
      return value.toISOString().split('T')[0]
    }
    if (typeof value === 'object' && 'result' in value) {
      return value.result?.toString() || ''
    }
    return value?.toString() || ''
  }

  const readExcelFile = async (file: File): Promise<AbonnementData[]> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader()
      
      reader.onload = async (e) => {
        try {
          const data = e.target?.result as ArrayBuffer
          const workbook = new ExcelJS.Workbook()
          await workbook.xlsx.load(data)
          const worksheet = workbook.worksheets[0]
          
          // Convert Excel data to JSON
          const jsonData = worksheet.getSheetValues()
            .filter((row, i) => i > 1 && row) // Skip header and empty rows
            .map(row => {
              const obj: Partial<ExcelRow> = {}
              worksheet.getRow(1).eachCell((cell, colNumber) => {
                if (cell.text && row && Array.isArray(row)) {
                  const value = convertExcelValue(row[colNumber])
                  if (value !== undefined && value !== null) {
                    obj[cell.text as keyof ExcelRow] = value
                  }
                }
              })
              return obj
            })
          
          // Map Excel columns to our data structure

          const mappedData = jsonData.map((row: unknown) => {
            const excelRow = row as ExcelRow
            return {
              fornavn: String(excelRow.Fornavn ?? ''),
              etternavn: String(excelRow.Etternavn ?? ''),
              adresse: String(excelRow.Adresse ?? ''),
              kommune: String(excelRow.Kommune ?? ''),
              var_utfort: typeof excelRow['Vår utført'] === 'boolean' 
                ? excelRow['Vår utført'] 
                : String(excelRow['Vår utført'] ?? '').toLowerCase() === 'ja',
              host_utfort: typeof excelRow['Høst utført'] === 'boolean'
                ? excelRow['Høst utført']
                : String(excelRow['Høst utført'] ?? '').toLowerCase() === 'ja',
              epost: String(excelRow['E-post'] ?? ''),
              fakturert: typeof excelRow.Fakturert === 'boolean'
                ? excelRow.Fakturert
                : String(excelRow.Fakturert ?? '').toLowerCase() === 'ja',
              fornyelsesdato: formatDate(excelRow.Fornyelsesdato),
              sum: Number(excelRow.Sum ?? 0),
              notat: String(excelRow.Notat ?? '')
            }
          })
          
          resolve(mappedData)
        } catch (error) {
          reject(error)
        }
      }
      
      reader.onerror = (error) => reject(error)
      reader.readAsBinaryString(file)
    })
  }

  const formatDate = (date: unknown): string => {
    if (date === undefined || date === null) return ''
    
    // Handle Excel date format (number of days since 1900-01-01)
    if (typeof date === 'number') {
      const excelEpoch = new Date(1900, 0, 1)
      const dateObj = new Date(excelEpoch.getTime() + (date - 1) * 24 * 60 * 60 * 1000)
      return dateObj.toISOString().split('T')[0]
    }
    
    // Handle string date format
    if (typeof date === 'string') {
      // DD.MM.YYYY format
      const parts = date.split('.')
      if (parts.length === 3) {
        return `${parts[2]}-${parts[1].padStart(2, '0')}-${parts[0].padStart(2, '0')}`
      }
      // YYYY-MM-DD format
      if (/^\d{4}-\d{2}-\d{2}$/.test(date)) {
        return date
      }
    }
    
    // Handle Date objects
    if (date instanceof Date) {
      return date.toISOString().split('T')[0]
    }
    
    // Fallback to empty string
    return ''
  }

  return (
    <div className="bg-gray-900 rounded-xl border border-gray-800 p-6">
      <h2 className="text-xl font-semibold text-white mb-4">Importer abonnementer</h2>
      {!showImport ? (
        <button
          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          onClick={() => setShowImport(true)}
        >
          Importer kunder fra fil
        </button>
      ) : (
        <>
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
        </>
      )}
    </div>
  )
}
