// src/app/hms/sjekklister/[id]/page.tsx
'use client';

import React, { useState, useEffect, Suspense } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { getChecklistWithItems } from '@/services/hmsService'; // Need to create this service function
import { Checklist, ChecklistItem, ChecklistWithItems } from '@/types/hms'; // Import types, including ChecklistWithItems
import { supabase } from '@/lib/supabase'; // Import supabase client


function ChecklistContent() {
  const params = useParams();
  const router = useRouter();
  const checklistId = params.id as string; // Get checklist ID from URL

  const [checklist, setChecklist] = useState<ChecklistWithItems | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [userId, setUserId] = useState<string | null>(null); // State to store the logged-in user's ID

  useEffect(() => {
     // Fetch user ID
    const fetchUser = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        setUserId(user.id);
      } else {
        // Handle case where user is not logged in, maybe redirect to login
        setError('Bruker ikke logget inn.');
        setLoading(false);
      }
    };

    fetchUser();

    if (!checklistId) {
      setError('Ingen sjekkliste ID funnet i URL.');
      setLoading(false);
      return;
    }

    const fetchChecklist = async () => {
      setLoading(true);
      setError(null);
      try {
        const fetchedChecklist = await getChecklistWithItems(checklistId); // Use imported function
        if (fetchedChecklist) {
          setChecklist(fetchedChecklist);
        } else {
          setError(`Kunne ikke finne sjekkliste med ID: ${checklistId}.`);
        }
      } catch (err) {
        console.error("Error fetching checklist:", err);
        setError('Feil ved lasting av sjekkliste.');
      } finally {
        setLoading(false);
      }
    };

    fetchChecklist();
  }, [checklistId, router]); // Add userId to dependency array if needed

  if (loading || userId === null) {
    return <div className="container mx-auto p-4">Laster sjekkliste...</div>;
  }

  if (error && (!checklist || userId === undefined)) {
    return <div className="container mx-auto p-4 text-red-600">{error}</div>;
  }

  if (!checklist) {
    return <div className="container mx-auto p-4">Fant ikke sjekklisten. Sjekk om IDen i URLen er korrekt.</div>;
  }

  return (
    <div className="container mx-auto p-4">
      {/* Breadcrumbs */}
      <nav className="text-sm text-gray-500 mb-4">
        <Link href="/hms" className="hover:underline">Hjem</Link> /
        <Link href="/hms/sjekklister" className="hover:underline"> Sjekklister</Link> /
        <span className="text-gray-700"> {checklist.template_name || 'Sjekkliste'}</span>
      </nav>

      {/* Header */}
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-semibold">{checklist.template_name || 'Sjekkliste Detaljer'}</h1>
        {/* TODO: Add Edit/Delete buttons */}
      </div>

      {/* Checklist Details */}
      <div className="bg-white shadow-md rounded-lg overflow-hidden border border-gray-200 p-4 mb-6">
        <p><strong>Status:</strong> {checklist.status}</p>
        <p><strong>Opprettet:</strong> {new Date(checklist.created_at).toLocaleDateString('nb-NO')} {new Date(checklist.created_at).toLocaleTimeString('nb-NO')}</p>
        {checklist.completed_at && (
          <p><strong>Fullført:</strong> {new Date(checklist.completed_at).toLocaleDateString('nb-NO')} {new Date(checklist.completed_at).toLocaleTimeString('nb-NO')}</p>
        )}
        <p><strong>Opprettet av:</strong> {checklist.created_by_name || 'Ukjent Bruker'}</p>
        {/* Add department if available */}
        {/* checklist.department_name && <p><strong>Avdeling:</strong> {checklist.department_name}</p> */}
        {checklist.template_description && (
           <p className="text-gray-600 text-sm mt-3 bg-gray-50 p-3 rounded border border-gray-200"><strong>Beskrivelse:</strong> {checklist.template_description}</p>
        )}
      </div>

      {/* Checklist Items Section */}
      <div className="bg-white shadow-md rounded-lg overflow-hidden border border-gray-200">
        {/* Section Header */}
        <div className="bg-teal-600 text-white p-4">
          <h2 className="text-xl font-semibold">Elementer</h2>
        </div>

        {/* Items List */}
        <ul className="divide-y divide-gray-200">
          {checklist.checklist_items.sort((a, b) => {
             // Sort by created_at or fallback
             return new Date(a.created_at).getTime() - new Date(b.created_at).getTime();
          }).map((item, index) => (
            <li key={item.id} className="p-4 flex items-center justify-between">
              <div className="flex items-center flex-grow mr-4">
                 <span className="text-gray-500 w-8 text-right mr-4 flex-shrink-0">{index + 1}</span>
                <span className="text-gray-800">{item.item_text || item.template_item_id}</span>
              </div>
              <input
                type="checkbox"
                checked={item.is_checked}
                disabled // Items are read-only on this view page
                className="form-checkbox h-5 w-5 text-teal-600 rounded border-gray-300 focus:ring-teal-500 focus:ring-offset-0 focus:ring-2 flex-shrink-0"
              />
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

const ChecklistPage = () => {
  return (
    <Suspense fallback={<div className="container mx-auto p-4">Laster...</div>}>
      <ChecklistContent />
    </Suspense>
  );
};

export default ChecklistPage;
