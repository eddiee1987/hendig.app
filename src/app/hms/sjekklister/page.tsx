// src/app/hms/sjekklister/page.tsx
'use client'; // Make this a client component to handle state

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
// We will need components for the table, modal, button etc.
import ChecklistTable from '@/components/hms/ChecklistTable'; // Import the ChecklistTable component
import NewChecklistModal from '@/components/hms/NewChecklistModal'; // Import the modal
// import Button from '@/components/ui/Button'; // Assuming a Button component exists

// We will need service functions to fetch data
import { getChecklists, deleteChecklist } from '@/services/hmsService'; // Import deleteChecklist
import { Checklist } from '@/types/hms'; // Import the Checklist type


const SjekklisterPage = () => {
  const [checklists, setChecklists] = useState<Checklist[]>([]); // Use Checklist[] type
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false); // State for modal visibility

  useEffect(() => {
    // Fetch checklists when the component mounts
    setLoading(true);
    setError(null);
    getChecklists()
      .then(data => setChecklists(data))
      .catch(err => {
        console.error("Error fetching checklists:", err);
        setError("Kunne ikke laste sjekklister.");
      })
      .finally(() => setLoading(false));
  }, []); // Empty dependency array ensures this runs once on mount

  const handleDelete = async (id: string) => {
    if (!window.confirm('Er du sikker på at du vil slette denne sjekklisten?')) return;
    setLoading(true);
    setError(null);
    try {
      const result = await deleteChecklist(id);
      if (!result.success) {
        setError(result.error || 'Kunne ikke slette sjekkliste.');
      } else {
        setChecklists((prev) => prev.filter((c) => c.id !== id));
      }
    } catch (err) {
      setError('Kunne ikke slette sjekkliste.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mx-auto p-4">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-semibold">Sjekklister</h1>
        {/* Button to open the modal */}
        <button
          onClick={() => setIsModalOpen(true)} // Set state to open modal
          className="bg-green-600 hover:bg-green-700 text-white font-bold py-2 px-4 rounded"
        >
          + NY
        </button>
      </div>

      <p className="text-lg mb-4">Påbegynte og fullførte</p>

      {loading && <p>Laster sjekklister...</p>}
      {error && <p className="text-red-600">{error}</p>}
      {!loading && !error && checklists.length === 0 && (
        <p>Ingen sjekklister funnet.</p>
      )}
      {!loading && !error && checklists.length > 0 && (
        // Use the ChecklistTable component
        <ChecklistTable checklists={checklists} onDelete={handleDelete} />
      )}

      {/* Render the modal */}
      <NewChecklistModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
    </div>
  );
};

export default SjekklisterPage;
