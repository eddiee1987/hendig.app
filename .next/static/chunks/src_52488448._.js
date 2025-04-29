(globalThis.TURBOPACK = globalThis.TURBOPACK || []).push([typeof document === "object" ? document.currentScript : undefined, {

"[project]/src/lib/supabase.ts [app-client] (ecmascript)": ((__turbopack_context__) => {
"use strict";

var { g: global, __dirname, k: __turbopack_refresh__, m: module } = __turbopack_context__;
{
__turbopack_context__.s({
    "fetchLager": (()=>fetchLager),
    "fetchLagerHistorikk": (()=>fetchLagerHistorikk),
    "fetchTimeEntriesByEmployeeId": (()=>fetchTimeEntriesByEmployeeId),
    "registerLagerTransaksjon": (()=>registerLagerTransaksjon),
    "supabase": (()=>supabase),
    "updateLager": (()=>updateLager),
    "updateTimeEntry": (()=>updateTimeEntry)
});
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$build$2f$polyfills$2f$process$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/build/polyfills/process.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$supabase$2f$supabase$2d$js$2f$dist$2f$module$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__ = __turbopack_context__.i("[project]/node_modules/@supabase/supabase-js/dist/module/index.js [app-client] (ecmascript) <locals>");
;
const supabaseUrl = ("TURBOPACK compile-time value", "https://jntsodzdafscwksizfov.supabase.co") || '';
const supabaseAnonKey = ("TURBOPACK compile-time value", "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImpudHNvZHpkYWZzY3drc2l6Zm92Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDM1NTU1NDAsImV4cCI6MjA1OTEzMTU0MH0.bHJS17KYKP4n2Abs0rp2oO0pFBGW3GorNhsJFyDljR8") || '';
console.log('Supabase URL:', supabaseUrl);
console.log('Supabase Anon Key:', ("TURBOPACK compile-time truthy", 1) ? 'Set' : ("TURBOPACK unreachable", undefined));
if ("TURBOPACK compile-time falsy", 0) {
    "TURBOPACK unreachable";
}
const supabase = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$supabase$2f$supabase$2d$js$2f$dist$2f$module$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__["createClient"])(supabaseUrl, supabaseAnonKey);
async function fetchTimeEntriesByEmployeeId(employeeId) {
    try {
        const { data, error } = await supabase.from('time_entries').select('*').eq('employee_id', employeeId).order('date', {
            ascending: false
        });
        if (error) {
            console.error('Error fetching time entries:', error);
            return [];
        }
        return data;
    } catch (error) {
        console.error('Unexpected error fetching time entries:', error);
        return [];
    }
}
async function updateTimeEntry(entryId, updatedFields) {
    try {
        const { data, error } = await supabase.from('time_entries').update(updatedFields).eq('id', entryId);
        if (error) {
            console.error('Error updating time entry:', error);
            return null;
        }
        return data;
    } catch (error) {
        console.error('Unexpected error updating time entry:', error);
        return null;
    }
}
async function fetchLager() {
    try {
        const { data, error } = await supabase.from('lager').select('navn, antall');
        if (error) {
            console.error('Error fetching lager:', error);
            return {};
        }
        // Map til { key: antall }
        const lagerObj = {};
        data?.forEach((row)=>{
            let key = row.navn.toLowerCase().replaceAll(' ', '_').replaceAll('å', 'a').replaceAll('æ', 'ae').replaceAll('ø', 'o');
            lagerObj[key] = row.antall;
        });
        return lagerObj;
    } catch (error) {
        console.error('Unexpected error fetching lager:', error);
        return {};
    }
}
async function updateLager(form) {
    try {
        // Hent eksisterende rader
        const { data: existing, error: fetchError } = await supabase.from('lager').select('id, navn');
        if (fetchError) {
            console.error('Error fetching lager for update:', fetchError);
            return;
        }
        // Oppdater eller opprett for hver vare
        for (const [key, antall] of Object.entries(form)){
            // Finn navn fra key
            let navn = key.replaceAll('_', ' ').replaceAll('ae', 'æ').replaceAll('o', 'ø').replaceAll('a', 'å');
            // Søk etter eksisterende rad
            const existingRow = existing?.find((row)=>row.navn.toLowerCase().replaceAll(' ', '_') === key);
            if (existingRow) {
                // Oppdater
                await supabase.from('lager').update({
                    antall: Number(antall)
                }).eq('id', existingRow.id);
            } else {
                // Sett inn ny
                await supabase.from('lager').insert([
                    {
                        navn,
                        antall: Number(antall)
                    }
                ]);
            }
        }
    } catch (error) {
        console.error('Unexpected error updating lager:', error);
    }
}
async function fetchLagerHistorikk() {
    try {
        const { data, error } = await supabase.from('lager_transactions').select('created_at, type, antall, kommentar, lager_id, lager:lager_id(navn)').order('created_at', {
            ascending: false
        }).limit(100);
        if (error) {
            console.error('Error fetching lager historikk:', error);
            // Log the full error object for debugging
            if ("TURBOPACK compile-time truthy", 1) {
                window.__supabaseLagerHistorikkError = error;
            }
            return [];
        }
        // Map til flat struktur med varenavn
        return (data || []).map((row)=>({
                created_at: row.created_at,
                navn: row.lager?.navn || '',
                type: row.type,
                antall: row.antall,
                kommentar: row.kommentar || ''
            }));
    } catch (error) {
        console.error('Unexpected error fetching lager historikk:', error);
        return [];
    }
}
async function registerLagerTransaksjon({ key, type, antall, kommentar }) {
    try {
        // Finn varenavn fra key
        let navn = key.replaceAll('_', ' ').replaceAll('ae', 'æ').replaceAll('o', 'ø').replaceAll('a', 'å');
        // Hent rad for varen
        let lagerId = null;
        let nyttAntall = 0;
        const { data: lagerRows, error: lagerError } = await supabase.from('lager').select('id, antall').eq('navn', navn).limit(1);
        if (!lagerRows || lagerRows.length === 0) {
            if (type === 'manuell') {
                // Opprett ny vare hvis manuell
                const { data: insertData, error: insertError } = await supabase.from('lager').insert([
                    {
                        navn,
                        antall: Number(antall)
                    }
                ]).select('id').single();
                if (insertError || !insertData) {
                    return {
                        error: 'Kunne ikke opprette ny vare'
                    };
                }
                lagerId = insertData.id;
                nyttAntall = Number(antall);
            } else {
                return {
                    error: 'Fant ikke varen i lageret'
                };
            }
        } else {
            lagerId = lagerRows[0].id;
            nyttAntall = lagerRows[0].antall;
            if (type === 'inntak') {
                nyttAntall += antall;
            } else if (type === 'uttak') {
                if (lagerRows[0].antall < antall) {
                    return {
                        error: 'Ikke nok på lager for uttak'
                    };
                }
                nyttAntall -= antall;
            } else if (type === 'manuell') {
                nyttAntall = antall;
            }
            // Oppdater lagerbeholdning for alle typer
            const { error: updateError } = await supabase.from('lager').update({
                antall: nyttAntall
            }).eq('id', lagerId);
            if (updateError) {
                return {
                    error: 'Kunne ikke oppdatere lagerbeholdning'
                };
            }
        }
        // Registrer transaksjon ALLTID
        const { error: transError } = await supabase.from('lager_transactions').insert({
            lager_id: lagerId,
            type,
            antall,
            kommentar
        });
        if (transError) {
            return {
                error: 'Kunne ikke registrere transaksjon'
            };
        }
        return {
            success: true
        };
    } catch (error) {
        return {
            error: 'Uventet feil ved registrering'
        };
    }
}
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(module, globalThis.$RefreshHelpers$);
}
}}),
"[project]/src/services/hmsService.ts [app-client] (ecmascript)": ((__turbopack_context__) => {
"use strict";

var { g: global, __dirname, k: __turbopack_refresh__, m: module } = __turbopack_context__;
{
// src/services/hmsService.ts
__turbopack_context__.s({
    "createChecklistInstance": (()=>createChecklistInstance),
    "deleteChecklist": (()=>deleteChecklist),
    "getActiveChecklistTemplates": (()=>getActiveChecklistTemplates),
    "getChecklistWithItems": (()=>getChecklistWithItems),
    "getChecklists": (()=>getChecklists),
    "getTemplateWithItems": (()=>getTemplateWithItems)
});
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$supabase$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/lib/supabase.ts [app-client] (ecmascript)"); // Assuming your Supabase client is exported from here
;
const getActiveChecklistTemplates = async ()=>{
    console.log('hmsService: Fetching active checklist templates...');
    const { data, error } = await __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$supabase$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["supabase"].from('checklist_templates').select('id, created_at, name, description') // Select created_at as well
    .eq('is_active', true).order('name');
    if (error) {
        console.error('Error fetching checklist templates:', error);
        throw new Error('Could not fetch checklist templates.');
    }
    // Explicitly cast the data to the expected type
    return data || [];
};
const getTemplateWithItems = async (templateId)=>{
    console.log(`hmsService: Fetching template with items for ID: ${templateId}`);
    const { data, error } = await __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$supabase$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["supabase"].from('checklist_templates').select(`
      id,
      created_at, // Select created_at
      name,
      description,
      checklist_template_items ( id, item_text, item_order )
    `).eq('id', templateId).eq('is_active', true).order('item_order', {
        referencedTable: 'checklist_template_items',
        ascending: true
    }).maybeSingle(); // Use maybeSingle() as the ID might not exist
    if (error) {
        console.error('Error fetching template with items:', error);
        throw new Error('Could not fetch template details.');
    }
    // Explicitly cast the data to the expected type
    return data;
};
const getChecklists = async ()=>{
    console.log('hmsService: Fetching checklists...');
    // Example using joins (adjust table/column names as needed):
    const { data, error } = await __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$supabase$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["supabase"].from('checklists').select(`
      id,
      created_at,
      completed_at,
      status,
      template_id, // Include template_id
      user_id, // Include user_id
      template:checklist_templates ( name, description ),
      user:profiles ( full_name ) -- Assuming a 'profiles' table linked to auth.users
      -- department:departments ( name ) -- Optional join if department is linked to checklist or user
    `).order('created_at', {
        ascending: false
    });
    if (error) {
        console.error('Error fetching checklists:', error);
        throw new Error('Could not fetch checklists.');
    }
    // Map the data to the expected Checklist structure and explicitly cast
    const mappedData = data?.map((item)=>({
            id: item.id,
            template_id: item.template_id,
            user_id: item.user_id,
            template_name: item.template?.name || 'Ukjent Mal',
            template_description: item.template?.description || null,
            created_by_name: item.user?.full_name || 'Ukjent Bruker',
            // department_name: item.department?.name || undefined, // Uncomment if department join is added
            created_at: item.created_at,
            completed_at: item.completed_at,
            status: item.status
        })) || []; // Explicitly cast the mapped array
    return mappedData;
};
const createChecklistInstance = async (templateId, userId, itemStatus)=>{
    console.log(`hmsService: Creating checklist instance for template ${templateId} by user ${userId}`);
    // Assumes an RPC function `create_new_checklist` exists in Supabase
    // that handles creating the checklist and its items transactionally.
    // The function would take template_id, user_id, and an array/json of items.
    const itemsPayload = Object.entries(itemStatus).map(([template_item_id, is_checked])=>({
            template_item_id,
            is_checked
        }));
    const { data, error } = await __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$supabase$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["supabase"].rpc('create_new_checklist', {
        p_template_id: templateId,
        p_user_id: userId,
        p_items: itemsPayload
    });
    if (error) {
        console.error('Error calling create_new_checklist RPC:', error);
        return {
            success: false,
            checklistId: null,
            error: 'Database error during checklist creation.'
        }; // Include checklistId: null
    }
    // Assuming the RPC returns an object with a checklist_id field
    if (!data || typeof data !== 'object' || !('checklist_id' in data) || !data.checklist_id) {
        console.error('RPC create_new_checklist did not return expected checklist_id', data);
        return {
            success: false,
            checklistId: null,
            error: 'Failed to retrieve new checklist ID after creation.'
        }; // Include checklistId: null
    }
    console.log('Successfully created checklist with ID:', data.checklist_id);
    return {
        success: true,
        checklistId: data.checklist_id,
        error: null
    }; // Include error: null
};
const getChecklistWithItems = async (checklistId)=>{
    console.log(`hmsService: Fetching checklist with items for ID: ${checklistId}`);
    const { data, error } = await __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$supabase$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["supabase"].from('checklists').select(`
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
    `).eq('id', checklistId).maybeSingle();
    if (error) {
        console.error('Error fetching checklist with items:', error);
        throw new Error('Could not fetch checklist details.');
    }
    if (!data) {
        return null;
    }
    // Map the data to the expected ChecklistWithItems structure, including item_text
    const mappedData = {
        id: data.id,
        template_id: data.template_id,
        user_id: data.user_id,
        template_name: data.template?.name || 'Ukjent Mal',
        template_description: data.template?.description || null,
        created_by_name: data.user?.full_name || 'Ukjent Bruker',
        created_at: data.created_at,
        completed_at: data.completed_at,
        status: data.status,
        checklist_items: (data.checklist_items || []).map((item)=>({
                ...item,
                item_text: item.template_item?.item_text || undefined
            }))
    };
    return mappedData;
};
const deleteChecklist = async (checklistId)=>{
    console.log(`hmsService: Deleting checklist with ID: ${checklistId}`);
    // Ideally, use an RPC function that handles deleting checklist items first
    // and then the checklist itself within a transaction.
    // Example using separate deletes (less ideal):
    // 1. Delete associated checklist items
    const { error: deleteItemsError } = await __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$supabase$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["supabase"].from('checklist_items').delete().eq('checklist_id', checklistId);
    if (deleteItemsError) {
        console.error('Error deleting checklist items:', deleteItemsError);
        return {
            success: false,
            error: 'Could not delete associated checklist items.'
        };
    }
    // 2. Delete the checklist
    const { error: deleteChecklistError } = await __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$supabase$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["supabase"].from('checklists').delete().eq('id', checklistId);
    if (deleteChecklistError) {
        console.error('Error deleting checklist:', deleteChecklistError);
        // Note: If the items deletion succeeded but checklist deletion fails,
        // you'll have orphaned items unless using a transaction/RPC.
        return {
            success: false,
            error: 'Could not delete the checklist.'
        };
    }
    console.log(`Successfully deleted checklist with ID: ${checklistId}`);
    return {
        success: true
    };
}; // TODO: Add functions for updating checklists/items if needed
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(module, globalThis.$RefreshHelpers$);
}
}}),
"[project]/src/app/hms/sjekklister/ny/page.tsx [app-client] (ecmascript)": ((__turbopack_context__) => {
"use strict";

var { g: global, __dirname, k: __turbopack_refresh__, m: module } = __turbopack_context__;
{
// src/app/hms/sjekklister/ny/page.tsx
__turbopack_context__.s({
    "default": (()=>__TURBOPACK__default__export__)
});
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$navigation$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/navigation.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$client$2f$app$2d$dir$2f$link$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/client/app-dir/link.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$services$2f$hmsService$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/services/hmsService.ts [app-client] (ecmascript)"); // Import service functions
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$supabase$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/lib/supabase.ts [app-client] (ecmascript)"); // Import supabase client
;
var _s = __turbopack_context__.k.signature();
'use client'; // Required for state and event handlers
// src/app/hms/sjekklister/ny/page.tsx
'use client'; // Required for state and event handlers
;
;
;
;
;
function NewChecklistContent() {
    _s();
    const searchParams = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$navigation$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useSearchParams"])();
    const router = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$navigation$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRouter"])();
    const templateId = searchParams.get('templateId'); // Get templateId from URL query params
    const [template, setTemplate] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(null);
    const [loading, setLoading] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(true);
    const [error, setError] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(null);
    const [itemStatus, setItemStatus] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])({}); // { template_item_id: is_checked }
    const [isSubmitting, setIsSubmitting] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(false);
    const [submitStatus, setSubmitStatus] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])('idle');
    const [savedTime, setSavedTime] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(null);
    const [userId, setUserId] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(null); // State to store the logged-in user's ID
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "NewChecklistContent.useEffect": ()=>{
            // Fetch user ID
            const fetchUser = {
                "NewChecklistContent.useEffect.fetchUser": async ()=>{
                    const { data: { user } } = await __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$supabase$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["supabase"].auth.getUser();
                    if (user) {
                        setUserId(user.id);
                    } else {
                        // Handle case where user is not logged in, maybe redirect to login
                        setError('Bruker ikke logget inn.');
                        setLoading(false);
                    }
                }
            }["NewChecklistContent.useEffect.fetchUser"];
            fetchUser();
            if (!templateId) {
                setError('Ingen sjekkliste-mal ID funnet i URL.');
                setLoading(false);
                // Consider redirecting back to the list page if no ID is provided
                // router.push('/hms/sjekklister');
                return;
            }
            const fetchTemplate = {
                "NewChecklistContent.useEffect.fetchTemplate": async ()=>{
                    setLoading(true);
                    setError(null);
                    setSubmitStatus('idle');
                    try {
                        const fetchedTemplate = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$services$2f$hmsService$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["getTemplateWithItems"])(templateId); // Use imported function
                        if (fetchedTemplate) {
                            setTemplate(fetchedTemplate);
                            const initialStatus = {};
                            fetchedTemplate.checklist_template_items.forEach({
                                "NewChecklistContent.useEffect.fetchTemplate": (item)=>{
                                    initialStatus[item.id] = false; // Default all items to unchecked
                                }
                            }["NewChecklistContent.useEffect.fetchTemplate"]);
                            setItemStatus(initialStatus);
                        } else {
                            setError(`Kunne ikke finne sjekkliste-mal med ID: ${templateId}.`);
                        }
                    } catch (err) {
                        console.error("Error fetching template:", err);
                        setError('Feil ved lasting av sjekkliste-mal.');
                    } finally{
                        setLoading(false);
                    }
                }
            }["NewChecklistContent.useEffect.fetchTemplate"];
            fetchTemplate();
        }
    }["NewChecklistContent.useEffect"], [
        templateId,
        router
    ]); // Add userId to dependency array if fetching template depends on user
    const handleCheckboxChange = (templateItemId)=>{
        setItemStatus((prevStatus)=>({
                ...prevStatus,
                [templateItemId]: !prevStatus[templateItemId]
            }));
        setSubmitStatus('idle'); // Reset submit status if user makes changes after save attempt
    };
    const handleSubmit = async ()=>{
        if (!templateId || !template || !userId) {
            setError('Kan ikke lagre sjekklisten: Mal, ID eller brukerinformasjon mangler.');
            setSubmitStatus('error');
            return;
        }
        setIsSubmitting(true);
        setSubmitStatus('idle');
        setError(null); // Clear previous errors
        try {
            const result = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$services$2f$hmsService$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["createChecklistInstance"])(templateId, userId, itemStatus); // Use actual userId
            if (result.success && result.checklistId) {
                setSubmitStatus('success');
                setSavedTime(new Date().toLocaleTimeString('nb-NO', {
                    hour: '2-digit',
                    minute: '2-digit'
                }));
                // Redirect after a short delay to show success message
                setTimeout(()=>{
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
        } finally{
            setIsSubmitting(false);
        }
    };
    if (loading || userId === null) {
        return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
            className: "container mx-auto p-4",
            children: "Laster sjekkliste..."
        }, void 0, false, {
            fileName: "[project]/src/app/hms/sjekklister/ny/page.tsx",
            lineNumber: 123,
            columnNumber: 12
        }, this);
    }
    if (error && (!template || userId === undefined)) {
        return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
            className: "container mx-auto p-4 text-red-600",
            children: error
        }, void 0, false, {
            fileName: "[project]/src/app/hms/sjekklister/ny/page.tsx",
            lineNumber: 127,
            columnNumber: 12
        }, this);
    }
    if (!template) {
        // This case might occur if templateId is invalid but fetch didn't throw error
        return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
            className: "container mx-auto p-4",
            children: "Fant ikke sjekkliste-malen. Sjekk om IDen i URLen er korrekt."
        }, void 0, false, {
            fileName: "[project]/src/app/hms/sjekklister/ny/page.tsx",
            lineNumber: 132,
            columnNumber: 12
        }, this);
    }
    // Determine if all items are checked (optional, for validation or UI feedback)
    // const allChecked = Object.values(itemStatus).every(status => status);
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        className: "container mx-auto p-4",
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("nav", {
                className: "text-sm text-gray-500 mb-4",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$client$2f$app$2d$dir$2f$link$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {
                        href: "/hms",
                        className: "hover:underline",
                        children: "Hjem"
                    }, void 0, false, {
                        fileName: "[project]/src/app/hms/sjekklister/ny/page.tsx",
                        lineNumber: 142,
                        columnNumber: 9
                    }, this),
                    " /",
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$client$2f$app$2d$dir$2f$link$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {
                        href: "/hms/sjekklister",
                        className: "hover:underline",
                        children: " Sjekklister"
                    }, void 0, false, {
                        fileName: "[project]/src/app/hms/sjekklister/ny/page.tsx",
                        lineNumber: 143,
                        columnNumber: 9
                    }, this),
                    " /",
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                        className: "text-gray-700",
                        children: " Ny"
                    }, void 0, false, {
                        fileName: "[project]/src/app/hms/sjekklister/ny/page.tsx",
                        lineNumber: 144,
                        columnNumber: 9
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/src/app/hms/sjekklister/ny/page.tsx",
                lineNumber: 141,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "flex justify-between items-center mb-4",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h1", {
                        className: "text-2xl font-semibold",
                        children: "Ny sjekkliste"
                    }, void 0, false, {
                        fileName: "[project]/src/app/hms/sjekklister/ny/page.tsx",
                        lineNumber: 149,
                        columnNumber: 9
                    }, this),
                    submitStatus === 'success' && savedTime && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                        className: "text-green-600 font-medium",
                        children: [
                            "Lagret kl. ",
                            savedTime,
                            " ✓"
                        ]
                    }, void 0, true, {
                        fileName: "[project]/src/app/hms/sjekklister/ny/page.tsx",
                        lineNumber: 150,
                        columnNumber: 53
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/src/app/hms/sjekklister/ny/page.tsx",
                lineNumber: 148,
                columnNumber: 7
            }, this),
            template.description && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                className: "text-gray-600 mb-6 bg-gray-50 p-3 rounded border border-gray-200",
                children: template.description
            }, void 0, false, {
                fileName: "[project]/src/app/hms/sjekklister/ny/page.tsx",
                lineNumber: 155,
                columnNumber: 9
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "bg-white shadow-md rounded-lg overflow-hidden border border-gray-200",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "bg-teal-600 text-white p-4",
                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h2", {
                            className: "text-xl font-semibold",
                            children: template.name
                        }, void 0, false, {
                            fileName: "[project]/src/app/hms/sjekklister/ny/page.tsx",
                            lineNumber: 162,
                            columnNumber: 11
                        }, this)
                    }, void 0, false, {
                        fileName: "[project]/src/app/hms/sjekklister/ny/page.tsx",
                        lineNumber: 161,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("ul", {
                        className: "divide-y divide-gray-200",
                        children: template.checklist_template_items.map((item, index)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("li", {
                                className: "p-4 flex items-center justify-between hover:bg-teal-50 transition-colors duration-150",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: "flex items-center flex-grow mr-4",
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                className: "text-gray-500 w-8 text-right mr-4 flex-shrink-0",
                                                children: index + 1
                                            }, void 0, false, {
                                                fileName: "[project]/src/app/hms/sjekklister/ny/page.tsx",
                                                lineNumber: 170,
                                                columnNumber: 17
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                                                htmlFor: `item-${item.id}`,
                                                className: "flex-grow cursor-pointer text-gray-800",
                                                children: item.item_text
                                            }, void 0, false, {
                                                fileName: "[project]/src/app/hms/sjekklister/ny/page.tsx",
                                                lineNumber: 172,
                                                columnNumber: 17
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/src/app/hms/sjekklister/ny/page.tsx",
                                        lineNumber: 169,
                                        columnNumber: 15
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                                        type: "checkbox",
                                        id: `item-${item.id}`,
                                        checked: itemStatus[item.id] || false,
                                        onChange: ()=>handleCheckboxChange(item.id),
                                        className: "form-checkbox h-5 w-5 text-teal-600 rounded border-gray-300 focus:ring-teal-500 focus:ring-offset-0 focus:ring-2 cursor-pointer flex-shrink-0"
                                    }, void 0, false, {
                                        fileName: "[project]/src/app/hms/sjekklister/ny/page.tsx",
                                        lineNumber: 177,
                                        columnNumber: 15
                                    }, this)
                                ]
                            }, item.id, true, {
                                fileName: "[project]/src/app/hms/sjekklister/ny/page.tsx",
                                lineNumber: 168,
                                columnNumber: 13
                            }, this))
                    }, void 0, false, {
                        fileName: "[project]/src/app/hms/sjekklister/ny/page.tsx",
                        lineNumber: 166,
                        columnNumber: 9
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/src/app/hms/sjekklister/ny/page.tsx",
                lineNumber: 159,
                columnNumber: 7
            }, this),
            submitStatus === 'error' && error && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "mt-4 text-red-600 bg-red-50 p-3 rounded border border-red-200",
                children: error
            }, void 0, false, {
                fileName: "[project]/src/app/hms/sjekklister/ny/page.tsx",
                lineNumber: 191,
                columnNumber: 10
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "mt-6 text-right",
                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                    onClick: handleSubmit,
                    disabled: isSubmitting || submitStatus === 'success',
                    className: `bg-green-600 hover:bg-green-700 text-white font-bold py-2 px-6 rounded focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 transition-opacity duration-150 ${isSubmitting || submitStatus === 'success' ? 'opacity-50 cursor-not-allowed' : ''}`,
                    children: isSubmitting ? 'Lagrer...' : '✅ FERDIGSTILL'
                }, void 0, false, {
                    fileName: "[project]/src/app/hms/sjekklister/ny/page.tsx",
                    lineNumber: 196,
                    columnNumber: 9
                }, this)
            }, void 0, false, {
                fileName: "[project]/src/app/hms/sjekklister/ny/page.tsx",
                lineNumber: 195,
                columnNumber: 7
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/src/app/hms/sjekklister/ny/page.tsx",
        lineNumber: 139,
        columnNumber: 5
    }, this);
}
_s(NewChecklistContent, "Q3FVkd5fbs7VgFq5vTI9cslwqJ4=", false, function() {
    return [
        __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$navigation$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useSearchParams"],
        __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$navigation$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRouter"]
    ];
});
_c = NewChecklistContent;
// Wrap the component that uses useSearchParams with Suspense
// This is necessary for Next.js App Router when reading search params in client components
const NewChecklistPage = ()=>{
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Suspense"], {
        fallback: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
            className: "container mx-auto p-4",
            children: "Laster..."
        }, void 0, false, {
            fileName: "[project]/src/app/hms/sjekklister/ny/page.tsx",
            lineNumber: 215,
            columnNumber: 25
        }, void 0),
        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(NewChecklistContent, {}, void 0, false, {
            fileName: "[project]/src/app/hms/sjekklister/ny/page.tsx",
            lineNumber: 216,
            columnNumber: 7
        }, this)
    }, void 0, false, {
        fileName: "[project]/src/app/hms/sjekklister/ny/page.tsx",
        lineNumber: 215,
        columnNumber: 5
    }, this);
};
_c1 = NewChecklistPage;
const __TURBOPACK__default__export__ = NewChecklistPage;
var _c, _c1;
__turbopack_context__.k.register(_c, "NewChecklistContent");
__turbopack_context__.k.register(_c1, "NewChecklistPage");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(module, globalThis.$RefreshHelpers$);
}
}}),
}]);

//# sourceMappingURL=src_52488448._.js.map