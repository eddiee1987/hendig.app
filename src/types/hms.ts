// src/types/hms.ts

export type ChecklistTemplate = {
  id: string;
  created_at: string;
  name: string;
  description: string | null;
};

export type ChecklistTemplateItem = {
  id: string;
  template_id: string;
  item_text: string;
  item_order: number;
};

export type ChecklistTemplateWithItems = ChecklistTemplate & {
  checklist_template_items: ChecklistTemplateItem[];
};

export type Checklist = {
  id: string;
  created_at: string;
  template_id: string;
  user_id: string; // Assuming user_id is a string (UUID)
  status: 'Påbegynt' | 'Fullført'; // Or other relevant statuses
  completed_at: string | null;
  // Fields from joined tables
  template_name: string;
  template_description: string | null;
  created_by_name: string | null; // Add created_by_name from profiles table
  // Add any other relevant fields from the 'checklists' table
  // e.g., department_name if joined
};

export type ChecklistItem = {
  id: string;
  created_at: string;
  checklist_id: string;
  template_item_id: string;
  is_checked: boolean;
  comment?: string | null; // Add comment field
  item_text?: string; // Optional: text for the checklist item (from template)
};

// Define a type for the checklist with its items
export type ChecklistWithItems = Checklist & {
  checklist_items: ChecklistItem[];
};

// Define the return type for the createChecklistInstance service function
export type CreateChecklistInstanceResult = {
  success: boolean;
  checklistId: string | null;
  error: string | null;
};
