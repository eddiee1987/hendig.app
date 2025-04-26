// src/services/hmsService.ts
import { supabase } from '@/lib/supabase'; // Assuming your Supabase client is exported from here
import { ChecklistTemplate, ChecklistTemplateWithItems, Checklist, ChecklistItem, CreateChecklistInstanceResult } from '@/types/hms'; // Import the types


/**
 * Fetches active checklist templates (for the 'New Checklist' modal and main HMS page).
 */
export const getActiveChecklistTemplates = async (): Promise<ChecklistTemplate[]> => {
  console.log('hmsService: Fetching active checklist templates...');
  const { data, error } = await supabase
    .from('checklist_templates')
    .select('id, created_at, name, description') // Select created_at as well
    .eq('is_active', true)
    .order('name');

  if (error) {
    console.error('Error fetching checklist templates:', error);
    throw new Error('Could not fetch checklist templates.');
  }
  // Explicitly cast the data to the expected type
  return data as ChecklistTemplate[] || [];
};

/**
 * Fetches a specific checklist template along with its items.
 * Used when starting a new checklist.
 */
export const getTemplateWithItems = async (templateId: string): Promise<ChecklistTemplateWithItems | null> => {
  console.log(`hmsService: Fetching template with items for ID: ${templateId}`);
  const { data, error } = await supabase
    .from('checklist_templates')
    .select(`
      id,
      created_at, // Select created_at
      name,
      description,
      checklist_template_items ( id, item_text, item_order )
    `)
    .eq('id', templateId)
    .eq('is_active', true)
    .order('item_order', { referencedTable: 'checklist_template_items', ascending: true })
    .maybeSingle(); // Use maybeSingle() as the ID might not exist

  if (error) {
    console.error('Error fetching template with items:', error);
    throw new Error('Could not fetch template details.');
  }
  // Explicitly cast the data to the expected type
  return data as ChecklistTemplateWithItems | null;
};

/**
 * Fetches existing checklist instances (for the listing page).
 * Includes joined data like template name and user name.
 */
export const getChecklists = async (): Promise<Checklist[]> => {
  console.log('hmsService: Fetching checklists...');
  // Example using joins (adjust table/column names as needed):
  const { data, error } = await supabase
    .from('checklists')
    .select(`
      id,
      created_at,
      completed_at,
      status,
      template_id, // Include template_id
      user_id, // Include user_id
      template:checklist_templates ( name, description ),
      user:profiles ( full_name ) -- Assuming a 'profiles' table linked to auth.users
      -- department:departments ( name ) -- Optional join if department is linked to checklist or user
    `)
    .order('created_at', { ascending: false });

  if (error) {
    console.error('Error fetching checklists:', error);
    throw new Error('Could not fetch checklists.');
  }

  // Map the data to the expected Checklist structure and explicitly cast
  const mappedData: Checklist[] = data?.map((item: any) => ({ // Use 'any' temporarily if join structure is complex
    id: item.id,
    template_id: item.template_id,
    user_id: item.user_id,
    template_name: item.template?.name || 'Ukjent Mal',
    template_description: item.template?.description || null,
    created_by_name: item.user?.full_name || 'Ukjent Bruker',
    // department_name: item.department?.name || undefined, // Uncomment if department join is added
    created_at: item.created_at,
    completed_at: item.completed_at,
    status: item.status as 'Påbegynt' | 'Fullført',
  })) as Checklist[] || []; // Explicitly cast the mapped array

  return mappedData;
};


/**
 * Creates a new checklist instance and its associated items.
 * This should ideally be done in a transaction or an RPC function in Supabase
 * to ensure atomicity (either all records are created or none).
 */
