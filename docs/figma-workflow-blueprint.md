# OfficeOps Figma Workflow Blueprint

This blueprint describes how to lay out the OfficeOps end-to-end workflow diagram in Figma so it can be reviewed and implemented inside the application. It includes swimlanes, nodes, connectors, and styling guidance for a consistent diagram.

## Canvas and Styling

- **Frame**: 1920×1080 (Desktop) with 8px grid; enable layout columns if you prefer alignment assistance.
- **Swimlanes**: Use horizontal sections (Auto Layout frames) sized to fit the content for each capability area. Suggested lane order (top → bottom):
  1) Access Management, 2) Asset Management, 3) Learning Management System (LMS), 4) Risk Management & Reporting, 5) Shared Services (Notifications/Identity).
- **Shapes**: Rounded rectangles (8px radius) for activities; diamonds for decision points; pills for roles; annotations using sticky-note style.
- **Color palette** (aligns with app styling):
  - Primary actions: `#2563EB` (blue)
  - Approvals/decisions: `#F59E0B` (amber)
  - Success/complete: `#10B981` (green)
  - Risks/escalations: `#EF4444` (red)
  - Background of swimlanes: light gray `#F3F4F6`
- **Connectors**: Use orthogonal connectors with arrows; label transitions for clarity (e.g., "ISO approves", "Auto-expire").

## Swimlane 1: Access Management

1. **Access Request Drafted (Employee/Manager pill)** → rectangle in blue.
2. **Submit with Start/End Dates & Justification** (captures time-boxing).
3. **ISO Review (Decision)** — diamond labeled "Approve?" with rejection path to **Request Returned with Feedback**.
4. **System Owner / IT Admin Provisioning** — rectangle noting "Final approval + provisioning".
5. **Access Activated (time-boxed)** — rectangle with note "Auto-review scheduled; expiry set".
6. **Periodic Review Trigger** — rectangle; connector to **Continue? (Decision)**.
7. Decision branch:
   - **Yes** → back to **Access Activated** with "Review date reset" label.
   - **No/End date reached** → **Auto-Revocation & Audit Log** (green rectangle) with note "Revoked automatically at end date".

## Swimlane 2: Asset Management

1. **Asset Created/Updated (Admin)** — rectangle capturing metadata + QR option.
2. **Asset Request (Employee/Manager)** — rectangle; connector to **ISO Visibility** sticky noting privileged assets flagged.
3. **Admin/IT Assignment** — rectangle with assignee, dates.
4. **In-Use Monitoring** — rectangle; connector to **Maintenance/Update** loop.
5. **Return Flow** — rectangle updating status to available.
6. **Protected Deletion Check (Decision)** — diamond; if assigned, route to **Deletion Blocked**; if not, **Delete with Confirmation**.

## Swimlane 3: Learning Management System (LMS)

1. **Course Authored (ISO/Admin)** — rectangle with subtext "Video + PDF/PPT/Word".
2. **Quiz Bank (≥10 questions) Created** — rectangle linked to each module.
3. **Assignments to Managers/Employees** — rectangle; connector to **Learner Dashboard**.
4. **Module 1 Unlocked** — rectangle; connector to **MCQ Quiz Passed? (Decision)**.
5. Decision branch:
   - **Pass (≥80%)** → **Next Module Unlocked** loop until final module.
   - **Fail** → **Retry Available** connector back to quiz.
6. **Course Completion & Certificate** — rectangle with output to Shared Services lane for notifications.

## Swimlane 4: Risk Management & Reporting

1. **Risk Intake (Guided Wizard)** — rectangle with ISO-owned validation.
2. **Risk Scoring & Treatment Plan** — rectangle noting pre/post scores.
3. **Mitigation Actions Tracked** — rectangle feeding dashboards.
4. **Review Cycle Scheduled** — rectangle; branch to **Residual Risk Acceptable? (Decision)**.
5. Branches:
   - **Yes** → **Close Risk & Archive Evidence** (green rectangle).
   - **No** → **Escalate / Additional Actions** back to mitigation.
6. **Risk Posture Report Updated** — rectangle; connector to Shared Services for exec notifications.

## Swimlane 5: Shared Services (Notifications/Identity)

- **Identity & Roles** pill showing Admin, ISO, Manager, Employee access boundaries.
- **Notifications** rectangle receiving signals from Access (review reminders), LMS (assignment/completion), and Risk (report readiness).
- **Audit Trail** rectangle connected from Access revocations, Asset changes, LMS completions, and Risk closures.

## Connector Legend (add as a small legend box)

- Solid arrow: normal progression
- Dashed arrow: automated/scheduled action (e.g., auto-review, auto-expiry)
- Red arrow: escalation path

## How to Share for Verification

1. Create the swimlanes as stacked Auto Layout frames and drop the shapes with the texts above.
2. Apply the color palette for quick semantic scanning (blue = action, amber = decision, green = completion, red = risk).
3. Export a **PNG or PDF** and attach it to the implementation ticket; keep the editable Figma link for future updates.
4. Link callouts to the existing documentation:
   - [Application Workflows](./application-workflow.md)
   - [Risk Posture Report](./risk-assessment-report.md)

Use this blueprint as the canonical source to build or verify the Figma diagram before mirroring the flow in the application.
