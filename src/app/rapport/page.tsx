'use client'

import { useState } from 'react'
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

interface ReportData {
  id: string
  title: string
  date: string
  type: 'timeforing' | 'inspeksjon' | 'kunde'
  status: 'draft' | 'published' | 'archived'
  createdBy: string
}

const mockData: ReportData[] = [
  {
    id: '1',
    title: 'Månedlig timeføringsrapport - Mars 2024',
    date: '2024-03-15',
    type: 'timeforing',
    status: 'published',
    createdBy: 'Ole Hansen'
  },
  // ... flere rapporter
]

export default function RapportDashboard() {
  const [reports, setReports] = useState<ReportData[]>(mockData)
  const [showGenerateModal, setShowGenerateModal] = useState(false)
  const [selectedReportType, setSelectedReportType] = useState<string>('')

  const handleGenerateReport = () => {
    // Her kan du implementere faktisk rapportgenerering
    alert(`Genererer ${selectedReportType}-rapport`)
  }

  return (
    <div className="min-h-screen bg-gray-900 p-8 ml-64">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex justify-between items-center mb-12">
          <div>
            <h1 className="text-4xl font-bold text-white">Rapporter</h1>
            <p className="text-gray-400 mt-2">Generer og administrer rapporter</p>
          </div>
          <button
            onClick={() => setShowGenerateModal(true)}
            className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-full flex items-center gap-2 shadow-sm transition-all duration-200"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
            <span>Generer rapport</span>
          </button>
        </div>

        {/* Statistikk-kort */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-gray-800 rounded-2xl p-6 border border-gray-700">
            <div className="flex items-center justify-between">
              <h3 className="text-gray-400">Timeføringsrapporter</h3>
              <div className="w-10 h-10 rounded-full bg-blue-900/50 flex items-center justify-center">
                <svg className="w-5 h-5 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
            </div>
            <p className="text-2xl font-bold text-white mt-2">24</p>
          </div>

          <div className="bg-gray-800 rounded-2xl p-6 border border-gray-700">
            <div className="flex items-center justify-between">
              <h3 className="text-gray-400">Inspeksjonsrapporter</h3>
              <div className="w-10 h-10 rounded-full bg-green-900/50 flex items-center justify-center">
                <svg className="w-5 h-5 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
            </div>
            <p className="text-2xl font-bold text-white mt-2">18</p>
          </div>

          <div className="bg-gray-800 rounded-2xl p-6 border border-gray-700">
            <div className="flex items-center justify-between">
              <h3 className="text-gray-400">Kunderapporter</h3>
              <div className="w-10 h-10 rounded-full bg-purple-900/50 flex items-center justify-center">
                <svg className="w-5 h-5 text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
              </div>
            </div>
            <p className="text-2xl font-bold text-white mt-2">12</p>
          </div>
        </div>

        {/* Filtrering og søk */}
        <div className="bg-gray-800 rounded-2xl p-6 mb-8 border border-gray-700">
          <div className="flex flex-wrap gap-4">
            <input
              type="text"
              placeholder="Søk etter rapporter..."
              className="flex-1 min-w-[200px] rounded-xl border-gray-700 focus:ring-blue-500 focus:border-blue-500 bg-gray-700 text-gray-300"
            />
            <select className="rounded-xl border-gray-700 focus:ring-blue-500 focus:border-blue-500 bg-gray-700 text-gray-300">
              <option value="all">Alle typer</option>
              <option value="timeforing">Timeføring</option>
              <option value="inspeksjon">Inspeksjon</option>
              <option value="kunde">Kunde</option>
            </select>
            <select className="rounded-xl border-gray-700 focus:ring-blue-500 focus:border-blue-500 bg-gray-700 text-gray-300">
              <option value="all">Alle status</option>
              <option value="draft">Kladd</option>
              <option value="published">Publisert</option>
              <option value="archived">Arkivert</option>
            </select>
          </div>
        </div>

        {/* Rapportliste */}
        <div className="bg-gray-800 rounded-2xl border border-gray-700 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-700">
                  <th className="px-6 py-4 text-left text-sm font-medium text-gray-400">Tittel</th>
                  <th className="px-6 py-4 text-left text-sm font-medium text-gray-400">Dato</th>
                  <th className="px-6 py-4 text-left text-sm font-medium text-gray-400">Type</th>
                  <th className="px-6 py-4 text-left text-sm font-medium text-gray-400">Status</th>
                  <th className="px-6 py-4 text-left text-sm font-medium text-gray-400">Opprettet av</th>
                  <th className="px-6 py-4 text-right text-sm font-medium text-gray-400">Handling</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-700">
                {reports.map(report => (
                  <tr key={report.id} className="hover:bg-gray-700/50">
                    <td className="px-6 py-4">
                      <div className="text-white">{report.title}</div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-white">{new Date(report.date).toLocaleDateString('nb-NO')}</div>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                        report.type === 'timeforing'
                          ? 'bg-blue-900/50 text-blue-400'
                          : report.type === 'inspeksjon'
                          ? 'bg-green-900/50 text-green-400'
                          : 'bg-purple-900/50 text-purple-400'
                      }`}>
                        {report.type.charAt(0).toUpperCase() + report.type.slice(1)}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                        report.status === 'published'
                          ? 'bg-green-900/50 text-green-400'
                          : report.status === 'draft'
                          ? 'bg-yellow-900/50 text-yellow-400'
                          : 'bg-gray-900/50 text-gray-400'
                      }`}>
                        {report.status.charAt(0).toUpperCase() + report.status.slice(1)}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-white">{report.createdBy}</div>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button className="text-blue-400 hover:text-blue-300">
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                          </svg>
                        </button>
                        <button className="text-red-400 hover:text-red-300">
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
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
    </div>
  )
} 