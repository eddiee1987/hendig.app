import { supabase } from '@/lib/supabase'

export interface Abonnement {
  id: string
  etternavn: string
  adresse: string
  kommune: string
  var: string
  host: string
  epost: string
  fornyelsesdato: string
  tak_storrelse?: string
}

export interface AbonnementInput {
  fornavn: string
  etternavn: string
  adresse: string
  kommune: string
  var: string
  host: string
  epost: string
  fakturert: boolean
  fornyelsesdato: string
  sum: number
  notat: string
}

export interface ScheduledAbonnement {
  id: string
  abonnement_id: number
  scheduled_date: string
  created_at: string
  updated_at: string
  abonnementer?: Abonnement
}

// Get all abonnements
export async function getAbonnements() {
  const { data, error } = await supabase
    .from('abonnementer')
    .select('*')
    .order('etternavn', { ascending: true })

  if (error) {
    console.error('Error fetching abonnements:', error)
    throw error
  }

  return data || []
}

// Get scheduled abonnements
export async function getScheduledAbonnements() {
  const { data, error } = await supabase
    .from('scheduled_abonnements')
    .select(`
      *,
      abonnementer:abonnement_id (*)
    `)
    .order('scheduled_date', { ascending: true })

  if (error) {
    console.error('Error fetching scheduled abonnements:', error)
    throw error
  }

  return data || []
}

// Schedule an abonnement
export async function scheduleAbonnement(abonnementId: string, scheduledDate: string) {
  try {
    // Validate inputs
    const abonnementIdNum = Number(abonnementId)
    if (isNaN(abonnementIdNum)) {
      throw new Error(`Invalid abonnement ID: ${abonnementId}`)
    }
    
    if (!scheduledDate || !Date.parse(scheduledDate)) {
      throw new Error(`Invalid date format: ${scheduledDate}`)
    }

    const { data, error } = await supabase
      .from('scheduled_abonnements')
      .insert([
        {
          abonnement_id: abonnementIdNum,
          scheduled_date: scheduledDate
        }
      ])
      .select()

    if (error) {
      console.error(`Error scheduling abonnement ${abonnementId} for date ${scheduledDate}:`, {
        message: error.message,
        code: error.code,
        details: error.details,
        hint: error.hint
      })
      throw new Error(`Failed to schedule: ${error.message}`)
    }

    if (!data || data.length === 0) {
      throw new Error('No data returned from scheduling operation')
    }

    return data[0]
  } catch (error) {
    console.error(`Failed to schedule abonnement ${abonnementId}:`, {
      error: error instanceof Error ? error.message : error,
      stack: error instanceof Error ? error.stack : undefined
    })
    throw new Error(`Failed to schedule abonnement: ${error instanceof Error ? error.message : 'Unknown error'}`)
  }
}

// Unschedule an abonnement
export async function unscheduleAbonnement(id: string) {
  const { error } = await supabase
    .from('scheduled_abonnements')
    .delete()
    .eq('id', id)

  if (error) {
    console.error(`Error unscheduling abonnement with id ${id}:`, error)
    throw error
  }

  return true
}

// Unschedule an abonnement by abonnement ID and date
export async function unscheduleAbonnementByIdAndDate(abonnementId: string, scheduledDate: string) {
  const { error } = await supabase
    .from('scheduled_abonnements')
    .delete()
    .eq('abonnement_id', abonnementId)
    .eq('scheduled_date', scheduledDate)

  if (error) {
    console.error(`Error unscheduling abonnement ${abonnementId} for date ${scheduledDate}:`, error)
    throw error
  }

  return true
}

// Process multiple abonnements from import
export async function processAbonnements(abonnements: AbonnementInput[]) {
  const results = []
  
  for (const abonnement of abonnements) {
    try {
      const result = await createAbonnement(abonnement)
      results.push(result)
    } catch (error) {
      console.error(`Failed to create abonnement for ${abonnement.fornavn} ${abonnement.etternavn}:`, error)
      throw error
    }
  }
  
  return results
}

// Create a new abonnement
export async function createAbonnement(abonnement: AbonnementInput) {
  const { data, error } = await supabase
    .from('abonnementer')
    .insert([
      {
        fornavn: abonnement.fornavn,
        etternavn: abonnement.etternavn,
        adresse: abonnement.adresse,
        kommune: abonnement.kommune,
        var: abonnement.var,
        host: abonnement.host,
        epost: abonnement.epost,
        fakturert: abonnement.fakturert,
        fornyelsesdato: abonnement.fornyelsesdato,
        sum: abonnement.sum,
        notat: abonnement.notat
      }
    ])
    .select()

  if (error) {
    console.error('Error creating abonnement:', error)
    throw error
  }

  return data?.[0]
}
