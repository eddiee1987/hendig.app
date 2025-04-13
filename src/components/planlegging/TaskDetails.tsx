'use client'

import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { MaintenanceTask } from "@/types/maintenance"
import { format } from "date-fns"
import { nb } from "date-fns/locale"

interface Props {
  task: MaintenanceTask
  onUpdateStatus: (taskId: string, status: MaintenanceTask['status']) => void
}

export function TaskDetails({ task, onUpdateStatus }: Props) {
  return (
    <Card className="p-4">
      <h2 className="font-semibold mb-3">Detaljer</h2>
      <div className="space-y-3">
        <div>
          <p className="font-medium">Tittel</p>
          <p>{task.title}</p>
        </div>

        <div>
          <p className="font-medium">Beskrivelse</p>
          <p>{task.description}</p>
        </div>

        <div>
          <p className="font-medium">Kunde</p>
          <p>{task.customerName}</p>
        </div>

        <div>
          <p className="font-medium">Adresse</p>
          <p>{task.address}</p>
        </div>

        <div>
          <p className="font-medium">Type</p>
          <p className="capitalize">{task.type}</p>
        </div>

        <div>
          <p className="font-medium">Tidspunkt</p>
          <p>
            {format(task.startDate, 'dd. MMMM yyyy', { locale: nb })}
            <br />
            {format(task.startDate, 'HH:mm')} - {format(task.endDate, 'HH:mm')}
          </p>
        </div>

        <div>
          <p className="font-medium">Status</p>
          <p className="capitalize">{task.status}</p>
        </div>

        {task.repeatInterval !== 'never' && (
          <div>
            <p className="font-medium">Gjentagelse</p>
            <p>
              {task.repeatInterval === 'daily' && 'Daglig'}
              {task.repeatInterval === 'weekly' && 'Ukentlig'}
              {task.repeatInterval === 'monthly' && 'Månedlig'}
              {task.repeatInterval === 'yearly' && 'Årlig'}
              {task.repeatUntil && (
                <> til {format(task.repeatUntil, 'dd. MMMM yyyy', { locale: nb })}</>
              )}
            </p>
          </div>
        )}

        <div>
          <p className="font-medium">Varsling</p>
          <p>
            {task.notifications.customer && 'Kunde'}
            {task.notifications.customer && task.notifications.worker && ' og '}
            {task.notifications.worker && 'Håndverker'}
            {' varsles '}
            {task.notifications.reminderDays} dager før
          </p>
        </div>

        <div className="flex gap-2 pt-2">
          {task.status === 'planlagt' && (
            <Button 
              onClick={() => onUpdateStatus(task.id, 'pågående')}
              className="bg-blue-600 hover:bg-blue-700"
            >
              Start oppgave
            </Button>
          )}
          {task.status === 'pågående' && (
            <Button 
              onClick={() => onUpdateStatus(task.id, 'fullført')}
              className="bg-green-600 hover:bg-green-700"
            >
              Fullfør oppgave
            </Button>
          )}
          <Button 
            variant="outline"
            onClick={() => onUpdateStatus(task.id, 'kansellert')}
            className="text-red-600 border-red-600 hover:bg-red-50"
          >
            Kanseller
          </Button>
        </div>
      </div>
    </Card>
  )
} 