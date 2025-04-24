'use client'

import { useParams } from 'next/navigation'
import { useEffect, useState } from 'react'
import { format } from 'date-fns'
import { nb } from 'date-fns/locale'
import { fetchTimeEntriesByEmployeeId } from '@/lib/supabase'

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
        const data = await fetchTimeEntriesByEmployeeId(id);
        setTimeEntries(data);
      } catch (error) {
        console.error('Error fetching time entries:', error)
      } finally {
        setLoading(false)
      }
    };
    fetchTimeEntries();
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

          {/* Timeføring er flyttet til timeforing-modulen */}
          <div className="bg-gray-800 rounded-2xl p-6 border border-gray-700 w-full md:w-2/3 flex items-center justify-center">
            <div className="text-gray-400 text-center">
              <p>Timeføring for ansatte er nå samlet i <b>Timeføring</b>-modulen.</p>
              <a href="/timeforing" className="text-blue-400 underline">Gå til timeføring</a>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
