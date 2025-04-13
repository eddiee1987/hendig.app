module.exports = {

"[project]/src/components/DashboardContent.tsx [app-ssr] (ecmascript)": ((__turbopack_context__) => {
"use strict";

var { g: global, __dirname } = __turbopack_context__;
{
__turbopack_context__.s({
    "default": (()=>DashboardContent)
});
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react-jsx-dev-runtime.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react.js [app-ssr] (ecmascript)");
'use client';
;
;
function DashboardContent() {
    const [greeting, setGreeting] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])('');
    const [stats, setStats] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])({
        kunder: 0,
        inspeksjoner: 0,
        prosjekter: 0,
        timer: 0
    });
    const [recentEvents, setRecentEvents] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])([]);
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useEffect"])(()=>{
        // Hilsen basert på tidspunkt
        const hour = new Date().getHours();
        if (hour >= 5 && hour < 12) setGreeting('God morgen');
        else if (hour >= 12 && hour < 17) setGreeting('God dag');
        else if (hour >= 17 && hour < 22) setGreeting('God kveld');
        else setGreeting('God natt');
        // Her kan du legge til API-kall for å hente data
        setStats({
            kunder: 156,
            inspeksjoner: 23,
            prosjekter: 12,
            timer: 245
        });
        setRecentEvents([
            {
                type: 'inspeksjon',
                title: 'Ny takinspeksjon fullført',
                location: 'Bergveien 12, Bergen',
                time: '2 timer siden'
            },
            {
                type: 'kunde',
                title: 'Ny kunde registrert',
                location: 'Hansen Eiendom AS',
                time: '4 timer siden'
            },
            {
                type: 'prosjekt',
                title: 'Prosjekt "Torvtak Renovering" startet',
                location: 'Fjordgata 8, Bergen',
                time: '6 timer siden'
            }
        ]);
    }, []);
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        className: "p-8"
    }, void 0, false, {
        fileName: "[project]/src/components/DashboardContent.tsx",
        lineNumber: 62,
        columnNumber: 5
    }, this);
}
}}),

};

//# sourceMappingURL=src_components_DashboardContent_tsx_c59d48ea._.js.map