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

interface TimeEntryUpdateFields {
  date?: string;
  hours?: number;
  project_id?: string;
  description?: string;
  approved?: boolean;
}

export async function updateTimeEntry(entryId: string, updatedFields: TimeEntryUpdateFields) {
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

// Lager-funksjoner

// Hent lagerdata og returner som et objekt { impregnert_staur: antall, ... }
export async function fetchLager(): Promise<Record<string, number>> {
  try {
    const { data, error } = await supabase
      .from('lager')
      .select('navn, antall')

    if (error) {
      console.error('Error fetching lager:', error)
      return {}
    }
    // Map til { key: antall }
    const lagerObj: Record<string, number> = {}
    data?.forEach((row: { navn: string; antall: number }) => {
      const key = row.navn.toLowerCase().replaceAll(' ', '_').replaceAll('å', 'a').replaceAll('æ', 'ae').replaceAll('ø', 'o')
      lagerObj[key] = row.antall
    })
    return lagerObj
  } catch (error) {
    console.error('Unexpected error fetching lager:', error)
    return {}
  }
}

// Oppdater lagerdata basert på form-objektet { impregnert_staur: antall, ... }
export async function updateLager(form: Record<string, number>) {
  try {
    // Hent eksisterende rader
    const { data: existing, error: fetchError } = await supabase
      .from('lager')
      .select('id, navn')
    if (fetchError) {
      console.error('Error fetching lager for update:', fetchError)
      return
    }
    // Oppdater eller opprett for hver vare
    for (const [key, antall] of Object.entries(form)) {
      // Finn navn fra key
      const navn = key
        .replaceAll('_', ' ')
        .replaceAll('ae', 'æ')
        .replaceAll('o', 'ø')
        .replaceAll('a', 'å')
      // Søk etter eksisterende rad
      const existingRow = existing?.find((row: { navn: string }) => row.navn.toLowerCase().replaceAll(' ', '_') === key)
      if (existingRow) {
        // Oppdater
        await supabase.from('lager').update({ antall: Number(antall) }).eq('id', existingRow.id)
      } else {
        // Sett inn ny
        await supabase.from('lager').insert([{ navn, antall: Number(antall) }])
      }
    }
  } catch (error) {
    console.error('Unexpected error updating lager:', error)
  }
}

// Hent lagerhistorikk (transaksjoner) med varenavn
export async function fetchLagerHistorikk(): Promise<Array<{
  created_at: string;
  navn: string;
  type: string;
  antall: number;
  kommentar: string;
}>> {
  try {
    const { data, error } = await supabase
      .from('lager_transactions')
      .select('created_at, type, antall, kommentar, lager_id, lager:lager_id(navn)')
      .order('created_at', { ascending: false })
      .limit(100)
    if (error) {
      console.error('Error fetching lager historikk:', error)
      // Log the full error object for debugging
      if (typeof window !== 'undefined') {
        interface WindowWithError extends Window {
          __supabaseLagerHistorikkError?: unknown;
        }
        (window as WindowWithError).__supabaseLagerHistorikkError = error;
      }
      return []
    }
    // Map til flat struktur med varenavn
    interface LagerTransaction {
      created_at: string
      lager?: Array<{ navn: string }>
      type: string
      antall: number
      kommentar: string | null
    }

    return (data || []).map((row: LagerTransaction) => ({
      created_at: row.created_at,
      navn: row.lager?.[0]?.navn || '',
      type: row.type,
      antall: row.antall,
      kommentar: row.kommentar || ''
    }))
  } catch (error) {
    console.error('Unexpected error fetching lager historikk:', error)
    return []
  }
}

// Registrer en lagertransaksjon (inntak/uttak/manuell) og oppdater lagerbeholdning
export async function registerLagerTransaksjon({ key, type, antall, kommentar }: { key: string, type: 'inntak' | 'uttak' | 'manuell', antall: number, kommentar: string }) {
  try {
    // Finn varenavn fra key
    const navn = key.replaceAll('_', ' ').replaceAll('ae', 'æ').replaceAll('o', 'ø').replaceAll('a', 'å')
    // Hent rad for varen
    let lagerId: number | null = null;
    let nyttAntall: number = 0;
    const { data: lagerRows } = await supabase
      .from('lager')
      .select('id, antall')
      .eq('navn', navn)
      .limit(1)
    if (!lagerRows || lagerRows.length === 0) {
      if (type === 'manuell') {
        // Opprett ny vare hvis manuell
        const { data: insertData, error: insertError } = await supabase
          .from('lager')
          .insert([{ navn, antall: Number(antall) }])
          .select('id')
          .single();
        if (insertError || !insertData) {
          return { error: 'Kunne ikke opprette ny vare' }
        }
        lagerId = insertData.id;
        nyttAntall = Number(antall);
      } else {
        return { error: 'Fant ikke varen i lageret' }
      }
    } else {
      lagerId = lagerRows[0].id;
      nyttAntall = lagerRows[0].antall;
      if (type === 'inntak') {
        nyttAntall += antall;
      } else if (type === 'uttak') {
        if (lagerRows[0].antall < antall) {
          return { error: 'Ikke nok på lager for uttak' }
        }
        nyttAntall -= antall;
      } else if (type === 'manuell') {
        nyttAntall = antall;
      }
      // Oppdater lagerbeholdning for alle typer
      const { error: updateError } = await supabase
        .from('lager')
        .update({ antall: nyttAntall })
        .eq('id', lagerId)
      if (updateError) {
        return { error: 'Kunne ikke oppdatere lagerbeholdning' }
      }
    }
    // Registrer transaksjon ALLTID
    const { error: transError } = await supabase
      .from('lager_transactions')
      .insert({ lager_id: lagerId, type, antall, kommentar })
    if (transError) {
      return { error: 'Kunne ikke registrere transaksjon' }
    }
    return { success: true }
  } catch {
    return { error: 'Uventet feil ved registrering' }
  }
}
