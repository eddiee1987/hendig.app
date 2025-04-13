'use client'

import { useParams } from 'next/navigation'
import { useEffect, useState } from 'react'
import { format } from 'date-fns'
import { nb } from 'date-fns/locale'

interface TimeEntry {
  id: number
  date: string
  hours: number
  project: string
  comment: string
}

interface Employee {
  name: string
  email: string
  phone: string
  role: string
  image: string
}

const employeeData: Record<string, Employee> = {
  '1': {
    name: 'Edgar Eidsheim',
    email: 'edgar@driftig.no',
    phone: '123 45 678',
    role: 'Eier/Sjef',
    image: '/images/edgar.jpg'
  },
  '2': {
    name: 'Kim Bråten',
    email: 'kim@driftig.no',
    phone: '234 56 789',
    role: 'Skogarbeider',
    image: '/images/kim.jpg'
  },
  '3': {
    name: 'Kleidas Kotlov',
    email: 'kleidas@driftig.no',
    phone: '345 67 890',
    role: 'Skogarbeider',
    image: '/images/kleidas.jpg'
  }
}

export default function EmployeeProfile() {
  const params = useParams()
  const id = params?.id as string
  const [timeEntries, setTimeEntries] = useState<TimeEntry[]>([])
  const [loading, setLoading] = useState(true)
  const [newEntry, setNewEntry] = useState<Omit<TimeEntry, 'id'>>({
    date: format(new Date(), 'yyyy-MM-dd'),
    hours: 7.5,
    project: '',
    comment: ''
  })
  const [showForm, setShowForm] = useState(false)

  const projects = [
    'Administrasjon',
    'Skigardkløyving', 
    'Beising',
    'Trefelling',
    'Transport'
  ]

  useEffect(() => {
    const fetchTimeEntries = async () => {
      try {
        // TODO: Replace with actual Supabase query
        // const { data } = await supabase
        //   .from('time_entries')
        //   .select('*')
        //   .eq('employee_id', id)
        //   .order('date', { ascending: false })
        
        // Mock data for now
        const data = [
          {
            id: 1,
            date: '2025-04-08',
            hours: 7.5,
            project: 'Skigardkløyving',
            comment: 'Kløyvd skigard på Østmarka'
          },
          {
            id: 2,
            date: '2025-04-07',
            hours: 6,
            project: 'Beising',
            comment: 'Beist stolper på Lillestrøm'
          }
        ]
        setTimeEntries(data)
      } catch (error) {
        console.error('Error fetching time entries:', error)
      } finally {
        setLoading(false)
      }
    }
    fetchTimeEntries()
  }, [id])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      // TODO: Replace with actual Supabase insert
      // const { data } = await supabase
      //   .from('time_entries')
      //   .insert([{ ...newEntry, employee_id: id }])
      //   .select()
      
      // Mock response
      const mockEntry = {
        id: Math.max(0, ...timeEntries.map(e => e.id)) + 1,
        ...newEntry
      }
      
      setTimeEntries([mockEntry, ...timeEntries])
      setNewEntry({
        date: format(new Date(), 'yyyy-MM-dd'),
        hours: 7.5,
        project: '',
        comment: ''
      })
      setShowForm(false)
    } catch (error) {
      console.error('Error saving time entry:', error)
    }
  }

  const employee = id ? employeeData[id] : undefined

  if (!employee) {
    return <div className="text-white">Ansatt ikke funnet</div>
  }

  return (
    <div className="min-h-screen bg-gray-900 p-4 md:p-8 ml-0 md:ml-64">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row gap-8">
          {/* Employee info */}
          <div className="bg-gray-800 rounded-2xl p-6 border border-gray-700 w-full md:w-1/3">
            <div className="flex flex-col items-center">
              <div className="w-32 h-32 rounded-full bg-gray-700 mb-4 overflow-hidden">
                {/* Employee image would go here */}
                <div className="w-full h-full flex items-center justify-center text-4xl text-gray-400">
                  {employee.name.charAt(0)}
                </div>
              </div>
              <h2 className="text-2xl font-bold text-white">{employee.name}</h2>
              <p className="text-gray-400">{employee.role}</p>
              
              <div className="mt-6 w-full space-y-3">
                <div className="flex items-center gap-3">
                  <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                  <span className="text-gray-300">{employee.email}</span>
                </div>
                <div className="flex items-center gap-3">
                  <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                  </svg>
                  <span className="text-gray-300">{employee.phone}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Time entries */}
          <div className="bg-gray-800 rounded-2xl p-6 border border-gray-700 w-full md:w-2/3">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-xl font-semibold text-white">Timeføring</h3>
              <button 
                onClick={() => setShowForm(!showForm)}
                className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm"
              >
                {showForm ? 'Avbryt' : 'Ny timeføring'}
              </button>
            </div>

            {showForm && (
              <form onSubmit={handleSubmit} className="bg-gray-700/50 rounded-lg p-4 mb-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm text-gray-300 mb-1">Dato</label>
                    <input
                      type="date"
                      value={newEntry.date}
                      onChange={(e) => setNewEntry({...newEntry, date: e.target.value})}
                      className="w-full bg-gray-600 border border-gray-500 rounded-lg px-3 py-2 text-white"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm text-gray-300 mb-1">Timer</label>
                    <input
                      type="number"
                      step="0.5"
                      min="0.5"
                      max="24"
                      value={newEntry.hours}
                      onChange={(e) => setNewEntry({...newEntry, hours: parseFloat(e.target.value)})}
                      className="w-full bg-gray-600 border border-gray-500 rounded-lg px-3 py-2 text-white"
                      required
                    />
                  </div>
                  <div className="md:col-span-2">
                    <label className="block text-sm text-gray-300 mb-1">Prosjekt</label>
                    <select
                      value={newEntry.project}
                      onChange={(e) => setNewEntry({...newEntry, project: e.target.value})}
                      className="w-full bg-gray-600 border border-gray-500 rounded-lg px-3 py-2 text-white"
                      required
                    >
                      <option value="">Velg prosjekt</option>
                      {projects.map(project => (
                        <option key={project} value={project}>{project}</option>
                      ))}
                    </select>
                  </div>
                  <div className="md:col-span-2">
                    <label className="block text-sm text-gray-300 mb-1">Kommentar (valgfritt)</label>
                    <textarea
                      value={newEntry.comment}
                      onChange={(e) => setNewEntry({...newEntry, comment: e.target.value})}
                      className="w-full bg-gray-600 border border-gray-500 rounded-lg px-3 py-2 text-white"
                      rows={2}
                    />
                  </div>
                </div>
                <div className="flex justify-end mt-4">
                  <button
                    type="submit"
                    className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg"
                  >
                    Lagre
                  </button>
                </div>
              </form>
            )}
            
            {loading ? (
              <div className="text-gray-400">Laster timeføring...</div>
            ) : timeEntries.length === 0 ? (
              <div className="text-gray-400">Ingen registrerte timer</div>
            ) : (
              <div className="space-y-4">
                {timeEntries.map(entry => (
                  <div key={entry.id} className="bg-gray-700/50 rounded-lg p-4">
                    <div className="flex justify-between items-start">
                      <div>
                        <h4 className="font-medium text-white">{entry.project}</h4>
                        <p className="text-sm text-gray-400 mt-1">
                          {format(new Date(entry.date), 'EEEE d. MMMM yyyy', { locale: nb })}
                        </p>
                        {entry.comment && (
                          <p className="text-sm text-gray-300 mt-2">{entry.comment}</p>
                        )}
                      </div>
                      <div className="text-lg font-semibold text-white">
                        {entry.hours} timer
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
