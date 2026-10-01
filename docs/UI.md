# Pharmacy Management System UI and Frontend Design

**Status:** Proposed  
**Version:** 0.1  
**Date:** 2026-10-01  
**Related documents:** [PRD](PRD.md) · [Architecture](architecture.md) · [Database design](database-design.md) · [Security](security.md)

> This document defines the proposed user experience and frontend conventions for the initial release. It is a design specification, not an implemented interface. Prescription and regulated-medicine workflows remain subject to jurisdictional and pharmacy-policy review.

## 1. Product UI Principles

- **Operational, not promotional:** Open directly into the signed-in pharmacy workspace. No marketing landing page or decorative hero.
- **Fast and scannable:** Prioritize medicine lookup, stock status, expiry, transaction totals, and actionable exceptions.
- **Predictable:** Use consistent page structure, button placement, terminology, form behavior, and table controls across modules.
- **Safe for consequential work:** Make sale, refund, stock adjustment, prescription review, and permission changes explicit and auditable.
- **Role-aware:** Present relevant tools for a user's role, while relying on backend authorization for actual access enforcement.
- **Accessible and responsive:** Design for keyboard use and supported desktop, tablet, and phone sizes; avoid hiding essential workflows on small screens.

## 2. Frontend Stack and Boundaries

- **Framework:** React with TypeScript, built using Vite.
- **Styling:** Tailwind CSS using the design tokens in this document. Prefer consistent reusable components over page-specific styling.
- **Routing:** React Router (or another single agreed client router) with authenticated route handling and a Vercel SPA fallback for deep links.
- **Server state:** TanStack Query is recommended for Supabase reads/RPCs, loading/error states, caching, and invalidation.
- **Forms:** React Hook Form and Zod are recommended for accessible form state and client-side shape validation. Database constraints and trusted operations remain authoritative.
- **Icons:** Use Lucide icons through the React package. Pair icons with labels for important or unfamiliar actions; icon-only buttons need accessible names and tooltips.
- **Data access:** Keep Supabase access in a shared, typed data-access layer organized by feature. Generate or maintain database types from migrations. Avoid embedding ad-hoc Supabase queries throughout visual components.
- **State boundaries:** Keep server data in the query layer, form state in forms, and short-lived view state (open dialog, selected tab, unsaved cart) local to the relevant feature. Add a global client-state library only if a demonstrated cross-feature need emerges.
- **Authorization:** Use route and component checks to guide the interface, but never treat them as security. Supabase RLS and trusted database functions enforce permissions (see [Security](security.md)).

## 3. Visual Direction

### Overall look

Use a calm, precise operations interface: light neutral surfaces, clear dark text, restrained green for primary actions, and distinct semantic colors for warnings and errors. Avoid a clinical cliché, decorative gradients, dashboard card walls, and oversized typography. Use borders and alignment to organize data; reserve contained panels/cards for discrete tools, dialogs, and repeated compact records.

### Typography

- Use **IBM Plex Sans** as the recommended interface typeface, with a resilient sans-serif fallback. Confirm font licensing and self-host or load it through the approved asset strategy.
- Use tabular numerals for prices, quantities, dates, and report totals where supported.
- Keep headings compact and consistent: page title, section heading, then field/table labels. Avoid display-scale text in operational views.
- Do not rely on color alone to distinguish states; pair semantic color with text or an icon and accessible label.

### Initial design tokens

These are starting values. Verify text and focus contrast in implementation and adjust only while preserving accessible contrast.

| Token | Value | Use |
| --- | --- | --- |
| `color.canvas` | `#F5F7F5` | App background. |
| `color.surface` | `#FFFFFF` | Tables, menus, forms, dialogs. |
| `color.text` | `#202923` | Primary text. |
| `color.text-muted` | `#58645D` | Secondary text and metadata. |
| `color.border` | `#D9E1DB` | Dividers, input borders, table separators. |
| `color.primary` | `#176B52` | Primary actions and selected navigation. |
| `color.primary-hover` | `#125641` | Hover/pressed primary action. |
| `color.info` | `#1D5C80` | Informational status and links where appropriate. |
| `color.warning` | `#8A4B08` | Low stock and nearing-expiry emphasis, paired with text/icon. |
| `color.danger` | `#B42318` | Expired, destructive, failed, or blocked states. |
| `color.success` | `#176B52` | Completed/available state, paired with a label. |
| `color.focus` | `#125D9C` | Visible keyboard focus ring. |

