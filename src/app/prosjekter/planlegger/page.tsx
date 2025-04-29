'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import ProjectPlanner from '@/components/ProjectPlanner'


interface LocalStorageProject {
  id: string;
  name: string;
  description: string;
  client?: string;
  clientId?: string;
  clientName?: string;
  status: 'active' | 'completed' | 'archived';
  startDate: string;
  endDate?: string;
  budget?: number;
  priority: 'low' | 'medium' | 'high';
}

interface Project extends Omit<LocalStorageProject, 'clientId' | 'clientName'> {
  client: string;
}

export default function ProsjektPlanleggerPage() {
  const [projects, setProjects] = useState<Project[]>([])

  // Load projects from localStorage
  useEffect(() => {
    const savedProjects = localStorage.getItem('projects')
    if (savedProjects) {
      const parsedProjects: LocalStorageProject[] = JSON.parse(savedProjects)
      // Convert projects to match expected interface
      const convertedProjects: Project[] = parsedProjects.map(project => ({
        ...project,
        client: project.client || project.clientName || project.clientId || 'Ukjent klient'
      }))
      setProjects(convertedProjects)
    }
  }, [])

  return (
    <div className="min-h-screen bg-gray-900 p-8">
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h1 className="text-4xl font-bold text-white">Prosjektplanlegger</h1>
            <p className="text-gray-400 mt-2">Planlegg og organiser prosjekter i kalenderen</p>
          </div>
        </div>
        
        {/* Navigation tabs */}
        <div className="flex border-b border-gray-800 mb-6">
          <Link 
            href="/prosjekter" 
            className="px-4 py-3 text-gray-400 hover:text-white font-medium"
          >
            Prosjektoversikt
          </Link>
          <Link 
            href="/prosjekter/planlegger" 
            className="px-4 py-3 text-white border-b-2 border-blue-500 font-medium"
          >
            Planlegger
          </Link>
        </div>

        {/* Project Planner Component */}
        <div className="h-[calc(100vh-200px)]">
          <ProjectPlanner projects={projects} abonnements={[]} inspections={[]} />
        </div>
      </div>
    </div>
  )
}
