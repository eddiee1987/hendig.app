module.exports = {

"[externals]/stream [external] (stream, cjs)": (function(__turbopack_context__) {

var { g: global, __dirname, m: module, e: exports } = __turbopack_context__;
{
const mod = __turbopack_context__.x("stream", () => require("stream"));

module.exports = mod;
}}),
"[externals]/http [external] (http, cjs)": (function(__turbopack_context__) {

var { g: global, __dirname, m: module, e: exports } = __turbopack_context__;
{
const mod = __turbopack_context__.x("http", () => require("http"));

module.exports = mod;
}}),
"[externals]/url [external] (url, cjs)": (function(__turbopack_context__) {

var { g: global, __dirname, m: module, e: exports } = __turbopack_context__;
{
const mod = __turbopack_context__.x("url", () => require("url"));

module.exports = mod;
}}),
"[externals]/punycode [external] (punycode, cjs)": (function(__turbopack_context__) {

var { g: global, __dirname, m: module, e: exports } = __turbopack_context__;
{
const mod = __turbopack_context__.x("punycode", () => require("punycode"));

module.exports = mod;
}}),
"[externals]/https [external] (https, cjs)": (function(__turbopack_context__) {

var { g: global, __dirname, m: module, e: exports } = __turbopack_context__;
{
const mod = __turbopack_context__.x("https", () => require("https"));

module.exports = mod;
}}),
"[externals]/zlib [external] (zlib, cjs)": (function(__turbopack_context__) {

var { g: global, __dirname, m: module, e: exports } = __turbopack_context__;
{
const mod = __turbopack_context__.x("zlib", () => require("zlib"));

module.exports = mod;
}}),
"[project]/src/lib/supabase.ts [app-ssr] (ecmascript)": ((__turbopack_context__) => {
"use strict";

var { g: global, __dirname } = __turbopack_context__;
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
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$supabase$2f$supabase$2d$js$2f$dist$2f$module$2f$index$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$locals$3e$__ = __turbopack_context__.i("[project]/node_modules/@supabase/supabase-js/dist/module/index.js [app-ssr] (ecmascript) <locals>");
;
const supabaseUrl = ("TURBOPACK compile-time value", "https://jntsodzdafscwksizfov.supabase.co") || '';
const supabaseAnonKey = ("TURBOPACK compile-time value", "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImpudHNvZHpkYWZzY3drc2l6Zm92Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDM1NTU1NDAsImV4cCI6MjA1OTEzMTU0MH0.bHJS17KYKP4n2Abs0rp2oO0pFBGW3GorNhsJFyDljR8") || '';
console.log('Supabase URL:', supabaseUrl);
console.log('Supabase Anon Key:', ("TURBOPACK compile-time truthy", 1) ? 'Set' : ("TURBOPACK unreachable", undefined));
if ("TURBOPACK compile-time falsy", 0) {
    "TURBOPACK unreachable";
}
const supabase = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$supabase$2f$supabase$2d$js$2f$dist$2f$module$2f$index$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$locals$3e$__["createClient"])(supabaseUrl, supabaseAnonKey);
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
            const key = row.navn.toLowerCase().replaceAll(' ', '_').replaceAll('å', 'a').replaceAll('æ', 'ae').replaceAll('ø', 'o');
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
            const navn = key.replaceAll('_', ' ').replaceAll('ae', 'æ').replaceAll('o', 'ø').replaceAll('a', 'å');
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
            if ("TURBOPACK compile-time falsy", 0) {
                "TURBOPACK unreachable";
            }
            return [];
        }
        return (data || []).map((row)=>({
                created_at: row.created_at,
                navn: row.lager?.[0]?.navn || '',
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
        const navn = key.replaceAll('_', ' ').replaceAll('ae', 'æ').replaceAll('o', 'ø').replaceAll('a', 'å');
        // Hent rad for varen
        let lagerId = null;
        let nyttAntall = 0;
        const { data: lagerRows } = await supabase.from('lager').select('id, antall').eq('navn', navn).limit(1);
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
    } catch  {
        return {
            error: 'Uventet feil ved registrering'
        };
    }
}
}}),
"[project]/src/services/hmsService.ts [app-ssr] (ecmascript)": ((__turbopack_context__) => {
"use strict";

var { g: global, __dirname } = __turbopack_context__;
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
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$supabase$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/lib/supabase.ts [app-ssr] (ecmascript)"); // Assuming your Supabase client is exported from here
;
const getActiveChecklistTemplates = async ()=>{
    console.log('hmsService: Fetching active checklist templates...');
    const { data, error } = await __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$supabase$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["supabase"].from('checklist_templates').select('id, created_at, name, description') // Select created_at as well
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
    const { data, error } = await __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$supabase$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["supabase"].from('checklist_templates').select(`
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
    const { data, error } = await __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$supabase$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["supabase"].from('checklists').select(`
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
    // Map the data to the expected Checklist structure
    const mappedData = data?.map((item)=>({
            id: item.id,
            template_id: item.template_id,
            user_id: item.user_id,
            template_name: item.template?.name || 'Ukjent Mal',
            template_description: item.template?.description || null,
            created_by_name: item.user?.full_name || 'Ukjent Bruker',
            created_at: item.created_at,
            completed_at: item.completed_at,
            status: item.status
        })) || [];
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
    const { data, error } = await __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$supabase$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["supabase"].rpc('create_new_checklist', {
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
    const { data, error } = await __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$supabase$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["supabase"].from('checklists').select(`
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
    const response = data;
    const mappedData = {
        id: response.id,
        template_id: response.template_id,
        user_id: response.user_id,
        template_name: response.template?.name || 'Ukjent Mal',
        template_description: response.template?.description || null,
        created_by_name: response.user?.full_name || 'Ukjent Bruker',
        created_at: response.created_at,
        completed_at: response.completed_at,
        status: response.status,
        checklist_items: (response.checklist_items || []).map((item)=>({
                id: item.id,
                checklist_id: response.id,
                template_item_id: item.template_item_id,
                is_checked: item.is_checked,
                comment: item.comment,
                created_at: item.created_at,
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
    const { error: deleteItemsError } = await __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$supabase$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["supabase"].from('checklist_items').delete().eq('checklist_id', checklistId);
    if (deleteItemsError) {
        console.error('Error deleting checklist items:', deleteItemsError);
        return {
            success: false,
            error: 'Could not delete associated checklist items.'
        };
    }
    // 2. Delete the checklist
    const { error: deleteChecklistError } = await __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$supabase$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["supabase"].from('checklists').delete().eq('id', checklistId);
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
}}),
"[project]/src/app/hms/page.tsx [app-ssr] (ecmascript)": ((__turbopack_context__) => {
"use strict";

var { g: global, __dirname } = __turbopack_context__;
{
// src/app/hms/page.tsx
__turbopack_context__.s({
    "default": (()=>__TURBOPACK__default__export__)
});
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react-jsx-dev-runtime.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$client$2f$app$2d$dir$2f$link$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/client/app-dir/link.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$services$2f$hmsService$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/services/hmsService.ts [app-ssr] (ecmascript)"); // Import the service function
'use client'; // Make this a client component
;
;
;
;
const HMSPage = ()=>{
    const [templates, setTemplates] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])([]);
    const [loading, setLoading] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])(true);
    const [error, setError] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])(null);
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useEffect"])(()=>{
        const fetchTemplates = async ()=>{
            setLoading(true);
            setError(null);
            try {
                const activeTemplates = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$services$2f$hmsService$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["getActiveChecklistTemplates"])();
                setTemplates(activeTemplates);
            } catch (err) {
                console.error("Error fetching checklist templates:", err);
                setError("Kunne ikke laste sjekkliste-maler.");
            } finally{
                setLoading(false);
            }
        };
        fetchTemplates();
    }, []); // Empty dependency array ensures this runs once on mount
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        className: "container mx-auto p-4",
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("h1", {
                className: "text-2xl font-semibold mb-4",
                children: "HMS"
            }, void 0, false, {
                fileName: "[project]/src/app/hms/page.tsx",
                lineNumber: 34,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("h2", {
                className: "text-xl font-medium mb-3",
                children: "Velg en sjekkliste-mal:"
            }, void 0, false, {
                fileName: "[project]/src/app/hms/page.tsx",
                lineNumber: 36,
                columnNumber: 7
            }, this),
            loading && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                children: "Laster sjekkliste-maler..."
            }, void 0, false, {
                fileName: "[project]/src/app/hms/page.tsx",
                lineNumber: 38,
                columnNumber: 19
            }, this),
            error && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                className: "text-red-600",
                children: error
            }, void 0, false, {
                fileName: "[project]/src/app/hms/page.tsx",
                lineNumber: 39,
                columnNumber: 17
            }, this),
            !loading && !error && templates.length === 0 && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                children: "Ingen aktive sjekkliste-maler funnet."
            }, void 0, false, {
                fileName: "[project]/src/app/hms/page.tsx",
                lineNumber: 41,
                columnNumber: 9
            }, this),
            !loading && !error && templates.length > 0 && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("ul", {
                className: "space-y-3",
                children: templates.map((template)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("li", {
                        className: "bg-white shadow-sm rounded-lg p-4 border border-gray-200 hover:border-blue-500 transition-colors duration-150",
                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$client$2f$app$2d$dir$2f$link$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["default"], {
                            href: `/hms/sjekklister/ny?templateId=${template.id}`,
                            className: "block",
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("h3", {
                                    className: "text-lg font-semibold text-blue-600 hover:underline",
                                    children: template.name
                                }, void 0, false, {
                                    fileName: "[project]/src/app/hms/page.tsx",
                                    lineNumber: 48,
                                    columnNumber: 17
                                }, this),
                                template.description && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                    className: "text-gray-600 text-sm mt-1",
                                    children: template.description
                                }, void 0, false, {
                                    fileName: "[project]/src/app/hms/page.tsx",
                                    lineNumber: 50,
                                    columnNumber: 19
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/src/app/hms/page.tsx",
                            lineNumber: 47,
                            columnNumber: 15
                        }, this)
                    }, template.id, false, {
                        fileName: "[project]/src/app/hms/page.tsx",
                        lineNumber: 46,
                        columnNumber: 13
                    }, this))
            }, void 0, false, {
                fileName: "[project]/src/app/hms/page.tsx",
                lineNumber: 44,
                columnNumber: 9
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/src/app/hms/page.tsx",
        lineNumber: 33,
        columnNumber: 5
    }, this);
};
const __TURBOPACK__default__export__ = HMSPage;
}}),

};

//# sourceMappingURL=%5Broot-of-the-server%5D__487899c7._.js.map