'use client'

import { useState, useEffect, useMemo } from 'react'
import { supabase } from '@/lib/supabase'

interface TimeEntry {
  id: string
  date: string
  startTime: string
  endTime: string
  project: string
  comments: string
  totalHours?: number
}

export default function TimeforingPage() {
  const [timeEntries, setTimeEntries] = useState<TimeEntry[]>([])
  const [newEntry, setNewEntry] = useState<Partial<TimeEntry>>({
    date: new Date().toISOString().split('T')[0],
    startTime: '',
    endTime: '',
    project: '',
    comments: ''
  })
  const [selectedProject, setSelectedProject] = useState<string>('all')
  const [timeRange, setTimeRange] = useState<'week' | 'month' | 'all'>('all')

  // Ikoner for prosjekttyper
  const projectOptions = [
    { value: 'Skigard', label: 'Skigard', icon: (
      <svg className="w-5 h-5 inline mr-2 text-yellow-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><rect x="4" y="10" width="16" height="4" rx="2" strokeWidth="2" /><path d="M8 10V6m8 4V6" strokeWidth="2" /></svg>
    ) },
    { value: 'Torvtak', label: 'Torvtak', icon: (
      <svg className="w-5 h-5 inline mr-2 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><rect x="3" y="12" width="18" height="7" rx="2" strokeWidth="2" /><path d="M3 12l9-7 9 7" strokeWidth="2" /></svg>
    ) },
    { value: 'Administrasjon', label: 'Administrasjon', icon: (
      <svg className="w-5 h-5 inline mr-2 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><rect x="4" y="4" width="16" height="16" rx="2" strokeWidth="2" /><path d="M8 4v16M16 4v16" strokeWidth="2" /></svg>
    ) },
    { value: 'Transport', label: 'Transport', icon: (
      <svg className="w-5 h-5 inline mr-2 text-indigo-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><rect x="3" y="13" width="18" height="6" rx="2" strokeWidth="2" /><path d="M5 13V7a2 2 0 012-2h10a2 2 0 012 2v6" strokeWidth="2" /></svg>
    ) },
    { value: 'Kløyving', label: 'Kløyving', icon: (
      <svg className="w-5 h-5 inline mr-2 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M12 3v18M6 8l6 6 6-6" strokeWidth="2" /></svg>
    ) },
    { value: 'Trefelling', label: 'Trefelling', icon: (
      <svg className="w-5 h-5 inline mr-2 text-emerald-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M12 2v20M6 18l6-6 6 6" strokeWidth="2" /></svg>
    ) },
  ]

  // Funksjon for å beregne timer mellom to tidspunkter
  const calculateHours = (startTime: string, endTime: string): number => {
    const [startHour, startMinute] = startTime.split(':').map(Number)
    const [endHour, endMinute] = endTime.split(':').map(Number)
    
    let hours = endHour - startHour
    let minutes = endMinute - startMinute
    
    if (minutes < 0) {
      hours -= 1
      minutes += 60
    }
    
    return Number((hours + minutes / 60).toFixed(2))
  }

  // Beregn total arbeidstid for alle entries
  const calculateTotalHours = (entries: TimeEntry[]): number => {
    return entries.reduce((total, entry) => {
      if (entry.startTime && entry.endTime) {
        return total + calculateHours(entry.startTime, entry.endTime)
      }
      return total
    }, 0)
  }

  // Summering for dag, uke, måned
  const today = new Date().toISOString().split('T')[0]
  const now = new Date()
  const startOfWeek = new Date(now)
  startOfWeek.setDate(now.getDate() - now.getDay())
  const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1)

  const dailyHours = useMemo(() => calculateTotalHours(timeEntries.filter(e => e.date === today)), [timeEntries, today])
  const weeklyHours = useMemo(() => calculateTotalHours(timeEntries.filter(e => new Date(e.date) >= startOfWeek)), [timeEntries])
  const monthlyHours = useMemo(() => calculateTotalHours(timeEntries.filter(e => new Date(e.date) >= startOfMonth)), [timeEntries])

  // Last inn eksisterende timeføringer fra Supabase
  useEffect(() => {
    fetchTimeEntries()
  }, [])

  async function fetchTimeEntries() {
    try {
      console.log('Henter timeføringer...')
      const { data, error } = await supabase
        .from('time_entries')
        .select('*')
        .order('date', { ascending: false })
      
      if (error) {
        console.error('Supabase error:', error)
        throw error
      }
      
      // Konverter data fra Supabase format til applikasjonens format
      const formattedEntries = data.map((entry: any) => ({
        id: entry.id,
        date: entry.date,
        startTime: entry.start_time.substring(0, 5), // Format HH:MM
        endTime: entry.end_time.substring(0, 5), // Format HH:MM
        project: entry.project,
        comments: entry.comments || '',
        totalHours: entry.total_hours
      }))
      
      console.log('Mottatt timeføringer:', formattedEntries)
      setTimeEntries(formattedEntries || [])
    } catch (error) {
      console.error('Fetch error:', error)
      // Vis feilmelding til bruker
      alert('Kunne ikke hente timeføringer. Prøv igjen senere.')
    }
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    setNewEntry(prev => ({
      ...prev,
      [name]: value
    }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    try {
      const totalHours = calculateHours(newEntry.startTime || '', newEntry.endTime || '')
      
      // Forbered data for Supabase
      const timeEntryData = {
        date: newEntry.date,
        start_time: newEntry.startTime,
        end_time: newEntry.endTime,
        project: newEntry.project,
        comments: newEntry.comments,
        total_hours: totalHours
      }
      
      // Lagre til Supabase
      const { data, error } = await supabase
        .from('time_entries')
        .insert([timeEntryData])
        .select()
      
      if (error) {
        console.error('Supabase insert error:', error)
        throw error
      }
      
      // Konverter den returnerte posten til applikasjonens format
      const newTimeEntry: TimeEntry = {
        id: data[0].id,
        date: data[0].date,
        startTime: data[0].start_time.substring(0, 5),
        endTime: data[0].end_time.substring(0, 5),
        project: data[0].project,
        comments: data[0].comments || '',
        totalHours: data[0].total_hours
      }
      
      // Oppdater lokal state
      setTimeEntries(prev => [newTimeEntry, ...prev])
      
      // Tilbakestill skjema
      setNewEntry({
        date: new Date().toISOString().split('T')[0],
        startTime: '',
        endTime: '',
        project: '',
        comments: ''
      })
      
      console.log('Timeføring lagret:', newTimeEntry)
    } catch (error) {
      console.error('Submit error:', error)
      alert('Kunne ikke lagre timeføring. Prøv igjen senere.')
    }
  }

  const handleDelete = async (id: string) => {
    if (window.confirm('Er du sikker på at du vil slette denne timeføringen?')) {
      try {
        const { error } = await supabase
          .from('time_entries')
          .delete()
          .eq('id', id)
        
        if (error) {
          console.error('Supabase delete error:', error)
          throw error
        }
        
        // Oppdater lokal state
        setTimeEntries(prev => prev.filter(entry => entry.id !== id))
        console.log('Timeføring slettet:', id)
      } catch (error) {
        console.error('Delete error:', error)
        alert('Kunne ikke slette timeføring. Prøv igjen senere.')
      }
    }
  }

  const filteredEntries = timeEntries.filter(entry => {
    const projectMatch = selectedProject === 'all' || entry.project === selectedProject
    const date = new Date(entry.date)
    const now = new Date()
    
    let dateMatch = true
    if (timeRange === 'week') {
      const weekAgo = new Date(now.setDate(now.getDate() - 7))
      dateMatch = date >= weekAgo
    } else if (timeRange === 'month') {
      const monthAgo = new Date(now.setMonth(now.getMonth() - 1))
      dateMatch = date >= monthAgo
    }
    
    return projectMatch && dateMatch
  })

  const projects = Array.from(new Set(timeEntries.map(entry => entry.project)))

  const exportToCSV = () => {
    const headers = ['Dato', 'Prosjekt', 'Starttid', 'Sluttid', 'Timer', 'Kommentarer']
    const csvContent = [
      headers.join(','),
      ...filteredEntries.map(entry => [
        entry.date,
        entry.project,
        entry.startTime,
        entry.endTime,
        entry.totalHours,
        `"${entry.comments}"`
      ].join(','))
    ].join('\n')

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' })
    const link = document.createElement('a')
    link.href = URL.createObjectURL(blob)
    link.download = 'timeforing.csv'
    link.click()
  }

  return (
    <div className="min-h-screen bg-gray-900 p-8 ml-64">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex justify-between items-center mb-12">
          <div>
            <h1 className="text-4xl font-bold text-white">
              Timeføring
            </h1>
            <p className="text-gray-400 mt-2">Hold oversikt over dine timer</p>
          </div>
          <div className="flex gap-4">
            <button
              onClick={exportToCSV}
              className="bg-gray-800 hover:bg-gray-700 text-gray-300 px-6 py-3 rounded-full flex items-center gap-2 shadow-sm border border-gray-700 transition-all duration-200 hover:shadow-md"
            >
              <span>Eksporter CSV</span>
            </button>
            <button
              onClick={() => alert('Send til Fiken-funksjon kommer snart!')}
              className="bg-blue-700 hover:bg-blue-800 text-white px-6 py-3 rounded-full flex items-center gap-2 shadow-sm border border-blue-800 transition-all duration-200 hover:shadow-md"
            >
              <span>Send timeliste til Fiken</span>
            </button>
          </div>
        </div>

        {/* Statistikk-kort */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
          <div className="bg-gray-800 rounded-2xl p-8 shadow-sm border border-gray-700 hover:shadow-md transition-all duration-200">
            <div className="flex items-center justify-between">
              <h3 className="text-gray-400 font-medium">Timer i dag</h3>
              <div className="w-12 h-12 rounded-full bg-green-900/50 flex items-center justify-center">
                <svg className="w-6 h-6 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><circle cx="12" cy="12" r="10" strokeWidth="2" /><path d="M12 6v6l4 2" strokeWidth="2" /></svg>
              </div>
            </div>
            <p className="text-3xl font-bold text-white mt-4">{dailyHours.toFixed(2)} t</p>
          </div>
          <div className="bg-gray-800 rounded-2xl p-8 shadow-sm border border-gray-700 hover:shadow-md transition-all duration-200">
            <div className="flex items-center justify-between">
              <h3 className="text-gray-400 font-medium">Timer denne uken</h3>
              <div className="w-12 h-12 rounded-full bg-blue-900/50 flex items-center justify-center">
                <svg className="w-6 h-6 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><rect x="4" y="4" width="16" height="16" rx="2" strokeWidth="2" /><path d="M8 4v16M16 4v16" strokeWidth="2" /></svg>
              </div>
            </div>
            <p className="text-3xl font-bold text-white mt-4">{weeklyHours.toFixed(2)} t</p>
          </div>
          <div className="bg-gray-800 rounded-2xl p-8 shadow-sm border border-gray-700 hover:shadow-md transition-all duration-200">
            <div className="flex items-center justify-between">
              <h3 className="text-gray-400 font-medium">Timer denne måneden</h3>
              <div className="w-12 h-12 rounded-full bg-purple-900/50 flex items-center justify-center">
                <svg className="w-6 h-6 text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><rect x="3" y="12" width="18" height="7" rx="2" strokeWidth="2" /><path d="M3 12l9-7 9 7" strokeWidth="2" /></svg>
              </div>
            </div>
            <p className="text-3xl font-bold text-white mt-4">{monthlyHours.toFixed(2)} t</p>
          </div>
        </div>

        {/* Filtreringsvalg */}
        <div className="bg-gray-800 rounded-2xl p-6 mb-12 shadow-sm border border-gray-700">
          <div className="flex flex-wrap gap-4">
            <select
              value={selectedProject}
              onChange={(e) => setSelectedProject(e.target.value)}
              className="rounded-full border-gray-700 focus:ring-blue-500 focus:border-blue-500 bg-gray-700 text-gray-300"
            >
              <option value="all">Alle prosjekter</option>
              {projects.map(project => (
                <option key={project} value={project}>{project}</option>
              ))}
            </select>
            <select
              value={timeRange}
              onChange={(e) => setTimeRange(e.target.value as 'week' | 'month' | 'all')}
              className="rounded-full border-gray-700 focus:ring-blue-500 focus:border-blue-500 bg-gray-700 text-gray-300"
            >
              <option value="all">All tid</option>
              <option value="week">Siste uke</option>
              <option value="month">Siste måned</option>
            </select>
          </div>
        </div>

        {/* Registreringsskjema */}
        <div className="bg-gray-800 rounded-2xl p-8 mb-12 shadow-sm border border-gray-700">
          <h2 className="text-2xl font-semibold mb-6 text-white">Registrer timer</h2>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-400 mb-2">Dato</label>
                <input
                  type="date"
                  name="date"
                  value={newEntry.date}
                  onChange={handleInputChange}
                  className="w-full rounded-xl border-gray-700 focus:ring-blue-500 focus:border-blue-500 bg-gray-700 text-gray-300"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-400 mb-2">Prosjekt</label>
                <select
                  name="project"
                  value={newEntry.project}
                  onChange={handleInputChange}
                  className="w-full rounded-xl border-gray-700 focus:ring-blue-500 focus:border-blue-500 bg-gray-700 text-gray-300"
                  required
                >
                  <option value="">Velg prosjekt...</option>
                  {projectOptions.map(opt => (
                    <option key={opt.value} value={opt.value}>{opt.label}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-400 mb-2">Starttid</label>
                <input
                  type="time"
                  name="startTime"
                  value={newEntry.startTime}
                  onChange={handleInputChange}
                  className="w-full rounded-xl border-gray-700 focus:ring-blue-500 focus:border-blue-500 bg-gray-700 text-gray-300"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-400 mb-2">Sluttid</label>
                <input
                  type="time"
                  name="endTime"
                  value={newEntry.endTime}
                  onChange={handleInputChange}
                  className="w-full rounded-xl border-gray-700 focus:ring-blue-500 focus:border-blue-500 bg-gray-700 text-gray-300"
                  required
                />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-400">Kommentarer</label>
              <textarea
                name="comments"
                value={newEntry.comments}
                onChange={handleInputChange}
                rows={3}
                className="w-full rounded-xl border-gray-700 focus:ring-blue-500 focus:border-blue-500 bg-gray-700 text-gray-300"
              />
            </div>
            <div className="flex justify-end">
              <button
                type="submit"
                className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded-lg shadow-sm transition-colors"
              >
                Lagre timer
              </button>
            </div>
          </form>
        </div>

        {/* Liste over timeføringer */}
        <div className="bg-gray-800 rounded-2xl p-8 shadow-sm border border-gray-700">
          <h2 className="text-2xl font-semibold mb-6 text-white">Registrerte timer</h2>
          <div className="space-y-4">
            {filteredEntries.map(entry => (
              <div key={entry.id} className="border-b border-gray-700 pb-4 last:border-b-0">
                <div className="flex justify-between items-start">
                  <div>
                    <p className="font-medium text-white">{entry.project}</p>
                    <p className="text-sm text-gray-400">
                      {new Date(entry.date).toLocaleDateString('nb-NO')} ({entry.startTime} - {entry.endTime})
                    </p>
                    <p className="text-sm text-blue-400 font-medium">
                      Timer: {entry.totalHours?.toFixed(2)}
                    </p>
                    {entry.comments && (
                      <p className="text-sm text-gray-500 mt-1">{entry.comments}</p>
                    )}
                  </div>
                  <button
                    onClick={() => handleDelete(entry.id)}
                    className="text-red-500 hover:text-red-600"
                  >
                    Slett
                  </button>
                </div>
              </div>
            ))}
            {filteredEntries.length === 0 && (
              <p className="text-gray-500 text-center">Ingen timeføringer registrert</p>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
