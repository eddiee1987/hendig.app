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
"[project]/src/services/projectService.ts [app-client] (ecmascript)": ((__turbopack_context__) => {
"use strict";

var { g: global, __dirname, k: __turbopack_refresh__, m: module } = __turbopack_context__;
{
__turbopack_context__.s({
    "createProject": (()=>createProject),
    "deleteProject": (()=>deleteProject),
    "getProject": (()=>getProject),
    "getProjects": (()=>getProjects),
    "getScheduledProjects": (()=>getScheduledProjects),
    "getScheduledProjectsForDate": (()=>getScheduledProjectsForDate),
    "scheduleProject": (()=>scheduleProject),
    "unscheduleProject": (()=>unscheduleProject),
    "unscheduleProjectByProjectIdAndDate": (()=>unscheduleProjectByProjectIdAndDate),
    "updateProject": (()=>updateProject)
});
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$supabase$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/lib/supabase.ts [app-client] (ecmascript)");
;
async function getProjects() {
    const { data, error } = await __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$supabase$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["supabase"].from('projects').select('*').order('created_at', {
        ascending: false
    });
    if (error) {
        console.error('Error fetching projects:', error);
        throw error;
    }
    return data || [];
}
async function getProject(id) {
    const { data, error } = await __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$supabase$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["supabase"].from('projects').select('*').eq('id', id).single();
    if (error) {
        console.error(`Error fetching project with id ${id}:`, error);
        throw error;
    }
    return data;
}
async function createProject(project) {
    console.log('Creating project with data:', project);
    try {
        // Check if the Supabase client is properly initialized
        console.log('Supabase client:', __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$supabase$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["supabase"]);
        // Check if the table exists by trying to select a single row
        const { data: tableCheck, error: tableError } = await __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$supabase$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["supabase"].from('projects').select('id').limit(1);
        if (tableError) {
            console.error('Error checking projects table:', tableError);
            throw new Error(`Table check failed: ${tableError.message}`);
        }
        console.log('Table check result:', tableCheck);
        // Proceed with insert
        const { data, error } = await __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$supabase$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["supabase"].from('projects').insert([
            project
        ]).select();
        if (error) {
            console.error('Error creating project:', error);
            throw new Error(`Insert failed: ${error.message}`);
        }
        console.log('Project created successfully:', data);
        return data?.[0];
    } catch (error) {
        console.error('Exception in createProject:', error);
        throw error;
    }
}
async function updateProject(id, project) {
    console.log('Updating project with id:', id, 'and data:', project);
    try {
        const { data, error } = await __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$supabase$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["supabase"].from('projects').update(project).eq('id', id).select();
        if (error) {
            console.error(`Error updating project with id ${id}:`, error);
            throw error;
        }
        console.log('Project updated successfully:', data);
        return data?.[0];
    } catch (error) {
        console.error(`Exception in updateProject for id ${id}:`, error);
        throw error;
    }
}
async function deleteProject(id) {
    const { error } = await __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$supabase$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["supabase"].from('projects').delete().eq('id', id);
    if (error) {
        console.error(`Error deleting project with id ${id}:`, error);
        throw error;
    }
    return true;
}
async function getScheduledProjects() {
    const { data, error } = await __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$supabase$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["supabase"].from('scheduled_projects').select(`
      *,
      projects:project_id (*)
    `).order('scheduled_date', {
        ascending: true
    });
    if (error) {
        console.error('Error fetching scheduled projects:', error);
        throw error;
    }
    return data || [];
}
async function getScheduledProjectsForDate(date) {
    const { data, error } = await __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$supabase$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["supabase"].from('scheduled_projects').select(`
      *,
      projects:project_id (*)
    `).eq('scheduled_date', date);
    if (error) {
        console.error(`Error fetching scheduled projects for date ${date}:`, error);
        throw error;
    }
    return data || [];
}
async function scheduleProject(projectId, scheduledDate) {
    const { data, error } = await __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$supabase$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["supabase"].from('scheduled_projects').insert([
        {
            project_id: projectId,
            scheduled_date: scheduledDate
        }
    ]).select();
    if (error) {
        console.error(`Error scheduling project ${projectId} for date ${scheduledDate}:`, error);
        throw error;
    }
    return data?.[0];
}
async function unscheduleProject(id) {
    const { error } = await __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$supabase$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["supabase"].from('scheduled_projects').delete().eq('id', id);
    if (error) {
        console.error(`Error unscheduling project with id ${id}:`, error);
        throw error;
    }
    return true;
}
async function unscheduleProjectByProjectIdAndDate(projectId, scheduledDate) {
    const { error } = await __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$supabase$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["supabase"].from('scheduled_projects').delete().eq('project_id', projectId).eq('scheduled_date', scheduledDate);
    if (error) {
        console.error(`Error unscheduling project ${projectId} for date ${scheduledDate}:`, error);
        throw error;
    }
    return true;
}
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(module, globalThis.$RefreshHelpers$);
}
}}),
"[project]/src/services/abonnementService.ts [app-client] (ecmascript)": ((__turbopack_context__) => {
"use strict";

var { g: global, __dirname, k: __turbopack_refresh__, m: module } = __turbopack_context__;
{
__turbopack_context__.s({
    "createAbonnement": (()=>createAbonnement),
    "getAbonnements": (()=>getAbonnements),
    "getScheduledAbonnements": (()=>getScheduledAbonnements),
    "scheduleAbonnement": (()=>scheduleAbonnement),
    "unscheduleAbonnement": (()=>unscheduleAbonnement),
    "unscheduleAbonnementByIdAndDate": (()=>unscheduleAbonnementByIdAndDate)
});
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$supabase$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/lib/supabase.ts [app-client] (ecmascript)");
;
async function getAbonnements() {
    const { data, error } = await __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$supabase$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["supabase"].from('abonnementer').select('*').order('etternavn', {
        ascending: true
    });
    if (error) {
        console.error('Error fetching abonnements:', error);
        throw error;
    }
    return data || [];
}
async function getScheduledAbonnements() {
    const { data, error } = await __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$supabase$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["supabase"].from('scheduled_abonnements').select(`
      *,
      abonnementer:abonnement_id (*)
    `).order('scheduled_date', {
        ascending: true
    });
    if (error) {
        console.error('Error fetching scheduled abonnements:', error);
        throw error;
    }
    return data || [];
}
async function scheduleAbonnement(abonnementId, scheduledDate) {
    try {
        // Validate inputs
        const abonnementIdNum = Number(abonnementId);
        if (isNaN(abonnementIdNum)) {
            throw new Error(`Invalid abonnement ID: ${abonnementId}`);
        }
        if (!scheduledDate || !Date.parse(scheduledDate)) {
            throw new Error(`Invalid date format: ${scheduledDate}`);
        }
        const { data, error } = await __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$supabase$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["supabase"].from('scheduled_abonnements').insert([
            {
                abonnement_id: abonnementIdNum,
                scheduled_date: scheduledDate
            }
        ]).select();
        if (error) {
            console.error(`Error scheduling abonnement ${abonnementId} for date ${scheduledDate}:`, {
                message: error.message,
                code: error.code,
                details: error.details,
                hint: error.hint
            });
            throw new Error(`Failed to schedule: ${error.message}`);
        }
        if (!data || data.length === 0) {
            throw new Error('No data returned from scheduling operation');
        }
        return data[0];
    } catch (error) {
        console.error(`Failed to schedule abonnement ${abonnementId}:`, {
            error: error instanceof Error ? error.message : error,
            stack: error instanceof Error ? error.stack : undefined
        });
        throw new Error(`Failed to schedule abonnement: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
}
async function unscheduleAbonnement(id) {
    const { error } = await __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$supabase$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["supabase"].from('scheduled_abonnements').delete().eq('id', id);
    if (error) {
        console.error(`Error unscheduling abonnement with id ${id}:`, error);
        throw error;
    }
    return true;
}
async function unscheduleAbonnementByIdAndDate(abonnementId, scheduledDate) {
    const { error } = await __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$supabase$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["supabase"].from('scheduled_abonnements').delete().eq('abonnement_id', abonnementId).eq('scheduled_date', scheduledDate);
    if (error) {
        console.error(`Error unscheduling abonnement ${abonnementId} for date ${scheduledDate}:`, error);
        throw error;
    }
    return true;
}
async function createAbonnement(abonnement) {
    const { data, error } = await __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$supabase$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["supabase"].from('abonnementer').insert([
        {
            fornavn: abonnement.fornavn,
            etternavn: abonnement.etternavn,
            adresse: abonnement.adresse,
            kommune: abonnement.kommune,
            var: abonnement.var,
            host: abonnement.host,
            epost: abonnement.epost,
            fakturert: abonnement.fakturert,
            fornyelsesdato: abonnement.fornyelsesdato,
            sum: abonnement.sum,
            notat: abonnement.notat
        }
    ]).select();
    if (error) {
        console.error('Error creating abonnement:', error);
        throw error;
    }
    return data?.[0];
}
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(module, globalThis.$RefreshHelpers$);
}
}}),
"[project]/src/components/ProjectPlanner.tsx [app-client] (ecmascript)": ((__turbopack_context__) => {
"use strict";

var { g: global, __dirname, k: __turbopack_refresh__, m: module } = __turbopack_context__;
{
__turbopack_context__.s({
    "default": (()=>ProjectPlanner)
});
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$heroicons$2f$react$2f$24$2f$outline$2f$esm$2f$ChevronLeftIcon$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__ChevronLeftIcon$3e$__ = __turbopack_context__.i("[project]/node_modules/@heroicons/react/24/outline/esm/ChevronLeftIcon.js [app-client] (ecmascript) <export default as ChevronLeftIcon>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$heroicons$2f$react$2f$24$2f$outline$2f$esm$2f$ChevronRightIcon$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__ChevronRightIcon$3e$__ = __turbopack_context__.i("[project]/node_modules/@heroicons/react/24/outline/esm/ChevronRightIcon.js [app-client] (ecmascript) <export default as ChevronRightIcon>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$heroicons$2f$react$2f$24$2f$outline$2f$esm$2f$CalendarIcon$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__CalendarIcon$3e$__ = __turbopack_context__.i("[project]/node_modules/@heroicons/react/24/outline/esm/CalendarIcon.js [app-client] (ecmascript) <export default as CalendarIcon>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$heroicons$2f$react$2f$24$2f$outline$2f$esm$2f$FunnelIcon$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__FunnelIcon$3e$__ = __turbopack_context__.i("[project]/node_modules/@heroicons/react/24/outline/esm/FunnelIcon.js [app-client] (ecmascript) <export default as FunnelIcon>");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$services$2f$projectService$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/services/projectService.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$services$2f$abonnementService$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/services/abonnementService.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2d$hot$2d$toast$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/react-hot-toast/dist/index.mjs [app-client] (ecmascript)");
;
var _s = __turbopack_context__.k.signature();
'use client';
;
;
;
;
;
// Convert Supabase project format to our internal format
const convertProject = (project)=>({
        id: project.id,
        name: project.name,
        description: project.description,
        client: project.client,
        status: project.status,
        startDate: project.start_date,
        endDate: project.end_date,
        budget: project.budget ? Number(project.budget) : undefined,
        priority: project.priority
    });
function ProjectPlanner({ projects, abonnements, inspections }) {
    _s();
    const [view, setView] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])('month');
    const [currentDate, setCurrentDate] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(new Date());
    const [calendarDays, setCalendarDays] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])([]);
    const [scheduledProjects, setScheduledProjects] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])([]);
    const [scheduledAbonnements, setScheduledAbonnements] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])([]);
    const [filter, setFilter] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])('all');
    const [showFilterMenu, setShowFilterMenu] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(false);
    const [draggedProject, setDraggedProject] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(null);
    const [draggedAbonnement, setDraggedAbonnement] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(null);
    const [showProjectInfo, setShowProjectInfo] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(null);
    const [showAbonnementInfo, setShowAbonnementInfo] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(null);
    const [isLoading, setIsLoading] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(true);
    const [activeTab, setActiveTab] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])('projects');
    const dragCounter = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRef"])(0);
    const filterMenuRef = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRef"])(null);
    // Load scheduled projects and abonnements from Supabase
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "ProjectPlanner.useEffect": ()=>{
            const fetchData = {
                "ProjectPlanner.useEffect.fetchData": async ()=>{
                    try {
                        setIsLoading(true);
                        // Fetch scheduled projects
                        const projectsData = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$services$2f$projectService$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["getScheduledProjects"])();
                        const formattedProjectsData = projectsData.map({
                            "ProjectPlanner.useEffect.fetchData.formattedProjectsData": (item)=>({
                                    ...convertProject(item.projects),
                                    scheduledDate: item.scheduled_date,
                                    scheduledId: item.id
                                })
                        }["ProjectPlanner.useEffect.fetchData.formattedProjectsData"]);
                        setScheduledProjects(formattedProjectsData);
                        // Fetch scheduled abonnements
                        const abonnementsData = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$services$2f$abonnementService$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["getScheduledAbonnements"])();
                        if (!abonnementsData) {
                            throw new Error('No data returned from getScheduledAbonnements');
                        }
                        const formattedAbonnementsData = abonnementsData.map({
                            "ProjectPlanner.useEffect.fetchData.formattedAbonnementsData": (item)=>{
                                if (!item.abonnementer) {
                                    console.warn('Missing abonnementer data for scheduled item:', item);
                                    return null;
                                }
                                return {
                                    ...item.abonnementer,
                                    scheduledDate: item.scheduled_date,
                                    scheduledId: item.id
                                };
                            }
                        }["ProjectPlanner.useEffect.fetchData.formattedAbonnementsData"]).filter(Boolean);
                        setScheduledAbonnements(formattedAbonnementsData);
                    } catch (error) {
                        console.error('Error fetching scheduled data:', error);
                        __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2d$hot$2d$toast$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["toast"].error('Kunne ikke hente planlagte data');
                    } finally{
                        setIsLoading(false);
                    }
                }
            }["ProjectPlanner.useEffect.fetchData"];
            fetchData();
        }
    }["ProjectPlanner.useEffect"], []);
    // Close filter menu when clicking outside
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "ProjectPlanner.useEffect": ()=>{
            const handleClickOutside = {
                "ProjectPlanner.useEffect.handleClickOutside": (event)=>{
                    if (filterMenuRef.current && !filterMenuRef.current.contains(event.target) && showFilterMenu) {
                        setShowFilterMenu(false);
                    }
                }
            }["ProjectPlanner.useEffect.handleClickOutside"];
            document.addEventListener('mousedown', handleClickOutside);
            return ({
                "ProjectPlanner.useEffect": ()=>{
                    document.removeEventListener('mousedown', handleClickOutside);
                }
            })["ProjectPlanner.useEffect"];
        }
    }["ProjectPlanner.useEffect"], [
        showFilterMenu
    ]);
    // Generate calendar days
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "ProjectPlanner.useEffect": ()=>{
            const days = [];
            const today = new Date();
            // Get first day of month
            const firstDayOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1);
            // Get last day of month
            const lastDayOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0);
            // Calculate days from previous month to fill first week
            const daysFromPrevMonth = (firstDayOfMonth.getDay() + 6) % 7;
            // Add days from previous month
            for(let i = firstDayOfMonth.getDate() - daysFromPrevMonth; i < firstDayOfMonth.getDate(); i++){
                const date = new Date(currentDate.getFullYear(), currentDate.getMonth(), i);
                days.push({
                    date,
                    dayOfMonth: i,
                    isCurrentMonth: false,
                    isToday: date.toDateString() === today.toDateString(),
                    projects: getProjectsForDate(date),
                    abonnements: getAbonnementsForDate(date),
                    inspections: getInspectionsForDate(date)
                });
            }
            // Add days for current month
            for(let i = 1; i <= lastDayOfMonth.getDate(); i++){
                const date = new Date(currentDate.getFullYear(), currentDate.getMonth(), i);
                days.push({
                    date,
                    dayOfMonth: i,
                    isCurrentMonth: true,
                    isToday: date.toDateString() === today.toDateString(),
                    projects: getProjectsForDate(date),
                    abonnements: getAbonnementsForDate(date),
                    inspections: getInspectionsForDate(date)
                });
            }
            // Add days from next month to complete the grid (6 rows x 7 days = 42 cells)
            const daysToAdd = 42 - days.length;
            for(let i = 1; i <= daysToAdd; i++){
                const date = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, i);
                days.push({
                    date,
                    dayOfMonth: i,
                    isCurrentMonth: false,
                    isToday: date.toDateString() === today.toDateString(),
                    projects: getProjectsForDate(date),
                    abonnements: getAbonnementsForDate(date),
                    inspections: getInspectionsForDate(date)
                });
            }
            setCalendarDays(days);
        }
    }["ProjectPlanner.useEffect"], [
        currentDate,
        scheduledProjects,
        scheduledAbonnements,
        inspections
    ]);
    // Get projects scheduled for a specific date
    function getProjectsForDate(date) {
        const dateString = date.toISOString().split('T')[0];
        return scheduledProjects.filter((project)=>project.scheduledDate === dateString);
    }
    // Get abonnements scheduled for a specific date
    function getAbonnementsForDate(date) {
        const dateString = date.toISOString().split('T')[0];
        return scheduledAbonnements.filter((abonnement)=>abonnement.scheduledDate === dateString);
    }
    // Get inspections scheduled for a specific date
    function getInspectionsForDate(date) {
        const dateString = date.toISOString().split('T')[0];
        return inspections.filter((inspection)=>inspection.inspection_date === dateString);
    }
    // Navigation functions
    const goToPrev = ()=>{
        if (view === 'month') {
            setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1));
        } else if (view === 'week') {
            const newDate = new Date(currentDate);
            newDate.setDate(newDate.getDate() - 7);
            setCurrentDate(newDate);
        } else if (view === 'day') {
            const newDate = new Date(currentDate);
            newDate.setDate(newDate.getDate() - 1);
            setCurrentDate(newDate);
        }
    };
    const goToNext = ()=>{
        if (view === 'month') {
            setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1));
        } else if (view === 'week') {
            const newDate = new Date(currentDate);
            newDate.setDate(newDate.getDate() + 7);
            setCurrentDate(newDate);
        } else if (view === 'day') {
            const newDate = new Date(currentDate);
            newDate.setDate(newDate.getDate() + 1);
            setCurrentDate(newDate);
        }
    };
    const goToToday = ()=>{
        setCurrentDate(new Date());
    };
    // Format date for display based on view
    const getHeaderText = ()=>{
        if (view === 'month') {
            return currentDate.toLocaleDateString('nb-NO', {
                month: 'long',
                year: 'numeric'
            });
        } else if (view === 'week') {
            const startOfWeek = new Date(currentDate);
            const dayOfWeek = startOfWeek.getDay();
            const diff = dayOfWeek === 0 ? -6 : 1 - dayOfWeek // Adjust to get Monday
            ;
            startOfWeek.setDate(startOfWeek.getDate() + diff);
            const endOfWeek = new Date(startOfWeek);
            endOfWeek.setDate(endOfWeek.getDate() + 6);
            const startMonth = startOfWeek.getMonth() === endOfWeek.getMonth() ? '' : startOfWeek.toLocaleDateString('nb-NO', {
                month: 'long'
            }) + ' ';
            return `${startMonth}${startOfWeek.getDate()}. - ${endOfWeek.toLocaleDateString('nb-NO', {
                day: 'numeric',
                month: 'long',
                year: 'numeric'
            })}`;
        } else {
            return currentDate.toLocaleDateString('nb-NO', {
                weekday: 'long',
                day: 'numeric',
                month: 'long',
                year: 'numeric'
            });
        }
    };
    // Get day name
    const getDayName = (dayIndex)=>{
        const days = [
            'Man',
            'Tirs',
            'Ons',
            'Tors',
            'Fre',
            'Lør',
            'Søn'
        ];
        return days[dayIndex];
    };
    // Handle drag start
    const handleDragStart = (project)=>{
        setDraggedProject(project);
    };
    // Handle drag over
    const handleDragOver = (e, date)=>{
        e.preventDefault();
    };
    // Handle drag enter
    const handleDragEnter = (e)=>{
        e.preventDefault();
        dragCounter.current++;
    };
    // Handle drag leave
    const handleDragLeave = (e)=>{
        e.preventDefault();
        dragCounter.current--;
    };
    // Handle drop
    const handleDrop = async (e, date)=>{
        e.preventDefault();
        dragCounter.current = 0;
        const dateString = date.toISOString().split('T')[0];
        // Handle project drop
        if (draggedProject) {
            // Check if project is already scheduled for this date
            const alreadyScheduled = scheduledProjects.some((p)=>p.id === draggedProject.id && p.scheduledDate === dateString);
            if (alreadyScheduled) {
                setDraggedProject(null);
                return;
            }
            try {
                // Schedule project in Supabase
                const result = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$services$2f$projectService$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["scheduleProject"])(draggedProject.id, dateString);
                if (result) {
                    // Add new scheduled project to state
                    const newScheduledProject = {
                        ...draggedProject,
                        scheduledDate: dateString,
                        scheduledId: result.id
                    };
                    setScheduledProjects([
                        ...scheduledProjects,
                        newScheduledProject
                    ]);
                    __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2d$hot$2d$toast$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["toast"].success('Prosjekt planlagt');
                }
            } catch (error) {
                console.error('Error scheduling project:', error);
                __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2d$hot$2d$toast$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["toast"].error('Kunne ikke planlegge prosjekt');
            } finally{
                setDraggedProject(null);
            }
        }
        // Handle abonnement drop
        if (draggedAbonnement) {
            // Validate abonnement data
            if (!draggedAbonnement.id) {
                __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2d$hot$2d$toast$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["toast"].error('Ugyldig vedlikeholdsavtale - mangler ID');
                setDraggedAbonnement(null);
                return;
            }
            // Check if abonnement is already scheduled for this date
            const alreadyScheduled = scheduledAbonnements.some((a)=>a.id === draggedAbonnement.id && a.scheduledDate === dateString);
            if (alreadyScheduled) {
                setDraggedAbonnement(null);
                return;
            }
            try {
                console.log('Attempting to schedule abonnement:', {
                    id: draggedAbonnement.id,
                    date: dateString
                });
                // Schedule abonnement in Supabase
                const result = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$services$2f$abonnementService$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["scheduleAbonnement"])(draggedAbonnement.id, dateString);
                if (result) {
                    console.log('Successfully scheduled abonnement:', result);
                    // Add new scheduled abonnement to state
                    const newScheduledAbonnement = {
                        ...draggedAbonnement,
                        scheduledDate: dateString,
                        scheduledId: result.id
                    };
                    setScheduledAbonnements([
                        ...scheduledAbonnements,
                        newScheduledAbonnement
                    ]);
                    __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2d$hot$2d$toast$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["toast"].success('Vedlikeholdsavtale planlagt');
                } else {
                    console.error('No result returned from scheduleAbonnement');
                    __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2d$hot$2d$toast$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["toast"].error('Ingen data returnert fra server');
                }
            } catch (error) {
                console.error('Detailed error scheduling abonnement:', {
                    error: error instanceof Error ? error.message : error,
                    stack: error instanceof Error ? error.stack : undefined,
                    abonnementId: draggedAbonnement.id,
                    date: dateString
                });
                if (error instanceof Error) {
                    if (error.message.includes('JWT expired') || error.message.includes('Invalid API key')) {
                        __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2d$hot$2d$toast$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["toast"].error('Autentiseringsfeil - sjekk API-nøkkel');
                    } else if (error.message.includes('foreign key constraint')) {
                        __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2d$hot$2d$toast$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["toast"].error('Ugyldig vedlikeholdsavtale-ID');
                    } else {
                        __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2d$hot$2d$toast$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["toast"].error(`Feil ved planlegging: ${error.message}`);
                    }
                } else {
                    __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2d$hot$2d$toast$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["toast"].error('Ukjent feil ved planlegging');
                }
            } finally{
                setDraggedAbonnement(null);
            }
        }
    };
    // Remove project from calendar
    const removeFromCalendar = async (projectId, date)=>{
        try {
            await (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$services$2f$projectService$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["unscheduleProjectByProjectIdAndDate"])(projectId, date);
            setScheduledProjects(scheduledProjects.filter((p)=>!(p.id === projectId && p.scheduledDate === date)));
            __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2d$hot$2d$toast$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["toast"].success('Prosjekt fjernet fra kalender');
        } catch (error) {
            console.error('Error removing project from calendar:', error);
            __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2d$hot$2d$toast$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["toast"].error('Kunne ikke fjerne prosjekt fra kalender');
        }
    };
    // Remove abonnement from calendar
    const removeAbonnementFromCalendar = async (abonnementId, date)=>{
        try {
            await (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$services$2f$abonnementService$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["unscheduleAbonnementByIdAndDate"])(abonnementId, date);
            setScheduledAbonnements(scheduledAbonnements.filter((a)=>!(a.id === abonnementId && a.scheduledDate === date)));
            __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2d$hot$2d$toast$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["toast"].success('Vedlikeholdsavtale fjernet fra kalender');
        } catch (error) {
            console.error('Error removing abonnement from calendar:', error);
            __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2d$hot$2d$toast$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["toast"].error('Kunne ikke fjerne vedlikeholdsavtale fra kalender');
        }
    };
    // Filter projects based on status
    const filteredProjects = filter === 'all' ? projects : projects.filter((project)=>project.status === filter);
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        className: "bg-gray-900 rounded-xl border border-gray-800",
        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
            className: "flex flex-col h-full",
            children: [
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: "flex border-b border-gray-800",
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                            className: `px-4 py-3 text-sm font-medium flex items-center ${view === 'month' ? 'text-white border-b-2 border-blue-500' : 'text-gray-400 hover:text-white'}`,
                            onClick: ()=>setView('month'),
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$heroicons$2f$react$2f$24$2f$outline$2f$esm$2f$CalendarIcon$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__CalendarIcon$3e$__["CalendarIcon"], {
                                    className: "w-4 h-4 mr-2"
                                }, void 0, false, {
                                    fileName: "[project]/src/components/ProjectPlanner.tsx",
                                    lineNumber: 471,
                                    columnNumber: 13
                                }, this),
                                "Måned"
                            ]
                        }, void 0, true, {
                            fileName: "[project]/src/components/ProjectPlanner.tsx",
                            lineNumber: 463,
                            columnNumber: 11
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                            className: `px-4 py-3 text-sm font-medium flex items-center ${view === 'week' ? 'text-white border-b-2 border-blue-500' : 'text-gray-400 hover:text-white'}`,
                            onClick: ()=>setView('week'),
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$heroicons$2f$react$2f$24$2f$outline$2f$esm$2f$CalendarIcon$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__CalendarIcon$3e$__["CalendarIcon"], {
                                    className: "w-4 h-4 mr-2"
                                }, void 0, false, {
                                    fileName: "[project]/src/components/ProjectPlanner.tsx",
                                    lineNumber: 482,
                                    columnNumber: 13
                                }, this),
                                "Uke"
                            ]
                        }, void 0, true, {
                            fileName: "[project]/src/components/ProjectPlanner.tsx",
                            lineNumber: 474,
                            columnNumber: 11
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                            className: `px-4 py-3 text-sm font-medium flex items-center ${view === 'day' ? 'text-white border-b-2 border-blue-500' : 'text-gray-400 hover:text-white'}`,
                            onClick: ()=>setView('day'),
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$heroicons$2f$react$2f$24$2f$outline$2f$esm$2f$CalendarIcon$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__CalendarIcon$3e$__["CalendarIcon"], {
                                    className: "w-4 h-4 mr-2"
                                }, void 0, false, {
                                    fileName: "[project]/src/components/ProjectPlanner.tsx",
                                    lineNumber: 493,
                                    columnNumber: 13
                                }, this),
                                "Dag"
                            ]
                        }, void 0, true, {
                            fileName: "[project]/src/components/ProjectPlanner.tsx",
                            lineNumber: 485,
                            columnNumber: 11
                        }, this)
                    ]
                }, void 0, true, {
                    fileName: "[project]/src/components/ProjectPlanner.tsx",
                    lineNumber: 462,
                    columnNumber: 9
                }, this),
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: "flex flex-1",
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "w-1/4 border-r border-gray-800 flex flex-col",
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    className: "flex border-b border-gray-700",
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                            className: `flex-1 px-4 py-2 text-sm font-medium ${activeTab === 'projects' ? 'text-white border-b-2 border-blue-500' : 'text-gray-400 hover:text-white'}`,
                                            onClick: ()=>setActiveTab('projects'),
                                            children: "Prosjekter"
                                        }, void 0, false, {
                                            fileName: "[project]/src/components/ProjectPlanner.tsx",
                                            lineNumber: 503,
                                            columnNumber: 15
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                            className: `flex-1 px-4 py-2 text-sm font-medium ${activeTab === 'abonnements' ? 'text-white border-b-2 border-blue-500' : 'text-gray-400 hover:text-white'}`,
                                            onClick: ()=>setActiveTab('abonnements'),
                                            children: "Vedlikeholdsavtaler"
                                        }, void 0, false, {
                                            fileName: "[project]/src/components/ProjectPlanner.tsx",
                                            lineNumber: 513,
                                            columnNumber: 15
                                        }, this)
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/src/components/ProjectPlanner.tsx",
                                    lineNumber: 502,
                                    columnNumber: 13
                                }, this),
                                activeTab === 'projects' && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    className: "p-4 flex-1 flex flex-col",
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                            className: "flex justify-between items-center mb-4",
                                            children: [
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h3", {
                                                    className: "text-lg font-medium text-white",
                                                    children: "Prosjekter"
                                                }, void 0, false, {
                                                    fileName: "[project]/src/components/ProjectPlanner.tsx",
                                                    lineNumber: 529,
                                                    columnNumber: 19
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                    className: "relative",
                                                    children: [
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                                            onClick: ()=>setShowFilterMenu(!showFilterMenu),
                                                            className: "flex items-center text-sm text-gray-400 hover:text-white",
                                                            children: [
                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$heroicons$2f$react$2f$24$2f$outline$2f$esm$2f$FunnelIcon$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__FunnelIcon$3e$__["FunnelIcon"], {
                                                                    className: "w-4 h-4 mr-1"
                                                                }, void 0, false, {
                                                                    fileName: "[project]/src/components/ProjectPlanner.tsx",
                                                                    lineNumber: 535,
                                                                    columnNumber: 23
                                                                }, this),
                                                                "Filter: ",
                                                                filter === 'all' ? 'Alle' : filter === 'active' ? 'Aktive' : filter === 'completed' ? 'Fullførte' : 'Arkiverte'
                                                            ]
                                                        }, void 0, true, {
                                                            fileName: "[project]/src/components/ProjectPlanner.tsx",
                                                            lineNumber: 531,
                                                            columnNumber: 21
                                                        }, this),
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                            ref: filterMenuRef,
                                                            className: `absolute right-0 mt-2 w-48 bg-gray-800 rounded-lg shadow-lg z-10 ${showFilterMenu ? 'block' : 'hidden'}`,
                                                            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                className: "py-1",
                                                                children: [
                                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                                                        className: "block w-full text-left px-4 py-2 text-sm text-gray-400 hover:bg-gray-700 hover:text-white",
                                                                        onClick: ()=>{
                                                                            setFilter('all');
                                                                            setShowFilterMenu(false);
                                                                        },
                                                                        children: "Alle"
                                                                    }, void 0, false, {
                                                                        fileName: "[project]/src/components/ProjectPlanner.tsx",
                                                                        lineNumber: 545,
                                                                        columnNumber: 25
                                                                    }, this),
                                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                                                        className: "block w-full text-left px-4 py-2 text-sm text-gray-400 hover:bg-gray-700 hover:text-white",
                                                                        onClick: ()=>{
                                                                            setFilter('active');
                                                                            setShowFilterMenu(false);
                                                                        },
                                                                        children: "Aktive"
                                                                    }, void 0, false, {
                                                                        fileName: "[project]/src/components/ProjectPlanner.tsx",
                                                                        lineNumber: 554,
                                                                        columnNumber: 25
                                                                    }, this),
                                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                                                        className: "block w-full text-left px-4 py-2 text-sm text-gray-400 hover:bg-gray-700 hover:text-white",
                                                                        onClick: ()=>{
                                                                            setFilter('completed');
                                                                            setShowFilterMenu(false);
                                                                        },
                                                                        children: "Fullførte"
                                                                    }, void 0, false, {
                                                                        fileName: "[project]/src/components/ProjectPlanner.tsx",
                                                                        lineNumber: 563,
                                                                        columnNumber: 25
                                                                    }, this),
                                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                                                        className: "block w-full text-left px-4 py-2 text-sm text-gray-400 hover:bg-gray-700 hover:text-white",
                                                                        onClick: ()=>{
                                                                            setFilter('archived');
                                                                            setShowFilterMenu(false);
                                                                        },
                                                                        children: "Arkiverte"
                                                                    }, void 0, false, {
                                                                        fileName: "[project]/src/components/ProjectPlanner.tsx",
                                                                        lineNumber: 572,
                                                                        columnNumber: 25
                                                                    }, this)
                                                                ]
                                                            }, void 0, true, {
                                                                fileName: "[project]/src/components/ProjectPlanner.tsx",
                                                                lineNumber: 544,
                                                                columnNumber: 23
                                                            }, this)
                                                        }, void 0, false, {
                                                            fileName: "[project]/src/components/ProjectPlanner.tsx",
                                                            lineNumber: 540,
                                                            columnNumber: 21
                                                        }, this)
                                                    ]
                                                }, void 0, true, {
                                                    fileName: "[project]/src/components/ProjectPlanner.tsx",
                                                    lineNumber: 530,
                                                    columnNumber: 19
                                                }, this)
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/src/components/ProjectPlanner.tsx",
                                            lineNumber: 528,
                                            columnNumber: 17
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                            className: "space-y-2 overflow-y-auto flex-1",
                                            children: filteredProjects.map((project)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                    className: "bg-gray-800 rounded-lg p-3 cursor-move hover:bg-gray-750 border border-gray-700",
                                                    draggable: true,
                                                    onDragStart: ()=>handleDragStart(project),
                                                    children: [
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                            className: "flex justify-between items-start",
                                                            children: [
                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h4", {
                                                                    className: "text-sm font-medium text-white",
                                                                    children: project.name
                                                                }, void 0, false, {
                                                                    fileName: "[project]/src/components/ProjectPlanner.tsx",
                                                                    lineNumber: 594,
                                                                    columnNumber: 25
                                                                }, this),
                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                                    className: `px-1.5 py-0.5 rounded-full text-xs font-medium ${project.priority === 'high' ? 'bg-red-900/50 text-red-400' : project.priority === 'medium' ? 'bg-yellow-900/50 text-yellow-400' : 'bg-green-900/50 text-green-400'}`,
                                                                    children: project.priority
                                                                }, void 0, false, {
                                                                    fileName: "[project]/src/components/ProjectPlanner.tsx",
                                                                    lineNumber: 595,
                                                                    columnNumber: 25
                                                                }, this)
                                                            ]
                                                        }, void 0, true, {
                                                            fileName: "[project]/src/components/ProjectPlanner.tsx",
                                                            lineNumber: 593,
                                                            columnNumber: 23
                                                        }, this),
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                            className: "text-xs text-gray-400 mt-1 truncate",
                                                            children: project.client
                                                        }, void 0, false, {
                                                            fileName: "[project]/src/components/ProjectPlanner.tsx",
                                                            lineNumber: 605,
                                                            columnNumber: 23
                                                        }, this)
                                                    ]
                                                }, project.id, true, {
                                                    fileName: "[project]/src/components/ProjectPlanner.tsx",
                                                    lineNumber: 587,
                                                    columnNumber: 21
                                                }, this))
                                        }, void 0, false, {
                                            fileName: "[project]/src/components/ProjectPlanner.tsx",
                                            lineNumber: 585,
                                            columnNumber: 17
                                        }, this)
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/src/components/ProjectPlanner.tsx",
                                    lineNumber: 527,
                                    columnNumber: 15
                                }, this),
                                activeTab === 'abonnements' && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    className: "p-4 flex-1 flex flex-col",
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                            className: "flex justify-between items-center mb-4",
                                            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h3", {
                                                className: "text-lg font-medium text-white",
                                                children: "Vedlikeholdsavtaler"
                                            }, void 0, false, {
                                                fileName: "[project]/src/components/ProjectPlanner.tsx",
                                                lineNumber: 616,
                                                columnNumber: 19
                                            }, this)
                                        }, void 0, false, {
                                            fileName: "[project]/src/components/ProjectPlanner.tsx",
                                            lineNumber: 615,
                                            columnNumber: 17
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                            className: "space-y-2 overflow-y-auto flex-1",
                                            children: abonnements.map((abonnement)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                    className: "bg-gray-800 rounded-lg p-3 cursor-move hover:bg-gray-750 border border-gray-700",
                                                    draggable: true,
                                                    onDragStart: ()=>{
                                                        setDraggedAbonnement(abonnement);
                                                        setDraggedProject(null);
                                                    },
                                                    children: [
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                            className: "flex justify-between items-start",
                                                            children: [
                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h4", {
                                                                    className: "text-sm font-medium text-white",
                                                                    children: abonnement.etternavn
                                                                }, void 0, false, {
                                                                    fileName: "[project]/src/components/ProjectPlanner.tsx",
                                                                    lineNumber: 630,
                                                                    columnNumber: 25
                                                                }, this),
                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                                    className: "px-1.5 py-0.5 rounded-full text-xs font-medium bg-blue-900/50 text-blue-400",
                                                                    children: "Vedlikehold"
                                                                }, void 0, false, {
                                                                    fileName: "[project]/src/components/ProjectPlanner.tsx",
                                                                    lineNumber: 631,
                                                                    columnNumber: 25
                                                                }, this)
                                                            ]
                                                        }, void 0, true, {
                                                            fileName: "[project]/src/components/ProjectPlanner.tsx",
                                                            lineNumber: 629,
                                                            columnNumber: 23
                                                        }, this),
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                            className: "text-xs text-gray-400 mt-1 truncate",
                                                            children: abonnement.adresse
                                                        }, void 0, false, {
                                                            fileName: "[project]/src/components/ProjectPlanner.tsx",
                                                            lineNumber: 635,
                                                            columnNumber: 23
                                                        }, this),
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                            className: "text-xs text-gray-400 truncate",
                                                            children: abonnement.kommune
                                                        }, void 0, false, {
                                                            fileName: "[project]/src/components/ProjectPlanner.tsx",
                                                            lineNumber: 636,
                                                            columnNumber: 23
                                                        }, this)
                                                    ]
                                                }, abonnement.id, true, {
                                                    fileName: "[project]/src/components/ProjectPlanner.tsx",
                                                    lineNumber: 620,
                                                    columnNumber: 21
                                                }, this))
                                        }, void 0, false, {
                                            fileName: "[project]/src/components/ProjectPlanner.tsx",
                                            lineNumber: 618,
                                            columnNumber: 17
                                        }, this)
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/src/components/ProjectPlanner.tsx",
                                    lineNumber: 614,
                                    columnNumber: 15
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/src/components/ProjectPlanner.tsx",
                            lineNumber: 500,
                            columnNumber: 11
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "flex-1 flex flex-col",
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    className: "flex items-center justify-between p-4 border-b border-gray-800",
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h2", {
                                            className: "text-xl font-semibold text-white",
                                            children: getHeaderText()
                                        }, void 0, false, {
                                            fileName: "[project]/src/components/ProjectPlanner.tsx",
                                            lineNumber: 648,
                                            columnNumber: 15
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                            className: "flex items-center space-x-2",
                                            children: [
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                                    onClick: goToPrev,
                                                    className: "p-1.5 rounded-full text-gray-400 hover:text-white hover:bg-gray-800",
                                                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$heroicons$2f$react$2f$24$2f$outline$2f$esm$2f$ChevronLeftIcon$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__ChevronLeftIcon$3e$__["ChevronLeftIcon"], {
                                                        className: "w-5 h-5"
                                                    }, void 0, false, {
                                                        fileName: "[project]/src/components/ProjectPlanner.tsx",
                                                        lineNumber: 656,
                                                        columnNumber: 19
                                                    }, this)
                                                }, void 0, false, {
                                                    fileName: "[project]/src/components/ProjectPlanner.tsx",
                                                    lineNumber: 652,
                                                    columnNumber: 17
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                                    onClick: goToToday,
                                                    className: "px-3 py-1.5 text-sm text-gray-400 hover:text-white",
                                                    children: "I dag"
                                                }, void 0, false, {
                                                    fileName: "[project]/src/components/ProjectPlanner.tsx",
                                                    lineNumber: 658,
                                                    columnNumber: 17
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                                    onClick: goToNext,
                                                    className: "p-1.5 rounded-full text-gray-400 hover:text-white hover:bg-gray-800",
                                                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$heroicons$2f$react$2f$24$2f$outline$2f$esm$2f$ChevronRightIcon$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__ChevronRightIcon$3e$__["ChevronRightIcon"], {
                                                        className: "w-5 h-5"
                                                    }, void 0, false, {
                                                        fileName: "[project]/src/components/ProjectPlanner.tsx",
                                                        lineNumber: 668,
                                                        columnNumber: 19
                                                    }, this)
                                                }, void 0, false, {
                                                    fileName: "[project]/src/components/ProjectPlanner.tsx",
                                                    lineNumber: 664,
                                                    columnNumber: 17
                                                }, this)
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/src/components/ProjectPlanner.tsx",
                                            lineNumber: 651,
                                            columnNumber: 15
                                        }, this)
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/src/components/ProjectPlanner.tsx",
                                    lineNumber: 647,
                                    columnNumber: 13
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    className: "flex-1 p-2",
                                    children: [
                                        view === 'month' && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Fragment"], {
                                            children: [
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                    className: "grid grid-cols-7 gap-1 mb-1",
                                                    children: [
                                                        0,
                                                        1,
                                                        2,
                                                        3,
                                                        4,
                                                        5,
                                                        6
                                                    ].map((day)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                            className: "text-center text-xs font-medium text-gray-400 py-1",
                                                            children: getDayName(day)
                                                        }, day, false, {
                                                            fileName: "[project]/src/components/ProjectPlanner.tsx",
                                                            lineNumber: 680,
                                                            columnNumber: 23
                                                        }, this))
                                                }, void 0, false, {
                                                    fileName: "[project]/src/components/ProjectPlanner.tsx",
                                                    lineNumber: 678,
                                                    columnNumber: 19
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                    className: "grid grid-cols-7 gap-1 flex-1",
                                                    children: calendarDays.map((day, index)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                            className: `min-h-[100px] rounded-lg border ${day.isCurrentMonth ? day.isToday ? 'bg-blue-900/20 border-blue-800' : 'bg-gray-800 border-gray-700' : 'bg-gray-850 border-gray-800'} p-1 relative`,
                                                            onDragOver: (e)=>handleDragOver(e, day.date),
                                                            onDragEnter: handleDragEnter,
                                                            onDragLeave: handleDragLeave,
                                                            onDrop: (e)=>handleDrop(e, day.date),
                                                            children: [
                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                    className: "flex justify-between items-center mb-1",
                                                                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                                        className: `text-xs font-medium ${day.isCurrentMonth ? day.isToday ? 'text-blue-400' : 'text-white' : 'text-gray-500'}`,
                                                                        children: day.dayOfMonth
                                                                    }, void 0, false, {
                                                                        fileName: "[project]/src/components/ProjectPlanner.tsx",
                                                                        lineNumber: 704,
                                                                        columnNumber: 27
                                                                    }, this)
                                                                }, void 0, false, {
                                                                    fileName: "[project]/src/components/ProjectPlanner.tsx",
                                                                    lineNumber: 703,
                                                                    columnNumber: 25
                                                                }, this),
                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                    className: "space-y-1 overflow-y-auto max-h-[80px] min-h-[60px]",
                                                                    onDragOver: (e)=>{
                                                                        e.preventDefault();
                                                                        e.currentTarget.classList.add('bg-gray-700/50');
                                                                    },
                                                                    onDragLeave: (e)=>{
                                                                        e.currentTarget.classList.remove('bg-gray-700/50');
                                                                    },
                                                                    onDrop: (e)=>{
                                                                        e.preventDefault();
                                                                        e.currentTarget.classList.remove('bg-gray-700/50');
                                                                        handleDrop(e, day.date);
                                                                    },
                                                                    children: [
                                                                        day.projects.map((project)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                                className: `text-xs p-1 rounded relative cursor-move transition-all duration-200 hover:shadow-lg ${project.priority === 'high' ? 'bg-red-900/30 text-red-400 border border-red-800/50 hover:bg-red-900/40' : project.priority === 'medium' ? 'bg-yellow-900/30 text-yellow-400 border border-yellow-800/50 hover:bg-yellow-900/40' : 'bg-green-900/30 text-green-400 border border-green-800/50 hover:bg-green-900/40'}`,
                                                                                onMouseEnter: ()=>setShowProjectInfo(`${project.id}-${day.date.toISOString()}`),
                                                                                onMouseLeave: ()=>setShowProjectInfo(null),
                                                                                children: [
                                                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                                        className: "truncate",
                                                                                        children: project.name
                                                                                    }, void 0, false, {
                                                                                        fileName: "[project]/src/components/ProjectPlanner.tsx",
                                                                                        lineNumber: 743,
                                                                                        columnNumber: 31
                                                                                    }, this),
                                                                                    showProjectInfo === `${project.id}-${day.date.toISOString()}` && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                                        className: "absolute z-10 left-0 top-full mt-1 w-48 bg-gray-900 rounded-lg shadow-lg border border-gray-700 p-2 text-xs",
                                                                                        children: [
                                                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h5", {
                                                                                                className: "font-medium text-white mb-1",
                                                                                                children: project.name
                                                                                            }, void 0, false, {
                                                                                                fileName: "[project]/src/components/ProjectPlanner.tsx",
                                                                                                lineNumber: 747,
                                                                                                columnNumber: 35
                                                                                            }, this),
                                                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                                                                className: "text-gray-400 mb-1",
                                                                                                children: project.client
                                                                                            }, void 0, false, {
                                                                                                fileName: "[project]/src/components/ProjectPlanner.tsx",
                                                                                                lineNumber: 748,
                                                                                                columnNumber: 35
                                                                                            }, this),
                                                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                                                                className: "text-gray-400 mb-1 line-clamp-2",
                                                                                                children: project.description
                                                                                            }, void 0, false, {
                                                                                                fileName: "[project]/src/components/ProjectPlanner.tsx",
                                                                                                lineNumber: 749,
                                                                                                columnNumber: 35
                                                                                            }, this),
                                                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                                                                                onClick: ()=>removeFromCalendar(project.id, day.date.toISOString().split('T')[0]),
                                                                                                className: "text-red-400 hover:text-red-300 text-xs mt-1",
                                                                                                children: "Fjern fra kalender"
                                                                                            }, void 0, false, {
                                                                                                fileName: "[project]/src/components/ProjectPlanner.tsx",
                                                                                                lineNumber: 750,
                                                                                                columnNumber: 35
                                                                                            }, this)
                                                                                        ]
                                                                                    }, void 0, true, {
                                                                                        fileName: "[project]/src/components/ProjectPlanner.tsx",
                                                                                        lineNumber: 746,
                                                                                        columnNumber: 33
                                                                                    }, this)
                                                                                ]
                                                                            }, `project-${project.id}-${day.date.toISOString()}`, true, {
                                                                                fileName: "[project]/src/components/ProjectPlanner.tsx",
                                                                                lineNumber: 731,
                                                                                columnNumber: 29
                                                                            }, this)),
                                                                        day.abonnements.map((abonnement)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                                className: "text-xs p-1 rounded relative cursor-move transition-all duration-200 hover:shadow-lg bg-blue-900/30 text-blue-400 border border-blue-800/50 hover:bg-blue-900/40",
                                                                                onMouseEnter: ()=>setShowAbonnementInfo(`${abonnement.id}-${day.date.toISOString()}`),
                                                                                onMouseLeave: ()=>setShowAbonnementInfo(null),
                                                                                children: [
                                                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                                        className: "truncate",
                                                                                        children: abonnement.etternavn
                                                                                    }, void 0, false, {
                                                                                        fileName: "[project]/src/components/ProjectPlanner.tsx",
                                                                                        lineNumber: 769,
                                                                                        columnNumber: 31
                                                                                    }, this),
                                                                                    showAbonnementInfo === `${abonnement.id}-${day.date.toISOString()}` && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                                        className: "absolute z-10 left-0 top-full mt-1 w-48 bg-gray-900 rounded-lg shadow-lg border border-gray-700 p-2 text-xs",
                                                                                        children: [
                                                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h5", {
                                                                                                className: "font-medium text-white mb-1",
                                                                                                children: abonnement.etternavn
                                                                                            }, void 0, false, {
                                                                                                fileName: "[project]/src/components/ProjectPlanner.tsx",
                                                                                                lineNumber: 773,
                                                                                                columnNumber: 35
                                                                                            }, this),
                                                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                                                                className: "text-gray-400 mb-1",
                                                                                                children: abonnement.adresse
                                                                                            }, void 0, false, {
                                                                                                fileName: "[project]/src/components/ProjectPlanner.tsx",
                                                                                                lineNumber: 774,
                                                                                                columnNumber: 35
                                                                                            }, this),
                                                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                                                                className: "text-gray-400 mb-1",
                                                                                                children: abonnement.kommune
                                                                                            }, void 0, false, {
                                                                                                fileName: "[project]/src/components/ProjectPlanner.tsx",
                                                                                                lineNumber: 775,
                                                                                                columnNumber: 35
                                                                                            }, this),
                                                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                                                                                onClick: ()=>removeAbonnementFromCalendar(abonnement.id, day.date.toISOString().split('T')[0]),
                                                                                                className: "text-red-400 hover:text-red-300 text-xs mt-1",
                                                                                                children: "Fjern fra kalender"
                                                                                            }, void 0, false, {
                                                                                                fileName: "[project]/src/components/ProjectPlanner.tsx",
                                                                                                lineNumber: 776,
                                                                                                columnNumber: 35
                                                                                            }, this)
                                                                                        ]
                                                                                    }, void 0, true, {
                                                                                        fileName: "[project]/src/components/ProjectPlanner.tsx",
                                                                                        lineNumber: 772,
                                                                                        columnNumber: 33
                                                                                    }, this)
                                                                                ]
                                                                            }, `abonnement-${abonnement.id}-${day.date.toISOString()}`, true, {
                                                                                fileName: "[project]/src/components/ProjectPlanner.tsx",
                                                                                lineNumber: 763,
                                                                                columnNumber: 29
                                                                            }, this)),
                                                                        day.inspections.map((inspection)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                                className: "text-xs p-1 rounded relative bg-yellow-900/30 text-yellow-300 border border-yellow-800/50 mt-1 flex items-center gap-1",
                                                                                title: inspection.inspection_type,
                                                                                children: [
                                                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                                                        className: "font-bold",
                                                                                        children: "Inspeksjon:"
                                                                                    }, void 0, false, {
                                                                                        fileName: "[project]/src/components/ProjectPlanner.tsx",
                                                                                        lineNumber: 794,
                                                                                        columnNumber: 31
                                                                                    }, this),
                                                                                    " ",
                                                                                    inspection.customer_name,
                                                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                                                        className: "ml-auto px-1 py-0.5 rounded bg-yellow-800/50 text-yellow-200 text-[10px]",
                                                                                        children: inspection.inspection_type
                                                                                    }, void 0, false, {
                                                                                        fileName: "[project]/src/components/ProjectPlanner.tsx",
                                                                                        lineNumber: 795,
                                                                                        columnNumber: 31
                                                                                    }, this)
                                                                                ]
                                                                            }, `inspection-${inspection.id}-${day.date.toISOString()}`, true, {
                                                                                fileName: "[project]/src/components/ProjectPlanner.tsx",
                                                                                lineNumber: 789,
                                                                                columnNumber: 29
                                                                            }, this))
                                                                    ]
                                                                }, void 0, true, {
                                                                    fileName: "[project]/src/components/ProjectPlanner.tsx",
                                                                    lineNumber: 714,
                                                                    columnNumber: 23
                                                                }, this)
                                                            ]
                                                        }, index, true, {
                                                            fileName: "[project]/src/components/ProjectPlanner.tsx",
                                                            lineNumber: 689,
                                                            columnNumber: 23
                                                        }, this))
                                                }, void 0, false, {
                                                    fileName: "[project]/src/components/ProjectPlanner.tsx",
                                                    lineNumber: 687,
                                                    columnNumber: 19
                                                }, this)
                                            ]
                                        }, void 0, true),
                                        view === 'week' && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                            className: "flex flex-col h-full",
                                            children: [
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                    className: "grid grid-cols-7 gap-1 mb-1",
                                                    children: Array.from({
                                                        length: 7
                                                    }).map((_, index)=>{
                                                        const date = new Date(currentDate);
                                                        const dayOfWeek = date.getDay();
                                                        const diff = index - (dayOfWeek === 0 ? 6 : dayOfWeek - 1);
                                                        date.setDate(date.getDate() + diff);
                                                        return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                            className: "text-center py-2",
                                                            children: [
                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                    className: "text-xs font-medium text-gray-400",
                                                                    children: getDayName(index)
                                                                }, void 0, false, {
                                                                    fileName: "[project]/src/components/ProjectPlanner.tsx",
                                                                    lineNumber: 819,
                                                                    columnNumber: 27
                                                                }, this),
                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                    className: `text-sm font-medium ${date.toDateString() === new Date().toDateString() ? 'text-blue-400' : 'text-white'}`,
                                                                    children: date.getDate()
                                                                }, void 0, false, {
                                                                    fileName: "[project]/src/components/ProjectPlanner.tsx",
                                                                    lineNumber: 820,
                                                                    columnNumber: 27
                                                                }, this)
                                                            ]
                                                        }, index, true, {
                                                            fileName: "[project]/src/components/ProjectPlanner.tsx",
                                                            lineNumber: 818,
                                                            columnNumber: 25
                                                        }, this);
                                                    })
                                                }, void 0, false, {
                                                    fileName: "[project]/src/components/ProjectPlanner.tsx",
                                                    lineNumber: 810,
                                                    columnNumber: 19
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                    className: "grid grid-cols-7 gap-1 flex-1",
                                                    children: Array.from({
                                                        length: 7
                                                    }).map((_, index)=>{
                                                        const date = new Date(currentDate);
                                                        const dayOfWeek = date.getDay();
                                                        const diff = index - (dayOfWeek === 0 ? 6 : dayOfWeek - 1);
                                                        date.setDate(date.getDate() + diff);
                                                        const dateString = date.toISOString().split('T')[0];
                                                        const dayProjects = scheduledProjects.filter((p)=>p.scheduledDate === dateString);
                                                        const dayAbonnements = scheduledAbonnements.filter((a)=>a.scheduledDate === dateString);
                                                        return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                            className: `min-h-[400px] rounded-lg border ${date.toDateString() === new Date().toDateString() ? 'bg-blue-900/20 border-blue-800' : 'bg-gray-800 border-gray-700'} p-2 relative`,
                                                            onDragOver: (e)=>handleDragOver(e, date),
                                                            onDragEnter: handleDragEnter,
                                                            onDragLeave: handleDragLeave,
                                                            onDrop: (e)=>handleDrop(e, date),
                                                            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                className: "space-y-2 overflow-y-auto max-h-full",
                                                                children: [
                                                                    dayProjects.map((project)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                            className: `p-2 rounded relative ${project.priority === 'high' ? 'bg-red-900/30 text-red-400 border border-red-800/50' : project.priority === 'medium' ? 'bg-yellow-900/30 text-yellow-400 border border-yellow-800/50' : 'bg-green-900/30 text-green-400 border border-green-800/50'}`,
                                                                            onMouseEnter: ()=>setShowProjectInfo(`${project.id}-${date.toISOString()}`),
                                                                            onMouseLeave: ()=>setShowProjectInfo(null),
                                                                            children: [
                                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                                    className: "font-medium",
                                                                                    children: project.name
                                                                                }, void 0, false, {
                                                                                    fileName: "[project]/src/components/ProjectPlanner.tsx",
                                                                                    lineNumber: 872,
                                                                                    columnNumber: 33
                                                                                }, this),
                                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                                    className: "text-xs mt-1",
                                                                                    children: project.client
                                                                                }, void 0, false, {
                                                                                    fileName: "[project]/src/components/ProjectPlanner.tsx",
                                                                                    lineNumber: 873,
                                                                                    columnNumber: 33
                                                                                }, this),
                                                                                showProjectInfo === `${project.id}-${date.toISOString()}` && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                                    className: "absolute z-10 left-0 top-full mt-1 w-64 bg-gray-900 rounded-lg shadow-lg border border-gray-700 p-3 text-sm",
                                                                                    children: [
                                                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h5", {
                                                                                            className: "font-medium text-white mb-1",
                                                                                            children: project.name
                                                                                        }, void 0, false, {
                                                                                            fileName: "[project]/src/components/ProjectPlanner.tsx",
                                                                                            lineNumber: 877,
                                                                                            columnNumber: 37
                                                                                        }, this),
                                                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                                                            className: "text-gray-400 mb-1",
                                                                                            children: project.client
                                                                                        }, void 0, false, {
                                                                                            fileName: "[project]/src/components/ProjectPlanner.tsx",
                                                                                            lineNumber: 878,
                                                                                            columnNumber: 37
                                                                                        }, this),
                                                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                                                            className: "text-gray-400 mb-2",
                                                                                            children: project.description
                                                                                        }, void 0, false, {
                                                                                            fileName: "[project]/src/components/ProjectPlanner.tsx",
                                                                                            lineNumber: 879,
                                                                                            columnNumber: 37
                                                                                        }, this),
                                                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                                                                            onClick: ()=>removeFromCalendar(project.id, dateString),
                                                                                            className: "text-red-400 hover:text-red-300 text-xs",
                                                                                            children: "Fjern fra kalender"
                                                                                        }, void 0, false, {
                                                                                            fileName: "[project]/src/components/ProjectPlanner.tsx",
                                                                                            lineNumber: 880,
                                                                                            columnNumber: 37
                                                                                        }, this)
                                                                                    ]
                                                                                }, void 0, true, {
                                                                                    fileName: "[project]/src/components/ProjectPlanner.tsx",
                                                                                    lineNumber: 876,
                                                                                    columnNumber: 35
                                                                                }, this)
                                                                            ]
                                                                        }, `project-${project.id}-${date.toISOString()}`, true, {
                                                                            fileName: "[project]/src/components/ProjectPlanner.tsx",
                                                                            lineNumber: 860,
                                                                            columnNumber: 31
                                                                        }, this)),
                                                                    dayAbonnements.map((abonnement)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                            className: "p-2 rounded relative bg-blue-900/30 text-blue-400 border border-blue-800/50",
                                                                            onMouseEnter: ()=>setShowAbonnementInfo(`${abonnement.id}-${date.toISOString()}`),
                                                                            onMouseLeave: ()=>setShowAbonnementInfo(null),
                                                                            children: [
                                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                                    className: "font-medium",
                                                                                    children: abonnement.etternavn
                                                                                }, void 0, false, {
                                                                                    fileName: "[project]/src/components/ProjectPlanner.tsx",
                                                                                    lineNumber: 899,
                                                                                    columnNumber: 33
                                                                                }, this),
                                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                                    className: "text-xs mt-1",
                                                                                    children: abonnement.adresse
                                                                                }, void 0, false, {
                                                                                    fileName: "[project]/src/components/ProjectPlanner.tsx",
                                                                                    lineNumber: 900,
                                                                                    columnNumber: 33
                                                                                }, this),
                                                                                showAbonnementInfo === `${abonnement.id}-${date.toISOString()}` && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                                    className: "absolute z-10 left-0 top-full mt-1 w-64 bg-gray-900 rounded-lg shadow-lg border border-gray-700 p-3 text-sm",
                                                                                    children: [
                                                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h5", {
                                                                                            className: "font-medium text-white mb-1",
                                                                                            children: abonnement.etternavn
                                                                                        }, void 0, false, {
                                                                                            fileName: "[project]/src/components/ProjectPlanner.tsx",
                                                                                            lineNumber: 904,
                                                                                            columnNumber: 37
                                                                                        }, this),
                                                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                                                            className: "text-gray-400 mb-1",
                                                                                            children: abonnement.adresse
                                                                                        }, void 0, false, {
                                                                                            fileName: "[project]/src/components/ProjectPlanner.tsx",
                                                                                            lineNumber: 905,
                                                                                            columnNumber: 37
                                                                                        }, this),
                                                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                                                            className: "text-gray-400 mb-2",
                                                                                            children: abonnement.kommune
                                                                                        }, void 0, false, {
                                                                                            fileName: "[project]/src/components/ProjectPlanner.tsx",
                                                                                            lineNumber: 906,
                                                                                            columnNumber: 37
                                                                                        }, this),
                                                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                                                                            onClick: ()=>removeAbonnementFromCalendar(abonnement.id, dateString),
                                                                                            className: "text-red-400 hover:text-red-300 text-xs",
                                                                                            children: "Fjern fra kalender"
                                                                                        }, void 0, false, {
                                                                                            fileName: "[project]/src/components/ProjectPlanner.tsx",
                                                                                            lineNumber: 907,
                                                                                            columnNumber: 37
                                                                                        }, this)
                                                                                    ]
                                                                                }, void 0, true, {
                                                                                    fileName: "[project]/src/components/ProjectPlanner.tsx",
                                                                                    lineNumber: 903,
                                                                                    columnNumber: 35
                                                                                }, this)
                                                                            ]
                                                                        }, `abonnement-${abonnement.id}-${date.toISOString()}`, true, {
                                                                            fileName: "[project]/src/components/ProjectPlanner.tsx",
                                                                            lineNumber: 893,
                                                                            columnNumber: 31
                                                                        }, this))
                                                                ]
                                                            }, void 0, true, {
                                                                fileName: "[project]/src/components/ProjectPlanner.tsx",
                                                                lineNumber: 857,
                                                                columnNumber: 27
                                                            }, this)
                                                        }, index, false, {
                                                            fileName: "[project]/src/components/ProjectPlanner.tsx",
                                                            lineNumber: 845,
                                                            columnNumber: 25
                                                        }, this);
                                                    })
                                                }, void 0, false, {
                                                    fileName: "[project]/src/components/ProjectPlanner.tsx",
                                                    lineNumber: 833,
                                                    columnNumber: 19
                                                }, this)
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/src/components/ProjectPlanner.tsx",
                                            lineNumber: 808,
                                            columnNumber: 17
                                        }, this),
                                        view === 'day' && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                            className: "flex flex-col h-full",
                                            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                className: "flex-1 p-4 bg-gray-800 rounded-lg border border-gray-700 mt-2 overflow-y-auto",
                                                onDragOver: (e)=>handleDragOver(e, currentDate),
                                                onDragEnter: handleDragEnter,
                                                onDragLeave: handleDragLeave,
                                                onDrop: (e)=>handleDrop(e, currentDate),
                                                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                    className: "space-y-3",
                                                    children: [
                                                        scheduledProjects.filter((p)=>p.scheduledDate === currentDate.toISOString().split('T')[0]).map((project)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                className: `p-4 rounded-lg relative ${project.priority === 'high' ? 'bg-red-900/30 text-red-400 border border-red-800/50' : project.priority === 'medium' ? 'bg-yellow-900/30 text-yellow-400 border border-yellow-800/50' : 'bg-green-900/30 text-green-400 border border-green-800/50'}`,
                                                                children: [
                                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                        className: "flex justify-between items-start",
                                                                        children: [
                                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h4", {
                                                                                className: "font-medium text-white",
                                                                                children: project.name
                                                                            }, void 0, false, {
                                                                                fileName: "[project]/src/components/ProjectPlanner.tsx",
                                                                                lineNumber: 951,
                                                                                columnNumber: 31
                                                                            }, this),
                                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                                                className: `px-2 py-1 rounded-full text-xs font-medium ${project.status === 'active' ? 'bg-blue-900/50 text-blue-400' : project.status === 'completed' ? 'bg-green-900/50 text-green-400' : 'bg-gray-900/50 text-gray-400'}`,
                                                                                children: project.status
                                                                            }, void 0, false, {
                                                                                fileName: "[project]/src/components/ProjectPlanner.tsx",
                                                                                lineNumber: 952,
                                                                                columnNumber: 31
                                                                            }, this)
                                                                        ]
                                                                    }, void 0, true, {
                                                                        fileName: "[project]/src/components/ProjectPlanner.tsx",
                                                                        lineNumber: 950,
                                                                        columnNumber: 29
                                                                    }, this),
                                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                                        className: "text-sm text-gray-400 mt-2",
                                                                        children: project.description
                                                                    }, void 0, false, {
                                                                        fileName: "[project]/src/components/ProjectPlanner.tsx",
                                                                        lineNumber: 962,
                                                                        columnNumber: 29
                                                                    }, this),
                                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                        className: "mt-3 flex justify-between items-center",
                                                                        children: [
                                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                                className: "text-sm text-gray-400",
                                                                                children: [
                                                                                    "Klient: ",
                                                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                                                        className: "text-white",
                                                                                        children: project.client
                                                                                    }, void 0, false, {
                                                                                        fileName: "[project]/src/components/ProjectPlanner.tsx",
                                                                                        lineNumber: 964,
                                                                                        columnNumber: 78
                                                                                    }, this)
                                                                                ]
                                                                            }, void 0, true, {
                                                                                fileName: "[project]/src/components/ProjectPlanner.tsx",
                                                                                lineNumber: 964,
                                                                                columnNumber: 31
                                                                            }, this),
                                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                                                                onClick: ()=>removeFromCalendar(project.id, currentDate.toISOString().split('T')[0]),
                                                                                className: "text-red-400 hover:text-red-300 text-xs",
                                                                                children: "Fjern fra kalender"
                                                                            }, void 0, false, {
                                                                                fileName: "[project]/src/components/ProjectPlanner.tsx",
                                                                                lineNumber: 965,
                                                                                columnNumber: 31
                                                                            }, this)
                                                                        ]
                                                                    }, void 0, true, {
                                                                        fileName: "[project]/src/components/ProjectPlanner.tsx",
                                                                        lineNumber: 963,
                                                                        columnNumber: 29
                                                                    }, this)
                                                                ]
                                                            }, `project-${project.id}`, true, {
                                                                fileName: "[project]/src/components/ProjectPlanner.tsx",
                                                                lineNumber: 940,
                                                                columnNumber: 27
                                                            }, this)),
                                                        scheduledAbonnements.filter((a)=>a.scheduledDate === currentDate.toISOString().split('T')[0]).map((abonnement)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                className: "p-4 rounded-lg relative bg-blue-900/30 text-blue-400 border border-blue-800/50",
                                                                children: [
                                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                        className: "flex justify-between items-start",
                                                                        children: [
                                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h4", {
                                                                                className: "font-medium text-white",
                                                                                children: abonnement.etternavn
                                                                            }, void 0, false, {
                                                                                fileName: "[project]/src/components/ProjectPlanner.tsx",
                                                                                lineNumber: 983,
                                                                                columnNumber: 31
                                                                            }, this),
                                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                                                className: "px-2 py-1 rounded-full text-xs font-medium bg-blue-900/50 text-blue-400",
                                                                                children: "Vedlikehold"
                                                                            }, void 0, false, {
                                                                                fileName: "[project]/src/components/ProjectPlanner.tsx",
                                                                                lineNumber: 984,
                                                                                columnNumber: 31
                                                                            }, this)
                                                                        ]
                                                                    }, void 0, true, {
                                                                        fileName: "[project]/src/components/ProjectPlanner.tsx",
                                                                        lineNumber: 982,
                                                                        columnNumber: 29
                                                                    }, this),
                                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                                        className: "text-sm text-gray-400 mt-2",
                                                                        children: abonnement.adresse
                                                                    }, void 0, false, {
                                                                        fileName: "[project]/src/components/ProjectPlanner.tsx",
                                                                        lineNumber: 988,
                                                                        columnNumber: 29
                                                                    }, this),
                                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                                        className: "text-sm text-gray-400",
                                                                        children: abonnement.kommune
                                                                    }, void 0, false, {
                                                                        fileName: "[project]/src/components/ProjectPlanner.tsx",
                                                                        lineNumber: 989,
                                                                        columnNumber: 29
                                                                    }, this),
                                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                        className: "mt-3 flex justify-between items-center",
                                                                        children: [
                                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                                className: "text-sm text-gray-400",
                                                                                children: [
                                                                                    "Fornyelse: ",
                                                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                                                        className: "text-white",
                                                                                        children: abonnement.fornyelsesdato
                                                                                    }, void 0, false, {
                                                                                        fileName: "[project]/src/components/ProjectPlanner.tsx",
                                                                                        lineNumber: 991,
                                                                                        columnNumber: 81
                                                                                    }, this)
                                                                                ]
                                                                            }, void 0, true, {
                                                                                fileName: "[project]/src/components/ProjectPlanner.tsx",
                                                                                lineNumber: 991,
                                                                                columnNumber: 31
                                                                            }, this),
                                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                                                                onClick: ()=>removeAbonnementFromCalendar(abonnement.id, currentDate.toISOString().split('T')[0]),
                                                                                className: "text-red-400 hover:text-red-300 text-xs",
                                                                                children: "Fjern fra kalender"
                                                                            }, void 0, false, {
                                                                                fileName: "[project]/src/components/ProjectPlanner.tsx",
                                                                                lineNumber: 992,
                                                                                columnNumber: 31
                                                                            }, this)
                                                                        ]
                                                                    }, void 0, true, {
                                                                        fileName: "[project]/src/components/ProjectPlanner.tsx",
                                                                        lineNumber: 990,
                                                                        columnNumber: 29
                                                                    }, this)
                                                                ]
                                                            }, `abonnement-${abonnement.id}`, true, {
                                                                fileName: "[project]/src/components/ProjectPlanner.tsx",
                                                                lineNumber: 978,
                                                                columnNumber: 27
                                                            }, this)),
                                                        inspections.filter((i)=>i.inspection_date === currentDate.toISOString().split('T')[0]).map((inspection)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                className: "p-4 rounded-lg relative bg-yellow-900/30 text-yellow-300 border border-yellow-800/50",
                                                                children: [
                                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                        className: "flex justify-between items-start",
                                                                        children: [
                                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h4", {
                                                                                className: "font-medium text-white",
                                                                                children: [
                                                                                    "Inspeksjon: ",
                                                                                    inspection.customer_name
                                                                                ]
                                                                            }, void 0, true, {
                                                                                fileName: "[project]/src/components/ProjectPlanner.tsx",
                                                                                lineNumber: 1010,
                                                                                columnNumber: 31
                                                                            }, this),
                                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                                                className: "px-2 py-1 rounded-full text-xs font-medium bg-yellow-800/50 text-yellow-200",
                                                                                children: inspection.inspection_type
                                                                            }, void 0, false, {
                                                                                fileName: "[project]/src/components/ProjectPlanner.tsx",
                                                                                lineNumber: 1011,
                                                                                columnNumber: 31
                                                                            }, this)
                                                                        ]
                                                                    }, void 0, true, {
                                                                        fileName: "[project]/src/components/ProjectPlanner.tsx",
                                                                        lineNumber: 1009,
                                                                        columnNumber: 29
                                                                    }, this),
                                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                                        className: "text-sm text-gray-400 mt-2",
                                                                        children: [
                                                                            "Adresse: ",
                                                                            inspection.customer_address
                                                                        ]
                                                                    }, void 0, true, {
                                                                        fileName: "[project]/src/components/ProjectPlanner.tsx",
                                                                        lineNumber: 1015,
                                                                        columnNumber: 29
                                                                    }, this),
                                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                                        className: "text-sm text-gray-400",
                                                                        children: [
                                                                            "Inspektør: ",
                                                                            inspection.inspector || '-'
                                                                        ]
                                                                    }, void 0, true, {
                                                                        fileName: "[project]/src/components/ProjectPlanner.tsx",
                                                                        lineNumber: 1016,
                                                                        columnNumber: 29
                                                                    }, this),
                                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                        className: "mt-3 flex justify-between items-center",
                                                                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                            className: "text-sm text-gray-400",
                                                                            children: [
                                                                                "Status: ",
                                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                                                    className: "text-white",
                                                                                    children: inspection.status
                                                                                }, void 0, false, {
                                                                                    fileName: "[project]/src/components/ProjectPlanner.tsx",
                                                                                    lineNumber: 1018,
                                                                                    columnNumber: 78
                                                                                }, this)
                                                                            ]
                                                                        }, void 0, true, {
                                                                            fileName: "[project]/src/components/ProjectPlanner.tsx",
                                                                            lineNumber: 1018,
                                                                            columnNumber: 31
                                                                        }, this)
                                                                    }, void 0, false, {
                                                                        fileName: "[project]/src/components/ProjectPlanner.tsx",
                                                                        lineNumber: 1017,
                                                                        columnNumber: 29
                                                                    }, this)
                                                                ]
                                                            }, `inspection-${inspection.id}`, true, {
                                                                fileName: "[project]/src/components/ProjectPlanner.tsx",
                                                                lineNumber: 1005,
                                                                columnNumber: 27
                                                            }, this)),
                                                        scheduledProjects.filter((p)=>p.scheduledDate === currentDate.toISOString().split('T')[0]).length === 0 && scheduledAbonnements.filter((a)=>a.scheduledDate === currentDate.toISOString().split('T')[0]).length === 0 && inspections.filter((i)=>i.inspection_date === currentDate.toISOString().split('T')[0]).length === 0 && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                            className: "text-center py-8 text-gray-500",
                                                            children: [
                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                                    children: "Ingen aktiviteter planlagt for denne dagen"
                                                                }, void 0, false, {
                                                                    fileName: "[project]/src/components/ProjectPlanner.tsx",
                                                                    lineNumber: 1027,
                                                                    columnNumber: 27
                                                                }, this),
                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                                    className: "text-sm mt-2",
                                                                    children: "Dra et prosjekt eller en vedlikeholdsavtale hit for å planlegge det"
                                                                }, void 0, false, {
                                                                    fileName: "[project]/src/components/ProjectPlanner.tsx",
                                                                    lineNumber: 1028,
                                                                    columnNumber: 27
                                                                }, this)
                                                            ]
                                                        }, void 0, true, {
                                                            fileName: "[project]/src/components/ProjectPlanner.tsx",
                                                            lineNumber: 1026,
                                                            columnNumber: 25
                                                        }, this)
                                                    ]
                                                }, void 0, true, {
                                                    fileName: "[project]/src/components/ProjectPlanner.tsx",
                                                    lineNumber: 935,
                                                    columnNumber: 21
                                                }, this)
                                            }, void 0, false, {
                                                fileName: "[project]/src/components/ProjectPlanner.tsx",
                                                lineNumber: 928,
                                                columnNumber: 19
                                            }, this)
                                        }, void 0, false, {
                                            fileName: "[project]/src/components/ProjectPlanner.tsx",
                                            lineNumber: 926,
                                            columnNumber: 17
                                        }, this)
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/src/components/ProjectPlanner.tsx",
                                    lineNumber: 674,
                                    columnNumber: 13
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/src/components/ProjectPlanner.tsx",
                            lineNumber: 645,
                            columnNumber: 11
                        }, this)
                    ]
                }, void 0, true, {
                    fileName: "[project]/src/components/ProjectPlanner.tsx",
                    lineNumber: 498,
                    columnNumber: 9
                }, this)
            ]
        }, void 0, true, {
            fileName: "[project]/src/components/ProjectPlanner.tsx",
            lineNumber: 460,
            columnNumber: 7
        }, this)
    }, void 0, false, {
        fileName: "[project]/src/components/ProjectPlanner.tsx",
        lineNumber: 459,
        columnNumber: 5
    }, this);
}
_s(ProjectPlanner, "7X1TVQqWntuzHFPwWLmMfUlsnZ8=");
_c = ProjectPlanner;
var _c;
__turbopack_context__.k.register(_c, "ProjectPlanner");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(module, globalThis.$RefreshHelpers$);
}
}}),
"[project]/src/services/inspectionService.ts [app-client] (ecmascript)": ((__turbopack_context__) => {
"use strict";

var { g: global, __dirname, k: __turbopack_refresh__, m: module } = __turbopack_context__;
{
__turbopack_context__.s({
    "getPlannedInspections": (()=>getPlannedInspections)
});
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$supabase$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/lib/supabase.ts [app-client] (ecmascript)");
;
async function getPlannedInspections() {
    const { data, error } = await __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$supabase$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["supabase"].from('inspections').select('*').eq('status', 'planlagt').order('inspection_date', {
        ascending: true
    });
    if (error) {
        console.error('Error fetching planned inspections:', error);
        throw error;
    }
    return data || [];
}
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(module, globalThis.$RefreshHelpers$);
}
}}),
"[project]/src/app/planlegging/page.tsx [app-client] (ecmascript)": ((__turbopack_context__) => {
"use strict";

var { g: global, __dirname, k: __turbopack_refresh__, m: module } = __turbopack_context__;
{
__turbopack_context__.s({
    "default": (()=>PlanleggingPage)
});
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$ProjectPlanner$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/components/ProjectPlanner.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$services$2f$projectService$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/services/projectService.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$services$2f$abonnementService$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/services/abonnementService.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$services$2f$inspectionService$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/services/inspectionService.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2d$hot$2d$toast$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/react-hot-toast/dist/index.mjs [app-client] (ecmascript)");
;
var _s = __turbopack_context__.k.signature();
'use client';
;
;
;
;
;
;
// Convert Supabase project format to our internal format
const fromSupabaseProject = (project)=>({
        id: project.id,
        name: project.name,
        description: project.description,
        client: project.client,
        status: project.status,
        startDate: project.start_date,
        endDate: project.end_date,
        budget: project.budget ? Number(project.budget) : undefined,
        priority: project.priority
    });
function PlanleggingPage() {
    _s();
    const [projects, setProjects] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])([]);
    const [abonnements, setAbonnements] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])([]);
    const [inspections, setInspections] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])([]);
    const [isLoading, setIsLoading] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(true);
    // Load projects, abonnements, and inspections from Supabase
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "PlanleggingPage.useEffect": ()=>{
            const fetchData = {
                "PlanleggingPage.useEffect.fetchData": async ()=>{
                    try {
                        setIsLoading(true);
                        // Fetch projects
                        const projectsData = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$services$2f$projectService$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["getProjects"])();
                        setProjects(projectsData.map(fromSupabaseProject));
                        // Fetch abonnements
                        const abonnementsData = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$services$2f$abonnementService$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["getAbonnements"])();
                        setAbonnements(abonnementsData);
                        // Fetch planned inspections
                        const inspectionsData = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$services$2f$inspectionService$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["getPlannedInspections"])();
                        setInspections(inspectionsData);
                    } catch (error) {
                        console.error('Error fetching data:', error);
                        __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2d$hot$2d$toast$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["toast"].error('Kunne ikke hente data');
                    } finally{
                        setIsLoading(false);
                    }
                }
            }["PlanleggingPage.useEffect.fetchData"];
            fetchData();
        }
    }["PlanleggingPage.useEffect"], []);
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        className: "min-h-screen bg-gray-900 p-8",
        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
            className: "max-w-7xl mx-auto",
            children: [
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: "flex justify-between items-center mb-6",
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h1", {
                                    className: "text-4xl font-bold text-white",
                                    children: "Planlegging"
                                }, void 0, false, {
                                    fileName: "[project]/src/app/planlegging/page.tsx",
                                    lineNumber: 83,
                                    columnNumber: 13
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                    className: "text-gray-400 mt-2",
                                    children: "Planlegg og organiser prosjekter og vedlikeholdsavtaler i kalenderen"
                                }, void 0, false, {
                                    fileName: "[project]/src/app/planlegging/page.tsx",
                                    lineNumber: 84,
                                    columnNumber: 13
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/src/app/planlegging/page.tsx",
                            lineNumber: 82,
                            columnNumber: 11
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                            className: "bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-full flex items-center gap-2 shadow-sm transition-all duration-200",
                            onClick: ()=>window.location.href = '/inspeksjoner/ny',
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("svg", {
                                    className: "w-5 h-5",
                                    fill: "none",
                                    stroke: "currentColor",
                                    viewBox: "0 0 24 24",
                                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("path", {
                                        strokeLinecap: "round",
                                        strokeLinejoin: "round",
                                        strokeWidth: 2,
                                        d: "M12 4v16m8-8H4"
                                    }, void 0, false, {
                                        fileName: "[project]/src/app/planlegging/page.tsx",
                                        lineNumber: 91,
                                        columnNumber: 15
                                    }, this)
                                }, void 0, false, {
                                    fileName: "[project]/src/app/planlegging/page.tsx",
                                    lineNumber: 90,
                                    columnNumber: 13
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                    children: "Planlegg ny inspeksjon"
                                }, void 0, false, {
                                    fileName: "[project]/src/app/planlegging/page.tsx",
                                    lineNumber: 93,
                                    columnNumber: 13
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/src/app/planlegging/page.tsx",
                            lineNumber: 86,
                            columnNumber: 11
                        }, this)
                    ]
                }, void 0, true, {
                    fileName: "[project]/src/app/planlegging/page.tsx",
                    lineNumber: 81,
                    columnNumber: 9
                }, this),
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2d$hot$2d$toast$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Toaster"], {
                    position: "top-right",
                    toastOptions: {
                        duration: 3000,
                        style: {
                            background: '#333',
                            color: '#fff'
                        }
                    }
                }, void 0, false, {
                    fileName: "[project]/src/app/planlegging/page.tsx",
                    lineNumber: 97,
                    columnNumber: 9
                }, this),
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: "h-[calc(100vh-200px)]",
                    children: isLoading ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "flex items-center justify-center h-full",
                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"
                        }, void 0, false, {
                            fileName: "[project]/src/app/planlegging/page.tsx",
                            lineNumber: 111,
                            columnNumber: 15
                        }, this)
                    }, void 0, false, {
                        fileName: "[project]/src/app/planlegging/page.tsx",
                        lineNumber: 110,
                        columnNumber: 13
                    }, this) : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$ProjectPlanner$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {
                        projects: projects,
                        abonnements: abonnements,
                        inspections: inspections
                    }, void 0, false, {
                        fileName: "[project]/src/app/planlegging/page.tsx",
                        lineNumber: 114,
                        columnNumber: 13
                    }, this)
                }, void 0, false, {
                    fileName: "[project]/src/app/planlegging/page.tsx",
                    lineNumber: 108,
                    columnNumber: 9
                }, this)
            ]
        }, void 0, true, {
            fileName: "[project]/src/app/planlegging/page.tsx",
            lineNumber: 80,
            columnNumber: 7
        }, this)
    }, void 0, false, {
        fileName: "[project]/src/app/planlegging/page.tsx",
        lineNumber: 79,
        columnNumber: 5
    }, this);
}
_s(PlanleggingPage, "DSbOYeDLuRqTk0VU5kC9BDQWKmw=");
_c = PlanleggingPage;
var _c;
__turbopack_context__.k.register(_c, "PlanleggingPage");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(module, globalThis.$RefreshHelpers$);
}
}}),
}]);

//# sourceMappingURL=src_feb92c0b._.js.map