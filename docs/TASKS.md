# Pharmacy Management System — Tasks

**Status:** Not started  
**Related documents:** [PRD](PRD.md) · [Architecture](architecture.md) · [Database design](database-design.md) · [Security](security.md) · [UI](UI.md)

Tasks are split into reviewable deliverables. Complete each task with its tests and acceptance notes before marking it done. Do not use real customer, prescription, payment, or production inventory data in development or preview environments.

## Before Implementation — Confirm Decisions

- [ ] **DEC-01** Confirm launch country/region and applicable pharmacy, privacy, prescription, tax, invoice, and data-retention rules.
- [ ] **DEC-02** Confirm single location versus multi-branch support and choose the `pharmacy_id`/`location_id` data boundary.
- [ ] **DEC-03** Approve staff roles, permissions, account provisioning, prescription access, and any second-approval requirements.
- [ ] **DEC-04** Confirm supported browsers/devices, barcode scanners, receipt printers, currency, locale, and timezone.
- [ ] **DEC-05** Confirm MVP payment methods, refunds, purchase receiving, stock adjustment, and batch/expiry policies.
- [ ] **DEC-06** Confirm hosting/data regions, Supabase and Vercel plans, backups, restore owner, RPO, and RTO.

## Phase 1 — Project and Database Setup

### Project foundation

- [x] **SET-01** Create the Vite React TypeScript project and confirm the production build runs.
- [ ] **SET-02** Add the agreed package scripts for development, build, lint, typecheck, unit tests, and end-to-end tests.
- [ ] **SET-03** Add Tailwind CSS and verify the initial design tokens from `UI.md` are available.
- [ ] **SET-04** Add the selected router and configure Vercel fallback for nested application routes.
- [ ] **SET-05** Set up formatting, linting, TypeScript strictness, and a basic CI check.
- [ ] **SET-06** Create the shared application shell, responsive navigation, page header, loading, empty, and error states.
- [x] **SET-07** Add the Supabase client using only public browser configuration; verify no privileged key is bundled.
- [x] **SET-08** Add `.env.example` with variable names and safe placeholders; ensure actual `.env` files are ignored by version control.
- [ ] **SET-09** Create separate development, staging, and production Supabase/Vercel environment configuration.

### Database foundation

- [ ] **DB-01** Resolve the schema decisions in `database-design.md` that block implementation, including tenancy, money/quantity formats, and jurisdiction-specific fields.
- [ ] **DB-02** Set up local/development Supabase and a version-controlled migration workflow.
- [ ] **DB-03** Create the pharmacy and optional location tables with tenant-aware keys and constraints.
- [ ] **DB-04** Create membership and role tables linked to Supabase Auth; prevent self-assigned privilege changes.
- [ ] **DB-05** Create medicine categories, medicines, suppliers, and minimal customer tables.
- [ ] **DB-06** Create purchase, purchase-line, receipt, and receipt-line tables.
- [ ] **DB-07** Create inventory batch, stock movement, and stock adjustment tables.
- [ ] **DB-08** Create sales, sale-line, batch-allocation, payment, return, and refund tables.
- [ ] **DB-09** Add prescription tables only after required fields, retention, and access policy are approved.
- [ ] **DB-10** Add audit-event storage and decide which sensitive values must not be copied into audit payloads.
- [ ] **DB-11** Add database constraints, indexes, immutable transaction references, and idempotency keys.
- [ ] **DB-12** Enable RLS and configure least-privilege grants for every client-exposed table, view, and function.
- [ ] **DB-13** Add automated database tests for tenant isolation, role permissions, constraints, and denied access.
- [ ] **DB-14** Generate or maintain frontend database types from the versioned schema.

## Phase 2 — Authentication and Access

