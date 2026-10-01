# Product Requirements Document: Pharmacy Management System

**Status:** Draft  
**Version:** 1.0  
**Date:** 2026-10-01  
**Product:** Pharmacy Management System (PMS)

## 1. Purpose

The Pharmacy Management System will provide pharmacy staff with one place to maintain medicine records, monitor stock and expiry dates, manage suppliers and customers, record purchases and sales, handle prescription-related sales, issue invoices, and review operational reports. It is intended to improve stock accuracy, reduce avoidable expiry and data-entry errors, and make day-to-day transactions traceable.

This document defines product scope and expected behavior and includes a proposed technical architecture. The architecture remains subject to technical validation and does not replace legal, clinical, accounting, or pharmacy-regulatory review.

## 2. Problem Statement

Pharmacies need reliable, current information about what medicines they carry, where stock came from, which batches are nearing expiry, and what was sold or purchased. Disconnected records and manual processes make it harder to prevent stock-outs, identify expired products, reconcile invoices, and answer operational questions.

## 3. Goals and Success Measures

### Goals

- Maintain a searchable, accurate medicine catalog.
- Provide a current stock view, with quantities traceable by batch and expiry date.
- Record supplier purchases and customer sales with their item, quantity, price, and payment details.
- Prevent or clearly flag invalid sales, including insufficient or expired stock.
- Support prescription records and prescription-linked sales, subject to applicable local rules.
- Produce invoices and useful inventory, sales, purchase, and expiry reports.
- Restrict sensitive operations by user role and retain a history of important changes.

### Success measures

The pharmacy should be able to measure, after launch:

- Inventory variance between system stock and physical counts.
- Number of stock-outs and expired items sold (target: zero expired-item sales).
- Share of sales and purchases recorded in the system.
- Time required to complete a routine sale and find a batch nearing expiry.
- Accuracy and completeness of invoice and report totals.

Numeric targets should be agreed with the pharmacy during rollout after baseline measurement.

## 4. Users and Roles

- **Administrator / Owner:** Configures the pharmacy, users, permissions, tax and invoice settings, and views all operational and financial reports.
- **Pharmacist:** Reviews prescription information where required, approves or records prescription-linked sales, and performs pharmacy operations permitted by local policy.
- **Cashier / Sales Clerk:** Creates sales, finds products, records customers when needed, accepts payments, and issues invoices within assigned permissions.
- **Inventory / Purchasing Staff:** Maintains stock records, suppliers, purchase orders, goods receipts, and stock adjustments within assigned permissions.
- **Read-only / Auditor:** Views authorized records and reports without changing operational data.

A user may have more than one role. Access to restricted medicine and customer data must be configurable and follow local policy.

## 5. Scope

### In scope

- Authentication, user roles, and permission-controlled operations.
- Medicine catalog management, search, and status management.
- Batch-aware inventory, expiry monitoring, stock adjustments, and stock counts.
- Supplier and customer records.
- Purchase recording and receiving stock.
- Point-of-sale transactions, returns or voids, payment recording, and invoices.
- Prescription capture and association with a sale, where legally permitted and required.
- Operational reports and data export for authorized users.
- Audit history for significant business and configuration changes.

### Out of scope for the initial release

- Medical diagnosis, prescribing, or clinical decision support.
- Insurance adjudication, claims submission, or reimbursement workflows.
- Multi-branch inventory transfers and consolidated reporting unless confirmed as a launch requirement.
- Automated wholesaler ordering or electronic prescription network integrations.
- Payroll, general ledger, and full accounting functionality.
- Consumer e-commerce, delivery management, or a patient mobile application.

## 6. Functional Requirements

### 6.1 User access and setup

- **FR-01:** Users must sign in using individually assigned accounts; shared staff accounts should not be required for normal use.
- **FR-02:** Administrators must be able to create, update, deactivate, and assign roles to users.
- **FR-03:** The system must enforce permissions for viewing, creating, editing, deleting/deactivating, approving, refunding, and reporting.
- **FR-04:** The pharmacy must be able to configure its identity and contact details, currency, time zone, invoice numbering, receipt details, and applicable tax settings.

### 6.2 Medicine catalog

