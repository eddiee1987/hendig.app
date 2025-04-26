// src/components/hms/NewChecklistModal.tsx
'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { getActiveChecklistTemplates } from '@/services/hmsService'; // Import service function
// TODO: Import actual type
// import { ChecklistTemplate } from '@/types/hms';

// Placeholder type (keep until actual type is defined)
type ChecklistTemplate = {
  id: string;
  name: string;
};


interface NewChecklistModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const NewChecklistModal: React.FC<NewChecklistModalProps> = ({ isOpen, onClose }) => {
  const router = useRouter();
  const [templates, setTemplates] = useState<ChecklistTemplate[]>([]);
  const [selectedTemplateId, setSelectedTemplateId] = useState<string>('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (isOpen) {
      setLoading(true);
      setError(null);
      setSelectedTemplateId(''); // Reset selection when modal opens
      getActiveChecklistTemplates()
        .then(data => {
          // Fjern duplikater basert på id
          const unique = Array.from(new Map(data.map(t => [t.id, t])).values());
          setTemplates(unique);
          if (unique.length > 0) {
            // Optionally pre-select the first item, or leave blank
            // setSelectedTemplateId(unique[0].id);
          }
        })
        .catch(err => {
          console.error("Error fetching templates:", err);
          setError('Kunne ikke laste sjekkliste-maler.');
        })
        .finally(() => setLoading(false));
    }
  }, [isOpen]);

  const handleStart = () => {
    if (!selectedTemplateId) {
      setError('Vennligst velg en sjekkliste-mal.');
      return;
    }
    onClose(); // Close the modal
    // Navigate to the 'new' page with the selected template ID
    router.push(`/hms/sjekklister/ny?templateId=${selectedTemplateId}`);
  };

  if (!isOpen) {
    return null;
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex justify-center items-center p-4">
      <div className="bg-white dark:bg-gray-900 rounded-lg shadow-xl p-6 w-full max-w-md border border-gray-200 dark:border-gray-700">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold dark:text-white">Hvilken sjekkliste vil du starte?</h2>
          <button onClick={onClose} className="text-gray-500 dark:text-gray-300 hover:text-gray-700 dark:hover:text-white text-2xl">&times;</button>
        </div>

        {loading && <p className="text-gray-700 dark:text-gray-200">Laster maler...</p>}
        {error && <p className="text-red-600 dark:text-red-400 mb-4">{error}</p>}

        {!loading && !error && (
          <div className="mb-4">
            <label htmlFor="templateSelect" className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-1">
              Velg mal:
            </label>
            <select
              id="templateSelect"
              value={selectedTemplateId}
              onChange={(e) => {
                setSelectedTemplateId(e.target.value);
                setError(null); // Clear error on selection change
              }}
              className="block w-full p-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 dark:bg-gray-800 dark:text-gray-100"
              disabled={loading}
            >
              <option value="" disabled>-- Velg en sjekkliste --</option>
              {templates.map(template => (
                <option key={template.id} value={template.id} className="dark:bg-gray-800 dark:text-gray-100">
                  {template.name}
                </option>
              ))}
            </select>
          </div>
        )}

        <div className="text-right">
          <button
            onClick={handleStart}
            disabled={loading || !selectedTemplateId}
            className={`bg-green-600 hover:bg-green-700 dark:bg-green-700 dark:hover:bg-green-800 text-white font-bold py-2 px-4 rounded focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 dark:focus:ring-offset-gray-900 ${
              loading || !selectedTemplateId ? 'opacity-50 cursor-not-allowed' : ''
            }`}
          >
            Start
          </button>
        </div>
      </div>
    </div>
  );
};

export default NewChecklistModal;
