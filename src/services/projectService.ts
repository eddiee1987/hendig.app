import { supabase } from '@/lib/supabase'
import { Project, ScheduledProject } from '@/types/supabase'

// Project functions
export async function getProjects() {
  const { data, error } = await supabase
    .from('projects')
    .select('*')
    .order('created_at', { ascending: false })

  if (error) {
    console.error('Error fetching projects:', error)
    throw error
  }

  return data || []
}

export async function getProject(id: string) {
  const { data, error } = await supabase
    .from('projects')
    .select('*')
    .eq('id', id)
    .single()

  if (error) {
    console.error(`Error fetching project with id ${id}:`, error)
    throw error
  }

  return data
}

export async function createProject(project: Record<string, any>) {
  console.log('Creating project with data:', project)
  
  try {
    // Check if the Supabase client is properly initialized
    console.log('Supabase client:', supabase)
    
    // Check if the table exists by trying to select a single row
    const { data: tableCheck, error: tableError } = await supabase
      .from('projects')
      .select('id')
      .limit(1)
    
    if (tableError) {
      console.error('Error checking projects table:', tableError)
      throw new Error(`Table check failed: ${tableError.message}`)
    }
    
    console.log('Table check result:', tableCheck)
    
    // Proceed with insert
    const { data, error } = await supabase
      .from('projects')
      .insert([project])
      .select()

    if (error) {
      console.error('Error creating project:', error)
      throw new Error(`Insert failed: ${error.message}`)
    }

    console.log('Project created successfully:', data)
    return data?.[0]
  } catch (error) {
    console.error('Exception in createProject:', error)
    throw error
  }
}

export async function updateProject(id: string, project: Record<string, any>) {
  console.log('Updating project with id:', id, 'and data:', project)
  
  try {
    const { data, error } = await supabase
      .from('projects')
      .update(project)
      .eq('id', id)
      .select()

    if (error) {
      console.error(`Error updating project with id ${id}:`, error)
      throw error
    }

    console.log('Project updated successfully:', data)
    return data?.[0]
  } catch (error) {
    console.error(`Exception in updateProject for id ${id}:`, error)
    throw error
  }
}

export async function deleteProject(id: string) {
  const { error } = await supabase
    .from('projects')
    .delete()
    .eq('id', id)

  if (error) {
    console.error(`Error deleting project with id ${id}:`, error)
    throw error
  }

  return true
}

// Scheduled Project functions
export async function getScheduledProjects() {
  const { data, error } = await supabase
    .from('scheduled_projects')
    .select(`
      *,
      projects:project_id (*)
    `)
    .order('scheduled_date', { ascending: true })

  if (error) {
    console.error('Error fetching scheduled projects:', error)
    throw error
  }

  return data || []
}

export async function getScheduledProjectsForDate(date: string) {
  const { data, error } = await supabase
    .from('scheduled_projects')
    .select(`
      *,
      projects:project_id (*)
    `)
    .eq('scheduled_date', date)

  if (error) {
    console.error(`Error fetching scheduled projects for date ${date}:`, error)
    throw error
  }

  return data || []
}

export async function scheduleProject(projectId: string, scheduledDate: string) {
  const { data, error } = await supabase
    .from('scheduled_projects')
    .insert([
      {
        project_id: projectId,
        scheduled_date: scheduledDate
      }
    ])
    .select()

  if (error) {
    console.error(`Error scheduling project ${projectId} for date ${scheduledDate}:`, error)
    throw error
  }

  return data?.[0]
}

export async function unscheduleProject(id: string) {
  const { error } = await supabase
    .from('scheduled_projects')
    .delete()
    .eq('id', id)

  if (error) {
    console.error(`Error unscheduling project with id ${id}:`, error)
    throw error
  }

  return true
}

export async function unscheduleProjectByProjectIdAndDate(projectId: string, scheduledDate: string) {
  const { error } = await supabase
    .from('scheduled_projects')
    .delete()
    .eq('project_id', projectId)
    .eq('scheduled_date', scheduledDate)

  if (error) {
    console.error(`Error unscheduling project ${projectId} for date ${scheduledDate}:`, error)
    throw error
  }

  return true
}