Use spacing increments based on 4px, with common controls around 36-44px high. Keep radii restrained (4-8px); use larger radii only where a platform convention makes the component easier to understand. Avoid using color as the only status signal.

## 4. Application Shell and Navigation

### Desktop

- Use a persistent left navigation rail/sidebar with clear text labels and Lucide icons. Keep it compact and allow collapsing only if the content area benefits.
- Use a slim top bar for current pharmacy/location, global medicine search or quick access, notifications/tasks if implemented, and user/session menu.
- Show page title, short contextual actions, and breadcrumbs for nested records where useful.
- Keep main content aligned to a readable maximum width for forms and detail views; allow inventory and report tables to use available width.

### Tablet and mobile

- Replace the persistent sidebar with a labeled menu/drawer. Keep the current page and critical context visible after opening it.
- Do not force a many-item bottom navigation bar. Use a small set of high-frequency shortcuts only if usability testing supports it.
- Stack forms and panels vertically. Preserve all table data via responsive row layouts or deliberate horizontal scrolling with pinned identifiers; never silently omit important columns.
- Keep touch targets at least 44x44 CSS px where practical. Make scanner/search input and sale/cart actions usable on touch devices.
- Support narrow screens without horizontal page overflow. Tables may scroll within their own region when necessary.

### Primary navigation

1. **Overview**
2. **Point of Sale**
3. **Medicines**
4. **Inventory**
5. **Purchases**
6. **Suppliers**
7. **Sales**
8. **Customers**
9. **Prescriptions** (only if confirmed and authorized)
10. **Reports**
11. **Administration** (permission-gated)

Navigation items are role-aware. A direct URL to a restricted page must show a clear access-denied state or safe redirect, not expose protected data.

## 5. Page and Route Inventory

| Page | Main purpose and content | Key actions |
| --- | --- | --- |
| Sign in / recovery | Authenticate staff; provide account recovery and clear failure feedback. | Sign in, recover account. |
| Overview | Operational snapshot: low stock, near-expiry batches, today's sales/purchases, and tasks allowed for the user. Avoid charts that do not support a decision. | Open the relevant filtered list/report. |
| Point of Sale | Search/scan medicines, add quantities, review cart, customer/prescription association when required, payment, and invoice result. | Add/remove line, adjust quantity, complete sale, hold/cancel if supported, print/download invoice. |
| Medicine list | Searchable catalog table with status, SKU/barcode, strength/form, price, and stock summary. | Add, edit, view, deactivate, filter/export if permitted. |
| Medicine detail/form | Complete medicine identity, category, unit, pricing/tax settings, active status, and relevant history. | Save, deactivate, review stock/transactions. |
| Inventory | Batch-aware quantities, supplier, batch/lot, expiry, available/on-hand values, low-stock and expiry filters. | View batch, receive stock, count/adjust with reason, export permitted report. |
| Stock count/adjustment | Record expected/count quantities, difference, reason, and required approval. | Save draft, submit/confirm if permitted. Show exact stock impact before confirmation. |
| Purchases | Purchase list with supplier, reference, date, status, total, receipt and payment status. | Create, view, edit draft, receive, record payment, print/export. |
| Purchase detail/receive | Compare ordered and received lines; capture batch, expiry, cost, and partial receipt. | Save draft, confirm receipt after impact review. |
| Suppliers | Searchable supplier list and supplier detail with purchase history. | Add, edit, deactivate, view purchases. |
| Sales | Searchable completed/draft sale history, totals, cashier, payment status, and invoice reference. | View/reprint, start return/void subject to permissions. |
| Sale detail/return | Original immutable sale, payment records, line/batch detail, and return/refund workflow. | Return eligible quantity, record reason, confirm refund/reversal. |
| Customers | Minimal customer directory and relevant transaction history, restricted by policy. | Add, edit, deactivate, view authorized history. |
| Prescriptions | Prescription reference and review/dispense status only if required. Display sensitive fields only to authorized roles. | Review, associate with sale, record required status. No diagnosis or clinical recommendation. |
| Reports | Stock, low-stock, expiry, sales, and purchase reports with date range, filters, totals, and permitted exports. | Filter, sort, paginate, export/print. |
| Administration | Users, roles, pharmacy settings, invoice/tax configuration, audit history. | Manage settings/users according to assigned permission. |
| Access denied / not found | Explain that access is unavailable or the record does not exist without leaking protected details. | Return to an allowed page or request access. |

