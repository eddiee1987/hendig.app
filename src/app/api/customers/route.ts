import { NextResponse } from 'next/server'
import type { Customer } from '@/types'

// GET /api/customers
export async function GET() {
  // TODO: Implementer database-tilkobling
  const customers: Customer[] = [
    {
      id: '1',
      name: 'Olsen Familie',
      address: 'Bergveien 12',
      postalCode: '5003',
      city: 'Bergen',
      phone: '99887766',
      email: 'olsen@example.com',
      hasActiveSubscription: true,
      nextInspection: new Date('2024-05-15')
    }
  ]
  
  return NextResponse.json(customers)
}

// POST /api/customers
export async function POST(request: Request) {
  try {
    const body = await request.json()
    console.log('Received customer data:', body)
    
    // Enkel validering
    if (!body.name || !body.email) {
      return NextResponse.json(
        { error: 'Navn og e-post er påkrevd' },
        { status: 400 }
      )
    }

    // TODO: Lagre i database
    return NextResponse.json({ message: 'Kunde opprettet' }, { status: 201 })
  } catch (error) {
    console.error('Error creating customer:', error)
    return NextResponse.json(
      { error: 'Kunne ikke opprette kunde' },
      { status: 400 }
    )
  }
}
