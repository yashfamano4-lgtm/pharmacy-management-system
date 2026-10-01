# Pharmacy Management System Security Design

**Status:** Proposed  
**Version:** 0.1  
**Date:** 2026-10-01  
**Related documents:** [PRD](PRD.md) · [Architecture](architecture.md) · [Database design](database-design.md)

> This document defines proposed security requirements and controls for the Pharmacy Management System. It does not contain deployed SQL policies and is not a legal, privacy, or regulatory compliance certification. Confirm applicable jurisdictional requirements and obtain qualified review before production use.

## 1. Security Objectives

- Prevent unauthorized access to pharmacy, customer, prescription, inventory, and financial data.
- Enforce permissions in PostgreSQL and trusted server-side operations, not only in the React interface.
- Prevent cross-pharmacy and unauthorized cross-location data access.
- Preserve transaction integrity and traceability for sales, purchases, payments, returns, and stock movements.
- Minimize sensitive data collection and limit its use, exposure, and retention.
- Detect, respond to, and recover from security incidents and operational failures.

## 2. Scope and Trust Boundaries

The security boundary includes the React application, Vercel deployment, Supabase Auth, Supabase's client-facing Data API, PostgreSQL tables/functions/RLS, optional Supabase Storage, and any future external payment or messaging integrations.

Assume browser code and all values supplied by the browser can be inspected or modified by a user. A hidden button, client-side role check, pharmacy ID, location ID, price, total, or stock count is not authoritative. Every protected operation must be authorized and validated by the database or a trusted server-side service.

The Supabase public/anon key is expected to be present in the browser. It is not a secret and is safe only when grants and RLS policies are correctly configured and tested. The Supabase service-role key bypasses RLS and must never be sent to the browser or included in a Vite build.

## 3. Data Classification

| Classification | Examples | Minimum handling |
| --- | --- | --- |
| Public | Public pharmacy address or published business hours | May be displayed without authentication if the pharmacy chooses. |
| Internal | Medicine catalog, supplier records, stock levels, operational reports | Require authentication and pharmacy/location-scoped authorization. |
| Confidential | Sales, purchase prices, payments, staff membership and audit history | Restrict by role and pharmacy; log sensitive administrative access and changes. |
| Restricted personal/health | Customer contact information, prescription details, prescription attachments | Minimize collection; limit to authorized roles and purpose; define retention and export controls; never include in analytics or routine logs. |
| Secrets | Service-role keys, payment-provider credentials, signing secrets | Store only in protected server-side secret management; rotate and audit access. |

The pharmacy must confirm whether particular records receive a higher legal classification in its jurisdiction.

## 4. Identity and Access Control

### Authentication

- Use Supabase Auth with individually assigned staff accounts; avoid shared accounts.
- Require strong authentication practices, secure session handling, and account recovery procedures. Require multi-factor authentication for administrators and other privileged users where supported and operationally feasible.
- Deactivate a staff membership promptly when access is no longer required. Define processes for lost devices, suspected account compromise, and session revocation.
- Do not store passwords or authentication secrets in application tables.

### Authorization model

- Link `auth.users` identities to active `pharmacy_memberships`; assign roles through trusted `membership_roles` records.
- Check pharmacy and, where applicable, location scope for every query and mutation. Never authorize based solely on a client-submitted `pharmacy_id`, `location_id`, role, or user ID.
- Prevent users from granting themselves roles or changing their own membership scope. Privilege changes require a separately authorized action and an audit event.
- Use least privilege and separate duties for high-impact actions such as refunds, stock adjustments, permission changes, and configuration changes when pharmacy operations require it.
- Enforce access in RLS, table grants, and narrow database functions. Frontend route guards and hidden controls are supplementary usability features only.

### Initial role guidance