- **FR-05:** Authorized users must be able to add, view, update, deactivate, and search medicine records.
- **FR-06:** A medicine record must support, at minimum, a unique internal identifier, name, generic name where applicable, strength, dosage form, unit of measure, barcode or SKU where available, category, sale price, purchase cost, tax classification, and active/inactive status.
- **FR-07:** The system must validate required fields and prevent duplicate identifiers. It should warn about likely duplicate medicines based on configured identifying fields.
- **FR-08:** Search must support common identifiers such as name, generic name, SKU, and barcode, and should allow filtering by category and active status.
- **FR-09:** Medicines with existing transaction history must not be hard-deleted. Authorized users may deactivate them so they cannot be selected for new transactions while historical records remain available.

### 6.3 Inventory and expiry

- **FR-10:** The system must show on-hand, reserved if applicable, and available quantities for each medicine, with batch-level detail where batch tracking is enabled.
- **FR-11:** Each received batch must record its medicine, batch/lot number when supplied, quantity received, expiry date when applicable, unit cost, supplier, and receiving date.
- **FR-12:** Stock must increase when a purchase receipt is confirmed and decrease when a sale is completed. Each stock movement must retain its source transaction and timestamp.
- **FR-13:** Users with permission must be able to record an opening balance, stock count, damage, loss, return, or other adjustment with a reason. Adjustments must be auditable.
- **FR-14:** The system must warn users when stock is below a configurable reorder threshold and show expired or soon-to-expire batches using a configurable warning window.
- **FR-15:** Expired batches must not be available for sale. Where stock is batch-tracked, the system should recommend the earliest-expiring eligible batch first (FEFO), while allowing only authorized, recorded exceptions if local policy permits.
- **FR-16:** Users must be able to search and filter inventory by medicine, batch, supplier, stock level, and expiry status.
- **FR-17:** The system must prevent negative stock by default. Any override must be explicitly permissioned, confirmed, and recorded in the audit history.

### 6.4 Suppliers and purchases

- **FR-18:** Authorized users must be able to add, view, update, search, and deactivate supplier records. Records should include name, contact details, address, tax/business identifiers where applicable, and notes.
- **FR-19:** Users must be able to create a purchase record with supplier, supplier invoice/reference, date, line items, quantities, unit costs, discounts, tax, and totals.
- **FR-20:** A purchase may be saved as a draft and must not affect stock until its receipt is confirmed.
- **FR-21:** On confirmation of received quantities, the system must add stock to the appropriate medicine batches and preserve the received cost and expiry details.
- **FR-22:** Users must be able to record partial receipts, outstanding quantities, and purchase status. The system must distinguish ordered quantity from received quantity.
- **FR-23:** Users must be able to record purchase payment status and payment references. Supplier balances, if shown, must be based on recorded purchases and payments and must be labeled accordingly.
- **FR-24:** A purchase or receipt with stock impact must not be silently deleted. Corrections must use a traceable reversal, return, or adjustment workflow.

### 6.5 Customers and prescriptions

- **FR-25:** Authorized users must be able to add, view, update, search, and deactivate customer records. Store only the personal information needed for the pharmacy's workflow.
- **FR-26:** A customer record may include name, contact details, and optional notes, subject to privacy policy and local law. The system must support a walk-in sale without requiring a customer profile unless configured otherwise.
- **FR-27:** Where required and legally permitted, authorized pharmacy staff must be able to record prescription details and associate them with a customer and one or more sales.
- **FR-28:** Prescription records must support locally required fields, which may include prescriber, issue date, reference or document, prescribed medicine and quantity, repeats/refills, and review or dispense status. The exact fields and retention rules must be configurable or confirmed before implementation.
- **FR-29:** The system must not make clinical judgments or authorize dispensing solely from a prescription data entry. Any review or approval remains the responsibility of appropriately authorized staff.
- **FR-30:** Access to prescription and customer information must be permission-controlled and logged where required.

### 6.6 Sales, billing, and returns