The route naming and exact page split can be finalized during implementation. Customer, prescription, tax, and return content depends on approved local policy.

## 6. Key Workflow Patterns

### Point of Sale

- Optimize the primary loop for fast keyboard/scanner use: focus search, find item, select, set quantity, review, pay, complete.
- Keep medicine identity, strength/form, unit price, quantity, line total, and availability visible in results and cart.
- Show a persistent, clearly labeled cart subtotal, discount, tax, and total. Never present client-calculated figures as final until the trusted transaction succeeds.
- Show stock/expiry or prescription restrictions inline before completion, with a clear reason and next permitted action.
- Make the customer optional for walk-in sales unless pharmacy configuration requires otherwise.
- Disable duplicate completion while a request is in flight and use idempotent backend behavior. On failure, retain the unsent cart and explain whether the transaction was completed or not.
- On success, show the invoice number, payment result, and print/download actions. Do not clear the cart before server confirmation.

### Tables, search, and filtering

- Use server-side pagination, sorting, and filtering for large lists. Keep filter state in the URL when it helps users share, reload, or return to a filtered view.
- Provide a prominent search field with an explicit label and optional barcode scanner support. Debounce text search; do not debounce scanner-entered values if it makes checkout unreliable.
- Keep key identity columns visible. Use consistent date, quantity, currency, and status formatting.
- Status chips use concise text and semantics; use warning/danger colors sparingly and pair them with explicit labels.
- Empty results, no data yet, loading, and error states must be distinct and offer relevant next actions.

### Forms and destructive actions

- Group fields by task and order them to match staff workflow. Mark required fields clearly and state units, accepted formats, and tax/currency assumptions near the input.
- Validate on submit and at appropriate field boundaries; preserve user-entered values after validation or network errors.
- Use inline field messages linked to fields and a form-level summary for submission errors.
- Require a reason for stock adjustments, refunds, voids, and other configured high-impact actions.
- Confirmation dialogs must state the record, consequences, stock/financial effect, and whether the operation is reversible. Destructive actions require explicit confirmation; do not rely on color alone.
- Drafts may be edited. Completed transactions are read-only; corrections use an authorized reversal/return workflow.

## 7. Shared Component Inventory

- `AppShell`, `Sidebar/NavigationDrawer`, `TopBar`, `PageHeader`, `Breadcrumbs`.
- `SearchField`, `FilterBar`, `DateRangePicker`, `DataTable`, `Pagination`, `SortableHeader`.
- `StatusBadge`, `StockIndicator`, `ExpiryIndicator`, `CurrencyValue`, `QuantityInput`.
- `FormField`, `Select`, `Combobox`, `DateInput`, `FieldError`, `FormErrorSummary`.
- `Dialog`, `ConfirmDialog`, `Toast/InlineAlert`, `LoadingState`, `EmptyState`, `ErrorState`.
- POS-specific `MedicineSearchResults`, `Cart`, `CartLine`, `TotalsPanel`, `PaymentMethodSelector`, `InvoiceActions`.
- Inventory-specific `BatchTable`, `StockAdjustmentForm`, `ExpiryWarning`.

Components must have one clear purpose, consistent keyboard behavior, and appropriate labels. Avoid nesting cards or framing every section; use unframed page sections and tables by default.

## 8. Loading, Error, and Status States

Every data-driven page and action must define the following states:

- **Initial/loading:** Stable layout with a progress indicator or skeleton; prevent accidental duplicate actions.
- **Empty:** Explain what is absent and provide an allowed action such as add medicine or create first purchase.
- **No matches:** Preserve filters and offer a clear way to clear them.
- **Validation failure:** Identify the invalid field and how to fix it without clearing entered data.
- **Authorization failure:** Show a safe access-denied state without leaking whether restricted records exist.
- **Network/server failure:** Preserve recoverable input, distinguish retryable failures, and avoid claiming a transaction succeeded until confirmed.
- **Success:** Confirm the saved/committed action and show an appropriate next step or reference number.
- **Critical stock/expiry restriction:** Explain the specific item/batch and the blocked reason; never silently substitute an ineligible batch.