| Role | Intended access | Restricted actions by default |
| --- | --- | --- |
| Administrator / Owner | Manage pharmacy configuration and memberships; view operational reports; manage access according to policy. | Should not automatically receive prescription details unless needed and permitted by policy. High-impact changes should be audited. |
| Pharmacist | Review permitted prescription data and perform authorized dispensing/sale operations. | Cannot change role assignments or erase completed transactions. |
| Cashier / Sales Clerk | Search catalog, create permitted sales, record payments, issue invoices, and process only explicitly granted returns. | No direct stock adjustment, prescription access beyond what is necessary, or role/configuration management by default. |
| Inventory / Purchasing Staff | Manage suppliers, purchases, receipts, counts, and permitted stock adjustments. | No payment refunds, prescription access, or user-role administration by default. |
| Read-only / Auditor | Read explicitly authorized records and reports. | No data writes, exports of restricted personal data without separate permission, or access outside assigned scope. |

These are starting defaults, not a substitute for an approved pharmacy access policy. Applicable dispensing laws and segregation-of-duties rules may require changes.

## 5. Supabase and PostgreSQL Controls

### Row Level Security and grants

- Enable RLS on every table exposed through the Supabase client-facing API. Apply equivalent access controls to private Storage buckets and views or other API-exposed objects.
- Use explicit table, sequence, function, and schema grants together with RLS. RLS does not replace grants, and grants do not replace RLS.
- Default-deny access where practical. Add narrowly scoped `SELECT`, `INSERT`, `UPDATE`, and function-execution permissions only for intended user roles.
- Base policies on `auth.uid()` and trusted membership/role records, checking active membership and matching `pharmacy_id` and optional `location_id`.
- Apply tenant-aware foreign keys or equivalent database validation so a row cannot reference another pharmacy's medicine, customer, supplier, batch, or transaction.
- Review policies for each table operation, including `USING` and `WITH CHECK` behavior for updates. Test policies with multiple users, roles, pharmacies, and locations.
- Avoid exposing tables or views that do not need to be available through the client API. Use carefully scoped views/RPCs for reporting where broad table access would reveal unnecessary data.

### Trusted database functions

Use narrow PostgreSQL functions/RPCs for sensitive state transitions such as completing a sale, confirming a goods receipt, issuing a return/refund, or approving a stock adjustment. Each operation should:

- Validate the authenticated actor, active membership, role, pharmacy, and location in the database.
- Re-check current state, stock, batch expiry, and quantities at execution time.
- Calculate or validate authoritative totals using approved pricing/tax rules; do not trust client-calculated totals.
- Apply the transaction, stock movements, payment state, and audit event atomically, rolling back all changes if any step fails.
- Be idempotent for retryable operations, using a server-validated idempotency key where appropriate.
- Expose only the minimum function arguments and result data needed by the client.

If a function uses `SECURITY DEFINER`, set a safe fixed `search_path`, qualify object names, validate `auth.uid()` explicitly, avoid unsafe dynamic SQL, restrict `EXECUTE` grants, and test it as an untrusted caller. Never treat `SECURITY DEFINER` as a way to bypass authorization.

### Direct writes and immutable history

- Restrict direct client writes to high-impact transaction tables. Prefer RPCs for financial and stock state transitions.
- Deny ordinary application roles permission to update or delete completed sales, purchase receipts, stock movements, and audit events.
- Correct completed transactions with linked void, reversal, return, refund, or adjustment records. Retain the original record and actor/time/reason.
- Keep batch balance changes and corresponding stock movements in the same database transaction. Prevent negative balances and overselling through database-side locks/serialization and constraints where possible.

## 6. Protection of Sensitive Data

- Collect only customer and prescription fields required for an approved workflow. Do not collect medical history or other sensitive details merely because the schema could hold them.
- Apply narrower access to prescription and customer records than to general catalog data. Determine which roles can view, create, amend, dispense, export, or correct each field.
- Avoid storing prescription scans in the initial release unless they are required and retention, access, deletion, backup, and malware-scanning controls are defined.
- If files are needed, use private Storage buckets, tenant-scoped policies, short-lived signed URLs, validated file types and sizes, and a safe scanning/review process. Never use public buckets for sensitive documents.
- Do not put personal or prescription data in URLs, application logs, analytics, error traces, support screenshots, test fixtures, or notification payloads unless explicitly approved and protected.
- Define retention, correction, export, archival, deletion/anonymization, and legal-hold procedures with the pharmacy's legal/privacy advisers. Database backups and exports must follow the same sensitivity rules.
- If payment cards are accepted, use a suitable payment provider and retain only provider tokens/references and necessary transaction metadata. Do not store card numbers or security codes.

