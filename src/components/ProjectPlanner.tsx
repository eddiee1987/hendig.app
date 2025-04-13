'use client'

import { useState, useEffect, useRef } from 'react'
import { ChevronLeftIcon, ChevronRightIcon, CalendarIcon, ListBulletIcon, FunnelIcon, HomeIcon } from '@heroicons/react/24/outline'
import { Project as SupabaseProject } from '@/types/supabase'
import { getScheduledProjects, scheduleProject, unscheduleProjectByProjectIdAndDate } from '@/services/projectService'
import { getScheduledAbonnements, scheduleAbonnement, unscheduleAbonnementByIdAndDate } from '@/services/abonnementService'
import { toast } from 'react-hot-toast'

interface Project {
  id: string
  name: string
  description: string
  client: string
  status: 'active' | 'completed' | 'archived'
  startDate: string
  endDate?: string
  budget?: number
  priority: 'low' | 'medium' | 'high'
}

interface Abonnement {
  id: string
  etternavn: string
  adresse: string
  kommune: string
  var: string
  host: string
  epost: string
  fornyelsesdato: string
  tak_storrelse?: string
}

interface ScheduledProject extends Project {
  scheduledDate: string
  scheduledId: string
}

interface ScheduledAbonnement extends Abonnement {
  scheduledDate: string
  scheduledId: string
}

interface CalendarDay {
  date: Date
  dayOfMonth: number
  isCurrentMonth: boolean
  isToday: boolean
  projects: ScheduledProject[]
  abonnements: ScheduledAbonnement[]
}

// Convert Supabase project format to our internal format
const convertProject = (project: SupabaseProject): Project => ({
  id: project.id,
  name: project.name,
  description: project.description,
  client: project.client,
  status: project.status,
  startDate: project.start_date,
  endDate: project.end_date,
  budget: project.budget ? Number(project.budget) : undefined,
  priority: project.priority
})