Use confirmations for completed writes and inline feedback for field-level problems. Toasts must not be the only record of important financial or stock outcomes.

## 9. Accessibility and Localization

- Target WCAG 2.1 AA for core workflows: keyboard navigation, visible focus, semantic labels, contrast, screen-reader announcements, and understandable error messages.
- Ensure dialogs manage focus, can be dismissed appropriately, and return focus to their trigger. Do not trap users in non-modal overlays.
- Use native semantic headings, buttons, labels, tables, and landmarks. Icon-only controls need accessible names; status updates should be announced without excessive repetition.
- Do not communicate stock, expiry, payment, or validation state through color alone.
- Support configured locale, currency, number precision, date format, pharmacy timezone, and tax labels. Keep stored values canonical and format for display.
- Allow zoom and text enlargement without clipping controls or losing access to critical actions. Respect reduced-motion preferences; motion is not required for operational feedback.

## 10. Frontend Security and Privacy Rules

- Treat browser state as untrusted. Never put the Supabase service-role key, database credentials, or payment secrets in `VITE_*` variables or client bundles.
- The browser may use only the Supabase public/anon key with RLS and grants correctly configured. Critical sale, receipt, return, permission, and stock operations use trusted database functions/RPCs.
- Do not place prescription/customer data in URLs, analytics, console output, toast messages, or error-report payloads.
- Avoid caching sensitive records longer than needed. Clear user-scoped query caches and local state on sign-out or account switch.
- Guard exports and invoice/customer screens using server-enforced permissions. A hidden export button is not authorization.
- Use private document access only if attachment workflows are approved; do not expose permanent public URLs.

## 11. Performance and Reliability

- Keep medicine lookup responsive with indexed server-side search, limited result sets, and barcode/SKU matching.
- Load large reports and histories incrementally; avoid fetching entire inventory or customer tables into the browser.
- Use route-level code splitting for less frequently used modules if it improves initial load without complicating navigation.
- Provide clear retry behavior and preserve form/cart state across recoverable network failures.
- Use query invalidation after committed changes so stock, totals, and reports refresh from authoritative server state.
- Do not implement offline sales unless a separate design addresses conflict resolution, duplicate transactions, stock consistency, and secure local storage.

## 12. UI Acceptance Criteria

- A staff member can navigate to their permitted workflows without seeing irrelevant role-restricted actions.
- A cashier can find a medicine by name or barcode, understand availability/expiry restrictions, complete payment, and receive a confirmed invoice result using keyboard or touch input.
- An inventory user can identify soon-to-expire and low-stock batches, record an adjustment with a reason, and see the confirmed result.
- A purchaser can record a partial receipt with batch and expiry information without confusing ordered and received quantities.
- A completed sale or receipt cannot be accidentally submitted twice by repeated clicks or network retries.
- Forms preserve entered data after validation and recoverable server errors.
- Core workflows are usable at supported desktop, tablet, and phone widths without clipped controls or inaccessible hidden columns.
- Core workflows can be completed with keyboard only and communicate errors/statuses to assistive technology.
- Restricted data and actions remain unavailable through direct API calls even if a user bypasses the frontend.

## 13. Decisions to Confirm

1. What desktop, tablet, and phone devices, browsers, scanners, and receipt printers are in the supported environment?
2. Which roles can view customer and prescription details, and do pharmacy policies require approval steps?
3. Which locale, language, currency, tax rules, date formats, and invoice/receipt formats apply?
4. Are prescription records or attachments needed in the initial release?
5. Are stock holds, suspended carts, split tender, credit sales, or integrated payment terminals required?
6. Which reports and exports are available to each role, and may users export customer-linked data?
7. Should the default overview prioritize daily sales, low stock, expiring stock, pending receipts, or role-specific tasks?

Until these decisions are confirmed, use the conservative defaults in this document and do not expose optional sensitive workflows.
