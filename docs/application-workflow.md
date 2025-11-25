# OfficeOps Application Workflows

This guide documents the end-to-end workflows implemented in the OfficeOps Platform so teams can operate consistently across access governance, asset lifecycle, and learning management. It focuses on who does what, what approvals are required, and how the system enforces periodic reviews and expirations.

## Roles and Responsibilities

- **Administrator (Admin):** Owns platform configuration, provisions access after approvals, and can perform all management actions.
- **Information Security Officer (ISO):** Reviews and approves privileged access, creates governance training content, and drives periodic access reviews.
- **Manager:** Requests or approves department-level actions (assets, training assignments), but cannot bypass ISO/administrator checkpoints.
- **Employee:** Requests access and assets, consumes learning content, and completes mandatory quizzes.

## Access Management Workflow

1. **Request intake**
   - Employees and managers submit access requests with justification, start/end dates, and resource selection from the controlled catalog.
2. **Security review**
   - Requests for protected resources are routed to the **ISO** as the first approver to validate least-privilege alignment.
3. **System owner provisioning**
   - After ISO approval, the **system owner or IT administrator** provides final approval and provisions the account or entitlement.
4. **Time-boxing and enforcement**
   - Access is issued for the requested duration (or resource-specific maximum). The platform automatically sets the next review date (90 days by default) and flags requests for periodic attestation.
   - When the end date is reached, access is automatically revoked and marked as expired, recording the revocation reason for auditability.
5. **Ongoing review**
   - Access reviews surface upcoming review dates, and reviewers validate continued need or revoke early if conditions change.

## Asset Management Workflow

1. **Inventory and creation**
   - Admins add assets with metadata (category, status, location, specifications, warranty, QR code flag) to keep the catalog authoritative.
2. **Request and assignment**
   - Employees/managers request assets. Admins/IT fulfill by assigning an asset, capturing assignee details and assignment date.
3. **Updates and maintenance**
   - Asset status, condition, and specifications are updated as maintenance or lifecycle events occur to preserve traceability.
4. **Return and recovery**
   - Returns are recorded with a return modal and the asset status is updated to make it available for reassignment.
5. **Controlled deletion**
   - Assets currently assigned remain protected from deletion; deletes require confirmation to avoid accidental loss of records.

## Learning Management Workflow

1. **Course creation**
   - **ISO** and **Admin** roles can author courses with mixed media (video plus PDF/PPT/Word documents) and governance-aligned quiz banks of at least 10 questions.
2. **Module gating and quizzes**
   - Courses enforce sequential module unlocks: learners must pass the module quiz (default passing score 80% with retakes allowed) before the next module becomes available.
3. **Assignments**
   - ISO/Admin owners target courses to managers and employees. Assignments propagate to learner dashboards for completion tracking.
4. **Completion and certification**
   - Upon passing quizzes and finishing modules, learners can receive certificates where enabled, and progress feeds reporting dashboards.

## Periodic Review and Audit Readiness

- **Access reviews:** Scheduled automatically for each access record; reviewers get upcoming review dates without manual setup.
- **Auto-expiry:** Access entitlements are automatically marked expired and revoked when end dates lapse, preserving audit evidence.
- **Learner evidence:** Quiz attempts and module completion history remain attached to courses for compliance validation.

Use this workflow guide as a runbook for onboarding administrators, ISOs, and managers to the platform.
