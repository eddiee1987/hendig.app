'use client'

import { useState, useEffect } from 'react'
import ProjectPlanner from '@/components/ProjectPlanner'
import { getProjects } from '@/services/projectService'
import { getAbonnements } from '@/services/abonnementService'
import { Project as SupabaseProject } from '@/types/supabase'
import { toast, Toaster } from 'react-hot-toast'

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

// Convert Supabase project format to our internal format
const fromSupabaseProject = (project: SupabaseProject): Project => ({
  id: project.id,
  name: project.name,
  description: project.description,
  client: project.client,
  status: project.status as 'active' | 'completed' | 'archived',
  startDate: project.start_date,
  endDate: project.end_date,
  budget: project.budget ? Number(project.budget) : undefined,
  priority: project.priority as 'low' | 'medium' | 'high'
})

export default function PlanleggingPage() {
  const [projects, setProjects] = useState<Project[]>([])
  const [abonnements, setAbonnements] = useState<Abonnement[]>([])
  const [isLoading, setIsLoading] = useState(true)

  // Load projects and abonnements from Supabase
  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true)
        
        // Fetch projects
        const projectsData = await getProjects()
        setProjects(projectsData.map(fromSupabaseProject))
        
        // Fetch abonnements
        const abonnementsData = await getAbonnements()
        setAbonnements(abonnementsData)
      } catch (error) {
        console.error('Error fetching data:', error)
        toast.error('Kunne ikke hente data')
      } finally {
        setIsLoading(false)
      }
    }
    
    fetchData()
  }, [])

  return (
    <div className="min-h-screen bg-gray-900 p-8">
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h1 className="text-4xl font-bold text-white">Planlegging</h1>
            <p className="text-gray-400 mt-2">Planlegg og organiser prosjekter og vedlikeholdsavtaler i kalenderen</p>
          </div>
        </div>

        {/* Toast notifications */}
        <Toaster
          position="top-right"
          toastOptions={{
            duration: 3000,
            style: {
              background: '#333',
              color: '#fff',
            },
          }}
        />

        {/* Project Planner Component */}
        <div className="h-[calc(100vh-200px)]">
          {isLoading ? (
            <div className="flex items-center justify-center h-full">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
            </div>
          ) : (
            <ProjectPlanner projects={projects} abonnements={abonnements} />
          )}
        </div>
      </div>
    </div>
  )
}