export const createChecklistInstance = async (
    templateId: string,
    userId: string, // Need the user ID to associate the checklist
    itemStatus: Record<string, boolean> // { template_item_id: is_checked }
): Promise<CreateChecklistInstanceResult> => {
    console.log(`hmsService: Creating checklist instance for template ${templateId} by user ${userId}`);

    // Assumes an RPC function `create_new_checklist` exists in Supabase
    // that handles creating the checklist and its items transactionally.
    // The function would take template_id, user_id, and an array/json of items.

    const itemsPayload = Object.entries(itemStatus).map(([template_item_id, is_checked]) => ({
        template_item_id,
        is_checked,
        // comment: null // Add comments if your UI supports them
    }));

    const { data, error } = await supabase.rpc('create_new_checklist', {
        p_template_id: templateId,
        p_user_id: userId,
        p_items: itemsPayload
    });

    if (error) {
        console.error('Error calling create_new_checklist RPC:', error);
        return { success: false, checklistId: null, error: 'Database error during checklist creation.' }; // Include checklistId: null
    }

    // Assuming the RPC returns an object with a checklist_id field
    if (!data || typeof data !== 'object' || !('checklist_id' in data) || !data.checklist_id) {
         console.error('RPC create_new_checklist did not return expected checklist_id', data);
         return { success: false, checklistId: null, error: 'Failed to retrieve new checklist ID after creation.' }; // Include checklistId: null
    }

    console.log('Successfully created checklist with ID:', data.checklist_id);
    return { success: true, checklistId: data.checklist_id as string, error: null }; // Include error: null
};

/**
 * Fetches a single checklist instance along with its items and related template/user data.
 */
export const getChecklistWithItems = async (checklistId: string): Promise<(Checklist & { checklist_items: (ChecklistItem & { item_text?: string })[] }) | null> => {
  console.log(`hmsService: Fetching checklist with items for ID: ${checklistId}`);
  const { data, error } = await supabase
    .from('checklists')
    .select(`
      id,
      created_at,
      completed_at,
      status,
      template_id,
      user_id,
      template:checklist_templates ( name, description ),
      user:profiles ( full_name ),
      checklist_items (
        id,
        template_item_id,
        is_checked,
        comment,
        created_at,
        template_item:checklist_template_items ( item_text )
      )
    `)
    .eq('id', checklistId)
    .maybeSingle();

  if (error) {
    console.error('Error fetching checklist with items:', error);
    throw new Error('Could not fetch checklist details.');
  }

  if (!data) {
    return null;
  }

  // Map the data to the expected ChecklistWithItems structure, including item_text
  const mappedData: Checklist & { checklist_items: (ChecklistItem & { item_text?: string })[] } = {
    id: data.id,
    template_id: data.template_id,
    user_id: data.user_id,
    template_name: (data as any).template?.name || 'Ukjent Mal',
    template_description: (data as any).template?.description || null,
    created_by_name: (data as any).user?.full_name || 'Ukjent Bruker',
    created_at: data.created_at,
    completed_at: data.completed_at,
    status: data.status as 'Påbegynt' | 'Fullført',
    checklist_items: ((data as any).checklist_items || []).map((item: any) => ({
      ...item,
      item_text: item.template_item?.item_text || undefined,
    })),
  };

  return mappedData;
};

/**
 * Deletes a checklist instance and its associated items.
 * This should ideally be done in a transaction or an RPC function in Supabase
 * to ensure atomicity.
 */
export const deleteChecklist = async (checklistId: string): Promise<{ success: boolean; error?: string }> => {
  console.log(`hmsService: Deleting checklist with ID: ${checklistId}`);

  // Ideally, use an RPC function that handles deleting checklist items first
  // and then the checklist itself within a transaction.
  // Example using separate deletes (less ideal):

  // 1. Delete associated checklist items
  const { error: deleteItemsError } = await supabase
    .from('checklist_items')
    .delete()
    .eq('checklist_id', checklistId);

  if (deleteItemsError) {
    console.error('Error deleting checklist items:', deleteItemsError);
    return { success: false, error: 'Could not delete associated checklist items.' };
  }

  // 2. Delete the checklist
  const { error: deleteChecklistError } = await supabase
    .from('checklists')
    .delete()
    .eq('id', checklistId);

  if (deleteChecklistError) {
    console.error('Error deleting checklist:', deleteChecklistError);
    // Note: If the items deletion succeeded but checklist deletion fails,
    // you'll have orphaned items unless using a transaction/RPC.
    return { success: false, error: 'Could not delete the checklist.' };
  }

  console.log(`Successfully deleted checklist with ID: ${checklistId}`);
  return { success: true };
};


// TODO: Add functions for updating checklists/items if needed
