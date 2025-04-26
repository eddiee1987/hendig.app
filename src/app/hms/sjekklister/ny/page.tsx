
// src/app/hms/sjekklister/ny/page.tsx
'use client'; // Required for state and event handlers

// src/app/hms/sjekklister/ny/page.tsx
'use client'; // Required for state and event handlers

import React, { useState, useEffect, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { getTemplateWithItems, createChecklistInstance } from '@/services/hmsService'; // Import service functions
import { ChecklistTemplateWithItems, CreateChecklistInstanceResult } from '@/types/hms'; // Import types
import { supabase } from '@/lib/supabase'; // Import supabase client


function NewChecklistContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const templateId = searchParams.get('templateId'); // Get templateId from URL query params

  const [template, setTemplate] = useState<ChecklistTemplateWithItems | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [itemStatus, setItemStatus] = useState<Record<string, boolean>>({}); // { template_item_id: is_checked }
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<'idle' | 'success' | 'error'>('idle');
  const [savedTime, setSavedTime] = useState<string | null>(null);
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

    if (!templateId) {
      setError('Ingen sjekkliste-mal ID funnet i URL.');
      setLoading(false);
      // Consider redirecting back to the list page if no ID is provided
      // router.push('/hms/sjekklister');
      return;
    }

    const fetchTemplate = async () => {
      setLoading(true);
      setError(null);
      setSubmitStatus('idle');
      try {
        const fetchedTemplate = await getTemplateWithItems(templateId); // Use imported function
        if (fetchedTemplate) {
          setTemplate(fetchedTemplate);
          const initialStatus: Record<string, boolean> = {};
          fetchedTemplate.checklist_template_items.forEach(item => {
            initialStatus[item.id] = false; // Default all items to unchecked
          });
          setItemStatus(initialStatus);
        } else {
          setError(`Kunne ikke finne sjekkliste-mal med ID: ${templateId}.`);
        }
      } catch (err) {
        console.error("Error fetching template:", err);
        setError('Feil ved lasting av sjekkliste-mal.');
      } finally {
        setLoading(false);
      }
    };

    fetchTemplate();
  }, [templateId, router]); // Add userId to dependency array if fetching template depends on user

  const handleCheckboxChange = (templateItemId: string) => {
    setItemStatus(prevStatus => ({
      ...prevStatus,
      [templateItemId]: !prevStatus[templateItemId],
    }));
     setSubmitStatus('idle'); // Reset submit status if user makes changes after save attempt
  };

  const handleSubmit = async () => {
    if (!templateId || !template || !userId) { // Ensure userId is available
        setError('Kan ikke lagre sjekklisten: Mal, ID eller brukerinformasjon mangler.');
        setSubmitStatus('error');
        return;
    }

    setIsSubmitting(true);
    setSubmitStatus('idle');
    setError(null); // Clear previous errors

    try {
      const result: CreateChecklistInstanceResult = await createChecklistInstance(templateId, userId, itemStatus); // Use actual userId

      if (result.success && result.checklistId) {
        setSubmitStatus('success');
        setSavedTime(new Date().toLocaleTimeString('nb-NO', { hour: '2-digit', minute: '2-digit' }));
        // Redirect after a short delay to show success message
        setTimeout(() => {
           router.push('/hms/sjekklister'); // Redirect to the list page
        }, 1500);
      } else {
        setSubmitStatus('error');
        setError(result.error || 'Kunne ikke lagre sjekklisten. Prøv igjen.'); // Display error from service if available
      }
    } catch (err) {
      console.error("Error submitting checklist:", err);
      setSubmitStatus('error');
      setError('En uventet feil oppstod under lagring.');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (loading || userId === null) { // Show loading while fetching user as well
    return <div className="container mx-auto p-4">Laster sjekkliste...</div>;
  }

  if (error && (!template || userId === undefined)) { // Show error prominently if template couldn't load or user is not found
    return <div className="container mx-auto p-4 text-red-600">{error}</div>;
  }

  if (!template) {
     // This case might occur if templateId is invalid but fetch didn't throw error
    return <div className="container mx-auto p-4">Fant ikke sjekkliste-malen. Sjekk om IDen i URLen er korrekt.</div>;
  }

  // Determine if all items are checked (optional, for validation or UI feedback)
  // const allChecked = Object.values(itemStatus).every(status => status);

  return (
    <div className="container mx-auto p-4">
      {/* Breadcrumbs */}
      <nav className="text-sm text-gray-500 mb-4">
        <Link href="/hms" className="hover:underline">Hjem</Link> /
        <Link href="/hms/sjekklister" className="hover:underline"> Sjekklister</Link> /
        <span className="text-gray-700"> Ny</span>
      </nav>

      {/* Header */}
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-semibold">Ny sjekkliste</h1>
        {submitStatus === 'success' && savedTime && <span className="text-green-600 font-medium">Lagret kl. {savedTime} ✓</span>}
      </div>

      {/* Description */}
      {template.description && (
        <p className="text-gray-600 mb-6 bg-gray-50 p-3 rounded border border-gray-200">{template.description}</p>
      )}

      {/* Checklist Items Section */}
      <div className="bg-white shadow-md rounded-lg overflow-hidden border border-gray-200">
        {/* Section Header */}
        <div className="bg-teal-600 text-white p-4">
          <h2 className="text-xl font-semibold">{template.name}</h2>
        </div>

        {/* Items List */}
        <ul className="divide-y divide-gray-200">
          {template.checklist_template_items.map((item, index) => (
            <li key={item.id} className="p-4 flex items-center justify-between hover:bg-teal-50 transition-colors duration-150">
              <div className="flex items-center flex-grow mr-4">
                <span className="text-gray-500 w-8 text-right mr-4 flex-shrink-0">{index + 1}</span>
                {/* Make the label clickable */}
                <label htmlFor={`item-${item.id}`} className="flex-grow cursor-pointer text-gray-800">
                  {item.item_text}
                </label>
              </div>
              {/* Checkbox aligned to the right */}
              <input
                type="checkbox"
                id={`item-${item.id}`}
                checked={itemStatus[item.id] || false}
                onChange={() => handleCheckboxChange(item.id)}
                className="form-checkbox h-5 w-5 text-teal-600 rounded border-gray-300 focus:ring-teal-500 focus:ring-offset-0 focus:ring-2 cursor-pointer flex-shrink-0"
              />
            </li>
          ))}
        </ul>
      </div>

       {/* Submission Error Message */}
       {submitStatus === 'error' && error && (
         <div className="mt-4 text-red-600 bg-red-50 p-3 rounded border border-red-200">{error}</div>
       )}

      {/* Action Button */}
      <div className="mt-6 text-right">
        <button
          onClick={handleSubmit}
          disabled={isSubmitting || submitStatus === 'success'} // Disable after successful save
          className={`bg-green-600 hover:bg-green-700 text-white font-bold py-2 px-6 rounded focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 transition-opacity duration-150 ${
            isSubmitting || submitStatus === 'success' ? 'opacity-50 cursor-not-allowed' : ''
          }`}
        >
          {isSubmitting ? 'Lagrer...' : '✅ FERDIGSTILL'}
        </button>
      </div>
    </div>
  );
}


// Wrap the component that uses useSearchParams with Suspense
// This is necessary for Next.js App Router when reading search params in client components
const NewChecklistPage = () => {
  return (
    <Suspense fallback={<div className="container mx-auto p-4">Laster...</div>}>
      <NewChecklistContent />
    </Suspense>
  );
};


export default NewChecklistPage;
