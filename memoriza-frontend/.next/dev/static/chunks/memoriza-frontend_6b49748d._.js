(globalThis.TURBOPACK || (globalThis.TURBOPACK = [])).push([typeof document === "object" ? document.currentScript : undefined,
"[project]/memoriza-frontend/components/ui/input.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "Input",
    ()=>Input
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$memoriza$2d$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/memoriza-frontend/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$memoriza$2d$frontend$2f$lib$2f$utils$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/memoriza-frontend/lib/utils.ts [app-client] (ecmascript)");
;
;
function Input({ className, type, ...props }) {
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$memoriza$2d$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
        type: type,
        "data-slot": "input",
        className: (0, __TURBOPACK__imported__module__$5b$project$5d2f$memoriza$2d$frontend$2f$lib$2f$utils$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["cn"])('file:text-foreground placeholder:text-muted-foreground selection:bg-primary selection:text-primary-foreground dark:bg-input/30 border-input h-9 w-full min-w-0 rounded-md border bg-transparent px-3 py-1 text-base shadow-xs transition-[color,box-shadow] outline-none file:inline-flex file:h-7 file:border-0 file:bg-transparent file:text-sm file:font-medium disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50 md:text-sm', 'focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px]', 'aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive', className),
        ...props
    }, void 0, false, {
        fileName: "[project]/memoriza-frontend/components/ui/input.tsx",
        lineNumber: 7,
        columnNumber: 5
    }, this);
}
_c = Input;
;
var _c;
__turbopack_context__.k.register(_c, "Input");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/memoriza-frontend/components/ui/select.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "Select",
    ()=>Select,
    "SelectContent",
    ()=>SelectContent,
    "SelectGroup",
    ()=>SelectGroup,
    "SelectItem",
    ()=>SelectItem,
    "SelectLabel",
    ()=>SelectLabel,
    "SelectScrollDownButton",
    ()=>SelectScrollDownButton,
    "SelectScrollUpButton",
    ()=>SelectScrollUpButton,
    "SelectSeparator",
    ()=>SelectSeparator,
    "SelectTrigger",
    ()=>SelectTrigger,
    "SelectValue",
    ()=>SelectValue
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$memoriza$2d$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/memoriza-frontend/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$memoriza$2d$frontend$2f$node_modules$2f40$radix$2d$ui$2f$react$2d$select$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/memoriza-frontend/node_modules/@radix-ui/react-select/dist/index.mjs [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$memoriza$2d$frontend$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$check$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__CheckIcon$3e$__ = __turbopack_context__.i("[project]/memoriza-frontend/node_modules/lucide-react/dist/esm/icons/check.js [app-client] (ecmascript) <export default as CheckIcon>");
var __TURBOPACK__imported__module__$5b$project$5d2f$memoriza$2d$frontend$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$chevron$2d$down$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__ChevronDownIcon$3e$__ = __turbopack_context__.i("[project]/memoriza-frontend/node_modules/lucide-react/dist/esm/icons/chevron-down.js [app-client] (ecmascript) <export default as ChevronDownIcon>");
var __TURBOPACK__imported__module__$5b$project$5d2f$memoriza$2d$frontend$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$chevron$2d$up$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__ChevronUpIcon$3e$__ = __turbopack_context__.i("[project]/memoriza-frontend/node_modules/lucide-react/dist/esm/icons/chevron-up.js [app-client] (ecmascript) <export default as ChevronUpIcon>");
var __TURBOPACK__imported__module__$5b$project$5d2f$memoriza$2d$frontend$2f$lib$2f$utils$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/memoriza-frontend/lib/utils.ts [app-client] (ecmascript)");
'use client';
;
;
;
;
function Select({ ...props }) {
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$memoriza$2d$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$memoriza$2d$frontend$2f$node_modules$2f40$radix$2d$ui$2f$react$2d$select$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Root"], {
        "data-slot": "select",
        ...props
    }, void 0, false, {
        fileName: "[project]/memoriza-frontend/components/ui/select.tsx",
        lineNumber: 12,
        columnNumber: 10
    }, this);
}
_c = Select;
function SelectGroup({ ...props }) {
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$memoriza$2d$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$memoriza$2d$frontend$2f$node_modules$2f40$radix$2d$ui$2f$react$2d$select$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Group"], {
        "data-slot": "select-group",
        ...props
    }, void 0, false, {
        fileName: "[project]/memoriza-frontend/components/ui/select.tsx",
        lineNumber: 18,
        columnNumber: 10
    }, this);
}
_c1 = SelectGroup;
function SelectValue({ ...props }) {
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$memoriza$2d$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$memoriza$2d$frontend$2f$node_modules$2f40$radix$2d$ui$2f$react$2d$select$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Value"], {
        "data-slot": "select-value",
        ...props
    }, void 0, false, {
        fileName: "[project]/memoriza-frontend/components/ui/select.tsx",
        lineNumber: 24,
        columnNumber: 10
    }, this);
}
_c2 = SelectValue;
function SelectTrigger({ className, size = 'default', children, ...props }) {
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$memoriza$2d$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$memoriza$2d$frontend$2f$node_modules$2f40$radix$2d$ui$2f$react$2d$select$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Trigger"], {
        "data-slot": "select-trigger",
        "data-size": size,
        className: (0, __TURBOPACK__imported__module__$5b$project$5d2f$memoriza$2d$frontend$2f$lib$2f$utils$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["cn"])("border-input data-[placeholder]:text-muted-foreground [&_svg:not([class*='text-'])]:text-muted-foreground focus-visible:border-ring focus-visible:ring-ring/50 aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive dark:bg-input/30 dark:hover:bg-input/50 flex w-fit items-center justify-between gap-2 rounded-md border bg-transparent px-3 py-2 text-sm whitespace-nowrap shadow-xs transition-[color,box-shadow] outline-none focus-visible:ring-[3px] disabled:cursor-not-allowed disabled:opacity-50 data-[size=default]:h-9 data-[size=sm]:h-8 *:data-[slot=select-value]:line-clamp-1 *:data-[slot=select-value]:flex *:data-[slot=select-value]:items-center *:data-[slot=select-value]:gap-2 [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4", className),
        ...props,
        children: [
            children,
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$memoriza$2d$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$memoriza$2d$frontend$2f$node_modules$2f40$radix$2d$ui$2f$react$2d$select$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Icon"], {
                asChild: true,
                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$memoriza$2d$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$memoriza$2d$frontend$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$chevron$2d$down$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__ChevronDownIcon$3e$__["ChevronDownIcon"], {
                    className: "size-4 opacity-50"
                }, void 0, false, {
                    fileName: "[project]/memoriza-frontend/components/ui/select.tsx",
                    lineNumber: 47,
                    columnNumber: 9
                }, this)
            }, void 0, false, {
                fileName: "[project]/memoriza-frontend/components/ui/select.tsx",
                lineNumber: 46,
                columnNumber: 7
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/memoriza-frontend/components/ui/select.tsx",
        lineNumber: 36,
        columnNumber: 5
    }, this);
}
_c3 = SelectTrigger;
function SelectContent({ className, children, position = 'popper', ...props }) {
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$memoriza$2d$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$memoriza$2d$frontend$2f$node_modules$2f40$radix$2d$ui$2f$react$2d$select$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Portal"], {
        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$memoriza$2d$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$memoriza$2d$frontend$2f$node_modules$2f40$radix$2d$ui$2f$react$2d$select$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Content"], {
            "data-slot": "select-content",
            className: (0, __TURBOPACK__imported__module__$5b$project$5d2f$memoriza$2d$frontend$2f$lib$2f$utils$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["cn"])('bg-popover text-popover-foreground data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2 relative z-50 max-h-(--radix-select-content-available-height) min-w-[8rem] origin-(--radix-select-content-transform-origin) overflow-x-hidden overflow-y-auto rounded-md border shadow-md', position === 'popper' && 'data-[side=bottom]:translate-y-1 data-[side=left]:-translate-x-1 data-[side=right]:translate-x-1 data-[side=top]:-translate-y-1', className),
            position: position,
            ...props,
            children: [
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$memoriza$2d$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(SelectScrollUpButton, {}, void 0, false, {
                    fileName: "[project]/memoriza-frontend/components/ui/select.tsx",
                    lineNumber: 72,
                    columnNumber: 9
                }, this),
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$memoriza$2d$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$memoriza$2d$frontend$2f$node_modules$2f40$radix$2d$ui$2f$react$2d$select$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Viewport"], {
                    className: (0, __TURBOPACK__imported__module__$5b$project$5d2f$memoriza$2d$frontend$2f$lib$2f$utils$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["cn"])('p-1', position === 'popper' && 'h-[var(--radix-select-trigger-height)] w-full min-w-[var(--radix-select-trigger-width)] scroll-my-1'),
                    children: children
                }, void 0, false, {
                    fileName: "[project]/memoriza-frontend/components/ui/select.tsx",
                    lineNumber: 73,
                    columnNumber: 9
                }, this),
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$memoriza$2d$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(SelectScrollDownButton, {}, void 0, false, {
                    fileName: "[project]/memoriza-frontend/components/ui/select.tsx",
                    lineNumber: 82,
                    columnNumber: 9
                }, this)
            ]
        }, void 0, true, {
            fileName: "[project]/memoriza-frontend/components/ui/select.tsx",
            lineNumber: 61,
            columnNumber: 7
        }, this)
    }, void 0, false, {
        fileName: "[project]/memoriza-frontend/components/ui/select.tsx",
        lineNumber: 60,
        columnNumber: 5
    }, this);
}
_c4 = SelectContent;
function SelectLabel({ className, ...props }) {
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$memoriza$2d$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$memoriza$2d$frontend$2f$node_modules$2f40$radix$2d$ui$2f$react$2d$select$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Label"], {
        "data-slot": "select-label",
        className: (0, __TURBOPACK__imported__module__$5b$project$5d2f$memoriza$2d$frontend$2f$lib$2f$utils$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["cn"])('text-muted-foreground px-2 py-1.5 text-xs', className),
        ...props
    }, void 0, false, {
        fileName: "[project]/memoriza-frontend/components/ui/select.tsx",
        lineNumber: 93,
        columnNumber: 5
    }, this);
}
_c5 = SelectLabel;
function SelectItem({ className, children, ...props }) {
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$memoriza$2d$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$memoriza$2d$frontend$2f$node_modules$2f40$radix$2d$ui$2f$react$2d$select$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Item"], {
        "data-slot": "select-item",
        className: (0, __TURBOPACK__imported__module__$5b$project$5d2f$memoriza$2d$frontend$2f$lib$2f$utils$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["cn"])("focus:bg-accent focus:text-accent-foreground [&_svg:not([class*='text-'])]:text-muted-foreground relative flex w-full cursor-default items-center gap-2 rounded-sm py-1.5 pr-8 pl-2 text-sm outline-hidden select-none data-[disabled]:pointer-events-none data-[disabled]:opacity-50 [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4 *:[span]:last:flex *:[span]:last:items-center *:[span]:last:gap-2", className),
        ...props,
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$memoriza$2d$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                className: "absolute right-2 flex size-3.5 items-center justify-center",
                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$memoriza$2d$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$memoriza$2d$frontend$2f$node_modules$2f40$radix$2d$ui$2f$react$2d$select$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["ItemIndicator"], {
                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$memoriza$2d$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$memoriza$2d$frontend$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$check$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__CheckIcon$3e$__["CheckIcon"], {
                        className: "size-4"
                    }, void 0, false, {
                        fileName: "[project]/memoriza-frontend/components/ui/select.tsx",
                        lineNumber: 117,
                        columnNumber: 11
                    }, this)
                }, void 0, false, {
                    fileName: "[project]/memoriza-frontend/components/ui/select.tsx",
                    lineNumber: 116,
                    columnNumber: 9
                }, this)
            }, void 0, false, {
                fileName: "[project]/memoriza-frontend/components/ui/select.tsx",
                lineNumber: 115,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$memoriza$2d$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$memoriza$2d$frontend$2f$node_modules$2f40$radix$2d$ui$2f$react$2d$select$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["ItemText"], {
                children: children
            }, void 0, false, {
                fileName: "[project]/memoriza-frontend/components/ui/select.tsx",
                lineNumber: 120,
                columnNumber: 7
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/memoriza-frontend/components/ui/select.tsx",
        lineNumber: 107,
        columnNumber: 5
    }, this);
}
_c6 = SelectItem;
function SelectSeparator({ className, ...props }) {
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$memoriza$2d$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$memoriza$2d$frontend$2f$node_modules$2f40$radix$2d$ui$2f$react$2d$select$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Separator"], {
        "data-slot": "select-separator",
        className: (0, __TURBOPACK__imported__module__$5b$project$5d2f$memoriza$2d$frontend$2f$lib$2f$utils$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["cn"])('bg-border pointer-events-none -mx-1 my-1 h-px', className),
        ...props
    }, void 0, false, {
        fileName: "[project]/memoriza-frontend/components/ui/select.tsx",
        lineNumber: 130,
        columnNumber: 5
    }, this);
}
_c7 = SelectSeparator;
function SelectScrollUpButton({ className, ...props }) {
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$memoriza$2d$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$memoriza$2d$frontend$2f$node_modules$2f40$radix$2d$ui$2f$react$2d$select$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["ScrollUpButton"], {
        "data-slot": "select-scroll-up-button",
        className: (0, __TURBOPACK__imported__module__$5b$project$5d2f$memoriza$2d$frontend$2f$lib$2f$utils$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["cn"])('flex cursor-default items-center justify-center py-1', className),
        ...props,
        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$memoriza$2d$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$memoriza$2d$frontend$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$chevron$2d$up$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__ChevronUpIcon$3e$__["ChevronUpIcon"], {
            className: "size-4"
        }, void 0, false, {
            fileName: "[project]/memoriza-frontend/components/ui/select.tsx",
            lineNumber: 151,
            columnNumber: 7
        }, this)
    }, void 0, false, {
        fileName: "[project]/memoriza-frontend/components/ui/select.tsx",
        lineNumber: 143,
        columnNumber: 5
    }, this);
}
_c8 = SelectScrollUpButton;
function SelectScrollDownButton({ className, ...props }) {
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$memoriza$2d$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$memoriza$2d$frontend$2f$node_modules$2f40$radix$2d$ui$2f$react$2d$select$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["ScrollDownButton"], {
        "data-slot": "select-scroll-down-button",
        className: (0, __TURBOPACK__imported__module__$5b$project$5d2f$memoriza$2d$frontend$2f$lib$2f$utils$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["cn"])('flex cursor-default items-center justify-center py-1', className),
        ...props,
        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$memoriza$2d$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$memoriza$2d$frontend$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$chevron$2d$down$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__ChevronDownIcon$3e$__["ChevronDownIcon"], {
            className: "size-4"
        }, void 0, false, {
            fileName: "[project]/memoriza-frontend/components/ui/select.tsx",
            lineNumber: 169,
            columnNumber: 7
        }, this)
    }, void 0, false, {
        fileName: "[project]/memoriza-frontend/components/ui/select.tsx",
        lineNumber: 161,
        columnNumber: 5
    }, this);
}
_c9 = SelectScrollDownButton;
;
var _c, _c1, _c2, _c3, _c4, _c5, _c6, _c7, _c8, _c9;
__turbopack_context__.k.register(_c, "Select");
__turbopack_context__.k.register(_c1, "SelectGroup");
__turbopack_context__.k.register(_c2, "SelectValue");
__turbopack_context__.k.register(_c3, "SelectTrigger");
__turbopack_context__.k.register(_c4, "SelectContent");
__turbopack_context__.k.register(_c5, "SelectLabel");
__turbopack_context__.k.register(_c6, "SelectItem");
__turbopack_context__.k.register(_c7, "SelectSeparator");
__turbopack_context__.k.register(_c8, "SelectScrollUpButton");
__turbopack_context__.k.register(_c9, "SelectScrollDownButton");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/memoriza-frontend/lib/employee-mock-data.ts [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "actionColors",
    ()=>actionColors,
    "actionLabels",
    ()=>actionLabels,
    "getEmployeeById",
    ()=>getEmployeeById,
    "getEmployeesByGroup",
    ()=>getEmployeesByGroup,
    "getGroupById",
    ()=>getGroupById,
    "isCpfUnique",
    ()=>isCpfUnique,
    "isEmailUnique",
    ()=>isEmailUnique,
    "isGroupNameUnique",
    ()=>isGroupNameUnique,
    "mockAccessLogs",
    ()=>mockAccessLogs,
    "mockEmployees",
    ()=>mockEmployees,
    "mockUserGroups",
    ()=>mockUserGroups,
    "moduleLabels",
    ()=>moduleLabels
]);
const mockUserGroups = [
    {
        id: '1',
        name: 'Vendedores',
        description: 'Equipe de vendas com acesso a produtos e pedidos',
        is_active: true,
        created_at: new Date('2024-01-15'),
        employee_count: 5,
        permissions: [
            {
                module: 'dashboard',
                actions: {
                    view: true,
                    export: false
                }
            },
            {
                module: 'products',
                actions: {
                    view: true,
                    create: false,
                    edit: false,
                    delete: false
                }
            },
            {
                module: 'orders',
                actions: {
                    view: true,
                    create: true,
                    edit: true,
                    delete: false,
                    update_status: true
                }
            }
        ]
    },
    {
        id: '2',
        name: 'Gerentes',
        description: 'Gerentes com acesso completo exceto configurações',
        is_active: true,
        created_at: new Date('2024-01-10'),
        employee_count: 3,
        permissions: [
            {
                module: 'dashboard',
                actions: {
                    view: true,
                    export: true
                }
            },
            {
                module: 'products',
                actions: {
                    view: true,
                    create: true,
                    edit: true,
                    delete: true
                }
            },
            {
                module: 'categories',
                actions: {
                    view: true,
                    create: true,
                    edit: true,
                    delete: true
                }
            },
            {
                module: 'sizes',
                actions: {
                    view: true,
                    create: true,
                    edit: true,
                    delete: true
                }
            },
            {
                module: 'colors',
                actions: {
                    view: true,
                    create: true,
                    edit: true,
                    delete: true
                }
            },
            {
                module: 'orders',
                actions: {
                    view: true,
                    create: true,
                    edit: true,
                    delete: true,
                    update_status: true
                }
            }
        ]
    },
    {
        id: '3',
        name: 'Estoque',
        description: 'Equipe de estoque com foco em produtos',
        is_active: true,
        created_at: new Date('2024-02-01'),
        employee_count: 4,
        permissions: [
            {
                module: 'dashboard',
                actions: {
                    view: true,
                    export: false
                }
            },
            {
                module: 'products',
                actions: {
                    view: true,
                    create: true,
                    edit: true,
                    delete: false
                }
            },
            {
                module: 'categories',
                actions: {
                    view: true,
                    create: false,
                    edit: false,
                    delete: false
                }
            },
            {
                module: 'sizes',
                actions: {
                    view: true,
                    create: true,
                    edit: true,
                    delete: false
                }
            },
            {
                module: 'colors',
                actions: {
                    view: true,
                    create: true,
                    edit: true,
                    delete: false
                }
            }
        ]
    },
    {
        id: '4',
        name: 'Suporte',
        description: 'Equipe de suporte ao cliente',
        is_active: false,
        created_at: new Date('2024-03-10'),
        employee_count: 2,
        permissions: [
            {
                module: 'dashboard',
                actions: {
                    view: true,
                    export: false
                }
            },
            {
                module: 'orders',
                actions: {
                    view: true,
                    create: false,
                    edit: true,
                    delete: false,
                    update_status: true
                }
            },
            {
                module: 'account_settings',
                actions: {
                    view: true,
                    edit: false
                }
            }
        ]
    }
];
const mockEmployees = [
    {
        id: 'emp-001',
        name: 'João',
        last_name: 'Silva',
        email: 'joao.silva@memoriza.com',
        phone: '(11) 98765-4321',
        cpf: '123.456.789-00',
        group_id: '2',
        group_name: 'Gerentes',
        hire_date: new Date('2024-01-15'),
        status: 'active',
        created_at: new Date('2024-01-15'),
        updated_at: new Date('2024-01-15')
    },
    {
        id: 'emp-002',
        name: 'Maria',
        last_name: 'Santos',
        email: 'maria.santos@memoriza.com',
        phone: '(11) 98765-4322',
        cpf: '234.567.890-11',
        group_id: '1',
        group_name: 'Vendedores',
        hire_date: new Date('2024-02-01'),
        status: 'active',
        created_at: new Date('2024-02-01'),
        updated_at: new Date('2024-02-01')
    },
    {
        id: 'emp-003',
        name: 'Pedro',
        last_name: 'Oliveira',
        email: 'pedro.oliveira@memoriza.com',
        phone: '(11) 98765-4323',
        group_id: '3',
        group_name: 'Estoque',
        hire_date: new Date('2024-02-15'),
        status: 'active',
        created_at: new Date('2024-02-15'),
        updated_at: new Date('2024-02-15')
    },
    {
        id: 'emp-004',
        name: 'Ana',
        last_name: 'Costa',
        email: 'ana.costa@memoriza.com',
        phone: '(11) 98765-4324',
        cpf: '345.678.901-22',
        group_id: '1',
        group_name: 'Vendedores',
        hire_date: new Date('2024-03-01'),
        status: 'active',
        created_at: new Date('2024-03-01'),
        updated_at: new Date('2024-03-01')
    },
    {
        id: 'emp-005',
        name: 'Carlos',
        last_name: 'Ferreira',
        email: 'carlos.ferreira@memoriza.com',
        phone: '(11) 98765-4325',
        group_id: '3',
        group_name: 'Estoque',
        hire_date: new Date('2024-03-15'),
        status: 'inactive',
        created_at: new Date('2024-03-15'),
        updated_at: new Date('2024-11-20')
    },
    {
        id: 'emp-006',
        name: 'Juliana',
        last_name: 'Almeida',
        email: 'juliana.almeida@memoriza.com',
        phone: '(11) 98765-4326',
        cpf: '456.789.012-33',
        group_id: '2',
        group_name: 'Gerentes',
        hire_date: new Date('2024-04-01'),
        status: 'active',
        created_at: new Date('2024-04-01'),
        updated_at: new Date('2024-04-01')
    },
    {
        id: 'emp-007',
        name: 'Roberto',
        last_name: 'Souza',
        email: 'roberto.souza@memoriza.com',
        phone: '(11) 98765-4327',
        group_id: '1',
        group_name: 'Vendedores',
        hire_date: new Date('2024-05-01'),
        status: 'active',
        created_at: new Date('2024-05-01'),
        updated_at: new Date('2024-05-01')
    },
    {
        id: 'emp-008',
        name: 'Fernanda',
        last_name: 'Lima',
        email: 'fernanda.lima@memoriza.com',
        phone: '(11) 98765-4328',
        cpf: '567.890.123-44',
        group_id: '3',
        group_name: 'Estoque',
        hire_date: new Date('2024-06-01'),
        status: 'active',
        created_at: new Date('2024-06-01'),
        updated_at: new Date('2024-06-01')
    },
    {
        id: 'emp-009',
        name: 'Ricardo',
        last_name: 'Pereira',
        email: 'ricardo.pereira@memoriza.com',
        phone: '(11) 98765-4329',
        group_id: '4',
        group_name: 'Suporte',
        hire_date: new Date('2024-07-01'),
        status: 'active',
        created_at: new Date('2024-07-01'),
        updated_at: new Date('2024-07-01')
    },
    {
        id: 'emp-010',
        name: 'Beatriz',
        last_name: 'Rodrigues',
        email: 'beatriz.rodrigues@memoriza.com',
        phone: '(11) 98765-4330',
        cpf: '678.901.234-55',
        group_id: '1',
        group_name: 'Vendedores',
        hire_date: new Date('2024-08-01'),
        status: 'active',
        created_at: new Date('2024-08-01'),
        updated_at: new Date('2024-08-01')
    },
    {
        id: 'emp-011',
        name: 'Lucas',
        last_name: 'Martins',
        email: 'lucas.martins@memoriza.com',
        phone: '(11) 98765-4331',
        group_id: '3',
        group_name: 'Estoque',
        hire_date: new Date('2024-09-01'),
        status: 'active',
        created_at: new Date('2024-09-01'),
        updated_at: new Date('2024-09-01')
    },
    {
        id: 'emp-012',
        name: 'Camila',
        last_name: 'Barbosa',
        email: 'camila.barbosa@memoriza.com',
        phone: '(11) 98765-4332',
        cpf: '789.012.345-66',
        group_id: '2',
        group_name: 'Gerentes',
        hire_date: new Date('2024-10-01'),
        status: 'active',
        created_at: new Date('2024-10-01'),
        updated_at: new Date('2024-10-01')
    },
    {
        id: 'emp-013',
        name: 'Gabriel',
        last_name: 'Araújo',
        email: 'gabriel.araujo@memoriza.com',
        phone: '(11) 98765-4333',
        group_id: '1',
        group_name: 'Vendedores',
        hire_date: new Date('2024-10-15'),
        status: 'active',
        created_at: new Date('2024-10-15'),
        updated_at: new Date('2024-10-15')
    },
    {
        id: 'emp-014',
        name: 'Patrícia',
        last_name: 'Mendes',
        email: 'patricia.mendes@memoriza.com',
        phone: '(11) 98765-4334',
        group_id: '4',
        group_name: 'Suporte',
        hire_date: new Date('2024-11-01'),
        status: 'inactive',
        created_at: new Date('2024-11-01'),
        updated_at: new Date('2024-11-25')
    }
];
const moduleLabels = {
    dashboard: 'Dashboard',
    products: 'Produtos',
    categories: 'Categorias',
    sizes: 'Tamanhos',
    colors: 'Cores',
    orders: 'Pedidos',
    carousel: 'Carrossel',
    settings: 'Configurações',
    employees: 'Funcionários',
    groups: 'Grupos',
    logs: 'Logs',
    account_settings: 'Configurações da Conta'
};
const actionLabels = {
    login: 'Login',
    logout: 'Logout',
    create: 'Criar',
    edit: 'Editar',
    delete: 'Excluir',
    view: 'Visualizar',
    export: 'Exportar',
    update_status: 'Atualizar Status',
    reorder: 'Reorganizar'
};
// ============================================
// LOGS DE ACESSO MOCKADOS
// ============================================
const generateMockLogs = ()=>{
    const logs = [];
    const now = new Date();
    // Gerar logs dos últimos 30 dias
    for(let i = 0; i < 60; i++){
        const employee = mockEmployees[Math.floor(Math.random() * mockEmployees.length)];
        const actions = [
            'login',
            'logout',
            'create',
            'edit',
            'delete',
            'view',
            'export'
        ];
        const modules = [
            'dashboard',
            'products',
            'categories',
            'sizes',
            'colors',
            'orders'
        ];
        const action = actions[Math.floor(Math.random() * actions.length)];
        const module = modules[Math.floor(Math.random() * modules.length)];
        const timestamp = new Date(now);
        timestamp.setDate(timestamp.getDate() - Math.floor(Math.random() * 30));
        timestamp.setHours(Math.floor(Math.random() * 24));
        timestamp.setMinutes(Math.floor(Math.random() * 60));
        let description = '';
        switch(action){
            case 'login':
                description = `${employee.name} ${employee.last_name} fez login no sistema`;
                break;
            case 'logout':
                description = `${employee.name} ${employee.last_name} fez logout do sistema`;
                break;
            case 'create':
                description = `${employee.name} ${employee.last_name} criou um item em ${moduleLabels[module]}`;
                break;
            case 'edit':
                description = `${employee.name} ${employee.last_name} editou um item em ${moduleLabels[module]}`;
                break;
            case 'delete':
                description = `${employee.name} ${employee.last_name} excluiu um item de ${moduleLabels[module]}`;
                break;
            case 'view':
                description = `${employee.name} ${employee.last_name} visualizou ${moduleLabels[module]}`;
                break;
            case 'export':
                description = `${employee.name} ${employee.last_name} exportou relatório de ${moduleLabels[module]}`;
                break;
            case 'update_status':
                description = `${employee.name} ${employee.last_name} atualizou o status em ${moduleLabels[module]}`;
                break;
            case 'reorder':
                description = `${employee.name} ${employee.last_name} reorganizou a ordem do ${moduleLabels[module]}`;
                break;
        }
        logs.push({
            id: `log-${i + 1}`,
            employee_id: employee.id,
            employee_name: `${employee.name} ${employee.last_name}`,
            employee_role: employee.group_name || 'N/A',
            action,
            module,
            description,
            timestamp
        });
    }
    return logs.sort((a, b)=>b.timestamp.getTime() - a.timestamp.getTime());
};
const mockAccessLogs = generateMockLogs();
const actionColors = {
    login: 'bg-green-100 text-green-700 border-green-200',
    logout: 'bg-gray-100 text-gray-700 border-gray-200',
    create: 'bg-blue-100 text-blue-700 border-blue-200',
    edit: 'bg-yellow-100 text-yellow-700 border-yellow-200',
    delete: 'bg-red-100 text-red-700 border-red-200',
    view: 'bg-purple-100 text-purple-700 border-purple-200',
    export: 'bg-indigo-100 text-indigo-700 border-indigo-200',
    update_status: 'bg-orange-100 text-orange-700 border-orange-200',
    reorder: 'bg-cyan-100 text-cyan-700 border-cyan-200'
};
const getEmployeesByGroup = (groupId)=>{
    return mockEmployees.filter((emp)=>emp.group_id === groupId);
};
const getGroupById = (groupId)=>{
    return mockUserGroups.find((group)=>group.id === groupId);
};
const getEmployeeById = (employeeId)=>{
    return mockEmployees.find((emp)=>emp.id === employeeId);
};
const isEmailUnique = (email, excludeId)=>{
    return !mockEmployees.some((emp)=>emp.email === email && emp.id !== excludeId);
};
const isCpfUnique = (cpf, excludeId)=>{
    return !mockEmployees.some((emp)=>emp.cpf === cpf && emp.id !== excludeId);
};
const isGroupNameUnique = (name, excludeId)=>{
    return !mockUserGroups.some((group)=>group.name === name && group.id !== excludeId);
};
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/memoriza-frontend/components/action-type-badge.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "ActionTypeBadge",
    ()=>ActionTypeBadge
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$memoriza$2d$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/memoriza-frontend/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$memoriza$2d$frontend$2f$lib$2f$employee$2d$mock$2d$data$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/memoriza-frontend/lib/employee-mock-data.ts [app-client] (ecmascript)");
;
;
function ActionTypeBadge({ action }) {
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$memoriza$2d$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
        className: `inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium border ${__TURBOPACK__imported__module__$5b$project$5d2f$memoriza$2d$frontend$2f$lib$2f$employee$2d$mock$2d$data$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["actionColors"][action]}`,
        children: __TURBOPACK__imported__module__$5b$project$5d2f$memoriza$2d$frontend$2f$lib$2f$employee$2d$mock$2d$data$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["actionLabels"][action]
    }, void 0, false, {
        fileName: "[project]/memoriza-frontend/components/action-type-badge.tsx",
        lineNumber: 10,
        columnNumber: 5
    }, this);
}
_c = ActionTypeBadge;
var _c;
__turbopack_context__.k.register(_c, "ActionTypeBadge");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/memoriza-frontend/components/module-icon.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "ModuleIcon",
    ()=>ModuleIcon
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$memoriza$2d$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/memoriza-frontend/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$memoriza$2d$frontend$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$layout$2d$dashboard$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__LayoutDashboard$3e$__ = __turbopack_context__.i("[project]/memoriza-frontend/node_modules/lucide-react/dist/esm/icons/layout-dashboard.js [app-client] (ecmascript) <export default as LayoutDashboard>");
var __TURBOPACK__imported__module__$5b$project$5d2f$memoriza$2d$frontend$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$package$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Package$3e$__ = __turbopack_context__.i("[project]/memoriza-frontend/node_modules/lucide-react/dist/esm/icons/package.js [app-client] (ecmascript) <export default as Package>");
var __TURBOPACK__imported__module__$5b$project$5d2f$memoriza$2d$frontend$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$folder$2d$tree$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__FolderTree$3e$__ = __turbopack_context__.i("[project]/memoriza-frontend/node_modules/lucide-react/dist/esm/icons/folder-tree.js [app-client] (ecmascript) <export default as FolderTree>");
var __TURBOPACK__imported__module__$5b$project$5d2f$memoriza$2d$frontend$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$ruler$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Ruler$3e$__ = __turbopack_context__.i("[project]/memoriza-frontend/node_modules/lucide-react/dist/esm/icons/ruler.js [app-client] (ecmascript) <export default as Ruler>");
var __TURBOPACK__imported__module__$5b$project$5d2f$memoriza$2d$frontend$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$palette$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Palette$3e$__ = __turbopack_context__.i("[project]/memoriza-frontend/node_modules/lucide-react/dist/esm/icons/palette.js [app-client] (ecmascript) <export default as Palette>");
var __TURBOPACK__imported__module__$5b$project$5d2f$memoriza$2d$frontend$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$shopping$2d$cart$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__ShoppingCart$3e$__ = __turbopack_context__.i("[project]/memoriza-frontend/node_modules/lucide-react/dist/esm/icons/shopping-cart.js [app-client] (ecmascript) <export default as ShoppingCart>");
var __TURBOPACK__imported__module__$5b$project$5d2f$memoriza$2d$frontend$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$settings$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Settings$3e$__ = __turbopack_context__.i("[project]/memoriza-frontend/node_modules/lucide-react/dist/esm/icons/settings.js [app-client] (ecmascript) <export default as Settings>");
var __TURBOPACK__imported__module__$5b$project$5d2f$memoriza$2d$frontend$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$image$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Image$3e$__ = __turbopack_context__.i("[project]/memoriza-frontend/node_modules/lucide-react/dist/esm/icons/image.js [app-client] (ecmascript) <export default as Image>");
var __TURBOPACK__imported__module__$5b$project$5d2f$memoriza$2d$frontend$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$users$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Users$3e$__ = __turbopack_context__.i("[project]/memoriza-frontend/node_modules/lucide-react/dist/esm/icons/users.js [app-client] (ecmascript) <export default as Users>");
var __TURBOPACK__imported__module__$5b$project$5d2f$memoriza$2d$frontend$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$shield$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Shield$3e$__ = __turbopack_context__.i("[project]/memoriza-frontend/node_modules/lucide-react/dist/esm/icons/shield.js [app-client] (ecmascript) <export default as Shield>");
var __TURBOPACK__imported__module__$5b$project$5d2f$memoriza$2d$frontend$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$file$2d$text$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__FileText$3e$__ = __turbopack_context__.i("[project]/memoriza-frontend/node_modules/lucide-react/dist/esm/icons/file-text.js [app-client] (ecmascript) <export default as FileText>");
;
;
const moduleIcons = {
    dashboard: __TURBOPACK__imported__module__$5b$project$5d2f$memoriza$2d$frontend$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$layout$2d$dashboard$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__LayoutDashboard$3e$__["LayoutDashboard"],
    products: __TURBOPACK__imported__module__$5b$project$5d2f$memoriza$2d$frontend$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$package$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Package$3e$__["Package"],
    categories: __TURBOPACK__imported__module__$5b$project$5d2f$memoriza$2d$frontend$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$folder$2d$tree$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__FolderTree$3e$__["FolderTree"],
    sizes: __TURBOPACK__imported__module__$5b$project$5d2f$memoriza$2d$frontend$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$ruler$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Ruler$3e$__["Ruler"],
    colors: __TURBOPACK__imported__module__$5b$project$5d2f$memoriza$2d$frontend$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$palette$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Palette$3e$__["Palette"],
    orders: __TURBOPACK__imported__module__$5b$project$5d2f$memoriza$2d$frontend$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$shopping$2d$cart$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__ShoppingCart$3e$__["ShoppingCart"],
    carousel: __TURBOPACK__imported__module__$5b$project$5d2f$memoriza$2d$frontend$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$image$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Image$3e$__["Image"],
    settings: __TURBOPACK__imported__module__$5b$project$5d2f$memoriza$2d$frontend$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$settings$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Settings$3e$__["Settings"],
    employees: __TURBOPACK__imported__module__$5b$project$5d2f$memoriza$2d$frontend$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$users$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Users$3e$__["Users"],
    groups: __TURBOPACK__imported__module__$5b$project$5d2f$memoriza$2d$frontend$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$shield$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Shield$3e$__["Shield"],
    logs: __TURBOPACK__imported__module__$5b$project$5d2f$memoriza$2d$frontend$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$file$2d$text$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__FileText$3e$__["FileText"],
    account_settings: __TURBOPACK__imported__module__$5b$project$5d2f$memoriza$2d$frontend$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$settings$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Settings$3e$__["Settings"]
};
function ModuleIcon({ module, size = 16, className = '' }) {
    const Icon = moduleIcons[module] || __TURBOPACK__imported__module__$5b$project$5d2f$memoriza$2d$frontend$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$layout$2d$dashboard$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__LayoutDashboard$3e$__["LayoutDashboard"];
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$memoriza$2d$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(Icon, {
        size: size,
        className: className
    }, void 0, false, {
        fileName: "[project]/memoriza-frontend/components/module-icon.tsx",
        lineNumber: 39,
        columnNumber: 10
    }, this);
}
_c = ModuleIcon;
var _c;
__turbopack_context__.k.register(_c, "ModuleIcon");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/memoriza-frontend/app/admin/gestao-empresa/logs/page.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>LogsPage
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$memoriza$2d$frontend$2f$node_modules$2f$next$2f$dist$2f$build$2f$polyfills$2f$process$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = /*#__PURE__*/ __turbopack_context__.i("[project]/memoriza-frontend/node_modules/next/dist/build/polyfills/process.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$memoriza$2d$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/memoriza-frontend/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$memoriza$2d$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/memoriza-frontend/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$memoriza$2d$frontend$2f$components$2f$ui$2f$button$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/memoriza-frontend/components/ui/button.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$memoriza$2d$frontend$2f$components$2f$ui$2f$input$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/memoriza-frontend/components/ui/input.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$memoriza$2d$frontend$2f$components$2f$ui$2f$select$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/memoriza-frontend/components/ui/select.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$memoriza$2d$frontend$2f$components$2f$action$2d$type$2d$badge$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/memoriza-frontend/components/action-type-badge.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$memoriza$2d$frontend$2f$components$2f$module$2d$icon$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/memoriza-frontend/components/module-icon.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$memoriza$2d$frontend$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$x$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__X$3e$__ = __turbopack_context__.i("[project]/memoriza-frontend/node_modules/lucide-react/dist/esm/icons/x.js [app-client] (ecmascript) <export default as X>");
var __TURBOPACK__imported__module__$5b$project$5d2f$memoriza$2d$frontend$2f$lib$2f$employee$2d$mock$2d$data$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/memoriza-frontend/lib/employee-mock-data.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$memoriza$2d$frontend$2f$node_modules$2f$sonner$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/memoriza-frontend/node_modules/sonner/dist/index.mjs [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$memoriza$2d$frontend$2f$lib$2f$auth$2d$context$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/memoriza-frontend/lib/auth-context.tsx [app-client] (ecmascript)");
;
var _s = __turbopack_context__.k.signature();
"use client";
;
;
;
;
;
;
;
;
;
;
const API_BASE_URL = ("TURBOPACK compile-time value", "https://localhost:7105") ?? "https://localhost:7105";
// Mapper
const mapApiToEmployee = (api)=>({
        id: api.id,
        name: api.name,
        last_name: api.lastName,
        email: api.email,
        phone: api.phone,
        cpf: api.cpf,
        group_id: api.groupId,
        group_name: api.groupName,
        hire_date: new Date(api.hireDate),
        status: api.status,
        created_at: new Date(api.createdAt),
        updated_at: new Date(api.updatedAt)
    });
function LogsPage() {
    _s();
    const { token } = (0, __TURBOPACK__imported__module__$5b$project$5d2f$memoriza$2d$frontend$2f$lib$2f$auth$2d$context$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useAuth"])();
    const [logs, setLogs] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$memoriza$2d$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])([]);
    const [employees, setEmployees] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$memoriza$2d$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])([]);
    const [currentPage, setCurrentPage] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$memoriza$2d$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(1);
    const [filters, setFilters] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$memoriza$2d$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])({});
    const itemsPerPage = 50;
    // Carregar funcionários do backend
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$memoriza$2d$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "LogsPage.useEffect": ()=>{
            let isCancelled = false;
            const fetchEmployees = {
                "LogsPage.useEffect.fetchEmployees": async ()=>{
                    if (!token) return;
                    try {
                        const response = await fetch(`${API_BASE_URL}/api/admin/employees`, {
                            headers: {
                                Authorization: `Bearer ${token}`
                            }
                        });
                        if (!response.ok) {
                            console.error("[LogsPage] Erro ao buscar funcionários. Status:", response.status);
                            return;
                        }
                        const data = await response.json();
                        const parsed = data.map(mapApiToEmployee);
                        if (!isCancelled) {
                            setEmployees(parsed);
                        }
                    } catch (error) {
                        console.error("[LogsPage] Erro ao buscar funcionários:", error);
                    }
                }
            }["LogsPage.useEffect.fetchEmployees"];
            fetchEmployees();
            return ({
                "LogsPage.useEffect": ()=>{
                    isCancelled = true;
                }
            })["LogsPage.useEffect"];
        }
    }["LogsPage.useEffect"], [
        token
    ]);
    // Carregar logs do backend
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$memoriza$2d$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "LogsPage.useEffect": ()=>{
            let isCancelled = false;
            const fetchLogs = {
                "LogsPage.useEffect.fetchLogs": async ()=>{
                    if (!token) return;
                    try {
                        const response = await fetch(`${API_BASE_URL}/api/admin/employee-logs`, {
                            headers: {
                                Authorization: `Bearer ${token}`
                            }
                        });
                        if (!response.ok) {
                            console.error("[LogsPage] Erro ao buscar logs. Status:", response.status);
                            return;
                        }
                        const data = await response.json();
                        // Mapear do formato camelCase do backend para snake_case do frontend
                        const parsedLogs = data.map({
                            "LogsPage.useEffect.fetchLogs.parsedLogs": (log)=>({
                                    id: log.id,
                                    employee_id: log.employeeId,
                                    employee_name: log.employeeName,
                                    employee_role: log.employeeRole,
                                    action: log.action,
                                    module: log.module,
                                    description: log.description,
                                    timestamp: new Date(log.timestamp)
                                })
                        }["LogsPage.useEffect.fetchLogs.parsedLogs"]);
                        if (!isCancelled) {
                            setLogs(parsedLogs);
                        }
                    } catch (error) {
                        console.error("[LogsPage] Erro ao buscar logs:", error);
                    }
                }
            }["LogsPage.useEffect.fetchLogs"];
            fetchLogs();
            return ({
                "LogsPage.useEffect": ()=>{
                    isCancelled = true;
                }
            })["LogsPage.useEffect"];
        }
    }["LogsPage.useEffect"], [
        token
    ]);
    // Filtrar logs
    const filteredLogs = (0, __TURBOPACK__imported__module__$5b$project$5d2f$memoriza$2d$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useMemo"])({
        "LogsPage.useMemo[filteredLogs]": ()=>{
            return logs.filter({
                "LogsPage.useMemo[filteredLogs]": (log)=>{
                    // Filtro de data
                    if (filters.dateRange) {
                        const logDate = new Date(log.timestamp);
                        if (logDate < filters.dateRange.start || logDate > filters.dateRange.end) {
                            return false;
                        }
                    }
                    // Filtro de funcionário
                    if (filters.employeeId && log.employee_id !== filters.employeeId) {
                        return false;
                    }
                    // Filtro de ações
                    if (filters.actions && filters.actions.length > 0) {
                        if (!filters.actions.includes(log.action)) {
                            return false;
                        }
                    }
                    // Filtro de módulos
                    if (filters.modules && filters.modules.length > 0) {
                        if (!filters.modules.includes(log.module)) {
                            return false;
                        }
                    }
                    return true;
                }
            }["LogsPage.useMemo[filteredLogs]"]);
        }
    }["LogsPage.useMemo[filteredLogs]"], [
        logs,
        filters
    ]);
    // Estatísticas
    const statistics = (0, __TURBOPACK__imported__module__$5b$project$5d2f$memoriza$2d$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useMemo"])({
        "LogsPage.useMemo[statistics]": ()=>{
            const now = new Date();
            const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
            const weekAgo = new Date(today);
            weekAgo.setDate(weekAgo.getDate() - 7);
            const monthAgo = new Date(today);
            monthAgo.setMonth(monthAgo.getMonth() - 1);
            const accessesToday = logs.filter({
                "LogsPage.useMemo[statistics]": (log)=>new Date(log.timestamp) >= today
            }["LogsPage.useMemo[statistics]"]).length;
            const accessesThisWeek = logs.filter({
                "LogsPage.useMemo[statistics]": (log)=>new Date(log.timestamp) >= weekAgo
            }["LogsPage.useMemo[statistics]"]).length;
            const accessesThisMonth = logs.filter({
                "LogsPage.useMemo[statistics]": (log)=>new Date(log.timestamp) >= monthAgo
            }["LogsPage.useMemo[statistics]"]).length;
            // Top funcionários
            const employeeCounts = {};
            logs.forEach({
                "LogsPage.useMemo[statistics]": (log)=>{
                    employeeCounts[log.employee_name] = (employeeCounts[log.employee_name] || 0) + 1;
                }
            }["LogsPage.useMemo[statistics]"]);
            const topEmployees = Object.entries(employeeCounts).map({
                "LogsPage.useMemo[statistics].topEmployees": ([name, count])=>({
                        employee_name: name,
                        access_count: count
                    })
            }["LogsPage.useMemo[statistics].topEmployees"]).sort({
                "LogsPage.useMemo[statistics].topEmployees": (a, b)=>b.access_count - a.access_count
            }["LogsPage.useMemo[statistics].topEmployees"]).slice(0, 5);
            // Top módulos
            const moduleCounts = {};
            logs.forEach({
                "LogsPage.useMemo[statistics]": (log)=>{
                    moduleCounts[log.module] = (moduleCounts[log.module] || 0) + 1;
                }
            }["LogsPage.useMemo[statistics]"]);
            const topModules = Object.entries(moduleCounts).map({
                "LogsPage.useMemo[statistics].topModules": ([module, count])=>({
                        module: module,
                        access_count: count
                    })
            }["LogsPage.useMemo[statistics].topModules"]).sort({
                "LogsPage.useMemo[statistics].topModules": (a, b)=>b.access_count - a.access_count
            }["LogsPage.useMemo[statistics].topModules"]).slice(0, 5);
            return {
                accessesToday,
                accessesThisWeek,
                accessesThisMonth,
                topEmployees,
                topModules
            };
        }
    }["LogsPage.useMemo[statistics]"], [
        logs
    ]);
    // Paginação
    const totalPages = Math.ceil(filteredLogs.length / itemsPerPage);
    const startIndex = (currentPage - 1) * itemsPerPage;
    const paginatedLogs = filteredLogs.slice(startIndex, startIndex + itemsPerPage);
    const handleExport = ()=>{
        __TURBOPACK__imported__module__$5b$project$5d2f$memoriza$2d$frontend$2f$node_modules$2f$sonner$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["toast"].success("Exportação iniciada! O arquivo será baixado em breve.");
        console.log("Exportando logs:", filteredLogs);
    };
    const clearFilters = ()=>{
        setFilters({});
        setCurrentPage(1);
    };
    const hasActiveFilters = filters.dateRange || filters.employeeId || filters.actions && filters.actions.length > 0 || filters.modules && filters.modules.length > 0;
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$memoriza$2d$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        className: "p-8",
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$memoriza$2d$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8",
                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$memoriza$2d$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$memoriza$2d$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h1", {
                            className: "text-3xl font-light text-foreground",
                            children: "Acessos & Logs"
                        }, void 0, false, {
                            fileName: "[project]/memoriza-frontend/app/admin/gestao-empresa/logs/page.tsx",
                            lineNumber: 271,
                            columnNumber: 11
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$memoriza$2d$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                            className: "text-foreground/60",
                            children: "Monitore a atividade dos funcionários"
                        }, void 0, false, {
                            fileName: "[project]/memoriza-frontend/app/admin/gestao-empresa/logs/page.tsx",
                            lineNumber: 272,
                            columnNumber: 11
                        }, this)
                    ]
                }, void 0, true, {
                    fileName: "[project]/memoriza-frontend/app/admin/gestao-empresa/logs/page.tsx",
                    lineNumber: 270,
                    columnNumber: 9
                }, this)
            }, void 0, false, {
                fileName: "[project]/memoriza-frontend/app/admin/gestao-empresa/logs/page.tsx",
                lineNumber: 269,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$memoriza$2d$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "grid grid-cols-1 md:grid-cols-3 gap-6 mb-8",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$memoriza$2d$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "bg-card border border-border rounded-xl p-6",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$memoriza$2d$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                className: "text-sm text-foreground/60 mb-2",
                                children: "Acessos Hoje"
                            }, void 0, false, {
                                fileName: "[project]/memoriza-frontend/app/admin/gestao-empresa/logs/page.tsx",
                                lineNumber: 279,
                                columnNumber: 11
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$memoriza$2d$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                className: "text-3xl font-semibold text-foreground",
                                children: statistics.accessesToday
                            }, void 0, false, {
                                fileName: "[project]/memoriza-frontend/app/admin/gestao-empresa/logs/page.tsx",
                                lineNumber: 280,
                                columnNumber: 11
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/memoriza-frontend/app/admin/gestao-empresa/logs/page.tsx",
                        lineNumber: 278,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$memoriza$2d$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "bg-card border border-border rounded-xl p-6",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$memoriza$2d$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                className: "text-sm text-foreground/60 mb-2",
                                children: "Esta Semana"
                            }, void 0, false, {
                                fileName: "[project]/memoriza-frontend/app/admin/gestao-empresa/logs/page.tsx",
                                lineNumber: 285,
                                columnNumber: 11
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$memoriza$2d$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                className: "text-3xl font-semibold text-foreground",
                                children: statistics.accessesThisWeek
                            }, void 0, false, {
                                fileName: "[project]/memoriza-frontend/app/admin/gestao-empresa/logs/page.tsx",
                                lineNumber: 286,
                                columnNumber: 11
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/memoriza-frontend/app/admin/gestao-empresa/logs/page.tsx",
                        lineNumber: 284,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$memoriza$2d$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "bg-card border border-border rounded-xl p-6",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$memoriza$2d$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                className: "text-sm text-foreground/60 mb-2",
                                children: "Este Mês"
                            }, void 0, false, {
                                fileName: "[project]/memoriza-frontend/app/admin/gestao-empresa/logs/page.tsx",
                                lineNumber: 291,
                                columnNumber: 11
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$memoriza$2d$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                className: "text-3xl font-semibold text-foreground",
                                children: statistics.accessesThisMonth
                            }, void 0, false, {
                                fileName: "[project]/memoriza-frontend/app/admin/gestao-empresa/logs/page.tsx",
                                lineNumber: 292,
                                columnNumber: 11
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/memoriza-frontend/app/admin/gestao-empresa/logs/page.tsx",
                        lineNumber: 290,
                        columnNumber: 9
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/memoriza-frontend/app/admin/gestao-empresa/logs/page.tsx",
                lineNumber: 277,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$memoriza$2d$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$memoriza$2d$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "bg-card border border-border rounded-xl p-6",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$memoriza$2d$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h3", {
                                className: "font-medium text-foreground mb-4",
                                children: "Funcionários Mais Ativos"
                            }, void 0, false, {
                                fileName: "[project]/memoriza-frontend/app/admin/gestao-empresa/logs/page.tsx",
                                lineNumber: 302,
                                columnNumber: 11
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$memoriza$2d$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "space-y-3",
                                children: statistics.topEmployees.map((emp, idx)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$memoriza$2d$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: "flex items-center justify-between",
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$memoriza$2d$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                className: "text-sm text-foreground/80",
                                                children: emp.employee_name
                                            }, void 0, false, {
                                                fileName: "[project]/memoriza-frontend/app/admin/gestao-empresa/logs/page.tsx",
                                                lineNumber: 306,
                                                columnNumber: 17
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$memoriza$2d$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                className: "text-sm font-medium text-foreground",
                                                children: [
                                                    emp.access_count,
                                                    " acessos"
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/memoriza-frontend/app/admin/gestao-empresa/logs/page.tsx",
                                                lineNumber: 309,
                                                columnNumber: 17
                                            }, this)
                                        ]
                                    }, idx, true, {
                                        fileName: "[project]/memoriza-frontend/app/admin/gestao-empresa/logs/page.tsx",
                                        lineNumber: 305,
                                        columnNumber: 15
                                    }, this))
                            }, void 0, false, {
                                fileName: "[project]/memoriza-frontend/app/admin/gestao-empresa/logs/page.tsx",
                                lineNumber: 303,
                                columnNumber: 11
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/memoriza-frontend/app/admin/gestao-empresa/logs/page.tsx",
                        lineNumber: 301,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$memoriza$2d$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "bg-card border border-border rounded-xl p-6",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$memoriza$2d$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h3", {
                                className: "font-medium text-foreground mb-4",
                                children: "Módulos Mais Acessados"
                            }, void 0, false, {
                                fileName: "[project]/memoriza-frontend/app/admin/gestao-empresa/logs/page.tsx",
                                lineNumber: 319,
                                columnNumber: 11
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$memoriza$2d$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "space-y-3",
                                children: statistics.topModules.map((mod, idx)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$memoriza$2d$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: "flex items-center justify-between",
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$memoriza$2d$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                className: "flex items-center gap-2",
                                                children: [
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$memoriza$2d$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$memoriza$2d$frontend$2f$components$2f$module$2d$icon$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["ModuleIcon"], {
                                                        module: mod.module,
                                                        size: 14,
                                                        className: "text-foreground/60"
                                                    }, void 0, false, {
                                                        fileName: "[project]/memoriza-frontend/app/admin/gestao-empresa/logs/page.tsx",
                                                        lineNumber: 324,
                                                        columnNumber: 19
                                                    }, this),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$memoriza$2d$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                        className: "text-sm text-foreground/80",
                                                        children: __TURBOPACK__imported__module__$5b$project$5d2f$memoriza$2d$frontend$2f$lib$2f$employee$2d$mock$2d$data$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["moduleLabels"][mod.module]
                                                    }, void 0, false, {
                                                        fileName: "[project]/memoriza-frontend/app/admin/gestao-empresa/logs/page.tsx",
                                                        lineNumber: 329,
                                                        columnNumber: 19
                                                    }, this)
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/memoriza-frontend/app/admin/gestao-empresa/logs/page.tsx",
                                                lineNumber: 323,
                                                columnNumber: 17
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$memoriza$2d$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                className: "text-sm font-medium text-foreground",
                                                children: [
                                                    mod.access_count,
                                                    " acessos"
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/memoriza-frontend/app/admin/gestao-empresa/logs/page.tsx",
                                                lineNumber: 333,
                                                columnNumber: 17
                                            }, this)
                                        ]
                                    }, idx, true, {
                                        fileName: "[project]/memoriza-frontend/app/admin/gestao-empresa/logs/page.tsx",
                                        lineNumber: 322,
                                        columnNumber: 15
                                    }, this))
                            }, void 0, false, {
                                fileName: "[project]/memoriza-frontend/app/admin/gestao-empresa/logs/page.tsx",
                                lineNumber: 320,
                                columnNumber: 11
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/memoriza-frontend/app/admin/gestao-empresa/logs/page.tsx",
                        lineNumber: 318,
                        columnNumber: 9
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/memoriza-frontend/app/admin/gestao-empresa/logs/page.tsx",
                lineNumber: 299,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$memoriza$2d$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "bg-card border border-border rounded-xl p-6 mb-6",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$memoriza$2d$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "flex items-center justify-between mb-4",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$memoriza$2d$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h3", {
                                className: "font-medium text-foreground",
                                children: "Filtros"
                            }, void 0, false, {
                                fileName: "[project]/memoriza-frontend/app/admin/gestao-empresa/logs/page.tsx",
                                lineNumber: 345,
                                columnNumber: 11
                            }, this),
                            hasActiveFilters && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$memoriza$2d$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$memoriza$2d$frontend$2f$components$2f$ui$2f$button$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Button"], {
                                variant: "ghost",
                                size: "sm",
                                onClick: clearFilters,
                                className: "gap-2",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$memoriza$2d$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$memoriza$2d$frontend$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$x$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__X$3e$__["X"], {
                                        size: 14
                                    }, void 0, false, {
                                        fileName: "[project]/memoriza-frontend/app/admin/gestao-empresa/logs/page.tsx",
                                        lineNumber: 353,
                                        columnNumber: 15
                                    }, this),
                                    "Limpar Filtros"
                                ]
                            }, void 0, true, {
                                fileName: "[project]/memoriza-frontend/app/admin/gestao-empresa/logs/page.tsx",
                                lineNumber: 347,
                                columnNumber: 13
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/memoriza-frontend/app/admin/gestao-empresa/logs/page.tsx",
                        lineNumber: 344,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$memoriza$2d$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$memoriza$2d$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$memoriza$2d$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                                        className: "text-xs text-foreground/60 mb-1 block",
                                        children: "Data Início"
                                    }, void 0, false, {
                                        fileName: "[project]/memoriza-frontend/app/admin/gestao-empresa/logs/page.tsx",
                                        lineNumber: 362,
                                        columnNumber: 13
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$memoriza$2d$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$memoriza$2d$frontend$2f$components$2f$ui$2f$input$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Input"], {
                                        type: "date",
                                        value: filters.dateRange?.start.toISOString().split("T")[0] || "",
                                        onChange: (e)=>{
                                            const start = e.target.value ? new Date(e.target.value) : undefined;
                                            setFilters({
                                                ...filters,
                                                dateRange: start && filters.dateRange?.end ? {
                                                    start,
                                                    end: filters.dateRange.end
                                                } : start ? {
                                                    start,
                                                    end: new Date()
                                                } : undefined
                                            });
                                            setCurrentPage(1);
                                        }
                                    }, void 0, false, {
                                        fileName: "[project]/memoriza-frontend/app/admin/gestao-empresa/logs/page.tsx",
                                        lineNumber: 365,
                                        columnNumber: 13
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/memoriza-frontend/app/admin/gestao-empresa/logs/page.tsx",
                                lineNumber: 361,
                                columnNumber: 11
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$memoriza$2d$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$memoriza$2d$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                                        className: "text-xs text-foreground/60 mb-1 block",
                                        children: "Data Fim"
                                    }, void 0, false, {
                                        fileName: "[project]/memoriza-frontend/app/admin/gestao-empresa/logs/page.tsx",
                                        lineNumber: 386,
                                        columnNumber: 13
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$memoriza$2d$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$memoriza$2d$frontend$2f$components$2f$ui$2f$input$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Input"], {
                                        type: "date",
                                        value: filters.dateRange?.end.toISOString().split("T")[0] || "",
                                        onChange: (e)=>{
                                            const end = e.target.value ? new Date(e.target.value) : undefined;
                                            setFilters({
                                                ...filters,
                                                dateRange: end && filters.dateRange?.start ? {
                                                    start: filters.dateRange.start,
                                                    end
                                                } : end ? {
                                                    start: new Date(0),
                                                    end
                                                } : undefined
                                            });
                                            setCurrentPage(1);
                                        }
                                    }, void 0, false, {
                                        fileName: "[project]/memoriza-frontend/app/admin/gestao-empresa/logs/page.tsx",
                                        lineNumber: 389,
                                        columnNumber: 13
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/memoriza-frontend/app/admin/gestao-empresa/logs/page.tsx",
                                lineNumber: 385,
                                columnNumber: 11
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$memoriza$2d$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$memoriza$2d$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                                        className: "text-xs text-foreground/60 mb-1 block",
                                        children: "Funcionário"
                                    }, void 0, false, {
                                        fileName: "[project]/memoriza-frontend/app/admin/gestao-empresa/logs/page.tsx",
                                        lineNumber: 410,
                                        columnNumber: 13
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$memoriza$2d$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$memoriza$2d$frontend$2f$components$2f$ui$2f$select$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Select"], {
                                        value: filters.employeeId || "all",
                                        onValueChange: (value)=>{
                                            setFilters({
                                                ...filters,
                                                employeeId: value === "all" ? undefined : value
                                            });
                                            setCurrentPage(1);
                                        },
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$memoriza$2d$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$memoriza$2d$frontend$2f$components$2f$ui$2f$select$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["SelectTrigger"], {
                                                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$memoriza$2d$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$memoriza$2d$frontend$2f$components$2f$ui$2f$select$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["SelectValue"], {
                                                    placeholder: "Todos"
                                                }, void 0, false, {
                                                    fileName: "[project]/memoriza-frontend/app/admin/gestao-empresa/logs/page.tsx",
                                                    lineNumber: 424,
                                                    columnNumber: 17
                                                }, this)
                                            }, void 0, false, {
                                                fileName: "[project]/memoriza-frontend/app/admin/gestao-empresa/logs/page.tsx",
                                                lineNumber: 423,
                                                columnNumber: 15
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$memoriza$2d$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$memoriza$2d$frontend$2f$components$2f$ui$2f$select$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["SelectContent"], {
                                                children: [
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$memoriza$2d$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$memoriza$2d$frontend$2f$components$2f$ui$2f$select$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["SelectItem"], {
                                                        value: "all",
                                                        children: "Todos"
                                                    }, void 0, false, {
                                                        fileName: "[project]/memoriza-frontend/app/admin/gestao-empresa/logs/page.tsx",
                                                        lineNumber: 427,
                                                        columnNumber: 17
                                                    }, this),
                                                    employees.map((emp)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$memoriza$2d$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$memoriza$2d$frontend$2f$components$2f$ui$2f$select$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["SelectItem"], {
                                                            value: emp.id,
                                                            children: [
                                                                emp.name,
                                                                " ",
                                                                emp.last_name
                                                            ]
                                                        }, emp.id, true, {
                                                            fileName: "[project]/memoriza-frontend/app/admin/gestao-empresa/logs/page.tsx",
                                                            lineNumber: 429,
                                                            columnNumber: 19
                                                        }, this))
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/memoriza-frontend/app/admin/gestao-empresa/logs/page.tsx",
                                                lineNumber: 426,
                                                columnNumber: 15
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/memoriza-frontend/app/admin/gestao-empresa/logs/page.tsx",
                                        lineNumber: 413,
                                        columnNumber: 13
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/memoriza-frontend/app/admin/gestao-empresa/logs/page.tsx",
                                lineNumber: 409,
                                columnNumber: 11
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$memoriza$2d$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$memoriza$2d$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                                        className: "text-xs text-foreground/60 mb-1 block",
                                        children: "Tipo de Ação"
                                    }, void 0, false, {
                                        fileName: "[project]/memoriza-frontend/app/admin/gestao-empresa/logs/page.tsx",
                                        lineNumber: 439,
                                        columnNumber: 13
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$memoriza$2d$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$memoriza$2d$frontend$2f$components$2f$ui$2f$select$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Select"], {
                                        value: filters.actions?.[0] || "all",
                                        onValueChange: (value)=>{
                                            setFilters({
                                                ...filters,
                                                actions: value === "all" ? undefined : [
                                                    value
                                                ]
                                            });
                                            setCurrentPage(1);
                                        },
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$memoriza$2d$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$memoriza$2d$frontend$2f$components$2f$ui$2f$select$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["SelectTrigger"], {
                                                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$memoriza$2d$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$memoriza$2d$frontend$2f$components$2f$ui$2f$select$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["SelectValue"], {
                                                    placeholder: "Todas"
                                                }, void 0, false, {
                                                    fileName: "[project]/memoriza-frontend/app/admin/gestao-empresa/logs/page.tsx",
                                                    lineNumber: 454,
                                                    columnNumber: 17
                                                }, this)
                                            }, void 0, false, {
                                                fileName: "[project]/memoriza-frontend/app/admin/gestao-empresa/logs/page.tsx",
                                                lineNumber: 453,
                                                columnNumber: 15
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$memoriza$2d$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$memoriza$2d$frontend$2f$components$2f$ui$2f$select$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["SelectContent"], {
                                                children: [
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$memoriza$2d$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$memoriza$2d$frontend$2f$components$2f$ui$2f$select$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["SelectItem"], {
                                                        value: "all",
                                                        children: "Todas"
                                                    }, void 0, false, {
                                                        fileName: "[project]/memoriza-frontend/app/admin/gestao-empresa/logs/page.tsx",
                                                        lineNumber: 457,
                                                        columnNumber: 17
                                                    }, this),
                                                    Object.entries(__TURBOPACK__imported__module__$5b$project$5d2f$memoriza$2d$frontend$2f$lib$2f$employee$2d$mock$2d$data$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["actionLabels"]).map(([key, label])=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$memoriza$2d$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$memoriza$2d$frontend$2f$components$2f$ui$2f$select$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["SelectItem"], {
                                                            value: key,
                                                            children: label
                                                        }, key, false, {
                                                            fileName: "[project]/memoriza-frontend/app/admin/gestao-empresa/logs/page.tsx",
                                                            lineNumber: 459,
                                                            columnNumber: 19
                                                        }, this))
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/memoriza-frontend/app/admin/gestao-empresa/logs/page.tsx",
                                                lineNumber: 456,
                                                columnNumber: 15
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/memoriza-frontend/app/admin/gestao-empresa/logs/page.tsx",
                                        lineNumber: 442,
                                        columnNumber: 13
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/memoriza-frontend/app/admin/gestao-empresa/logs/page.tsx",
                                lineNumber: 438,
                                columnNumber: 11
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/memoriza-frontend/app/admin/gestao-empresa/logs/page.tsx",
                        lineNumber: 359,
                        columnNumber: 9
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/memoriza-frontend/app/admin/gestao-empresa/logs/page.tsx",
                lineNumber: 343,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$memoriza$2d$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "bg-card border border-border rounded-xl overflow-hidden",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$memoriza$2d$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "overflow-x-auto",
                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$memoriza$2d$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("table", {
                            className: "w-full",
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$memoriza$2d$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("thead", {
                                    className: "bg-muted/30 border-b border-border",
                                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$memoriza$2d$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("tr", {
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$memoriza$2d$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("th", {
                                                className: "px-6 py-4 text-left text-sm font-medium text-foreground",
                                                children: "Data/Hora"
                                            }, void 0, false, {
                                                fileName: "[project]/memoriza-frontend/app/admin/gestao-empresa/logs/page.tsx",
                                                lineNumber: 475,
                                                columnNumber: 17
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$memoriza$2d$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("th", {
                                                className: "px-6 py-4 text-left text-sm font-medium text-foreground",
                                                children: "Funcionário"
                                            }, void 0, false, {
                                                fileName: "[project]/memoriza-frontend/app/admin/gestao-empresa/logs/page.tsx",
                                                lineNumber: 478,
                                                columnNumber: 17
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$memoriza$2d$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("th", {
                                                className: "px-6 py-4 text-left text-sm font-medium text-foreground",
                                                children: "Ação"
                                            }, void 0, false, {
                                                fileName: "[project]/memoriza-frontend/app/admin/gestao-empresa/logs/page.tsx",
                                                lineNumber: 481,
                                                columnNumber: 17
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$memoriza$2d$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("th", {
                                                className: "px-6 py-4 text-left text-sm font-medium text-foreground",
                                                children: "Módulo"
                                            }, void 0, false, {
                                                fileName: "[project]/memoriza-frontend/app/admin/gestao-empresa/logs/page.tsx",
                                                lineNumber: 484,
                                                columnNumber: 17
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$memoriza$2d$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("th", {
                                                className: "px-6 py-4 text-left text-sm font-medium text-foreground",
                                                children: "Descrição"
                                            }, void 0, false, {
                                                fileName: "[project]/memoriza-frontend/app/admin/gestao-empresa/logs/page.tsx",
                                                lineNumber: 487,
                                                columnNumber: 17
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/memoriza-frontend/app/admin/gestao-empresa/logs/page.tsx",
                                        lineNumber: 474,
                                        columnNumber: 15
                                    }, this)
                                }, void 0, false, {
                                    fileName: "[project]/memoriza-frontend/app/admin/gestao-empresa/logs/page.tsx",
                                    lineNumber: 473,
                                    columnNumber: 13
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$memoriza$2d$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("tbody", {
                                    className: "divide-y divide-border",
                                    children: paginatedLogs.length === 0 ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$memoriza$2d$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("tr", {
                                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$memoriza$2d$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("td", {
                                            colSpan: 5,
                                            className: "px-6 py-12 text-center",
                                            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$memoriza$2d$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                className: "text-foreground/60",
                                                children: "Nenhum log encontrado"
                                            }, void 0, false, {
                                                fileName: "[project]/memoriza-frontend/app/admin/gestao-empresa/logs/page.tsx",
                                                lineNumber: 496,
                                                columnNumber: 21
                                            }, this)
                                        }, void 0, false, {
                                            fileName: "[project]/memoriza-frontend/app/admin/gestao-empresa/logs/page.tsx",
                                            lineNumber: 495,
                                            columnNumber: 19
                                        }, this)
                                    }, void 0, false, {
                                        fileName: "[project]/memoriza-frontend/app/admin/gestao-empresa/logs/page.tsx",
                                        lineNumber: 494,
                                        columnNumber: 17
                                    }, this) : paginatedLogs.map((log)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$memoriza$2d$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("tr", {
                                            className: "hover:bg-muted/20 transition-colors",
                                            children: [
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$memoriza$2d$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("td", {
                                                    className: "px-6 py-4 text-sm text-foreground/80",
                                                    children: new Date(log.timestamp).toLocaleString("pt-BR")
                                                }, void 0, false, {
                                                    fileName: "[project]/memoriza-frontend/app/admin/gestao-empresa/logs/page.tsx",
                                                    lineNumber: 505,
                                                    columnNumber: 21
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$memoriza$2d$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("td", {
                                                    className: "px-6 py-4",
                                                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$memoriza$2d$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                        children: [
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$memoriza$2d$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                                className: "text-sm font-medium text-foreground",
                                                                children: log.employee_name
                                                            }, void 0, false, {
                                                                fileName: "[project]/memoriza-frontend/app/admin/gestao-empresa/logs/page.tsx",
                                                                lineNumber: 510,
                                                                columnNumber: 25
                                                            }, this),
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$memoriza$2d$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                                className: "text-xs text-foreground/60",
                                                                children: log.employee_role
                                                            }, void 0, false, {
                                                                fileName: "[project]/memoriza-frontend/app/admin/gestao-empresa/logs/page.tsx",
                                                                lineNumber: 513,
                                                                columnNumber: 25
                                                            }, this)
                                                        ]
                                                    }, void 0, true, {
                                                        fileName: "[project]/memoriza-frontend/app/admin/gestao-empresa/logs/page.tsx",
                                                        lineNumber: 509,
                                                        columnNumber: 23
                                                    }, this)
                                                }, void 0, false, {
                                                    fileName: "[project]/memoriza-frontend/app/admin/gestao-empresa/logs/page.tsx",
                                                    lineNumber: 508,
                                                    columnNumber: 21
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$memoriza$2d$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("td", {
                                                    className: "px-6 py-4",
                                                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$memoriza$2d$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$memoriza$2d$frontend$2f$components$2f$action$2d$type$2d$badge$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["ActionTypeBadge"], {
                                                        action: log.action
                                                    }, void 0, false, {
                                                        fileName: "[project]/memoriza-frontend/app/admin/gestao-empresa/logs/page.tsx",
                                                        lineNumber: 519,
                                                        columnNumber: 23
                                                    }, this)
                                                }, void 0, false, {
                                                    fileName: "[project]/memoriza-frontend/app/admin/gestao-empresa/logs/page.tsx",
                                                    lineNumber: 518,
                                                    columnNumber: 21
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$memoriza$2d$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("td", {
                                                    className: "px-6 py-4",
                                                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$memoriza$2d$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                        className: "flex items-center gap-2",
                                                        children: [
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$memoriza$2d$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$memoriza$2d$frontend$2f$components$2f$module$2d$icon$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["ModuleIcon"], {
                                                                module: log.module,
                                                                size: 14,
                                                                className: "text-foreground/60"
                                                            }, void 0, false, {
                                                                fileName: "[project]/memoriza-frontend/app/admin/gestao-empresa/logs/page.tsx",
                                                                lineNumber: 523,
                                                                columnNumber: 25
                                                            }, this),
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$memoriza$2d$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                                className: "text-sm text-foreground/80",
                                                                children: __TURBOPACK__imported__module__$5b$project$5d2f$memoriza$2d$frontend$2f$lib$2f$employee$2d$mock$2d$data$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["moduleLabels"][log.module]
                                                            }, void 0, false, {
                                                                fileName: "[project]/memoriza-frontend/app/admin/gestao-empresa/logs/page.tsx",
                                                                lineNumber: 528,
                                                                columnNumber: 25
                                                            }, this)
                                                        ]
                                                    }, void 0, true, {
                                                        fileName: "[project]/memoriza-frontend/app/admin/gestao-empresa/logs/page.tsx",
                                                        lineNumber: 522,
                                                        columnNumber: 23
                                                    }, this)
                                                }, void 0, false, {
                                                    fileName: "[project]/memoriza-frontend/app/admin/gestao-empresa/logs/page.tsx",
                                                    lineNumber: 521,
                                                    columnNumber: 21
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$memoriza$2d$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("td", {
                                                    className: "px-6 py-4 text-sm text-foreground/80 max-w-md truncate",
                                                    children: log.description
                                                }, void 0, false, {
                                                    fileName: "[project]/memoriza-frontend/app/admin/gestao-empresa/logs/page.tsx",
                                                    lineNumber: 533,
                                                    columnNumber: 21
                                                }, this)
                                            ]
                                        }, log.id, true, {
                                            fileName: "[project]/memoriza-frontend/app/admin/gestao-empresa/logs/page.tsx",
                                            lineNumber: 501,
                                            columnNumber: 19
                                        }, this))
                                }, void 0, false, {
                                    fileName: "[project]/memoriza-frontend/app/admin/gestao-empresa/logs/page.tsx",
                                    lineNumber: 492,
                                    columnNumber: 13
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/memoriza-frontend/app/admin/gestao-empresa/logs/page.tsx",
                            lineNumber: 472,
                            columnNumber: 11
                        }, this)
                    }, void 0, false, {
                        fileName: "[project]/memoriza-frontend/app/admin/gestao-empresa/logs/page.tsx",
                        lineNumber: 471,
                        columnNumber: 9
                    }, this),
                    totalPages > 1 && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$memoriza$2d$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "px-6 py-4 border-t border-border flex items-center justify-between",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$memoriza$2d$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                className: "text-sm text-foreground/60",
                                children: [
                                    "Mostrando ",
                                    startIndex + 1,
                                    " a",
                                    " ",
                                    Math.min(startIndex + itemsPerPage, filteredLogs.length),
                                    " de",
                                    " ",
                                    filteredLogs.length,
                                    " logs"
                                ]
                            }, void 0, true, {
                                fileName: "[project]/memoriza-frontend/app/admin/gestao-empresa/logs/page.tsx",
                                lineNumber: 546,
                                columnNumber: 13
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$memoriza$2d$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "flex gap-2",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$memoriza$2d$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$memoriza$2d$frontend$2f$components$2f$ui$2f$button$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Button"], {
                                        variant: "outline",
                                        size: "sm",
                                        onClick: ()=>setCurrentPage((p)=>Math.max(1, p - 1)),
                                        disabled: currentPage === 1,
                                        children: "Anterior"
                                    }, void 0, false, {
                                        fileName: "[project]/memoriza-frontend/app/admin/gestao-empresa/logs/page.tsx",
                                        lineNumber: 552,
                                        columnNumber: 15
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$memoriza$2d$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                        className: "px-3 py-1 text-sm text-foreground/60",
                                        children: [
                                            "Página ",
                                            currentPage,
                                            " de ",
                                            totalPages
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/memoriza-frontend/app/admin/gestao-empresa/logs/page.tsx",
                                        lineNumber: 562,
                                        columnNumber: 15
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$memoriza$2d$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$memoriza$2d$frontend$2f$components$2f$ui$2f$button$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Button"], {
                                        variant: "outline",
                                        size: "sm",
                                        onClick: ()=>setCurrentPage((p)=>Math.min(totalPages, p + 1)),
                                        disabled: currentPage === totalPages,
                                        children: "Próxima"
                                    }, void 0, false, {
                                        fileName: "[project]/memoriza-frontend/app/admin/gestao-empresa/logs/page.tsx",
                                        lineNumber: 565,
                                        columnNumber: 15
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/memoriza-frontend/app/admin/gestao-empresa/logs/page.tsx",
                                lineNumber: 551,
                                columnNumber: 13
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/memoriza-frontend/app/admin/gestao-empresa/logs/page.tsx",
                        lineNumber: 545,
                        columnNumber: 11
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/memoriza-frontend/app/admin/gestao-empresa/logs/page.tsx",
                lineNumber: 470,
                columnNumber: 7
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/memoriza-frontend/app/admin/gestao-empresa/logs/page.tsx",
        lineNumber: 267,
        columnNumber: 5
    }, this);
}
_s(LogsPage, "C9sTPInd4i2VS1MKfx93c5rSPZw=", false, function() {
    return [
        __TURBOPACK__imported__module__$5b$project$5d2f$memoriza$2d$frontend$2f$lib$2f$auth$2d$context$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useAuth"]
    ];
});
_c = LogsPage;
var _c;
__turbopack_context__.k.register(_c, "LogsPage");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
]);

//# sourceMappingURL=memoriza-frontend_6b49748d._.js.map