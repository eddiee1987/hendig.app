// src/components/hms/ChecklistTable.tsx
import React from 'react';
import Link from 'next/link';
import { Checklist } from '@/types/hms'; // Import the Checklist type

interface ChecklistTableProps {
  checklists: Checklist[];
  onDelete?: (id: string) => void; // Optional delete handler
}

const ChecklistTable: React.FC<ChecklistTableProps> = ({ checklists, onDelete }) => {
  return (
    <div className="bg-white dark:bg-gray-900 shadow-md rounded-lg overflow-hidden border border-gray-200 dark:border-gray-700">
      <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
        <thead className="bg-gray-50 dark:bg-gray-800">
          <tr>
            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Navn</th>
            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Beskrivelse</th>
            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Opprettet av</th>
            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Avdeling</th>
            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Opprettet</th>
            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Sist endret</th>
            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Status</th>
            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Handlinger</th>
          </tr>
        </thead>
        <tbody className="bg-white dark:bg-gray-900 divide-y divide-gray-200 dark:divide-gray-700">
          {checklists.map((checklist) => (
            <tr key={checklist.id}>
              <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                <Link href={`/hms/sjekklister/${checklist.id}`} className="text-blue-600 dark:text-blue-400 hover:underline">
                  {checklist.template_name}
                </Link>
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-300">{checklist.template_description?.substring(0, 50)}{checklist.template_description && checklist.template_description.length > 50 ? '...' : ''}</td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-300">{checklist.created_by_name || checklist.user_id}</td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-300">-</td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-300">{new Date(checklist.created_at).toLocaleDateString('nb-NO')}</td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-300">{new Date(checklist.completed_at || checklist.created_at).toLocaleDateString('nb-NO')}</td>
              <td className="px-6 py-4 whitespace-nowrap">
                <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${checklist.status === 'Fullført' ? 'bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-300' : 'bg-yellow-100 dark:bg-yellow-900 text-yellow-800 dark:text-yellow-300'}`}>
                  {checklist.status}
                </span>
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                <Link href={`/hms/sjekklister/${checklist.id}`} className="text-indigo-600 dark:text-indigo-400 hover:text-indigo-900 dark:hover:text-indigo-200 mr-2" title="Vis sjekkliste">👁️</Link>
                <button
                  className="text-red-600 dark:text-red-400 hover:text-red-900 dark:hover:text-red-300"
                  title="Slett sjekkliste"
                  onClick={() => onDelete && onDelete(checklist.id)}
                >
                  🗑️
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default ChecklistTable;
