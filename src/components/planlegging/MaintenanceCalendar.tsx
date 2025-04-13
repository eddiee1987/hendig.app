'use client'

import { Calendar, dateFnsLocalizer } from 'react-big-calendar'
import { format, parse, startOfWeek, getDay } from 'date-fns'
import { nb } from 'date-fns/locale'
import { MaintenanceTask } from '@/types/maintenance'
import 'react-big-calendar/lib/css/react-big-calendar.css'
import './calendar.css'

const locales = {
  'nb': nb,
}

const localizer = dateFnsLocalizer({
  format,
  parse,
  startOfWeek,
  getDay,
  locales,
})

const messages = {
  week: 'Uke',
  work_week: 'Arbeidsuke',
  day: 'Dag',
  month: 'Måned',
  previous: 'Forrige',
  next: 'Neste',
  today: 'I dag',
  agenda: 'Agenda',
}

interface Props {
  tasks: MaintenanceTask[]
  onTaskDrop: (taskId: string, start: Date, end: Date) => void
}

export function MaintenanceCalendar({ tasks, onTaskDrop }: Props) {
  const events = tasks.map(task => ({
    id: task.id,
    title: task.title,
    start: new Date(task.startDate),
    end: new Date(task.endDate),
    resource: task
  }))

  const handleEventDrop = ({ event, start, end }: any) => {
    onTaskDrop(event.id, start, end)
  }

  return (
    <div className="calendar-container bg-white rounded-lg shadow-lg p-4">
      <Calendar
        localizer={localizer}
        events={events}
        defaultView="week"
        views={['month', 'week', 'day']}
        step={60}
        showMultiDayTimes
        messages={messages}
        onEventDrop={handleEventDrop}
        draggableAccessor={() => true}
        resizable
        style={{ height: 800 }}
        min={new Date(0, 0, 0, 6, 0, 0)}
        max={new Date(0, 0, 0, 20, 0, 0)}
      />
    </div>
  )
} 