## 7. Secrets, Hosting, and Environments

- Store privileged keys and third-party credentials in Vercel/Supabase server-side secret configuration. Restrict who can view or change production secrets and rotate them after exposure or personnel changes.
- Verify production builds and preview builds do not contain service-role keys, database passwords, or payment-provider secrets.
- Use separate Supabase projects and credentials for development, staging, and production. Vercel preview deployments must connect only to non-production projects and non-sensitive test data.
- Do not copy production customer or prescription data into local development, CI, or preview environments without an approved protected/anonymization process.
- Keep schema, RLS, grants, and function changes in reviewed, version-controlled migrations. Require review and staging verification before production release.
- Review Supabase and Vercel account security, team membership, region/data-residency options, vendor terms, backup features, and plan limits before selecting production configurations.

## 8. Audit, Monitoring, and Incident Response

### Audit records

Record security-relevant events, including successful/failed privileged operations where available, membership and role changes, sensitive-data access/export where required, medicine/price changes, stock movements, purchase receipt confirmation, sale completion, refunds/voids, prescription review/changes, and security configuration changes.

Audit events should include actor, pharmacy/location scope, action, affected entity, timestamp, request/correlation ID, and reason where appropriate. Minimize or redact before/after payloads so audit trails do not become an unnecessary copy of prescription or personal data. Ordinary application roles must not edit or delete audit events. A database table alone cannot protect logs from a database administrator; consider a separately controlled export/monitoring destination if stronger tamper resistance is required.

### Monitoring and response

- Monitor authentication anomalies, authorization denials, repeated failed requests, function errors, database capacity, and unusual export or stock/refund activity.
- Redact sensitive fields in logs and error reports; restrict access and retention for monitoring data.
- Define incident owners, escalation contacts, credential/key rotation, account/session revocation, evidence preservation, customer/regulator notification assessment, and recovery steps.
- Define backup retention, recovery objectives, and restore exercises. Confirm backups are protected at the same classification as source data.

## 9. Security Verification Requirements

Before production, verify and retain evidence that:

- Every exposed table and private storage bucket has RLS enabled and explicit grants/policies.
- Each role can perform its intended actions and is denied unauthorized actions through direct API requests, not only the UI.
- Cross-pharmacy and cross-location reads/writes fail, including guessed UUIDs and altered request payloads.
- A user cannot alter their own role or act after membership deactivation/session revocation.
- Service-role and other privileged credentials are absent from browser assets, source maps, logs, and preview configuration.
- Sale, receipt, return, and adjustment operations roll back completely on failure and resist concurrent overselling and duplicate retries.
- Expired or inactive products cannot be sold, completed records cannot be silently edited, and audit events are protected from normal client roles.
- Sensitive prescription/customer data is absent from logs, analytics, and unauthorized exports.
- Database migration, backup restoration, and incident-response procedures have been exercised.

## 10. Open Security Decisions

1. Which privacy, pharmacy, prescription, controlled-medicine, breach-notification, and record-retention rules apply?
2. Which staff roles require MFA, and what device/session timeout and account recovery policies are appropriate?
3. Does the product serve one pharmacy, multiple branches, or multiple pharmacy organizations? What are the tenant and location isolation requirements?
4. Which staff may access customer and prescription data, and what actions require a second approver?
5. Are prescription attachments required? If so, what file types, scanning, retention, deletion, and access controls are mandatory?
6. Which vendor regions, contractual terms, backup/restore capabilities, and production plans meet the pharmacy's requirements?
7. What audit events must be retained, for how long, and should a copy be sent to a separately controlled monitoring system?
8. What are the incident response owner, escalation path, RPO, and RTO?

## 11. Security Release Gate

Do not enable real customer, prescription, payment, or production inventory data until the pharmacy has approved the access matrix and jurisdiction-specific requirements, RLS and function authorization have passed direct-API tests, privileged secrets are verified server-side only, backups/restores have been tested, and an incident-response owner is assigned.
