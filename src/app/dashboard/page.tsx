'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { supabase } from '@/lib/supabase'
import WeatherWidget from '@/components/WeatherWidget'
import MaintenanceWidget from '@/components/MaintenanceWidget'

interface Customer {
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

interface Project {
  id?: string
  name: string
  status: 'active' | 'completed' | 'on-hold'
  customerId: string
  startDate: string
  deadline?: string
  hoursUsed: number
  hoursBudgeted: number
}

interface Todo {
  id: string
  task: string
  completed: boolean
  createdAt: string
}

interface DashboardStats {
  totalCustomers: number
  pendingSpringMaintenance: number
  pendingFallMaintenance: number
  activeProjects: number
}

export default function DashboardPage() {
  const [recentCustomers, setRecentCustomers] = useState<Customer[]>([])
  const [upcomingInspections, setUpcomingInspections] = useState<Customer[]>([])
  const [stats, setStats] = useState<DashboardStats>({
    totalCustomers: 0,
    pendingSpringMaintenance: 0,
    pendingFallMaintenance: 0,
    activeProjects: 0
  })
  const [loading, setLoading] = useState(true)
  const [greeting, setGreeting] = useState('')
  const [todos, setTodos] = useState<Todo[]>([
    {
      id: '1',
      task: 'Bestille jord til Torvullvegen',
      completed: false,
      createdAt: new Date().toISOString()
    },
    {
      id: '2',
      task: 'Legge membran Nattenvegen 332',
      completed: false,
      createdAt: new Date().toISOString()
    },
    {
      id: '3',
      task: 'Ringe Kaugerud transport',
      completed: false,
      createdAt: new Date().toISOString()
    }
  ])
  const [newTodo, setNewTodo] = useState('')
  const [showAddForm, setShowAddForm] = useState(false)

  const handleAddTodo = (e: React.FormEvent) => {
    e.preventDefault()
    if (!newTodo.trim()) return
    
    setTodos([...todos, {
      id: Date.now().toString(),
      task: newTodo,
      completed: false,
      createdAt: new Date().toISOString()
    }])
    setNewTodo('')
    setShowAddForm(false)
  }
  const userName = 'Edgar' // Dette kan senere hentes fra en brukerkontekst eller API

  useEffect(() => {
    fetchDashboardData()

    const getGreeting = () => {
      const hour = new Date().getHours()
      
      if (hour >= 5 && hour < 12) {
        return 'God morgen'
      } else if (hour >= 12 && hour < 17) {
        return 'God ettermiddag'
      } else if (hour >= 17 && hour < 22) {
        return 'God kveld'
      } else {
        return 'God natt'
      }
    }

    setGreeting(getGreeting())
  }, [])

  async function fetchDashboardData() {
    try {
      setLoading(true)
      
      // Fetch all customers
      const { data: customers, error } = await supabase
        .from('abonnementer')
        .select('*')
      
      if (error) {
        console.error('Error fetching customers:', error)
        return
      }
      
      if (!customers) {
        return
      }
      
      // Calculate statistics
      const totalCustomers = customers.length
      
      // Count customers with pending spring maintenance
      const pendingSpringMaintenance = customers.filter(
        customer => customer.var !== 'Ja'
      ).length
      
      // Count customers with pending fall maintenance
      const pendingFallMaintenance = customers.filter(
        customer => customer.host !== 'Ja'
      ).length
      
      // Fetch active projects
      const { data: projects, error: projectsError } = await supabase
        .from('projects')
        .select('*')
        .eq('status', 'active')
      
      if (projectsError) {
        console.error('Error fetching projects:', projectsError)
      }
      
      setStats({
        totalCustomers,
        pendingSpringMaintenance,
        pendingFallMaintenance,
        activeProjects: projects?.length || 0
      })
      
      // Set upcoming inspections
      const sortedByRenewal = [...customers]
        .sort((a, b) => {
          const dateA = a.fornyelsesdato ? new Date(a.fornyelsesdato).getTime() : 0
          const dateB = b.fornyelsesdato ? new Date(b.fornyelsesdato).getTime() : 0
          return dateA - dateB
        })
        .slice(0, 5)
      
      setUpcomingInspections(sortedByRenewal)
      
      // Set recent customers
      const sortedByUpdate = [...customers]
        .sort((a, b) => {
          const dateA = a.fornyelsesdato ? new Date(a.fornyelsesdato).getTime() : 0
          const dateB = b.fornyelsesdato ? new Date(b.fornyelsesdato).getTime() : 0
          return dateB - dateA
        })
        .slice(0, 5)
      
      setRecentCustomers(sortedByUpdate)
    } catch (error) {
      console.error('Error in fetchDashboardData:', error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gray-900 p-4 md:p-8 ml-0 md:ml-64">
      <div className="max-w-full md:max-w-7xl xl:w-[140%] xl:-ml-[20%] mx-auto">
        <p className="text-2xl text-gray-400">
          {new Date().toLocaleDateString('no-NO', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })}
        </p>
        <h1 className="text-4xl font-bold text-white">{greeting}, {userName}</h1>
        
        {/* Header */}
        <div className="mb-12">
          <h1 className="text-4xl font-bold text-white">Dashboard</h1>
          <p className="text-gray-400 mt-2">Oversikt over aktiviteter og status</p>
        </div>

        {/* Statistikk-kort */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-6">
          <div className="bg-gray-800 rounded-2xl p-6 border border-gray-700">
            <div className="flex items-center justify-between">
              <h3 className="text-gray-400">Aktive prosjekter</h3>
              <div className="w-10 h-10 rounded-full bg-blue-900/50 flex items-center justify-center">
                <svg className="w-5 h-5 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                </svg>
              </div>
            </div>
            <p className="text-2xl font-bold text-white mt-2">
              {loading ? (
                <span className="inline-block w-8 h-6 bg-gray-700 animate-pulse rounded"></span>
              ) : (
                stats.activeProjects
              )}
            </p>
          </div>

          <div className="bg-gray-800 rounded-2xl p-6 border border-gray-700">
            <div className="flex items-center justify-between">
              <h3 className="text-gray-400">Registrerte abonnementer</h3>
              <div className="w-10 h-10 rounded-full bg-purple-900/50 flex items-center justify-center">
                <svg className="w-5 h-5 text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
              </div>
            </div>
            <p className="text-2xl font-bold text-white mt-2">
              {loading ? (
                <span className="inline-block w-8 h-6 bg-gray-700 animate-pulse rounded"></span>
              ) : (
                stats.totalCustomers
              )}
            </p>
          </div>

          <div className="bg-gray-800 rounded-2xl p-6 border border-gray-700">
            <div className="flex items-center justify-between">
              <h3 className="text-gray-400">Gjenstår vårvedlikehold</h3>
              <div className="w-10 h-10 rounded-full bg-green-900/50 flex items-center justify-center">
                <svg className="w-5 h-5 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4" />
                </svg>
              </div>
            </div>
            <p className="text-2xl font-bold text-white mt-2">
              {loading ? (
                <span className="inline-block w-8 h-6 bg-gray-700 animate-pulse rounded"></span>
              ) : (
                stats.pendingSpringMaintenance
              )}
            </p>
          </div>

          <div className="bg-gray-800 rounded-2xl p-6 border border-gray-700">
            <div className="flex items-center justify-between">
              <h3 className="text-gray-400">Gjenstår høstvedlikehold</h3>
              <div className="w-10 h-10 rounded-full bg-yellow-900/50 flex items-center justify-center">
                <svg className="w-5 h-5 text-yellow-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4" />
                </svg>
              </div>
            </div>
            <p className="text-2xl font-bold text-white mt-2">
              {loading ? (
                <span className="inline-block w-8 h-6 bg-gray-700 animate-pulse rounded"></span>
              ) : (
                stats.pendingFallMaintenance
              )}
            </p>
          </div>
        </div>

        {/* Todo List and Weather Side by Side */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
          <div className="bg-gray-800 rounded-2xl p-6 border border-gray-700">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold text-white">Todo-liste</h2>
            <button 
              className="text-sm text-blue-400 hover:text-blue-300"
              onClick={() => setShowAddForm(!showAddForm)}
            >
              Legg til
            </button>
          </div>
          
          {showAddForm && (
            <form onSubmit={handleAddTodo} className="mb-4">
              <div className="flex gap-2">
                <input
                  type="text"
                  value={newTodo}
                  onChange={(e) => setNewTodo(e.target.value)}
                  className="flex-1 bg-gray-700 border border-gray-600 rounded-lg px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Ny oppgave"
                  autoFocus
                />
                <button 
                  type="submit"
                  className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg"
                >
                  Lagre
                </button>
              </div>
            </form>
          )}
          <div className="space-y-3">
            {todos.map(todo => (
              <div key={todo.id} className="flex items-center justify-between py-3 px-4 bg-gray-700/50 rounded-lg">
                <div className="flex items-center space-x-4">
                  <button 
                    className={`w-5 h-5 rounded border ${todo.completed ? 'bg-blue-500 border-blue-500' : 'border-gray-500'}`}
                    onClick={() => setTodos(todos.map(t => 
                      t.id === todo.id ? {...t, completed: !t.completed} : t
                    ))}
                  >
                    {todo.completed && (
                      <svg className="w-3 h-3 mx-auto text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                    )}
                  </button>
                  <p className={`text-white ${todo.completed ? 'line-through text-gray-500' : ''}`}>
                    {todo.task}
                  </p>
                </div>
                <button 
                  className="text-gray-400 hover:text-red-400"
                  onClick={() => setTodos(todos.filter(t => t.id !== todo.id))}
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                  </svg>
                </button>
              </div>
            ))}
          </div>
        </div>

          {/* Weather Widget */}
          <div>
            <WeatherWidget />
            <MaintenanceWidget />
          </div>
        </div>

        {/* Activities Grid */}
        <div className="mb-6">

          {/* Aktivitetsliste */}
          <div className="bg-gray-800 rounded-2xl p-4 md:p-6 border border-gray-700">
            <h2 className="text-xl font-semibold text-white mb-4">Nylige aktiviteter</h2>
            <div className="space-y-4">
              {[1, 2, 3].map((item) => (
                <div key={item} className="flex items-center justify-between py-3 border-b border-gray-700 last:border-b-0">
                  <div className="flex items-center space-x-4">
                    <div className="w-10 h-10 rounded-full bg-gray-700 flex items-center justify-center">
                      <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                    </div>
                    <div>
                      <p className="text-white">Ny timeføring registrert</p>
                      <p className="text-sm text-gray-400">Prosjekt: Kundeportal</p>
                    </div>
                  </div>
                  <span className="text-sm text-gray-400">2 timer siden</span>
                </div>
              ))}
          </div>
        </div>
        </div>

        {/* Abonnement oversikt */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          <div className="bg-gray-800 rounded-2xl p-6 border border-gray-700">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-semibold text-white">Kommende fornyelser</h2>
              <Link href="/abonnement" className="text-sm text-blue-400 hover:text-blue-300">
                Se alle
              </Link>
            </div>
            
            {loading ? (
              <div className="space-y-4">
                {[1, 2, 3].map((item) => (
                  <div key={item} className="h-12 bg-gray-700 animate-pulse rounded"></div>
                ))}
              </div>
            ) : upcomingInspections.length > 0 ? (
              <div className="space-y-4">
                {upcomingInspections.map((customer) => (
                  <div key={customer.id} className="flex items-center justify-between py-2 border-b border-gray-700 last:border-b-0">
                    <div className="flex items-center space-x-4">
                      <div className="w-2 h-2 rounded-full bg-blue-500"></div>
                      <div>
                        <p className="text-white">{customer.etternavn}</p>
                        <p className="text-sm text-gray-400">{customer.adresse}</p>
                      </div>
                    </div>
                    <span className="text-sm text-gray-400">
                      {customer.fornyelsesdato ? new Date(customer.fornyelsesdato).toLocaleDateString('no-NO') : 'Ikke satt'}
                    </span>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-gray-400">Ingen kommende fornyelser</p>
            )}
          </div>

          <div className="bg-gray-800 rounded-2xl p-6 border border-gray-700">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-semibold text-white">Vedlikehold status</h2>
              <Link href="/abonnement" className="text-sm text-blue-400 hover:text-blue-300">
                Se detaljer
              </Link>
            </div>
            
            {loading ? (
              <div className="space-y-4">
                {[1, 2].map((item) => (
                  <div key={item} className="h-16 bg-gray-700 animate-pulse rounded mb-4"></div>
                ))}
              </div>
            ) : (
              <div className="space-y-6">
                <div>
                  <div className="flex justify-between mb-2">
                    <span className="text-gray-400">Vårvedlikehold</span>
                    <span className="text-white">{stats.pendingSpringMaintenance} gjenstår</span>
                  </div>
                  <div className="w-full bg-gray-700 rounded-full h-2.5">
                    <div 
                      className="bg-green-600 h-2.5 rounded-full" 
                      style={{ 
                        width: `${stats.totalCustomers > 0 ? 
                          ((stats.totalCustomers - stats.pendingSpringMaintenance) / stats.totalCustomers) * 100 : 0}%` 
                      }}
                    ></div>
                  </div>
                </div>
                
                <div>
                  <div className="flex justify-between mb-2">
                    <span className="text-gray-400">Høstvedlikehold</span>
                    <span className="text-white">{stats.pendingFallMaintenance} gjenstår</span>
                  </div>
                  <div className="w-full bg-gray-700 rounded-full h-2.5">
                    <div 
                      className="bg-yellow-600 h-2.5 rounded-full" 
                      style={{ 
                        width: `${stats.totalCustomers > 0 ? 
                          ((stats.totalCustomers - stats.pendingFallMaintenance) / stats.totalCustomers) * 100 : 0}%` 
                      }}
                    ></div>
                  </div>
                </div>
                <div className="pt-2 border-t border-gray-700">
                  <Link href="/abonnement/historikk" className="text-sm text-blue-400 hover:text-blue-300">
                    Se tidligere vedlikehold
                  </Link>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
