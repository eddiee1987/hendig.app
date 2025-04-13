'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { CalendarIcon } from '@heroicons/react/24/outline'
import { Project as SupabaseProject } from '@/types/supabase'
import { getProjects, createProject, updateProject, deleteProject } from '@/services/projectService'
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

// Convert between our internal Project format and Supabase format
const toSupabaseProject = (project: Partial<Project>) => {
  // Create a clean object with all required fields
  const supabaseProject: Record<string, any> = {
    name: project.name || '',
    description: project.description || '',
    client: project.client || '',
    status: project.status || 'active',
    start_date: project.startDate || new Date().toISOString().split('T')[0],
    priority: project.priority || 'medium'
  }
  
  // Only add optional fields if they have values
  if (project.endDate && project.endDate !== '') {
    supabaseProject.end_date = project.endDate
  }
  
  if (project.budget !== undefined && project.budget !== null) {
    supabaseProject.budget = project.budget
  }
  
  console.log('Converted project for Supabase:', supabaseProject)
  return supabaseProject
}

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

export default function ProsjekterPage() {
  const [projects, setProjects] = useState<Project[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [showAddModal, setShowAddModal] = useState(false)
  const [showEditModal, setShowEditModal] = useState(false)
  const [editingProject, setEditingProject] = useState<Project | null>(null)
  const [newProject, setNewProject] = useState<Partial<Project>>({
    name: '',
    description: '',
    client: '',
    status: 'active',
    startDate: new Date().toISOString().split('T')[0],
    endDate: '',
    budget: undefined,
    priority: 'medium'
  })

  // Fetch projects from Supabase
  useEffect(() => {
    const fetchProjects = async () => {
      try {
        setIsLoading(true)
        const data = await getProjects()
        setProjects(data.map(fromSupabaseProject))
      } catch (error) {
        console.error('Error fetching projects:', error)
        toast.error('Kunne ikke hente prosjekter')
      } finally {
        setIsLoading(false)
      }
    }
    
    fetchProjects()
  }, [])

  const handleAddProject = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!newProject.name || !newProject.client) return

    try {
      const supabaseProject = toSupabaseProject(newProject)
      const createdProject = await createProject(supabaseProject)
      
      if (createdProject) {
        setProjects([fromSupabaseProject(createdProject), ...projects])
        toast.success('Prosjekt opprettet')
      }
      
      setNewProject({
        name: '',
        description: '',
        client: '',
        status: 'active',
        startDate: new Date().toISOString().split('T')[0],
        endDate: '',
        budget: undefined,
        priority: 'medium'
      })
      setShowAddModal(false)
    } catch (error) {
      console.error('Error creating project:', error)
      toast.error('Kunne ikke opprette prosjekt')
    }
  }

  const handleDeleteProject = async (id: string) => {
    if (window.confirm('Er du sikker på at du vil slette dette prosjektet?')) {
      try {
        await deleteProject(id)
        setProjects(projects.filter(project => project.id !== id))
        toast.success('Prosjekt slettet')
      } catch (error) {
        console.error('Error deleting project:', error)
        toast.error('Kunne ikke slette prosjekt')
      }
    }
  }

  const handleStatusChange = async (id: string, newStatus: Project['status']) => {
    try {
      const project = projects.find(p => p.id === id)
      if (!project) return
      
      // Use the Supabase field name 'status'
      await updateProject(id, { status: newStatus })
      
      setProjects(projects.map(project => 
        project.id === id ? { ...project, status: newStatus } : project
      ))
      
      toast.success('Status oppdatert')
    } catch (error) {
      console.error('Error updating project status:', error)
      toast.error('Kunne ikke oppdatere status')
    }
  }

  const handleEditProject = (project: Project) => {
    setEditingProject(project)
    setShowEditModal(true)
  }

  const handleUpdateProject = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!editingProject) return

    try {
      const supabaseProject = toSupabaseProject(editingProject)
      await updateProject(editingProject.id, supabaseProject)
      
      setProjects(projects.map(project => 
        project.id === editingProject.id ? editingProject : project
      ))
      
      toast.success('Prosjekt oppdatert')
      setShowEditModal(false)
      setEditingProject(null)
    } catch (error) {
      console.error('Error updating project:', error)
      toast.error('Kunne ikke oppdatere prosjekt')
    }
  }

  return (
    <div className="min-h-screen bg-gray-900 p-8">
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h1 className="text-4xl font-bold text-white">Prosjekter</h1>
            <p className="text-gray-400 mt-2">Administrer dine prosjekter</p>
          </div>
          <button
            onClick={() => setShowAddModal(true)}
            className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-full flex items-center gap-2 shadow-sm transition-all duration-200"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
            <span>Nytt prosjekt</span>
          </button>
        </div>

        {/* Prosjektliste */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {projects.map(project => (
            <div key={project.id} className="bg-gray-800 rounded-2xl p-6 border border-gray-700">
              <div className="flex justify-between items-start mb-4">
                <h3 className="text-xl font-semibold text-white">{project.name}</h3>
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
              <p className="text-gray-400 mb-4">{project.description}</p>
              <div className="space-y-2 mb-4">
                <p className="text-sm text-gray-400">Klient: <span className="text-white">{project.client}</span></p>
                <p className="text-sm text-gray-400">Startdato: <span className="text-white">{new Date(project.startDate).toLocaleDateString('nb-NO')}</span></p>
                {project.endDate && (
                  <p className="text-sm text-gray-400">Sluttdato: <span className="text-white">{new Date(project.endDate).toLocaleDateString('nb-NO')}</span></p>
                )}
                {project.budget && (
                  <p className="text-sm text-gray-400">Budsjett: <span className="text-white">{project.budget.toLocaleString('nb-NO')} kr</span></p>
                )}
                <p className="text-sm text-gray-400">Prioritet: <span className={`${
                  project.priority === 'high' ? 'text-red-400' :
                  project.priority === 'medium' ? 'text-yellow-400' :
                  'text-green-400'
                }`}>{project.priority}</span></p>
              </div>
              <div className="flex flex-wrap gap-2">
                <button
                  onClick={() => handleEditProject(project)}
                  className="px-3 py-1 rounded-lg text-sm bg-blue-900/50 text-blue-400 hover:bg-blue-900/70"
                >
                  Endre
                </button>
                <button
                  onClick={() => handleStatusChange(project.id, 'active')}
                  className={`px-3 py-1 rounded-lg text-sm ${
                    project.status === 'active'
                      ? 'bg-blue-600 text-white'
                      : 'bg-gray-700 text-gray-400 hover:bg-gray-600'
                  }`}
                >
                  Aktiv
                </button>
                <button
                  onClick={() => handleStatusChange(project.id, 'completed')}
                  className={`px-3 py-1 rounded-lg text-sm ${
                    project.status === 'completed'
                      ? 'bg-green-600 text-white'
                      : 'bg-gray-700 text-gray-400 hover:bg-gray-600'
                  }`}
                >
                  Fullført
                </button>
                <button
                  onClick={() => handleStatusChange(project.id, 'archived')}
                  className={`px-3 py-1 rounded-lg text-sm ${
                    project.status === 'archived'
                      ? 'bg-gray-600 text-white'
                      : 'bg-gray-700 text-gray-400 hover:bg-gray-600'
                  }`}
                >
                  Arkivert
                </button>
                <button
                  onClick={() => handleDeleteProject(project.id)}
                  className="px-3 py-1 rounded-lg text-sm bg-red-900/50 text-red-400 hover:bg-red-900/70"
                >
                  Slett
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Edit Modal */}
        {showEditModal && editingProject && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center">
            <div className="bg-gray-800 rounded-2xl p-8 max-w-md w-full">
              <h2 className="text-2xl font-bold text-white mb-6">Endre prosjekt</h2>
              <form onSubmit={handleUpdateProject} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-400 mb-1">Prosjektnavn</label>
                  <input
                    type="text"
                    value={editingProject.name}
                    onChange={(e) => setEditingProject({ ...editingProject, name: e.target.value })}
                    className="w-full bg-gray-700 border border-gray-600 rounded-lg px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-400 mb-1">Beskrivelse</label>
                  <textarea
                    value={editingProject.description}
                    onChange={(e) => setEditingProject({ ...editingProject, description: e.target.value })}
                    className="w-full bg-gray-700 border border-gray-600 rounded-lg px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                    rows={3}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-400 mb-1">Klient</label>
                  <input
                    type="text"
                    value={editingProject.client}
                    onChange={(e) => setEditingProject({ ...editingProject, client: e.target.value })}
                    className="w-full bg-gray-700 border border-gray-600 rounded-lg px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-400 mb-1">Status</label>
                  <select
                    value={editingProject.status}
                    onChange={(e) => setEditingProject({ ...editingProject, status: e.target.value as Project['status'] })}
                    className="w-full bg-gray-700 border border-gray-600 rounded-lg px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="active">Aktiv</option>
                    <option value="completed">Fullført</option>
                    <option value="archived">Arkivert</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-400 mb-1">Prioritet</label>
                  <select
                    value={editingProject.priority}
                    onChange={(e) => setEditingProject({ ...editingProject, priority: e.target.value as Project['priority'] })}
                    className="w-full bg-gray-700 border border-gray-600 rounded-lg px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="low">Lav</option>
                    <option value="medium">Medium</option>
                    <option value="high">Høy</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-400 mb-1">Startdato</label>
                  <input
                    type="date"
                    value={editingProject.startDate}
                    onChange={(e) => setEditingProject({ ...editingProject, startDate: e.target.value })}
                    className="w-full bg-gray-700 border border-gray-600 rounded-lg px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-400 mb-1">Sluttdato</label>
                  <input
                    type="date"
                    value={editingProject.endDate || ''}
                    onChange={(e) => setEditingProject({ ...editingProject, endDate: e.target.value })}
                    className="w-full bg-gray-700 border border-gray-600 rounded-lg px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-400 mb-1">Budsjett</label>
                  <input
                    type="number"
                    value={editingProject.budget || ''}
                    onChange={(e) => setEditingProject({ ...editingProject, budget: e.target.value ? Number(e.target.value) : undefined })}
                    className="w-full bg-gray-700 border border-gray-600 rounded-lg px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div className="flex justify-end gap-4 mt-6">
                  <button
                    type="button"
                    onClick={() => {
                      setShowEditModal(false)
                      setEditingProject(null)
                    }}
                    className="px-4 py-2 text-gray-400 hover:text-white"
                  >
                    Avbryt
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                  >
                    Lagre endringer
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Modal for å legge til nytt prosjekt */}
        {showAddModal && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center">
            <div className="bg-gray-800 rounded-2xl p-8 max-w-md w-full">
              <h2 className="text-2xl font-bold text-white mb-6">Nytt prosjekt</h2>
              <form onSubmit={handleAddProject} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-400 mb-1">Prosjektnavn</label>
                  <input
                    type="text"
                    value={newProject.name}
                    onChange={(e) => setNewProject({ ...newProject, name: e.target.value })}
                    className="w-full bg-gray-700 border border-gray-600 rounded-lg px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-400 mb-1">Beskrivelse</label>
                  <textarea
                    value={newProject.description}
                    onChange={(e) => setNewProject({ ...newProject, description: e.target.value })}
                    className="w-full bg-gray-700 border border-gray-600 rounded-lg px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                    rows={3}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-400 mb-1">Klient</label>
                  <input
                    type="text"
                    value={newProject.client}
                    onChange={(e) => setNewProject({ ...newProject, client: e.target.value })}
                    className="w-full bg-gray-700 border border-gray-600 rounded-lg px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-400 mb-1">Startdato</label>
                  <input
                    type="date"
                    value={newProject.startDate}
                    onChange={(e) => setNewProject({ ...newProject, startDate: e.target.value })}
                    className="w-full bg-gray-700 border border-gray-600 rounded-lg px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-400 mb-1">Sluttdato</label>
                  <input
                    type="date"
                    value={newProject.endDate || ''}
                    onChange={(e) => setNewProject({ ...newProject, endDate: e.target.value })}
                    className="w-full bg-gray-700 border border-gray-600 rounded-lg px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-400 mb-1">Budsjett</label>
                  <input
                    type="number"
                    value={newProject.budget || ''}
                    onChange={(e) => setNewProject({ ...newProject, budget: e.target.value ? Number(e.target.value) : undefined })}
                    className="w-full bg-gray-700 border border-gray-600 rounded-lg px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-400 mb-1">Prioritet</label>
                  <select
                    value={newProject.priority}
                    onChange={(e) => setNewProject({ ...newProject, priority: e.target.value as Project['priority'] })}
                    className="w-full bg-gray-700 border border-gray-600 rounded-lg px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="low">Lav</option>
                    <option value="medium">Medium</option>
                    <option value="high">Høy</option>
                  </select>
                </div>
                <button type="submit" className="w-full bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg mt-6">
                  Lagre
                </button>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
