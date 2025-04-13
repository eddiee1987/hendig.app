import { NextResponse } from 'next/server'
import type { FikenCustomer } from '@/types/fiken'

export async function GET() {
  try {
    // TODO: Hent faktisk API-nøkkel fra miljøvariabler
    const FIKEN_API_KEY = process.env.FIKEN_API_KEY
    const FIKEN_COMPANY = process.env.FIKEN_COMPANY

    const response = await fetch(
      `https://api.fiken.no/api/v2/companies/${FIKEN_COMPANY}/contacts`, {
      headers: {
        'Authorization': `Bearer ${FIKEN_API_KEY}`,
        'Accept': 'application/json',
      }
    })

    if (!response.ok) {
      throw new Error('Fiken API request failed')
    }

    const customers: FikenCustomer[] = await response.json()
    return NextResponse.json({ success: true, data: customers })
  } catch (error) {
    console.error('Fiken API error:', error)
    return NextResponse.json(
      { success: false, error: 'Kunne ikke hente kunder fra Fiken' },
      { status: 500 }
    )
  }
} 