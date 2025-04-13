'use client'

import { Card } from "@/components/ui/card"
import { MaintenanceTask } from "@/types/maintenance"
import { format } from "date-fns"
import { nb } from "date-fns/locale"

interface Props {
  tasks: MaintenanceTask[]
  selectedDate: Date
  onSelectTask: (task: MaintenanceTask) => void
}

export function TaskList({ tasks, selectedDate, onSelectTask }: Props) {
  const dayTasks = tasks.filter(
    task => task.startDate.toDateString() === selectedDate.toDateString()
  )

  if (dayTasks.length === 0) {
    return (
      <Card className="p-4">
        <p className="text-gray-500 text-center">
          Ingen oppgaver for {format(selectedDate, 'dd. MMMM yyyy', { locale: nb })}
        </p>
      </Card>
    )
  }

  return (
    <Card className="p-4">
      <h2 className="font-semibold mb-3">
        Oppgaver {format(selectedDate, 'dd. MMMM yyyy', { locale: nb })}
      </h2>
      <div className="space-y-2">
        {dayTasks.map(task => (
          <div
            key={task.id}
            className={`p-3 rounded cursor-pointer hover:bg-gray-50 border-l-4 border-l-${
              task.type === 'vedlikehold' ? 'green' : 
              task.type === 'inspeksjon' ? 'blue' : 
              'gray'
            }-500`}
            onClick={() => onSelectTask(task)}
          >
            <div className="font-medium">{task.title}</div>
            <div className="text-sm text-gray-500">
              {format(task.startDate, 'HH:mm')} - {format(task.endDate, 'HH:mm')}
            </div>
          </div>
        ))}
      </div>
    </Card>
  )
} 