- [ ] **AUTH-01** Configure Supabase Auth providers and approved account-recovery behavior.
- [ ] **AUTH-02** Build the sign-in page with validation, loading, and failure states.
- [ ] **AUTH-03** Implement session restoration and secure sign-out behavior.
- [ ] **AUTH-04** On sign-out or account switch, clear user-scoped query caches and sensitive local UI state.
- [ ] **AUTH-05** Create the initial administrator through a controlled bootstrap/invitation process.
- [ ] **AUTH-06** Implement administrator-managed staff invitations and membership activation/deactivation.
- [ ] **AUTH-07** Implement role assignment and permission checks against trusted membership records.
- [ ] **AUTH-08** Add authenticated route handling and safe access-denied/not-found screens.
- [ ] **AUTH-09** Test direct Supabase API/RPC requests for allowed and denied actions across every role.
- [ ] **AUTH-10** Verify deactivated memberships lose access and privileged keys are absent from browser assets.

> This is a staff-only pharmacy system. Do not add unrestricted public self-registration unless a confirmed product requirement changes the access model.

## Phase 3 — Dashboard and Inventory

### Catalog

- [ ] **INV-01** Build the medicine list with server-side search, sorting, pagination, and active-status filtering.
- [ ] **INV-02** Build the add-medicine form with required-field and duplicate-identifier validation.
- [ ] **INV-03** Build medicine detail and edit forms, preserving historical transaction snapshots.
- [ ] **INV-04** Implement medicine deactivation; prevent hard deletion when referenced by history.
- [ ] **INV-05** Add barcode/SKU lookup and test with the selected scanner or keyboard-wedge behavior.

### Inventory and dashboard

- [ ] **INV-06** Build batch inventory list showing medicine, batch, expiry, supplier, on-hand, and available quantities.
- [ ] **INV-07** Implement low-stock and expiry filters with configurable warning windows.
- [ ] **INV-08** Implement stock-count and adjustment draft flow with required reason and permission checks.
- [ ] **INV-09** Implement database-side confirmation that writes stock balance and movement atomically.
- [ ] **INV-10** Reject expired or insufficient batches and prevent negative inventory during concurrent updates.
- [ ] **INV-11** Add FEFO batch recommendation and show which batch allocations will be used.
- [ ] **INV-12** Build overview metrics for medicine count, low stock, expired/near-expiry stock, and agreed daily activity.
- [ ] **INV-13** Link each dashboard alert to a pre-filtered inventory or report view.
- [ ] **INV-14** Test stock totals against the stock-movement ledger and add a reconciliation view or report.

## Phase 4 — Sales, Suppliers, and Purchases

### Suppliers and purchasing

- [ ] **PUR-01** Build supplier list, search, detail, create, edit, and deactivate workflows.
- [ ] **PUR-02** Build purchase draft with supplier, supplier reference, line items, quantities, costs, discounts, taxes, and totals.
- [ ] **PUR-03** Build receiving workflow that records actual quantities, batch/lot, expiry, and cost.
- [ ] **PUR-04** Support partial receipts and clearly distinguish ordered from received quantities.
- [ ] **PUR-05** Implement atomic receipt confirmation that updates batches, stock movements, purchase state, and audit history.
- [ ] **PUR-06** Add purchase payment records and display payment status based on recorded payments.
- [ ] **PUR-07** Prevent silent deletion or editing of received purchases; use traceable correction workflows.

### Point of sale and billing

- [ ] **SALE-01** Build medicine search/scan results with strength/form, price, and stock/expiry availability.
- [ ] **SALE-02** Build cart line add/remove and quantity update interactions for keyboard and touch use.
- [ ] **SALE-03** Display provisional subtotal, discounts, tax, and total using configured formatting and rounding rules.
- [ ] **SALE-04** Add optional customer selection and prescription association only as permitted by approved policy.
- [ ] **SALE-05** Implement payment method and payment-status capture for approved payment methods.
- [ ] **SALE-06** Implement a trusted, atomic sale RPC that revalidates permissions, price/tax, stock, expiry, and batch allocation.
- [ ] **SALE-07** Make checkout idempotent and preserve the cart on recoverable failure; prevent duplicate submissions.
- [ ] **SALE-08** Create immutable sale and line snapshots, invoice numbering, stock movements, payment record, and audit event.
- [ ] **SALE-09** Build sale confirmation and invoice/receipt view with print/download behavior.
- [ ] **SALE-10** Build searchable sales history and sale detail/reprint view.
- [ ] **SALE-11** Build permission-gated void, return, and refund workflows with reason and traceable stock/payment effects.
- [ ] **SALE-12** Test expired-stock rejection, insufficient stock, concurrent checkout, rollback, duplicate retry, and invoice totals.

