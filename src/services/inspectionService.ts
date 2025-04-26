import { supabase } from '@/lib/supabase'

export async function getPlannedInspections() {
  const { data, error } = await supabase
    .from('inspections')
    .select('*')
    .eq('status', 'planlagt')
    .order('inspection_date', { ascending: true })

  if (error) {
    console.error('Error fetching planned inspections:', error)
    throw error
  }

  return data || []
}
