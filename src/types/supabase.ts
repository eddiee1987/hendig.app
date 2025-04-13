export type Project = {
  id: string
  name: string
  description: string
  client: string
  status: 'active' | 'completed' | 'archived'
  start_date: string
  end_date?: string
  budget?: number
  priority: 'low' | 'medium' | 'high'
  created_at: string
  updated_at: string
}

export type ScheduledProject = {
  id: string
  project_id: string
  scheduled_date: string
  created_at: string
  updated_at: string
}

export type Database = {
  public: {
    Tables: {
      projects: {
        Row: Project
        Insert: Omit<Project, 'id' | 'created_at' | 'updated_at'>
        Update: Partial<Omit<Project, 'id' | 'created_at' | 'updated_at'>>
      }
      scheduled_projects: {
        Row: ScheduledProject
        Insert: Omit<ScheduledProject, 'id' | 'created_at' | 'updated_at'>
        Update: Partial<Omit<ScheduledProject, 'id' | 'created_at' | 'updated_at'>>
      }
    }
  }
}