## Phase 5 — Customers and Prescriptions

### Customers

- [ ] **CUS-01** Confirm the minimum customer fields and role access before collecting personal information.
- [ ] **CUS-02** Build customer search/list with server-side filtering and privacy-aware columns.
- [ ] **CUS-03** Build create/edit customer forms with validation and appropriate field access.
- [ ] **CUS-04** Build customer profile with only authorized transaction history.
- [ ] **CUS-05** Implement deactivation and approved privacy correction/erasure workflows; do not break transaction history.

### Prescriptions

- [ ] **RX-01** Confirm jurisdiction-specific prescription fields, workflow, retention, and authorized user roles.
- [ ] **RX-02** Implement minimum prescription records and database access policies only after RX-01 approval.
- [ ] **RX-03** Build prescription review/history view with field-level privacy and audit requirements.
- [ ] **RX-04** Link prescription items to customers and eligible sale lines where required.
- [ ] **RX-05** Verify prescription entry does not perform diagnosis or independently authorize dispensing.
- [ ] **RX-06** Add private document upload only if required; implement access, scanning, retention, and deletion controls first.
- [ ] **RX-07** Test role restrictions and confirm prescription/customer data is absent from logs, analytics, and unauthorized exports.

## Phase 6 — Reports, Deployment, and Testing

### Reports

- [ ] **REP-01** Build current stock and batch report with filters and pagination.
- [ ] **REP-02** Build low-stock and expiry reports with configurable date windows.
- [ ] **REP-03** Build sales reports with date, medicine, category, cashier, and payment filters.
- [ ] **REP-04** Build purchase reports with supplier, date, receipt, and payment filters.
- [ ] **REP-05** Verify report totals reconcile with transactions, returns, discounts, taxes, and partial payments.
- [ ] **REP-06** Add permission-controlled CSV/PDF exports and audit sensitive exports.

### Verification and production readiness

- [ ] **REL-01** Add unit/component tests for forms, calculations, validation, and common UI states.
- [ ] **REL-02** Add database integration tests for RLS, RPCs, transactions, idempotency, and concurrent stock operations.
- [ ] **REL-03** Add end-to-end tests for staff sign-in, medicine management, receipt, sale, invoice, return, and reports.
- [ ] **REL-04** Run keyboard, accessibility, and responsive checks on supported screen sizes.
- [ ] **REL-05** Review RLS, grants, storage policies, RPC privileges, and cross-pharmacy/location denial tests.
- [ ] **REL-06** Configure production Supabase project, region, auth settings, secrets, and approved migrations.
- [ ] **REL-07** Configure Vercel production build, environment variables, domain, and SPA routing.
- [ ] **REL-08** Verify Vercel previews cannot access production data and no privileged secrets appear in client assets.
- [ ] **REL-09** Configure backup retention, restore test, monitoring, error reporting, and incident-response ownership.
- [ ] **REL-10** Import and reconcile approved opening catalog and stock data using a tested process.
- [ ] **REL-11** Complete user acceptance testing with pharmacy staff and record defects and sign-off.
- [ ] **REL-12** Resolve release-blocking bugs, run the regression suite, and approve production launch.

## Definition of Done

A task is complete when:

- Its behavior matches the PRD, UI, database, and security decisions that apply to it.
- Validation, error, loading, empty, and permission-denied states are handled where relevant.
- Tests for the changed behavior pass, including direct API/RLS checks for protected data or operations.
- No secrets or real sensitive data are exposed in source, logs, test fixtures, or previews.
- The change has been reviewed and any required documentation or migration notes are updated.

## Suggested Delivery Order

Complete decisions and environment/database foundations first. Then deliver authentication and role enforcement, catalog and inventory, purchases/receiving, point of sale and billing, customers/prescriptions only after policy approval, and finally reports and production readiness. Keep database transactions, RLS tests, and UI acceptance tests alongside each feature rather than postponing all testing to the final phase.
