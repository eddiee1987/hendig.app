'use client'

import { useState } from 'react'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { MaintenanceTask, RepeatInterval } from '@/types/maintenance'

interface Props {
  open: boolean
  onOpenChange: (open: boolean) => void
  onAddTask: (task: MaintenanceTask) => void
}

export function NewTaskDialog({ open, onOpenChange, onAddTask }: Props) {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    customerId: '',
    customerName: '',
    address: '',
    startDate: '',
    endDate: '',
    type: 'vedlikehold' as MaintenanceTask['type'],
    repeatInterval: 'never' as RepeatInterval,
    repeatUntil: '',
    notifications: {
      customer: true,
      worker: true,
      reminderDays: 7
    }
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    
    const task: MaintenanceTask = {
      id: crypto.randomUUID(),
      ...formData,
      startDate: new Date(formData.startDate),
      endDate: new Date(formData.endDate),
      repeatUntil: formData.repeatUntil ? new Date(formData.repeatUntil) : undefined,
      status: 'planlagt'
    }
    
    onAddTask(task)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>Ny vedlikeholdsoppgave</DialogTitle>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="title">Tittel</Label>
              <Input
                id="title"
                value={formData.title}
                onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="type">Type</Label>
              <Select 
                value={formData.type} 
                onValueChange={(value) => setFormData(prev => ({ ...prev, type: value as MaintenanceTask['type'] }))}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Velg type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="vedlikehold">Vedlikehold</SelectItem>
                  <SelectItem value="inspeksjon">Inspeksjon</SelectItem>
                  <SelectItem value="reparasjon">Reparasjon</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          
          <Button type="submit">Lagre</Button>
        </form>
      </DialogContent>
    </Dialog>
  )
} 