- **FR-31:** An authorized user must be able to create a sale by searching or scanning medicines, entering quantities, and reviewing prices, discounts, tax, and the final total before completion.
- **FR-32:** A sale may be associated with a customer and prescription when required; otherwise, the system must support an appropriate walk-in flow.
- **FR-33:** The system must check medicine status, eligible batch stock, expiry, and any configured prescription requirements before completing a sale.
- **FR-34:** On completion, the system must reduce stock, assign a unique sale/invoice number, record the cashier and transaction time, and generate an invoice or receipt.
- **FR-35:** An invoice must include the pharmacy identity, invoice number and date, line items, quantities, unit prices, discounts, taxes, total, payment method/status, and customer details when applicable.
- **FR-36:** The system must support configured payment methods and payment status (for example, paid, partially paid, or unpaid if credit sales are allowed). Payment records must include amount, method, timestamp, and reference when available.
- **FR-37:** Authorized users must be able to issue a full or partial return/refund against an existing sale, record the reason and refund method, and choose whether returned items are eligible for restocking. Stock changes must be traceable.
- **FR-38:** A completed sale must not be silently edited or deleted. Corrections must use a void, return, or reversal flow that preserves the original and records the user, time, and reason.
- **FR-39:** Users must be able to find a prior sale by invoice number, date, customer, or medicine, subject to permissions, and reprint or export its invoice.

### 6.7 Reports and exports

- **FR-40:** Authorized users must be able to view and filter a current stock report, including batch and expiry information where available.
- **FR-41:** The system must provide an expiry report with configurable date windows and a low-stock/reorder report.
- **FR-42:** The system must provide sales reports by date range, medicine, category, customer where appropriate, user, and payment status.
- **FR-43:** The system must provide purchase reports by date range, supplier, medicine, and purchase/receipt/payment status.
- **FR-44:** Reports must display their date range, currency, and applicable filters. Totals must reconcile to the underlying transactions, including documented treatment of returns, discounts, and taxes.
- **FR-45:** Authorized users must be able to export permitted reports and records in a practical format such as CSV or PDF. Exports containing personal or prescription information must be restricted and auditable.

### 6.8 Audit and data integrity

- **FR-46:** The system must record an audit event for significant changes, including user and timestamp, action, affected record, and reason where applicable.
- **FR-47:** Audit history must cover medicine and price changes, stock movements and adjustments, purchase receipt confirmation, sale completion, voids/returns/refunds, prescription changes, permission changes, and relevant configuration changes.
- **FR-48:** Completed transactions and their financial and stock effects must remain internally consistent. Operations that affect stock and transaction status must either complete together or leave the data unchanged.

## 7. Business Rules

- Stock is increased only by a confirmed receipt or an authorized positive adjustment, and reduced by a completed sale or authorized negative adjustment.
- A draft sale or purchase does not change stock. A completed/confirmed transaction has a unique, immutable reference.
- Expired stock is not sellable. The system uses the pharmacy-configured definition of “near expiry” for warnings and reports.
- Products with transaction history are deactivated or reversed, not erased from history.
- Taxes, rounding, prescription requirements, controlled-medicine handling, invoice retention, and refund rules depend on jurisdiction and pharmacy policy; these must be confirmed before production use.
- A report's figures are based on recorded system transactions and should not be represented as audited accounting statements unless separately validated.

## 8. Non-Functional Requirements

- **Security:** Encrypt network traffic and protect stored credentials using industry-standard mechanisms. Enforce least-privilege access and secure session handling.
- **Privacy:** Collect the minimum personal and prescription data necessary. Support access restrictions, retention, export, and deletion/anonymization processes as required by applicable law.
- **Reliability:** Preserve transaction integrity across failures. Provide backup and recovery procedures appropriate to the pharmacy's operating needs.
- **Performance:** Common medicine lookup and point-of-sale actions should feel responsive under the agreed expected data volume and concurrent user load. Performance targets must be set during technical design.
- **Usability:** Support fast keyboard-driven lookup and transaction entry, clear validation messages, and layouts usable on the pharmacy's supported screen sizes and devices.
- **Accessibility:** Aim for WCAG 2.1 AA for user-facing workflows, including keyboard navigation, focus visibility, and readable contrast.
- **Maintainability:** Keep business rules, permissions, and configuration understandable and testable; changes to financial or stock behavior require automated regression coverage.
- **Localization:** Support configurable currency, time zone, date format, decimal precision, tax labels, and invoice language as required by the launch market.

## 9. Core Workflows

### Receive a purchase

1. Staff select a supplier and enter purchase lines and supplier references.
2. Staff record quantities actually received, batch identifiers, expiry dates, and costs.
3. An authorized user confirms the receipt.
4. The system updates stock, records the receipt and stock movements, and makes the purchase available in reports.

### Complete a sale

1. Staff find or scan items and enter quantities.
2. The system checks active status, available unexpired stock, configured restrictions, and prescription requirements.
3. Staff review totals, discounts, taxes, customer/prescription association if applicable, and payment details.
4. Staff complete the sale; the system records payment and stock movements and produces an invoice.

