import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || ''
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ''

console.log('Supabase URL:', supabaseUrl)
console.log('Supabase Anon Key:', supabaseAnonKey ? 'Set' : 'Not set')

if (!supabaseUrl || !supabaseAnonKey) {
  console.error('Supabase credentials are not set correctly in environment variables')
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

export async function fetchTimeEntriesByEmployeeId(employeeId: string) {
  try {
    const { data, error } = await supabase
      .from('time_entries')
      .select('*')
      .eq('employee_id', employeeId)
      .order('date', { ascending: false });

    if (error) {
      console.error('Error fetching time entries:', error);
      return [];
    }

    return data;
  } catch (error) {
    console.error('Unexpected error fetching time entries:', error);
    return [];
  }
}

export async function updateTimeEntry(entryId: string, updatedFields: Record<string, any>) {
  try {
    const { data, error } = await supabase
      .from('time_entries')
      .update(updatedFields)
      .eq('id', entryId);

    if (error) {
      console.error('Error updating time entry:', error);
      return null;
    }

    return data;
  } catch (error) {
    console.error('Unexpected error updating time entry:', error);
    return null;
  }
}
