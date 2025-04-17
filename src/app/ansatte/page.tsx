'use client'

import Link from 'next/link'

const employees = [
  {
    id: '1',
    name: 'Edgar Eidsheim',
    email: 'edgar@nesbyenhytteservice.no',
    phone: '41404097',
    role: 'Driftssjef',
    status: 'active'
  },
  {
    id: '2', 
    name: 'Kim Bråten',
    email: 'kim@nesbyenhytteservice.no',
    phone: '41151505',
    role: 'Daglig leder',
    status: 'active'
  },
 
]

export default function AnsattePage() {
  return (
    <div className="min-h-screen bg-gray-900 p-4 md:p-8 ml-0 md:ml-64">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-4xl font-bold text-white">Ansatte</h1>
        <p className="text-gray-400 mt-2">Oversikt over ansatte</p>

        <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-6">
          {employees.map(employee => (
            <Link 
              key={employee.id}
              href={`/ansatte/${employee.id}`}
              className="bg-gray-800 rounded-2xl p-6 border border-gray-700 hover:border-blue-500 transition-colors"
            >
              <h2 className="text-xl font-semibold text-white">{employee.name}</h2>
              <p className="text-gray-400 mt-1">{employee.role}</p>
              <div className="mt-4 text-sm text-gray-300">
                <p>{employee.email}</p>
                <p>{employee.phone}</p>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  )
}