### Review expiring stock

1. Staff open the expiry report and select a warning window.
2. The system lists affected batches with medicine, batch, expiry date, and available quantity.
3. Staff may use the list for rotation, return, quarantine, or disposal according to pharmacy policy; any stock change is recorded as a traceable adjustment.

## 10. Acceptance Criteria for Initial Release

- An administrator can create a user, assign a role, and verify that restricted actions are unavailable to unauthorized roles.
- Staff can add, edit, search, deactivate, and view medicine records without losing transaction history.
- A confirmed purchase receipt adds the received quantity to the correct batch; a draft purchase does not affect stock.
- Expired batches are excluded from sale, and the inventory view identifies low-stock and soon-to-expire items.
- A completed sale decreases the correct stock, records payment, and produces a uniquely numbered invoice with correct line and total calculations.
- A permitted return or void retains the original sale, records a reason and actor, and applies stock/refund effects according to policy.
- Sales, purchase, stock, low-stock, and expiry reports can be filtered by date or relevant dimensions and reconcile to recorded transactions.
- Important stock, financial, prescription, and access-control changes appear in an auditable history.
- The pharmacy's required privacy, security, tax, prescription, and invoice rules have been reviewed and configured for its jurisdiction before production rollout.

## 11. Dependencies and Assumptions

- The initial deployment is for one pharmacy location unless multi-location operation is confirmed.
- The pharmacy will supply its medicine catalog, opening inventory, suppliers, customers where appropriate, tax rules, payment methods, and invoice requirements.
- Barcode scanning depends on supported hardware and reliable barcode data being available.
- Prescription and regulated-medicine workflows depend on jurisdiction-specific requirements and a review by the pharmacy's responsible professionals.
- Backup, hosting, device, printer, and connectivity requirements will be selected during technical design.

## 12. Open Questions

1. Which country/region and pharmacy regulations apply, including prescription, controlled-medicine, privacy, tax, and record-retention rules?
2. Is this for one pharmacy location or multiple branches? Are transfers and consolidated reporting needed in the first release?
3. Which devices, operating systems, barcode scanners, receipt printers, and invoice formats must be supported?
4. Are credit sales, partial payments, customer accounts, insurance, or integrated payment terminals required?
5. What are the approved rules for returns, damaged stock, batch traceability, stock overrides, and disposal?
6. Which prescription fields, verification steps, attachments, refill controls, and retention periods are mandatory?
7. What data import formats and opening-stock reconciliation process are available?
8. What expected catalog size, transaction volume, concurrent user count, uptime target, and recovery objectives should guide technical design?
9. Which report formats and export permissions are required by owners, staff, accountants, and auditors?
10. What measurable launch targets should be set for transaction speed, stock accuracy, and expiry reduction?

## 13. Proposed Technical Architecture

This is a proposed starting architecture for a single-pharmacy initial release. It uses the requested React, Tailwind CSS, Vite, Supabase, and Vercel stack. Pharmacy-specific legal, privacy, hosting-location, and operational requirements must be confirmed before production deployment.

### 13.1 Application stack

- **Frontend:** React with TypeScript, built with Vite and styled with Tailwind CSS. Use a client-side router for application areas and a consistent accessible component system for forms, tables, dialogs, and point-of-sale interactions.
- **Frontend data and forms:** Use a server-state/query library such as TanStack Query, schema-based validation such as Zod, and a form library such as React Hook Form where useful. Keep the API/data-access layer separate from presentation components.
- **Backend and database:** Supabase PostgreSQL is the system of record. Use Supabase Auth for identities, Row Level Security (RLS) for data access enforcement, and versioned SQL migrations for schema and policy changes.
- **Backend business operations:** Put sensitive or multi-step operations in PostgreSQL functions/RPCs or Supabase Edge Functions, choosing based on whether the operation is primarily transactional database work or requires external services. Use Vercel server-side functions only where a Vercel-hosted endpoint is specifically useful; avoid splitting business logic across platforms without a clear need.
- **File storage:** If prescription documents or other files are required, use a private Supabase Storage bucket with restrictive policies and short-lived signed access. Avoid storing prescription scans in the initial release unless retention, access, deletion, and jurisdiction requirements are defined.
- **Hosting and deployment:** Deploy the Vite-built web application to Vercel. Use Vercel preview deployments for review and separate Supabase projects for development/staging and production. Do not treat preview deployments as production data environments.

