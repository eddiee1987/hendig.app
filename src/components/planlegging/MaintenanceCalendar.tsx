'use client'

import { Calendar, dateFnsLocalizer } from 'react-big-calendar'
import withDragAndDrop from 'react-big-calendar/lib/addons/dragAndDrop'; // <-- Import withDragAndDrop
import { format, parse, startOfWeek, getDay } from 'date-fns'
import { nb } from 'date-fns/locale'
import { type MaintenanceTask } from '@/types/maintenance' // <-- Added 'type' here for consistency with best practices and previous error
import 'react-big-calendar/lib/css/react-big-calendar.css'
import 'react-big-calendar/lib/addons/dragAndDrop/styles.css'; // <-- Import the drag and drop styles
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
  date: 'Dato', // Added some missing messages for completeness
  time: 'Tid',
  event: 'Hendelse',
  allDay: 'Hele dagen',
  noEventsInRange: 'Ingen hendelser i dette området.',
}

interface Props {
  tasks: MaintenanceTask[]
  onTaskDrop: (taskId: string, start: Date, end: Date) => void
  // You might also need onTaskResize if you use resizable events
  onTaskResize?: (taskId: string, start: Date, end: Date) => void
}

// *** Define the Drag and Drop Calendar component by wrapping the standard Calendar ***
const DnDCalendar = withDragAndDrop(Calendar);

export function MaintenanceCalendar({ tasks, onTaskDrop, onTaskResize }: Props) { // <-- Added onTaskResize to props
  const events = tasks.map(task => ({
    id: task.id, // Ensure id is a string if needed by react-big-calendar or your drop handler
    title: task.title,
    start: new Date(task.startDate),
    end: new Date(task.endDate),
    resource: task
  }))

  const handleEventDrop = ({ event, start, end }: { event: { id: string }, start: Date, end: Date }) => {
     // Add confirmation or other logic here if needed
    onTaskDrop(event.id, start, end);
  }

   // Implement handleEventResize if you want to handle resizing
   const handleEventResize = ({ event, start, end }: { event: { id: string }, start: Date, end: Date }) => {
      // Add confirmation or other logic here if needed
      if (onTaskResize) {
         onTaskResize(event.id, start, end);
      }
   }


  return (
    <div className="calendar-container bg-white rounded-lg shadow-lg p-4">
      {/* *** Use the DnDCalendar component here instead of Calendar *** */}
      <DnDCalendar
        localizer={localizer}
        events={events}
        defaultView="week"
        views={['month', 'week', 'day']}
        step={60}
        showMultiDayTimes
        messages={messages}
        style={{ height: 800 }}
        min={new Date(0, 0, 0, 6, 0, 0)} // Note: Using year 0, month 0 is generally fine for time-only limits
        max={new Date(0, 0, 0, 20, 0, 0)}

        // *** Pass drag and drop props to the DnDCalendar ***
        // Enable drag/drop functionality (assuming you want all tasks draggable)
        draggableAccessor={() => true}
        // Enable resizing functionality
        resizable={true} // Make sure resizable is true if you want resizing

        onEventDrop={handleEventDrop} // This prop is now valid on DnDCalendar
        onEventResize={handleEventResize} // Use this if you enable resizing and pass it down
        // Add other handlers like onSelectEvent, onSelectSlot if needed
      />
    </div>
  )
}