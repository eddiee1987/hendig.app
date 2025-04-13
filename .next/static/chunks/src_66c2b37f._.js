(globalThis.TURBOPACK = globalThis.TURBOPACK || []).push(["static/chunks/src_66c2b37f._.js", {

"[project]/src/lib/supabase.ts [app-client] (ecmascript)": ((__turbopack_context__) => {
"use strict";

var { g: global, __dirname, k: __turbopack_refresh__, m: module } = __turbopack_context__;
{
__turbopack_context__.s({
    "supabase": (()=>supabase)
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
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2d$hot$2d$toast$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/react-hot-toast/dist/index.mjs [app-client] (ecmascript)");
;
var _s = __turbopack_context__.k.signature();
'use client';
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
function ProjectPlanner({ projects }) {
    _s();
    const [view, setView] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])('month');
    const [currentDate, setCurrentDate] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(new Date());
    const [calendarDays, setCalendarDays] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])([]);
    const [scheduledProjects, setScheduledProjects] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])([]);
    const [filter, setFilter] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])('all');
    const [showFilterMenu, setShowFilterMenu] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(false);
    const [draggedProject, setDraggedProject] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(null);
    const [showProjectInfo, setShowProjectInfo] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(null);
    const [isLoading, setIsLoading] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(true);
    const dragCounter = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRef"])(0);
    const filterMenuRef = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRef"])(null);
    // Load scheduled projects from Supabase
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "ProjectPlanner.useEffect": ()=>{
            const fetchScheduledProjects = {
                "ProjectPlanner.useEffect.fetchScheduledProjects": async ()=>{
                    try {
                        setIsLoading(true);
                        const data = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$services$2f$projectService$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["getScheduledProjects"])();
                        const formattedData = data.map({
                            "ProjectPlanner.useEffect.fetchScheduledProjects.formattedData": (item)=>({
                                    ...convertProject(item.projects),
                                    scheduledDate: item.scheduled_date,
                                    scheduledId: item.id
                                })
                        }["ProjectPlanner.useEffect.fetchScheduledProjects.formattedData"]);
                        setScheduledProjects(formattedData);
                    } catch (error) {
                        console.error('Error fetching scheduled projects:', error);
                        __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2d$hot$2d$toast$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["toast"].error('Kunne ikke hente planlagte prosjekter');
                    } finally{
                        setIsLoading(false);
                    }
                }
            }["ProjectPlanner.useEffect.fetchScheduledProjects"];
            fetchScheduledProjects();
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
            // Get day of week of first day (0 = Sunday, 1 = Monday, etc.)
            let firstDayOfWeek = firstDayOfMonth.getDay();
            // Adjust for Monday as first day of week
            firstDayOfWeek = firstDayOfWeek === 0 ? 6 : firstDayOfWeek - 1;
            // Add days from previous month
            const daysFromPrevMonth = firstDayOfWeek;
            const prevMonth = new Date(currentDate.getFullYear(), currentDate.getMonth(), 0);
            for(let i = daysFromPrevMonth - 1; i >= 0; i--){
                const date = new Date(prevMonth.getFullYear(), prevMonth.getMonth(), prevMonth.getDate() - i);
                days.push({
                    date,
                    dayOfMonth: date.getDate(),
                    isCurrentMonth: false,
                    isToday: date.toDateString() === today.toDateString(),
                    projects: getProjectsForDate(date)
                });
            }
            // Add days from current month
            for(let i = 1; i <= lastDayOfMonth.getDate(); i++){
                const date = new Date(currentDate.getFullYear(), currentDate.getMonth(), i);
                days.push({
                    date,
                    dayOfMonth: i,
                    isCurrentMonth: true,
                    isToday: date.toDateString() === today.toDateString(),
                    projects: getProjectsForDate(date)
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
                    projects: getProjectsForDate(date)
                });
            }
            setCalendarDays(days);
        }
    }["ProjectPlanner.useEffect"], [
        currentDate,
        scheduledProjects
    ]);
    // Get projects scheduled for a specific date
    function getProjectsForDate(date) {
        const dateString = date.toISOString().split('T')[0];
        return scheduledProjects.filter((project)=>project.scheduledDate === dateString);
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
        if (!draggedProject) return;
        const dateString = date.toISOString().split('T')[0];
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
                                    lineNumber: 324,
                                    columnNumber: 13
                                }, this),
                                "Måned"
                            ]
                        }, void 0, true, {
                            fileName: "[project]/src/components/ProjectPlanner.tsx",
                            lineNumber: 316,
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
                                    lineNumber: 335,
                                    columnNumber: 13
                                }, this),
                                "Uke"
                            ]
                        }, void 0, true, {
                            fileName: "[project]/src/components/ProjectPlanner.tsx",
                            lineNumber: 327,
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
                                    lineNumber: 346,
                                    columnNumber: 13
                                }, this),
                                "Dag"
                            ]
                        }, void 0, true, {
                            fileName: "[project]/src/components/ProjectPlanner.tsx",
                            lineNumber: 338,
                            columnNumber: 11
                        }, this)
                    ]
                }, void 0, true, {
                    fileName: "[project]/src/components/ProjectPlanner.tsx",
                    lineNumber: 315,
                    columnNumber: 9
                }, this),
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: "flex flex-1",
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "w-1/4 border-r border-gray-800 p-4",
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    className: "flex justify-between items-center mb-4",
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h3", {
                                            className: "text-lg font-medium text-white",
                                            children: "Prosjekter"
                                        }, void 0, false, {
                                            fileName: "[project]/src/components/ProjectPlanner.tsx",
                                            lineNumber: 355,
                                            columnNumber: 15
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
                                                            lineNumber: 361,
                                                            columnNumber: 19
                                                        }, this),
                                                        "Filter: ",
                                                        filter === 'all' ? 'Alle' : filter === 'active' ? 'Aktive' : filter === 'completed' ? 'Fullførte' : 'Arkiverte'
                                                    ]
                                                }, void 0, true, {
                                                    fileName: "[project]/src/components/ProjectPlanner.tsx",
                                                    lineNumber: 357,
                                                    columnNumber: 17
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
                                                                lineNumber: 371,
                                                                columnNumber: 21
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
                                                                lineNumber: 380,
                                                                columnNumber: 21
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
                                                                lineNumber: 389,
                                                                columnNumber: 21
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
                                                                lineNumber: 398,
                                                                columnNumber: 21
                                                            }, this)
                                                        ]
                                                    }, void 0, true, {
                                                        fileName: "[project]/src/components/ProjectPlanner.tsx",
                                                        lineNumber: 370,
                                                        columnNumber: 19
                                                    }, this)
                                                }, void 0, false, {
                                                    fileName: "[project]/src/components/ProjectPlanner.tsx",
                                                    lineNumber: 366,
                                                    columnNumber: 17
                                                }, this)
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/src/components/ProjectPlanner.tsx",
                                            lineNumber: 356,
                                            columnNumber: 15
                                        }, this)
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/src/components/ProjectPlanner.tsx",
                                    lineNumber: 354,
                                    columnNumber: 13
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    className: "space-y-2 overflow-y-auto max-h-[calc(100vh-250px)]",
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
                                                            lineNumber: 420,
                                                            columnNumber: 21
                                                        }, this),
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                            className: `px-1.5 py-0.5 rounded-full text-xs font-medium ${project.priority === 'high' ? 'bg-red-900/50 text-red-400' : project.priority === 'medium' ? 'bg-yellow-900/50 text-yellow-400' : 'bg-green-900/50 text-green-400'}`,
                                                            children: project.priority
                                                        }, void 0, false, {
                                                            fileName: "[project]/src/components/ProjectPlanner.tsx",
                                                            lineNumber: 421,
                                                            columnNumber: 21
                                                        }, this)
                                                    ]
                                                }, void 0, true, {
                                                    fileName: "[project]/src/components/ProjectPlanner.tsx",
                                                    lineNumber: 419,
                                                    columnNumber: 19
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                    className: "text-xs text-gray-400 mt-1 truncate",
                                                    children: project.client
                                                }, void 0, false, {
                                                    fileName: "[project]/src/components/ProjectPlanner.tsx",
                                                    lineNumber: 431,
                                                    columnNumber: 19
                                                }, this)
                                            ]
                                        }, project.id, true, {
                                            fileName: "[project]/src/components/ProjectPlanner.tsx",
                                            lineNumber: 413,
                                            columnNumber: 17
                                        }, this))
                                }, void 0, false, {
                                    fileName: "[project]/src/components/ProjectPlanner.tsx",
                                    lineNumber: 411,
                                    columnNumber: 13
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/src/components/ProjectPlanner.tsx",
                            lineNumber: 353,
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
                                            lineNumber: 441,
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
                                                        lineNumber: 449,
                                                        columnNumber: 19
                                                    }, this)
                                                }, void 0, false, {
                                                    fileName: "[project]/src/components/ProjectPlanner.tsx",
                                                    lineNumber: 445,
                                                    columnNumber: 17
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                                    onClick: goToToday,
                                                    className: "px-3 py-1.5 text-sm text-gray-400 hover:text-white",
                                                    children: "I dag"
                                                }, void 0, false, {
                                                    fileName: "[project]/src/components/ProjectPlanner.tsx",
                                                    lineNumber: 451,
                                                    columnNumber: 17
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                                    onClick: goToNext,
                                                    className: "p-1.5 rounded-full text-gray-400 hover:text-white hover:bg-gray-800",
                                                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$heroicons$2f$react$2f$24$2f$outline$2f$esm$2f$ChevronRightIcon$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__ChevronRightIcon$3e$__["ChevronRightIcon"], {
                                                        className: "w-5 h-5"
                                                    }, void 0, false, {
                                                        fileName: "[project]/src/components/ProjectPlanner.tsx",
                                                        lineNumber: 461,
                                                        columnNumber: 19
                                                    }, this)
                                                }, void 0, false, {
                                                    fileName: "[project]/src/components/ProjectPlanner.tsx",
                                                    lineNumber: 457,
                                                    columnNumber: 17
                                                }, this)
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/src/components/ProjectPlanner.tsx",
                                            lineNumber: 444,
                                            columnNumber: 15
                                        }, this)
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/src/components/ProjectPlanner.tsx",
                                    lineNumber: 440,
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
                                                            lineNumber: 473,
                                                            columnNumber: 23
                                                        }, this))
                                                }, void 0, false, {
                                                    fileName: "[project]/src/components/ProjectPlanner.tsx",
                                                    lineNumber: 471,
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
                                                                        lineNumber: 497,
                                                                        columnNumber: 27
                                                                    }, this)
                                                                }, void 0, false, {
                                                                    fileName: "[project]/src/components/ProjectPlanner.tsx",
                                                                    lineNumber: 496,
                                                                    columnNumber: 25
                                                                }, this),
                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                    className: "space-y-1 overflow-y-auto max-h-[80px]",
                                                                    children: day.projects.map((project)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                            className: `text-xs p-1 rounded relative ${project.priority === 'high' ? 'bg-red-900/30 text-red-400 border border-red-800/50' : project.priority === 'medium' ? 'bg-yellow-900/30 text-yellow-400 border border-yellow-800/50' : 'bg-green-900/30 text-green-400 border border-green-800/50'}`,
                                                                            onMouseEnter: ()=>setShowProjectInfo(`${project.id}-${day.date.toISOString()}`),
                                                                            onMouseLeave: ()=>setShowProjectInfo(null),
                                                                            children: [
                                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                                    className: "truncate",
                                                                                    children: project.name
                                                                                }, void 0, false, {
                                                                                    fileName: "[project]/src/components/ProjectPlanner.tsx",
                                                                                    lineNumber: 521,
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
                                                                                            lineNumber: 525,
                                                                                            columnNumber: 35
                                                                                        }, this),
                                                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                                                            className: "text-gray-400 mb-1",
                                                                                            children: project.client
                                                                                        }, void 0, false, {
                                                                                            fileName: "[project]/src/components/ProjectPlanner.tsx",
                                                                                            lineNumber: 526,
                                                                                            columnNumber: 35
                                                                                        }, this),
                                                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                                                            className: "text-gray-400 mb-1 line-clamp-2",
                                                                                            children: project.description
                                                                                        }, void 0, false, {
                                                                                            fileName: "[project]/src/components/ProjectPlanner.tsx",
                                                                                            lineNumber: 527,
                                                                                            columnNumber: 35
                                                                                        }, this),
                                                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                                                                            onClick: ()=>removeFromCalendar(project.id, day.date.toISOString().split('T')[0]),
                                                                                            className: "text-red-400 hover:text-red-300 text-xs mt-1",
                                                                                            children: "Fjern fra kalender"
                                                                                        }, void 0, false, {
                                                                                            fileName: "[project]/src/components/ProjectPlanner.tsx",
                                                                                            lineNumber: 528,
                                                                                            columnNumber: 35
                                                                                        }, this)
                                                                                    ]
                                                                                }, void 0, true, {
                                                                                    fileName: "[project]/src/components/ProjectPlanner.tsx",
                                                                                    lineNumber: 524,
                                                                                    columnNumber: 33
                                                                                }, this)
                                                                            ]
                                                                        }, `${project.id}-${day.date.toISOString()}`, true, {
                                                                            fileName: "[project]/src/components/ProjectPlanner.tsx",
                                                                            lineNumber: 509,
                                                                            columnNumber: 29
                                                                        }, this))
                                                                }, void 0, false, {
                                                                    fileName: "[project]/src/components/ProjectPlanner.tsx",
                                                                    lineNumber: 507,
                                                                    columnNumber: 25
                                                                }, this)
                                                            ]
                                                        }, index, true, {
                                                            fileName: "[project]/src/components/ProjectPlanner.tsx",
                                                            lineNumber: 482,
                                                            columnNumber: 23
                                                        }, this))
                                                }, void 0, false, {
                                                    fileName: "[project]/src/components/ProjectPlanner.tsx",
                                                    lineNumber: 480,
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
                                                                    lineNumber: 557,
                                                                    columnNumber: 27
                                                                }, this),
                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                    className: `text-sm font-medium ${date.toDateString() === new Date().toDateString() ? 'text-blue-400' : 'text-white'}`,
                                                                    children: date.getDate()
                                                                }, void 0, false, {
                                                                    fileName: "[project]/src/components/ProjectPlanner.tsx",
                                                                    lineNumber: 558,
                                                                    columnNumber: 27
                                                                }, this)
                                                            ]
                                                        }, index, true, {
                                                            fileName: "[project]/src/components/ProjectPlanner.tsx",
                                                            lineNumber: 556,
                                                            columnNumber: 25
                                                        }, this);
                                                    })
                                                }, void 0, false, {
                                                    fileName: "[project]/src/components/ProjectPlanner.tsx",
                                                    lineNumber: 548,
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
                                                        return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                            className: `min-h-[400px] rounded-lg border ${date.toDateString() === new Date().toDateString() ? 'bg-blue-900/20 border-blue-800' : 'bg-gray-800 border-gray-700'} p-2 relative`,
                                                            onDragOver: (e)=>handleDragOver(e, date),
                                                            onDragEnter: handleDragEnter,
                                                            onDragLeave: handleDragLeave,
                                                            onDrop: (e)=>handleDrop(e, date),
                                                            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                className: "space-y-2 overflow-y-auto max-h-full",
                                                                children: dayProjects.map((project)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                        className: `p-2 rounded relative ${project.priority === 'high' ? 'bg-red-900/30 text-red-400 border border-red-800/50' : project.priority === 'medium' ? 'bg-yellow-900/30 text-yellow-400 border border-yellow-800/50' : 'bg-green-900/30 text-green-400 border border-green-800/50'}`,
                                                                        onMouseEnter: ()=>setShowProjectInfo(`${project.id}-${date.toISOString()}`),
                                                                        onMouseLeave: ()=>setShowProjectInfo(null),
                                                                        children: [
                                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                                className: "font-medium",
                                                                                children: project.name
                                                                            }, void 0, false, {
                                                                                fileName: "[project]/src/components/ProjectPlanner.tsx",
                                                                                lineNumber: 608,
                                                                                columnNumber: 33
                                                                            }, this),
                                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                                className: "text-xs mt-1",
                                                                                children: project.client
                                                                            }, void 0, false, {
                                                                                fileName: "[project]/src/components/ProjectPlanner.tsx",
                                                                                lineNumber: 609,
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
                                                                                        lineNumber: 613,
                                                                                        columnNumber: 37
                                                                                    }, this),
                                                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                                                        className: "text-gray-400 mb-1",
                                                                                        children: project.client
                                                                                    }, void 0, false, {
                                                                                        fileName: "[project]/src/components/ProjectPlanner.tsx",
                                                                                        lineNumber: 614,
                                                                                        columnNumber: 37
                                                                                    }, this),
                                                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                                                        className: "text-gray-400 mb-2",
                                                                                        children: project.description
                                                                                    }, void 0, false, {
                                                                                        fileName: "[project]/src/components/ProjectPlanner.tsx",
                                                                                        lineNumber: 615,
                                                                                        columnNumber: 37
                                                                                    }, this),
                                                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                                                                        onClick: ()=>removeFromCalendar(project.id, dateString),
                                                                                        className: "text-red-400 hover:text-red-300 text-xs",
                                                                                        children: "Fjern fra kalender"
                                                                                    }, void 0, false, {
                                                                                        fileName: "[project]/src/components/ProjectPlanner.tsx",
                                                                                        lineNumber: 616,
                                                                                        columnNumber: 37
                                                                                    }, this)
                                                                                ]
                                                                            }, void 0, true, {
                                                                                fileName: "[project]/src/components/ProjectPlanner.tsx",
                                                                                lineNumber: 612,
                                                                                columnNumber: 35
                                                                            }, this)
                                                                        ]
                                                                    }, `${project.id}-${date.toISOString()}`, true, {
                                                                        fileName: "[project]/src/components/ProjectPlanner.tsx",
                                                                        lineNumber: 596,
                                                                        columnNumber: 31
                                                                    }, this))
                                                            }, void 0, false, {
                                                                fileName: "[project]/src/components/ProjectPlanner.tsx",
                                                                lineNumber: 594,
                                                                columnNumber: 27
                                                            }, this)
                                                        }, index, false, {
                                                            fileName: "[project]/src/components/ProjectPlanner.tsx",
                                                            lineNumber: 582,
                                                            columnNumber: 25
                                                        }, this);
                                                    })
                                                }, void 0, false, {
                                                    fileName: "[project]/src/components/ProjectPlanner.tsx",
                                                    lineNumber: 571,
                                                    columnNumber: 19
                                                }, this)
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/src/components/ProjectPlanner.tsx",
                                            lineNumber: 546,
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
                                                                                lineNumber: 659,
                                                                                columnNumber: 31
                                                                            }, this),
                                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                                                className: `px-2 py-1 rounded-full text-xs font-medium ${project.status === 'active' ? 'bg-blue-900/50 text-blue-400' : project.status === 'completed' ? 'bg-green-900/50 text-green-400' : 'bg-gray-900/50 text-gray-400'}`,
                                                                                children: project.status
                                                                            }, void 0, false, {
                                                                                fileName: "[project]/src/components/ProjectPlanner.tsx",
                                                                                lineNumber: 660,
                                                                                columnNumber: 31
                                                                            }, this)
                                                                        ]
                                                                    }, void 0, true, {
                                                                        fileName: "[project]/src/components/ProjectPlanner.tsx",
                                                                        lineNumber: 658,
                                                                        columnNumber: 29
                                                                    }, this),
                                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                                        className: "text-sm text-gray-400 mt-2",
                                                                        children: project.description
                                                                    }, void 0, false, {
                                                                        fileName: "[project]/src/components/ProjectPlanner.tsx",
                                                                        lineNumber: 670,
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
                                                                                        lineNumber: 672,
                                                                                        columnNumber: 78
                                                                                    }, this)
                                                                                ]
                                                                            }, void 0, true, {
                                                                                fileName: "[project]/src/components/ProjectPlanner.tsx",
                                                                                lineNumber: 672,
                                                                                columnNumber: 31
                                                                            }, this),
                                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                                                                onClick: ()=>removeFromCalendar(project.id, currentDate.toISOString().split('T')[0]),
                                                                                className: "text-red-400 hover:text-red-300 text-xs",
                                                                                children: "Fjern fra kalender"
                                                                            }, void 0, false, {
                                                                                fileName: "[project]/src/components/ProjectPlanner.tsx",
                                                                                lineNumber: 673,
                                                                                columnNumber: 31
                                                                            }, this)
                                                                        ]
                                                                    }, void 0, true, {
                                                                        fileName: "[project]/src/components/ProjectPlanner.tsx",
                                                                        lineNumber: 671,
                                                                        columnNumber: 29
                                                                    }, this)
                                                                ]
                                                            }, project.id, true, {
                                                                fileName: "[project]/src/components/ProjectPlanner.tsx",
                                                                lineNumber: 648,
                                                                columnNumber: 27
                                                            }, this)),
                                                        scheduledProjects.filter((p)=>p.scheduledDate === currentDate.toISOString().split('T')[0]).length === 0 && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                            className: "text-center py-8 text-gray-500",
                                                            children: [
                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                                    children: "Ingen prosjekter planlagt for denne dagen"
                                                                }, void 0, false, {
                                                                    fileName: "[project]/src/components/ProjectPlanner.tsx",
                                                                    lineNumber: 685,
                                                                    columnNumber: 27
                                                                }, this),
                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                                    className: "text-sm mt-2",
                                                                    children: "Dra et prosjekt hit for å planlegge det"
                                                                }, void 0, false, {
                                                                    fileName: "[project]/src/components/ProjectPlanner.tsx",
                                                                    lineNumber: 686,
                                                                    columnNumber: 27
                                                                }, this)
                                                            ]
                                                        }, void 0, true, {
                                                            fileName: "[project]/src/components/ProjectPlanner.tsx",
                                                            lineNumber: 684,
                                                            columnNumber: 25
                                                        }, this)
                                                    ]
                                                }, void 0, true, {
                                                    fileName: "[project]/src/components/ProjectPlanner.tsx",
                                                    lineNumber: 644,
                                                    columnNumber: 21
                                                }, this)
                                            }, void 0, false, {
                                                fileName: "[project]/src/components/ProjectPlanner.tsx",
                                                lineNumber: 637,
                                                columnNumber: 19
                                            }, this)
                                        }, void 0, false, {
                                            fileName: "[project]/src/components/ProjectPlanner.tsx",
                                            lineNumber: 635,
                                            columnNumber: 17
                                        }, this)
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/src/components/ProjectPlanner.tsx",
                                    lineNumber: 467,
                                    columnNumber: 13
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/src/components/ProjectPlanner.tsx",
                            lineNumber: 438,
                            columnNumber: 11
                        }, this)
                    ]
                }, void 0, true, {
                    fileName: "[project]/src/components/ProjectPlanner.tsx",
                    lineNumber: 351,
                    columnNumber: 9
                }, this)
            ]
        }, void 0, true, {
            fileName: "[project]/src/components/ProjectPlanner.tsx",
            lineNumber: 313,
            columnNumber: 7
        }, this)
    }, void 0, false, {
        fileName: "[project]/src/components/ProjectPlanner.tsx",
        lineNumber: 312,
        columnNumber: 5
    }, this);
}
_s(ProjectPlanner, "o84fbM0S8DqasttqwogeLeKEiH0=");
_c = ProjectPlanner;
var _c;
__turbopack_context__.k.register(_c, "ProjectPlanner");
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
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2d$hot$2d$toast$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/react-hot-toast/dist/index.mjs [app-client] (ecmascript)");
;
var _s = __turbopack_context__.k.signature();
'use client';
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
    const [isLoading, setIsLoading] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(true);
    // Load projects from Supabase
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "PlanleggingPage.useEffect": ()=>{
            const fetchProjects = {
                "PlanleggingPage.useEffect.fetchProjects": async ()=>{
                    try {
                        setIsLoading(true);
                        const data = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$services$2f$projectService$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["getProjects"])();
                        setProjects(data.map(fromSupabaseProject));
                    } catch (error) {
                        console.error('Error fetching projects:', error);
                        __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2d$hot$2d$toast$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["toast"].error('Kunne ikke hente prosjekter');
                    } finally{
                        setIsLoading(false);
                    }
                }
            }["PlanleggingPage.useEffect.fetchProjects"];
            fetchProjects();
        }
    }["PlanleggingPage.useEffect"], []);
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        className: "min-h-screen bg-gray-900 p-8",
        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
            className: "max-w-7xl mx-auto",
            children: [
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: "flex justify-between items-center mb-6",
                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h1", {
                                className: "text-4xl font-bold text-white",
                                children: "Planlegging"
                            }, void 0, false, {
                                fileName: "[project]/src/app/planlegging/page.tsx",
                                lineNumber: 61,
                                columnNumber: 13
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                className: "text-gray-400 mt-2",
                                children: "Planlegg og organiser prosjekter i kalenderen"
                            }, void 0, false, {
                                fileName: "[project]/src/app/planlegging/page.tsx",
                                lineNumber: 62,
                                columnNumber: 13
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/src/app/planlegging/page.tsx",
                        lineNumber: 60,
                        columnNumber: 11
                    }, this)
                }, void 0, false, {
                    fileName: "[project]/src/app/planlegging/page.tsx",
                    lineNumber: 59,
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
                    lineNumber: 67,
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
                            lineNumber: 82,
                            columnNumber: 15
                        }, this)
                    }, void 0, false, {
                        fileName: "[project]/src/app/planlegging/page.tsx",
                        lineNumber: 81,
                        columnNumber: 13
                    }, this) : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$ProjectPlanner$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {
                        projects: projects
                    }, void 0, false, {
                        fileName: "[project]/src/app/planlegging/page.tsx",
                        lineNumber: 85,
                        columnNumber: 13
                    }, this)
                }, void 0, false, {
                    fileName: "[project]/src/app/planlegging/page.tsx",
                    lineNumber: 79,
                    columnNumber: 9
                }, this)
            ]
        }, void 0, true, {
            fileName: "[project]/src/app/planlegging/page.tsx",
            lineNumber: 58,
            columnNumber: 7
        }, this)
    }, void 0, false, {
        fileName: "[project]/src/app/planlegging/page.tsx",
        lineNumber: 57,
        columnNumber: 5
    }, this);
}
_s(PlanleggingPage, "j1+C9JKBe7hOV9v2VWkyx3nb+uc=");
_c = PlanleggingPage;
var _c;
__turbopack_context__.k.register(_c, "PlanleggingPage");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(module, globalThis.$RefreshHelpers$);
}
}}),
}]);

//# sourceMappingURL=src_66c2b37f._.js.map