export default function ProjectPlanner({ projects, abonnements }: { projects: Project[], abonnements: Abonnement[] }) {
  const [view, setView] = useState<'month' | 'week' | 'day'>('month')
  const [currentDate, setCurrentDate] = useState(new Date())
  const [calendarDays, setCalendarDays] = useState<CalendarDay[]>([])
  const [scheduledProjects, setScheduledProjects] = useState<ScheduledProject[]>([])
  const [scheduledAbonnements, setScheduledAbonnements] = useState<ScheduledAbonnement[]>([])
  const [filter, setFilter] = useState<'all' | 'active' | 'completed' | 'archived'>('all')
  const [showFilterMenu, setShowFilterMenu] = useState(false)
  const [draggedProject, setDraggedProject] = useState<Project | null>(null)
  const [draggedAbonnement, setDraggedAbonnement] = useState<Abonnement | null>(null)
  const [showProjectInfo, setShowProjectInfo] = useState<string | null>(null)
  const [showAbonnementInfo, setShowAbonnementInfo] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [activeTab, setActiveTab] = useState<'projects' | 'abonnements'>('projects')
  const dragCounter = useRef(0)
  const filterMenuRef = useRef<HTMLDivElement>(null)

  // Load scheduled projects and abonnements from Supabase
  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true)
        
        // Fetch scheduled projects
        const projectsData = await getScheduledProjects()
        const formattedProjectsData = projectsData.map(item => ({
          ...convertProject(item.projects as unknown as SupabaseProject),
          scheduledDate: item.scheduled_date,
          scheduledId: item.id
        }))
        setScheduledProjects(formattedProjectsData)
        
        // Fetch scheduled abonnements
        const abonnementsData = await getScheduledAbonnements()
        if (!abonnementsData) {
          throw new Error('No data returned from getScheduledAbonnements')
        }
        
        const formattedAbonnementsData = abonnementsData.map(item => {
          if (!item.abonnementer) {
            console.warn('Missing abonnementer data for scheduled item:', item)
            return null
          }
          return {
            ...item.abonnementer,
            scheduledDate: item.scheduled_date,
            scheduledId: item.id
          }
        }).filter(Boolean) as ScheduledAbonnement[]
        
        setScheduledAbonnements(formattedAbonnementsData)
      } catch (error) {
        console.error('Error fetching scheduled data:', error)
        toast.error('Kunne ikke hente planlagte data')
      } finally {
        setIsLoading(false)
      }
    }
    
    fetchData()
  }, [])

  // Close filter menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (filterMenuRef.current && !filterMenuRef.current.contains(event.target as Node) && showFilterMenu) {
        setShowFilterMenu(false)
      }
    }
    
    document.addEventListener('mousedown', handleClickOutside)
    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [showFilterMenu])

  // Generate calendar days
  useEffect(() => {
    const days: CalendarDay[] = []
    const today = new Date()
    
    // Get first day of month
    const firstDayOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1)
    
    // Get last day of month
    const lastDayOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0)
    
    // Get day of week of first day (0 = Sunday, 1 = Monday, etc.)
    let firstDayOfWeek = firstDayOfMonth.getDay()
    // Adjust for Monday as first day of week
    firstDayOfWeek = firstDayOfWeek === 0 ? 6 : firstDayOfWeek - 1
    
    // Add days from previous month
    const daysFromPrevMonth = firstDayOfWeek
    const prevMonth = new Date(currentDate.getFullYear(), currentDate.getMonth(), 0)
    
    for (let i = daysFromPrevMonth - 1; i >= 0; i--) {
      const date = new Date(prevMonth.getFullYear(), prevMonth.getMonth(), prevMonth.getDate() - i)
      days.push({
        date,
        dayOfMonth: date.getDate(),
        isCurrentMonth: false,
        isToday: date.toDateString() === today.toDateString(),
        projects: getProjectsForDate(date),
        abonnements: getAbonnementsForDate(date)
      })
    }
    
    // Add days from current month
    for (let i = 1; i <= lastDayOfMonth.getDate(); i++) {
      const date = new Date(currentDate.getFullYear(), currentDate.getMonth(), i)
      days.push({
        date,
        dayOfMonth: i,
        isCurrentMonth: true,
        isToday: date.toDateString() === today.toDateString(),
        projects: getProjectsForDate(date),
        abonnements: getAbonnementsForDate(date)
      })
    }
    
    // Add days from next month to complete the grid (6 rows x 7 days = 42 cells)
    const daysToAdd = 42 - days.length
    for (let i = 1; i <= daysToAdd; i++) {
      const date = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, i)
      days.push({
        date,
        dayOfMonth: i,
        isCurrentMonth: false,
        isToday: date.toDateString() === today.toDateString(),
        projects: getProjectsForDate(date),
        abonnements: getAbonnementsForDate(date)
      })
    }
    
    setCalendarDays(days)
  }, [currentDate, scheduledProjects])

  // Get projects scheduled for a specific date
  function getProjectsForDate(date: Date): ScheduledProject[] {
    const dateString = date.toISOString().split('T')[0]
    return scheduledProjects.filter(project => project.scheduledDate === dateString)
  }
  
  // Get abonnements scheduled for a specific date
  function getAbonnementsForDate(date: Date): ScheduledAbonnement[] {
    const dateString = date.toISOString().split('T')[0]
    return scheduledAbonnements.filter(abonnement => abonnement.scheduledDate === dateString)
  }

  // Navigation functions
  const goToPrev = () => {
    if (view === 'month') {
      setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1))
    } else if (view === 'week') {
      const newDate = new Date(currentDate)
      newDate.setDate(newDate.getDate() - 7)
      setCurrentDate(newDate)
    } else if (view === 'day') {
      const newDate = new Date(currentDate)
      newDate.setDate(newDate.getDate() - 1)
      setCurrentDate(newDate)
    }
  }

  const goToNext = () => {
    if (view === 'month') {
      setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1))
    } else if (view === 'week') {
      const newDate = new Date(currentDate)
      newDate.setDate(newDate.getDate() + 7)
      setCurrentDate(newDate)
    } else if (view === 'day') {
      const newDate = new Date(currentDate)
      newDate.setDate(newDate.getDate() + 1)
      setCurrentDate(newDate)
    }
  }

  const goToToday = () => {
    setCurrentDate(new Date())
  }

  // Format date for display based on view
  const getHeaderText = () => {
    if (view === 'month') {
      return currentDate.toLocaleDateString('nb-NO', { month: 'long', year: 'numeric' })
    } else if (view === 'week') {
      const startOfWeek = new Date(currentDate)
      const dayOfWeek = startOfWeek.getDay()
      const diff = dayOfWeek === 0 ? -6 : 1 - dayOfWeek // Adjust to get Monday
      startOfWeek.setDate(startOfWeek.getDate() + diff)
      
      const endOfWeek = new Date(startOfWeek)
      endOfWeek.setDate(endOfWeek.getDate() + 6)
      
      const startMonth = startOfWeek.getMonth() === endOfWeek.getMonth() 
        ? '' 
        : startOfWeek.toLocaleDateString('nb-NO', { month: 'long' }) + ' '
      
      return `${startMonth}${startOfWeek.getDate()}. - ${endOfWeek.toLocaleDateString('nb-NO', { day: 'numeric', month: 'long', year: 'numeric' })}`
    } else {
      return currentDate.toLocaleDateString('nb-NO', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })
    }
  }

  // Get day name
  const getDayName = (dayIndex: number) => {
    const days = ['Man', 'Tirs', 'Ons', 'Tors', 'Fre', 'Lør', 'Søn']
    return days[dayIndex]
  }

  // Handle drag start
  const handleDragStart = (project: Project) => {
    setDraggedProject(project)
  }

  // Handle drag over
  const handleDragOver = (e: React.DragEvent, date: Date) => {
    e.preventDefault()
  }

  // Handle drag enter
  const handleDragEnter = (e: React.DragEvent) => {
    e.preventDefault()
    dragCounter.current++
  }

  // Handle drag leave
  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault()
    dragCounter.current--
  }

  // Handle drop
  const handleDrop = async (e: React.DragEvent, date: Date) => {
    e.preventDefault()
    dragCounter.current = 0
    
    const dateString = date.toISOString().split('T')[0]
    
    // Handle project drop
    if (draggedProject) {
      // Check if project is already scheduled for this date
      const alreadyScheduled = scheduledProjects.some(
        p => p.id === draggedProject.id && p.scheduledDate === dateString
      )
      
      if (alreadyScheduled) {
        setDraggedProject(null)
        return
      }
      
      try {
        // Schedule project in Supabase
        const result = await scheduleProject(draggedProject.id, dateString)
        
        if (result) {
          // Add new scheduled project to state
          const newScheduledProject: ScheduledProject = {
            ...draggedProject,
            scheduledDate: dateString,
            scheduledId: result.id
          }
          
          setScheduledProjects([...scheduledProjects, newScheduledProject])
          toast.success('Prosjekt planlagt')
        }
      } catch (error) {
        console.error('Error scheduling project:', error)
        toast.error('Kunne ikke planlegge prosjekt')
      } finally {
        setDraggedProject(null)
      }
    }
    
    // Handle abonnement drop
    if (draggedAbonnement) {
      // Validate abonnement data
      if (!draggedAbonnement.id) {
        toast.error('Ugyldig vedlikeholdsavtale - mangler ID')
        setDraggedAbonnement(null)
        return
      }

      // Check if abonnement is already scheduled for this date
      const alreadyScheduled = scheduledAbonnements.some(
        a => a.id === draggedAbonnement.id && a.scheduledDate === dateString
      )
      
      if (alreadyScheduled) {
        setDraggedAbonnement(null)
        return
      }
      
      try {
        console.log('Attempting to schedule abonnement:', {
          id: draggedAbonnement.id,
          date: dateString
        })
        
        // Schedule abonnement in Supabase
        const result = await scheduleAbonnement(draggedAbonnement.id, dateString)
        
        if (result) {
          console.log('Successfully scheduled abonnement:', result)
          // Add new scheduled abonnement to state
          const newScheduledAbonnement: ScheduledAbonnement = {
            ...draggedAbonnement,
            scheduledDate: dateString,
            scheduledId: result.id
          }
          
          setScheduledAbonnements([...scheduledAbonnements, newScheduledAbonnement])
          toast.success('Vedlikeholdsavtale planlagt')
        } else {
          console.error('No result returned from scheduleAbonnement')
          toast.error('Ingen data returnert fra server')
        }
      } catch (error) {
        console.error('Detailed error scheduling abonnement:', {
          error: error instanceof Error ? error.message : error,
          stack: error instanceof Error ? error.stack : undefined,
          abonnementId: draggedAbonnement.id,
          date: dateString
        })
        if (error instanceof Error) {
          if (error.message.includes('JWT expired') || error.message.includes('Invalid API key')) {
            toast.error('Autentiseringsfeil - sjekk API-nøkkel')
          } else if (error.message.includes('foreign key constraint')) {
            toast.error('Ugyldig vedlikeholdsavtale-ID')
          } else {
            toast.error(`Feil ved planlegging: ${error.message}`)
          }
        } else {
          toast.error('Ukjent feil ved planlegging')
        }
      } finally {
        setDraggedAbonnement(null)
      }
    }
  }

  // Remove project from calendar
  const removeFromCalendar = async (projectId: string, date: string) => {
    try {
      await unscheduleProjectByProjectIdAndDate(projectId, date)
      
      setScheduledProjects(scheduledProjects.filter(
        p => !(p.id === projectId && p.scheduledDate === date)
      ))
      
      toast.success('Prosjekt fjernet fra kalender')
    } catch (error) {
      console.error('Error removing project from calendar:', error)
      toast.error('Kunne ikke fjerne prosjekt fra kalender')
    }
  }
  
  // Remove abonnement from calendar
  const removeAbonnementFromCalendar = async (abonnementId: string, date: string) => {
    try {
      await unscheduleAbonnementByIdAndDate(abonnementId, date)
      
      setScheduledAbonnements(scheduledAbonnements.filter(
        a => !(a.id === abonnementId && a.scheduledDate === date)
      ))
      
      toast.success('Vedlikeholdsavtale fjernet fra kalender')
    } catch (error) {
      console.error('Error removing abonnement from calendar:', error)
      toast.error('Kunne ikke fjerne vedlikeholdsavtale fra kalender')
    }
  }

  // Filter projects based on status
  const filteredProjects = filter === 'all' 
    ? projects 
    : projects.filter(project => project.status === filter)

  return (
    <div className="bg-gray-900 rounded-xl border border-gray-800">
      <div className="flex flex-col h-full">
        {/* Tabs */}
        <div className="flex border-b border-gray-800">
          <button
            className={`px-4 py-3 text-sm font-medium flex items-center ${
              view === 'month' 
                ? 'text-white border-b-2 border-blue-500' 
                : 'text-gray-400 hover:text-white'
            }`}
            onClick={() => setView('month')}
          >
            <CalendarIcon className="w-4 h-4 mr-2" />
            Måned
          </button>
          <button
            className={`px-4 py-3 text-sm font-medium flex items-center ${
              view === 'week' 
                ? 'text-white border-b-2 border-blue-500' 
                : 'text-gray-400 hover:text-white'
            }`}
            onClick={() => setView('week')}
          >
            <CalendarIcon className="w-4 h-4 mr-2" />
            Uke
          </button>
          <button
            className={`px-4 py-3 text-sm font-medium flex items-center ${
              view === 'day' 
                ? 'text-white border-b-2 border-blue-500' 
                : 'text-gray-400 hover:text-white'
            }`}
            onClick={() => setView('day')}
          >
            <CalendarIcon className="w-4 h-4 mr-2" />
            Dag
          </button>
        </div>

        <div className="flex flex-1">
          {/* Sidebar with tabs for Projects and Abonnements */}
          <div className="w-1/4 border-r border-gray-800 flex flex-col">
            {/* Sidebar tabs */}
            <div className="flex border-b border-gray-700">
              <button
                className={`flex-1 px-4 py-2 text-sm font-medium ${
                  activeTab === 'projects'
                    ? 'text-white border-b-2 border-blue-500'
                    : 'text-gray-400 hover:text-white'
                }`}
                onClick={() => setActiveTab('projects')}
              >
                Prosjekter
              </button>
              <button
                className={`flex-1 px-4 py-2 text-sm font-medium ${
                  activeTab === 'abonnements'
                    ? 'text-white border-b-2 border-blue-500'
                    : 'text-gray-400 hover:text-white'
                }`}
                onClick={() => setActiveTab('abonnements')}
              >
                Vedlikeholdsavtaler
              </button>
            </div>
            
            {/* Projects list */}
            {activeTab === 'projects' && (
              <div className="p-4 flex-1 flex flex-col">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-lg font-medium text-white">Prosjekter</h3>
                  <div className="relative">
                    <button
                      onClick={() => setShowFilterMenu(!showFilterMenu)}
                      className="flex items-center text-sm text-gray-400 hover:text-white"
                    >
                      <FunnelIcon className="w-4 h-4 mr-1" />
                      Filter: {filter === 'all' ? 'Alle' : 
                              filter === 'active' ? 'Aktive' : 
                              filter === 'completed' ? 'Fullførte' : 'Arkiverte'}
                    </button>
                    <div 
                      ref={filterMenuRef}
                      className={`absolute right-0 mt-2 w-48 bg-gray-800 rounded-lg shadow-lg z-10 ${showFilterMenu ? 'block' : 'hidden'}`}
                    >
                      <div className="py-1">
                        <button
                          className="block w-full text-left px-4 py-2 text-sm text-gray-400 hover:bg-gray-700 hover:text-white"
                          onClick={() => {
                            setFilter('all')
                            setShowFilterMenu(false)
                          }}
                        >
                          Alle
                        </button>
                        <button
                          className="block w-full text-left px-4 py-2 text-sm text-gray-400 hover:bg-gray-700 hover:text-white"
                          onClick={() => {
                            setFilter('active')
                            setShowFilterMenu(false)
                          }}
                        >
                          Aktive
                        </button>
                        <button
                          className="block w-full text-left px-4 py-2 text-sm text-gray-400 hover:bg-gray-700 hover:text-white"
                          onClick={() => {
                            setFilter('completed')
                            setShowFilterMenu(false)
                          }}
                        >
                          Fullførte
                        </button>
                        <button
                          className="block w-full text-left px-4 py-2 text-sm text-gray-400 hover:bg-gray-700 hover:text-white"
                          onClick={() => {
                            setFilter('archived')
                            setShowFilterMenu(false)
                          }}
                        >
                          Arkiverte
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="space-y-2 overflow-y-auto flex-1">
                  {filteredProjects.map(project => (
                    <div
                      key={project.id}
                      className="bg-gray-800 rounded-lg p-3 cursor-move hover:bg-gray-750 border border-gray-700"
                      draggable
                      onDragStart={() => handleDragStart(project)}
                    >
                      <div className="flex justify-between items-start">
                        <h4 className="text-sm font-medium text-white">{project.name}</h4>
                        <span className={`px-1.5 py-0.5 rounded-full text-xs font-medium ${
                          project.priority === 'high'
                            ? 'bg-red-900/50 text-red-400'
                            : project.priority === 'medium'
                            ? 'bg-yellow-900/50 text-yellow-400'
                            : 'bg-green-900/50 text-green-400'
                        }`}>
                          {project.priority}
                        </span>
                      </div>
                      <p className="text-xs text-gray-400 mt-1 truncate">{project.client}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}
            
            {/* Abonnements list */}
            {activeTab === 'abonnements' && (
              <div className="p-4 flex-1 flex flex-col">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-lg font-medium text-white">Vedlikeholdsavtaler</h3>
                </div>
                <div className="space-y-2 overflow-y-auto flex-1">
                  {abonnements.map(abonnement => (
                    <div
                      key={abonnement.id}
                      className="bg-gray-800 rounded-lg p-3 cursor-move hover:bg-gray-750 border border-gray-700"
                      draggable
                      onDragStart={() => {
                        setDraggedAbonnement(abonnement)
                        setDraggedProject(null)
                      }}
                    >
                      <div className="flex justify-between items-start">
                        <h4 className="text-sm font-medium text-white">{abonnement.etternavn}</h4>
                        <span className="px-1.5 py-0.5 rounded-full text-xs font-medium bg-blue-900/50 text-blue-400">
                          Vedlikehold
                        </span>
                      </div>
                      <p className="text-xs text-gray-400 mt-1 truncate">{abonnement.adresse}</p>
                      <p className="text-xs text-gray-400 truncate">{abonnement.kommune}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Calendar */}
          <div className="flex-1 flex flex-col">
            {/* Calendar header */}
            <div className="flex items-center justify-between p-4 border-b border-gray-800">
              <h2 className="text-xl font-semibold text-white">
                {getHeaderText()}
              </h2>
              <div className="flex items-center space-x-2">
                <button
                  onClick={goToPrev}
                  className="p-1.5 rounded-full text-gray-400 hover:text-white hover:bg-gray-800"
                >
                  <ChevronLeftIcon className="w-5 h-5" />
                </button>
                <button
                  onClick={goToToday}
                  className="px-3 py-1.5 text-sm text-gray-400 hover:text-white"
                >
                  I dag
                </button>
                <button
                  onClick={goToNext}
                  className="p-1.5 rounded-full text-gray-400 hover:text-white hover:bg-gray-800"
                >
                  <ChevronRightIcon className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Calendar content based on view */}
            <div className="flex-1 p-2">
              {view === 'month' && (
                <>
                  {/* Day headers */}
                  <div className="grid grid-cols-7 gap-1 mb-1">
                    {[0, 1, 2, 3, 4, 5, 6].map(day => (
                      <div key={day} className="text-center text-xs font-medium text-gray-400 py-1">
                        {getDayName(day)}
                      </div>
                    ))}
                  </div>

                  {/* Calendar days */}
                  <div className="grid grid-cols-7 gap-1 flex-1">
                    {calendarDays.map((day, index) => (
                      <div
                        key={index}
                        className={`min-h-[100px] rounded-lg border ${
                          day.isCurrentMonth
                            ? day.isToday
                              ? 'bg-blue-900/20 border-blue-800'
                              : 'bg-gray-800 border-gray-700'
                            : 'bg-gray-850 border-gray-800'
                        } p-1 relative`}
                        onDragOver={(e) => handleDragOver(e, day.date)}
                        onDragEnter={handleDragEnter}
                        onDragLeave={handleDragLeave}
                        onDrop={(e) => handleDrop(e, day.date)}
                      >
                        <div className="flex justify-between items-center mb-1">
                          <span className={`text-xs font-medium ${
                            day.isCurrentMonth
                              ? day.isToday
                                ? 'text-blue-400'
                                : 'text-white'
                              : 'text-gray-500'
                          }`}>
                            {day.dayOfMonth}
                          </span>
                        </div>
                      <div 
                        className="space-y-1 overflow-y-auto max-h-[80px] min-h-[60px]"
                        onDragOver={(e) => {
                          e.preventDefault()
                          e.currentTarget.classList.add('bg-gray-700/50')
                        }}
                        onDragLeave={(e) => {
                          e.currentTarget.classList.remove('bg-gray-700/50')
                        }}
                        onDrop={(e) => {
                          e.preventDefault()
                          e.currentTarget.classList.remove('bg-gray-700/50')
                          handleDrop(e, day.date)
                        }}
                      >
                          {/* Projects */}
                          {day.projects.map(project => (
                            <div
                              key={`project-${project.id}-${day.date.toISOString()}`}
                              className={`text-xs p-1 rounded relative cursor-move transition-all duration-200 hover:shadow-lg ${
                                project.priority === 'high'
                                  ? 'bg-red-900/30 text-red-400 border border-red-800/50 hover:bg-red-900/40'
                                  : project.priority === 'medium'
                                  ? 'bg-yellow-900/30 text-yellow-400 border border-yellow-800/50 hover:bg-yellow-900/40'
                                  : 'bg-green-900/30 text-green-400 border border-green-800/50 hover:bg-green-900/40'
                              }`}
                              onMouseEnter={() => setShowProjectInfo(`${project.id}-${day.date.toISOString()}`)}
                              onMouseLeave={() => setShowProjectInfo(null)}
                            >
                              <div className="truncate">{project.name}</div>
                              
                              {showProjectInfo === `${project.id}-${day.date.toISOString()}` && (
                                <div className="absolute z-10 left-0 top-full mt-1 w-48 bg-gray-900 rounded-lg shadow-lg border border-gray-700 p-2 text-xs">
                                  <h5 className="font-medium text-white mb-1">{project.name}</h5>
                                  <p className="text-gray-400 mb-1">{project.client}</p>
                                  <p className="text-gray-400 mb-1 line-clamp-2">{project.description}</p>
                                  <button
                                    onClick={() => removeFromCalendar(project.id, day.date.toISOString().split('T')[0])}
                                    className="text-red-400 hover:text-red-300 text-xs mt-1"
                                  >
                                    Fjern fra kalender
                                  </button>
                                </div>
                              )}
                            </div>
                          ))}
                          
                          {/* Abonnements */}
                          {day.abonnements.map(abonnement => (
                            <div
                              key={`abonnement-${abonnement.id}-${day.date.toISOString()}`}
                              className="text-xs p-1 rounded relative cursor-move transition-all duration-200 hover:shadow-lg bg-blue-900/30 text-blue-400 border border-blue-800/50 hover:bg-blue-900/40"
                              onMouseEnter={() => setShowAbonnementInfo(`${abonnement.id}-${day.date.toISOString()}`)}
                              onMouseLeave={() => setShowAbonnementInfo(null)}
                            >
                              <div className="truncate">{abonnement.etternavn}</div>
                              
                              {showAbonnementInfo === `${abonnement.id}-${day.date.toISOString()}` && (
                                <div className="absolute z-10 left-0 top-full mt-1 w-48 bg-gray-900 rounded-lg shadow-lg border border-gray-700 p-2 text-xs">
                                  <h5 className="font-medium text-white mb-1">{abonnement.etternavn}</h5>
                                  <p className="text-gray-400 mb-1">{abonnement.adresse}</p>
                                  <p className="text-gray-400 mb-1">{abonnement.kommune}</p>
                                  <button
                                    onClick={() => removeAbonnementFromCalendar(abonnement.id, day.date.toISOString().split('T')[0])}
                                    className="text-red-400 hover:text-red-300 text-xs mt-1"
                                  >
                                    Fjern fra kalender
                                  </button>
                                </div>
                              )}
                            </div>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                </>
              )}

              {view === 'week' && (
                <div className="flex flex-col h-full">
                  {/* Week header */}
                  <div className="grid grid-cols-7 gap-1 mb-1">
                    {Array.from({ length: 7 }).map((_, index) => {
                      const date = new Date(currentDate);
                      const dayOfWeek = date.getDay();
                      const diff = index - (dayOfWeek === 0 ? 6 : dayOfWeek - 1);
                      date.setDate(date.getDate() + diff);
                      
                      return (
                        <div key={index} className="text-center py-2">
                          <div className="text-xs font-medium text-gray-400">{getDayName(index)}</div>
                          <div className={`text-sm font-medium ${
                            date.toDateString() === new Date().toDateString() 
                              ? 'text-blue-400' 
                              : 'text-white'
                          }`}>
                            {date.getDate()}
                          </div>
                        </div>
                      );
                    })}
                  </div>

                  {/* Week view */}
                  <div className="grid grid-cols-7 gap-1 flex-1">
                    {Array.from({ length: 7 }).map((_, index) => {
                      const date = new Date(currentDate);
                      const dayOfWeek = date.getDay();
                      const diff = index - (dayOfWeek === 0 ? 6 : dayOfWeek - 1);
                      date.setDate(date.getDate() + diff);
                      
                      const dateString = date.toISOString().split('T')[0];
                      const dayProjects = scheduledProjects.filter(p => p.scheduledDate === dateString);
                      const dayAbonnements = scheduledAbonnements.filter(a => a.scheduledDate === dateString);
                      
                      return (
                        <div 
                          key={index}
                          className={`min-h-[400px] rounded-lg border ${
                            date.toDateString() === new Date().toDateString()
                              ? 'bg-blue-900/20 border-blue-800'
                              : 'bg-gray-800 border-gray-700'
                          } p-2 relative`}
                          onDragOver={(e) => handleDragOver(e, date)}
                          onDragEnter={handleDragEnter}
                          onDragLeave={handleDragLeave}
                          onDrop={(e) => handleDrop(e, date)}
                        >
                          <div className="space-y-2 overflow-y-auto max-h-full">
                            {/* Projects */}
                            {dayProjects.map(project => (
                              <div
                                key={`project-${project.id}-${date.toISOString()}`}
                                className={`p-2 rounded relative ${
                                  project.priority === 'high'
                                    ? 'bg-red-900/30 text-red-400 border border-red-800/50'
                                    : project.priority === 'medium'
                                    ? 'bg-yellow-900/30 text-yellow-400 border border-yellow-800/50'
                                    : 'bg-green-900/30 text-green-400 border border-green-800/50'
                                }`}
                                onMouseEnter={() => setShowProjectInfo(`${project.id}-${date.toISOString()}`)}
                                onMouseLeave={() => setShowProjectInfo(null)}
                              >
                                <div className="font-medium">{project.name}</div>
                                <div className="text-xs mt-1">{project.client}</div>
                                
                                {showProjectInfo === `${project.id}-${date.toISOString()}` && (
                                  <div className="absolute z-10 left-0 top-full mt-1 w-64 bg-gray-900 rounded-lg shadow-lg border border-gray-700 p-3 text-sm">
                                    <h5 className="font-medium text-white mb-1">{project.name}</h5>
                                    <p className="text-gray-400 mb-1">{project.client}</p>
                                    <p className="text-gray-400 mb-2">{project.description}</p>
                                    <button
                                      onClick={() => removeFromCalendar(project.id, dateString)}
                                      className="text-red-400 hover:text-red-300 text-xs"
                                    >
                                      Fjern fra kalender
                                    </button>
                                  </div>
                                )}
                              </div>
                            ))}
                            
                            {/* Abonnements */}
                            {dayAbonnements.map(abonnement => (
                              <div
                                key={`abonnement-${abonnement.id}-${date.toISOString()}`}
                                className="p-2 rounded relative bg-blue-900/30 text-blue-400 border border-blue-800/50"
                                onMouseEnter={() => setShowAbonnementInfo(`${abonnement.id}-${date.toISOString()}`)}
                                onMouseLeave={() => setShowAbonnementInfo(null)}
                              >
                                <div className="font-medium">{abonnement.etternavn}</div>
                                <div className="text-xs mt-1">{abonnement.adresse}</div>
                                
                                {showAbonnementInfo === `${abonnement.id}-${date.toISOString()}` && (
                                  <div className="absolute z-10 left-0 top-full mt-1 w-64 bg-gray-900 rounded-lg shadow-lg border border-gray-700 p-3 text-sm">
                                    <h5 className="font-medium text-white mb-1">{abonnement.etternavn}</h5>
                                    <p className="text-gray-400 mb-1">{abonnement.adresse}</p>
                                    <p className="text-gray-400 mb-2">{abonnement.kommune}</p>
                                    <button
                                      onClick={() => removeAbonnementFromCalendar(abonnement.id, dateString)}
                                      className="text-red-400 hover:text-red-300 text-xs"
                                    >
                                      Fjern fra kalender
                                    </button>
                                  </div>
                                )}
                              </div>
                            ))}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}

              {view === 'day' && (
                <div className="flex flex-col h-full">
                  {/* Day view */}
                  <div 
                    className="flex-1 p-4 bg-gray-800 rounded-lg border border-gray-700 mt-2 overflow-y-auto"
                    onDragOver={(e) => handleDragOver(e, currentDate)}
                    onDragEnter={handleDragEnter}
                    onDragLeave={handleDragLeave}
                    onDrop={(e) => handleDrop(e, currentDate)}
                  >
                    <div className="space-y-3">
                      {/* Projects */}
                      {scheduledProjects
                        .filter(p => p.scheduledDate === currentDate.toISOString().split('T')[0])
                        .map(project => (
                          <div
                            key={`project-${project.id}`}
                            className={`p-4 rounded-lg relative ${
                              project.priority === 'high'
                                ? 'bg-red-900/30 text-red-400 border border-red-800/50'
                                : project.priority === 'medium'
                                ? 'bg-yellow-900/30 text-yellow-400 border border-yellow-800/50'
                                : 'bg-green-900/30 text-green-400 border border-green-800/50'
                            }`}
                          >
                            <div className="flex justify-between items-start">
                              <h4 className="font-medium text-white">{project.name}</h4>
                              <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                                project.status === 'active'
                                  ? 'bg-blue-900/50 text-blue-400'
                                  : project.status === 'completed'
                                  ? 'bg-green-900/50 text-green-400'
                                  : 'bg-gray-900/50 text-gray-400'
                              }`}>
                                {project.status}
                              </span>
                            </div>
                            <p className="text-sm text-gray-400 mt-2">{project.description}</p>
                            <div className="mt-3 flex justify-between items-center">
                              <div className="text-sm text-gray-400">Klient: <span className="text-white">{project.client}</span></div>
                              <button
                                onClick={() => removeFromCalendar(project.id, currentDate.toISOString().split('T')[0])}
                                className="text-red-400 hover:text-red-300 text-xs"
                              >
                                Fjern fra kalender
                              </button>
                            </div>
                          </div>
                        ))}
                      
                      {/* Abonnements */}
                      {scheduledAbonnements
                        .filter(a => a.scheduledDate === currentDate.toISOString().split('T')[0])
                        .map(abonnement => (
                          <div
                            key={`abonnement-${abonnement.id}`}
                            className="p-4 rounded-lg relative bg-blue-900/30 text-blue-400 border border-blue-800/50"
                          >
                            <div className="flex justify-between items-start">
                              <h4 className="font-medium text-white">{abonnement.etternavn}</h4>
                              <span className="px-2 py-1 rounded-full text-xs font-medium bg-blue-900/50 text-blue-400">
                                Vedlikehold
                              </span>
                            </div>
                            <p className="text-sm text-gray-400 mt-2">{abonnement.adresse}</p>
                            <p className="text-sm text-gray-400">{abonnement.kommune}</p>
                            <div className="mt-3 flex justify-between items-center">
                              <div className="text-sm text-gray-400">Fornyelse: <span className="text-white">{abonnement.fornyelsesdato}</span></div>
                              <button
                                onClick={() => removeAbonnementFromCalendar(abonnement.id, currentDate.toISOString().split('T')[0])}
                                className="text-red-400 hover:text-red-300 text-xs"
                              >
                                Fjern fra kalender
                              </button>
                            </div>
                          </div>
                        ))}
                      
                      {scheduledProjects.filter(p => p.scheduledDate === currentDate.toISOString().split('T')[0]).length === 0 && 
                       scheduledAbonnements.filter(a => a.scheduledDate === currentDate.toISOString().split('T')[0]).length === 0 && (
                        <div className="text-center py-8 text-gray-500">
                          <p>Ingen aktiviteter planlagt for denne dagen</p>
                          <p className="text-sm mt-2">Dra et prosjekt eller en vedlikeholdsavtale hit for å planlegge det</p>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
