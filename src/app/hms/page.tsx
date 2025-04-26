// src/app/hms/page.tsx
'use client'; // Make this a client component

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { getActiveChecklistTemplates } from '@/services/hmsService'; // Import the service function
import { ChecklistTemplate } from '@/types/hms'; // Import the type

const HMSPage = () => {
  const [templates, setTemplates] = useState<ChecklistTemplate[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchTemplates = async () => {
      setLoading(true);
      setError(null);
      try {
        const activeTemplates = await getActiveChecklistTemplates();
        setTemplates(activeTemplates);
      } catch (err) {
        console.error("Error fetching checklist templates:", err);
        setError("Kunne ikke laste sjekkliste-maler.");
      } finally {
        setLoading(false);
      }
    };

    fetchTemplates();
  }, []); // Empty dependency array ensures this runs once on mount

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-semibold mb-4">HMS</h1>

      <h2 className="text-xl font-medium mb-3">Velg en sjekkliste-mal:</h2>

      {loading && <p>Laster sjekkliste-maler...</p>}
      {error && <p className="text-red-600">{error}</p>}
      {!loading && !error && templates.length === 0 && (
        <p>Ingen aktive sjekkliste-maler funnet.</p>
      )}
      {!loading && !error && templates.length > 0 && (
        <ul className="space-y-3">
          {templates.map((template) => (
            <li key={template.id} className="bg-white shadow-sm rounded-lg p-4 border border-gray-200 hover:border-blue-500 transition-colors duration-150">
              <Link href={`/hms/sjekklister/ny?templateId=${template.id}`} className="block">
                <h3 className="text-lg font-semibold text-blue-600 hover:underline">{template.name}</h3>
                {template.description && (
                  <p className="text-gray-600 text-sm mt-1">{template.description}</p>
                )}
              </Link>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default HMSPage;
