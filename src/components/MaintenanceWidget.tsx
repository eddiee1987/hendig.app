'use client'

import { useEffect, useState } from 'react'
import { getScheduledProjects } from '@/services/projectService'
import { format, isSameWeek, parseISO } from 'date-fns'

export default function MaintenanceWidget() {
  const [scheduledProjects, setScheduledProjects] = useState<Awaited<ReturnType<typeof getScheduledProjects>>>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    const fetchMaintenance = async () => {
      try {
        const data = await getScheduledProj
        // Filter for current week
        const currentWeekProjects = data.filter(project => 
          isSameWeek(parseISO(project.scheduled_date), new Date())
        )
        setScheduledProjects(currentWeekProjects)
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load maintenance schedule')
      } finally {
        setLoading(false)
      }
    }
    fetchMaintenance()
  }, [])

  if (loading) return <div>Loading maintenance schedule...</div>
  if (error) return <div className="text-red-500">{error}</div>

  return (
    <div className="bg-gray-800 rounded-lg shadow p-4 border border-gray-700 mt-4">
      <h2 className="text-lg font-semibold mb-2 text-white">Planlagt vedlikehold denne uken</h2>
      {scheduledProjects.length === 0 ? (
        <div className="text-gray-300">Du har ingen planlagte jobber denne uken</div>
      ) : (
        <div className="space-y-2">
          {scheduledProjects.map((project) => (
            <div key={project.id} className="flex justify-between items-center">
              <div className="text-white">
                {project.projects?.name || 'Ukjent prosjekt'}
              </div>
              <div className="text-gray-300 text-sm">
                {format(parseISO(project.scheduled_date), 'EEEE dd.MM')}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
