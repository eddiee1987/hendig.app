'use client'

import FullCalendar from '@fullcalendar/react'
import dayGridPlugin from '@fullcalendar/daygrid'
import timeGridPlugin from '@fullcalendar/timegrid'
import interactionPlugin from '@fullcalendar/interaction'
import { MaintenanceTask } from '@/types/maintenance'

interface Props {
  tasks: MaintenanceTask[]
  onTaskDrop: (taskId: string, start: Date, end: Date) => void
}

export default function FullCalendarWrapper({ tasks, onTaskDrop }: Props) {
  const events = tasks.map(task => ({
    id: task.id,
    title: task.title,
    start: task.startDate,
    end: task.endDate,
    className: `status-${task.status}`,
    extendedProps: { ...task }
  }))

  const handleEventDrop = (info: any) => {
    onTaskDrop(
      info.event.id,
      info.event.start,
      info.event.end || info.event.start
    )
  }

  return (
    <div className="calendar-container rounded-lg shadow-lg bg-white p-4">
      <FullCalendar
        plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
        initialView="timeGridWeek"
        headerToolbar={{
          left: 'prev,next today',
          center: 'title',
          right: 'dayGridMonth,timeGridWeek,timeGridDay'
        }}
        editable={true}
        droppable={true}
        eventDrop={handleEventDrop}
        events={events}
        locale="nb"
        slotMinTime="06:00:00"
        slotMaxTime="20:00:00"
        allDaySlot={false}
        height="auto"
        aspectRatio={1.8}
        slotDuration="01:00:00"
        nowIndicator={true}
        dayMaxEvents={true}
        eventTimeFormat={{
          hour: '2-digit',
          minute: '2-digit',
          meridiem: false
        }}
        slotLabelFormat={{
          hour: '2-digit',
          minute: '2-digit',
          hour12: false
        }}
      />
    </div>
  )
} 