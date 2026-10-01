# AI Engineering Rules — Pharmacy Management System

These rules apply to the whole repository. Read the relevant project documents before implementing related work:

- [PRD](docs/PRD.md): product scope, requirements, and business rules.
- [Architecture](docs/architecture.md): proposed React/Vite/Tailwind, Supabase, and Vercel architecture.
- [Database design](docs/database-design.md): proposed data model and transaction boundaries.
- [Security](docs/security.md): access control, RLS, privacy, and security gates.
- [UI](docs/UI.md): frontend and interaction decisions.
- [Tasks](docs/TASKS.md): implementation sequence and acceptance expectations.

These documents describe a proposed design. If an implementation request conflicts with them, or a pending regulatory/product decision blocks safe implementation, identify the conflict and ask for clarification rather than silently changing the architecture or policy.

## General Engineering

- Inspect the project structure and relevant nearby code before making changes.
- Make small, focused, reviewable changes. Reuse existing components, utilities, and conventions.
- Do not change the approved architecture, introduce unnecessary dependencies, or rewrite working code without a clear need and approval when the change affects project direction.
- Do not leave placeholder pages, fake workflows, or dummy functionality presented as complete.
- Keep documentation, code, database schema, and tests consistent. Update relevant documentation when behavior or decisions change.
- Do not add real customer, prescription, payment, or production inventory data to development, test, CI, or preview environments.

## React and Frontend

- Use React with TypeScript and the established Vite, Tailwind CSS, and routing setup.
- Use focused functional components and React hooks. Choose meaningful names and keep state close to where it is used.
- Keep server state, form state, and transient UI state in their appropriate layers; avoid duplicating cached server data in global client state.
- Reuse the shared design tokens and components in `docs/UI.md`. Keep operational screens scannable, responsive, keyboard accessible, and consistent.
- Provide loading, empty, no-results, validation, authorization, network-error, and success states for data-driven workflows.
- Preserve user-entered form/cart data after recoverable errors. Do not indicate a sale or receipt succeeded until the server confirms it.
- Treat client-side validation and route/role guards as usability aids, not security controls.
- Do not put sensitive customer or prescription data in URLs, analytics, logs, console messages, or error-report payloads.

## Supabase and Database

- Follow the approved Supabase/PostgreSQL architecture and current official documentation.
- Never expose the Supabase service-role key, database credentials, payment secrets, or other privileged credentials in client code, `VITE_*` variables, source maps, or browser assets. Use only the public/anon key in the browser with correctly configured grants and RLS.
- Store schema, grants, RLS policies, and database functions in reviewed, version-controlled migrations. Do not make untracked production schema changes.
- Enable and test RLS for every client-exposed table and private storage bucket. Use explicit least-privilege grants as well as policies.
- Check pharmacy and, where applicable, location membership at the database boundary. Never trust tenant IDs, user IDs, prices, totals, roles, or stock values supplied by the browser.
- Use narrow, authorized database functions/RPCs for sensitive state transitions. Secure `SECURITY DEFINER` functions with a safe `search_path`, explicit caller/tenant validation, and restricted execute grants.
- Keep authentication identities separate from application role assignments. Do not allow users to elevate their own role by editing client-controlled profile metadata.
- Prefer staff invitations and administrator-managed accounts. Do not implement unrestricted public self-registration unless the product requirements explicitly change.
- Handle database errors safely and use idempotency for retryable operations such as checkout, receipt confirmation, and payment callbacks.

## Pharmacy Domain and Data Integrity

- Track stock by batch when required for lot and expiry traceability. Expired batches must not be sold.
- Treat the stock movement ledger as the traceable history. Update batch balances and corresponding movements in the same database transaction.
- Complete sales, purchase receipts, returns/refunds, and stock adjustments atomically; re-check availability and permissions at commit time to prevent overselling, duplicate transactions, and partial writes.
- Keep invoice and transaction line snapshots stable; historical totals must not change when catalog prices or tax configuration changes.
- Preserve completed financial and stock records. Deactivate/archive catalog and counterparty records with history; correct completed transactions using audited void, reversal, return, refund, or adjustment workflows instead of hard deletion.
- Record actor, timestamp, affected record, and reason for important stock, financial, prescription, and access-control actions. Do not put unnecessary personal or prescription data in audit payloads.
- Do not make diagnoses or clinical decisions. Add prescription or controlled-medicine workflows only after required jurisdictional fields, access, retention, and pharmacy review are approved.
- Do not store card numbers or security codes. Use a payment provider if card payments are integrated.

## Security and Privacy

- Validate input in the UI and again at the trusted backend/database boundary. Apply database constraints for important invariants.
- Enforce authorization in grants, RLS, and trusted database functions. Hiding UI actions is never sufficient.
- Apply least privilege to administrator, pharmacist, cashier, inventory, and read-only roles. Customer and prescription data may require narrower access than general pharmacy records.
- Minimize personal and health data. Define retention, export, correction/deletion, backup, and incident-response requirements before enabling sensitive workflows.
- Use private storage and short-lived access for sensitive files. Do not add prescription document uploads until access, scanning, retention, and deletion controls are defined.
- Redact sensitive data in application logs, monitoring, analytics, test fixtures, and support diagnostics.
- Keep development, staging, preview, and production environments separate. Preview deployments must never use production data or production secrets.

## UI and Accessibility

- Follow `docs/UI.md` for navigation, page behavior, visual direction, responsive rules, and design tokens.
- Build for efficient pharmacy operations, especially medicine lookup, point of sale, receiving, batch/expiry review, and exception handling.
- Target WCAG 2.1 AA for core workflows: semantic controls, keyboard navigation, visible focus, readable contrast, screen-reader feedback, and understandable errors.
- Never communicate status using color alone. Give destructive and financial/stock-impacting actions explicit confirmation and explain the effect.
- Do not implement offline sales unless a separate approved design addresses secure local storage, conflict resolution, idempotency, and stock reconciliation.

## Testing and Verification

- Add or update focused tests for changed behavior. Include database/RLS tests for protected data and transaction tests for stock or financial operations.
- For UI changes, run relevant unit/component and end-to-end checks where available; verify responsive behavior, keyboard use, and browser console/network errors for affected workflows.
- For database changes, verify migrations, constraints, grants, RLS allow/deny cases, tenant isolation, rollback behavior, concurrency, and retry/idempotency cases as relevant.
- Run the project's applicable formatter, lint, typecheck, build, and test commands. Run the application and smoke-test affected workflows when code changes and the environment supports it.
- For documentation-only changes, verify the file, headings, links, and consistency with the design docs; do not claim code or database tests were run if they were not relevant or available.
- Never report a check as passing unless it was actually run. State blockers and remaining verification gaps clearly.

## Before Finishing a Task

- Review the changed files and confirm unrelated work was left untouched.
- Verify the requested behavior and run the relevant checks described above.
- Explain what changed and where, summarize verification, and mention incomplete functionality, unresolved decisions, or tests that could not be run.
