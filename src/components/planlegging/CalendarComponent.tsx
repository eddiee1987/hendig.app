'use client'

import { DnDCalendar } from 'react-big-calendar-dnd'
import { dateFnsLocalizer, Event } from 'react-big-calendar'
import { format, parse, startOfWeek, getDay } from 'date-fns'
import { nb } from 'date-fns/locale/nb'
import { MaintenanceTask } from '@/types/maintenance'
import 'react-big-calendar/lib/css/react-big-calendar.css'
import { DndProvider } from 'react-dnd'
import { HTML5Backend } from 'react-dnd-html5-backend'

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
  date: 'Dato',
  time: 'Tid',
  event: 'Hendelse',
  allDay: 'Hele dagen',
  noEventsInRange: 'Ingen oppgaver i dette tidsrommet',
}

interface Props {
  tasks: MaintenanceTask[]
  onTaskDrop: (taskId: string, start: Date, end: Date) => void
}

interface CustomEvent extends Event {
  id: string;
}

export default function CalendarComponent({ tasks, onTaskDrop }: Props) {
  const events = tasks.map(task => ({
    id: task.id,
    title: task.title,
    start: new Date(task.startDate),
    end: new Date(task.endDate),
    resource: task
  }))

  const handleEventDrop = ({ event, start, end }: { event: CustomEvent; start: Date; end: Date }) => {
    onTaskDrop(event.id, start, end);
  }

  return (
    <DndProvider backend={HTML5Backend}>
      <div className="calendar-container rounded-lg shadow-lg bg-white p-4">
        <DnDCalendar
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
          formats={{
            timeGutterFormat: 'HH:mm',
            eventTimeRangeFormat: ({ start, end }: { start: Date; end: Date }) =>
              `${format(start, 'HH:mm')} - ${format(end, 'HH:mm')}`,
          }}
        />
      </div>
    </DndProvider>
  )
}