### 13.2 Suggested application boundaries

Organize the application around pharmacy workflows rather than one large screen or undifferentiated data layer:

- **Web application:** Authentication and role-aware navigation; medicine catalog; inventory and expiry; suppliers and purchasing; customers and prescriptions; point of sale and billing; reports; administration.
- **Database domain:** Medicines, suppliers, customers, users/memberships and roles, purchase orders and receipts, batches, stock movements, sales and sale lines, payments, returns/refunds, prescriptions, invoice configuration, and audit events.
- **Database invariants:** Store money as fixed-precision decimal or integer minor units with an explicit currency policy; use explicit transaction states; retain immutable transaction references; use foreign keys, uniqueness constraints, check constraints, and indexes for key lookup paths.
- **Stock ledger:** Record every stock change as a traceable movement linked to its source. Derive or maintain on-hand quantities consistently from this ledger, and regularly reconcile any cached balance against movements.
- **Transactional operations:** Complete sale/receipt/return state changes and their corresponding stock movements atomically in the database. Lock or safely serialize affected inventory rows and re-check availability at commit time to prevent two concurrent sales from overselling the same batch. Do not implement this invariant as separate browser-side reads and writes.
- **Audit history:** Write audit events as part of the same trusted operation for important stock, financial, prescription, and permission changes. Do not allow ordinary application roles to rewrite or delete audit history.

### 13.3 Authentication, authorization, and data protection

- Require authenticated access to operational data; provide least-privilege roles for administrator, pharmacist, cashier, inventory staff, and read-only users.
- Enforce authorization in PostgreSQL RLS policies and trusted server/database operations, not only by hiding frontend controls. Ensure role assignments cannot be self-elevated by editing client-controlled profile metadata.
- Keep Supabase service-role keys and other privileged secrets exclusively in protected server-side environment variables. Never bundle them into the Vite client; the browser should use only the public/anon key with RLS correctly enabled.
- Decide whether the data model needs a `pharmacy_id` tenant boundary now, even for one location, if future multi-pharmacy or branch support is plausible. Scope every applicable table and policy consistently; do not imply that adding this column alone makes the system multi-tenant secure.
- Minimize personal and prescription data. Define retention, deletion/anonymization, backup retention, access review, and incident response rules before production use. Review vendor contracts, data residency, and applicable regulatory obligations for both Supabase and Vercel.
- If card payments are later integrated, use a compliant payment provider and avoid storing card numbers or security codes in the application database.

### 13.4 Environments, delivery, and quality

- Keep schema changes and database policies in reviewed, version-controlled migrations. Apply migrations through a deliberate release process; do not make untracked production schema edits from a developer console.
- Maintain separate development, staging, and production configuration and secrets. Production data must not be copied into previews or local development without an approved, privacy-safe process.
- Use automated checks in CI for TypeScript/build errors, linting, unit tests, and migration/policy validation. Add integration tests for authorization and database transactions, plus end-to-end tests for purchase receipt, sale, return, expiry prevention, and invoice generation.
- Test RLS policies with multiple roles and both allowed and denied operations. Security tests must include direct API requests, not only frontend navigation checks.
- Add error reporting and operational monitoring for frontend and backend failures, database capacity, failed scheduled jobs if any, and transaction failures. Redact personal and prescription data from logs and analytics.
- Define backup frequency, recovery point and recovery time objectives, and run restore exercises before relying on backups. Confirm Supabase plan capabilities and operational limits against the pharmacy's requirements.

### 13.5 Recommended implementation choices to confirm

- **Language:** TypeScript across the React application and server-side functions where supported.
- **Routing:** React Router or an equivalent established client router; configure Vercel rewrites so direct navigation to nested SPA routes works.
- **Testing:** Vitest and React Testing Library for UI/unit tests; Playwright for end-to-end workflows; database integration tests for RLS, RPCs, and stock concurrency.
- **Code quality:** ESLint and Prettier, with CI checks. Choose and document a shared UI/component and accessibility approach before building the operational screens.
- **Operations:** GitHub (or the selected source host) for version control and CI; an error-monitoring service such as Sentry may be added after privacy and data-redaction review.

These are recommendations, not additional required vendors. Keep the initial implementation small and add integrations only when a confirmed workflow requires them.
