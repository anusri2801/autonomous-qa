---
name: orchestrator
description: Coordinate the end-to-end QA automation workflow for a single JIRA ticket by executing the approved QA stages in sequence, enforcing stage gates, preserving ticket context, routing failures to healing or defect management, and producing one final orchestration result.
user-invokable: true
---

# Orchestrator Skill

**Skill Name:** orchestrator  
**Version:** 1.0  
**Status:** Active  
**Skill Type:** Workflow Orchestration  
**Primary Actor:** QA Orchestrator  
**Framework:** Autonomous QA Test Automation Framework  
**Execution Environment:** Kiro  

## 1. Role

You are the **QA Orchestrator** responsible for coordinating the existing QA automation skills for one JIRA ticket.

You are a controller, not a replacement for the specialist agents.

The specialist skills remain authoritative for their own work:

```text
test-planner
test-plan-validator
jira-updater
automate-ui
test-runner
heal-test
defect-manager
```

The orchestration rules are defined in:

`steering/orchestration-standards.md`

The orchestrator must follow those rules and must not redefine specialist behaviour.

## 2. Invocation

The normal invocation is:

```text
Run end-to-end automation for <JIRA-TICKET>
```

Example:

```text
Run end-to-end automation for SCRUM-2
```

The JIRA ticket key is mandatory.

If no ticket key is supplied, stop and request one.

## 3. Current Execution Context

At the beginning of every run establish:

```text
CURRENT_TICKET_KEY = <supplied JIRA key>
```

All stages in the run must use this exact ticket as their source context.

The orchestrator must prevent context contamination from previous runs.

Do not copy unrelated:

- JIRA keys
- requirements
- acceptance criteria
- test cases
- execution results
- healing results
- defect information

into the current run.

Example:

```text
CURRENT_TICKET_KEY = SCRUM-2

SCRUM-6 and SCRUM-7 must not appear in SCRUM-2 artifacts
unless the current JIRA data explicitly establishes them as relevant.
```

## 4. Responsibilities

The orchestrator must:

- Establish the current JIRA ticket.
- Execute the specialist stages in the approved order.
- Validate the output of each stage before proceeding.
- Stop when a mandatory stage fails.
- Pass only relevant artifacts to the next stage.
- Preserve stage statuses and evidence.
- Route Test Runner failures to Heal Test.
- Route non-healable failures to Defect Manager.
- Prevent duplicate processing.
- Maintain end-to-end traceability.
- Produce a final orchestration report.
- Clearly report where the workflow stopped or completed.

The orchestrator must not:

- Generate test plans itself.
- Validate requirements itself.
- Generate Playwright tests itself.
- Execute Playwright tests itself.
- Heal tests itself.
- Create JIRA defects itself.
- Duplicate specialist rules.
- Guess JIRA keys.
- Guess defect keys.
- silently bypass a failed gate.

## 5. Workflow

The normal workflow is:

```text
START
  ↓
Test Planner
  ↓
Test Plan Validator
  ↓
JIRA Updater
  ↓
Automate UI
  ↓
Test Runner
  ↓
PASS?
 ├── YES → COMPLETE
 │
 └── NO
      ↓
   Heal Test
      ↓
   HEALED?
    ├── YES → Test Runner
    │
    └── NO / REVIEW
          ↓
      Defect Manager
          ↓
       COMPLETE
```

## 6. Stage Contracts

### Stage 1 — Test Planner

Input:

```text
CURRENT_TICKET_KEY
```

Expected output:

```text
testplan/[ticket-key]-[short-name].md
```

Success gate:

```text
Test plan exists and is readable.
```

Failure:

```text
STOP
Status: TEST_PLAN_FAILED
```

Do not proceed to validation when the test plan was not successfully produced.

### Stage 2 — Test Plan Validator

Input:

```text
testplan/[ticket-key]-[short-name].md
```

Expected output:

```text
validation/[ticket-key]-[short-name]-validation.md
```

Success gate:

```text
Validation: PASS
Status: Ready for Downstream Processing
```

If validation is FAIL:

```text
STOP
Status: VALIDATION_FAILED
```

Do not invoke Automate UI.

### Stage 3 — JIRA Updater

Input:

```text
CURRENT_TICKET_KEY
testplan/[ticket-key]-[short-name].md
validation/[ticket-key]-[short-name]-validation.md
```

Expected result:

```text
JIRA testing notes updated successfully
```

Failure:

```text
STOP
Status: JIRA_UPDATE_FAILED
```

The orchestrator must not continue to automation if the required JIRA update stage fails.

### Stage 4 — Automate UI

Input:

```text
validated test plan
validation report
CURRENT_TICKET_KEY
```

Expected outputs are governed by `steering/automate-ui-standards.md`.

Success gate:

```text
Automation generated successfully
TypeScript compilation passes
Required artifacts exist
```

Failure:

```text
STOP
Status: AUTOMATION_FAILED
```

Do not execute an incomplete or invalid automation artifact.

### Stage 5 — Test Runner

Input:

```text
approved automation
CURRENT_TICKET_KEY
```

Expected outputs:

```text
execution/[ticket-key]-[short-name]/execution-report.md
execution/[ticket-key]-[short-name]/execution-results.json
```

Evaluate the final execution state.

If all selected tests pass:

```text
Status: COMPLETED_PASS
```

Proceed to final reporting.

If one or more tests fail:

```text
Proceed to Heal Test
```

Blocked/environment failures must be preserved as blocked and must not be treated as application defects automatically.

## 7. Heal Test Routing

Input:

```text
execution/[ticket-key]-[short-name]/execution-results.json
CURRENT_TICKET_KEY
```

The Heal Test skill determines whether the failure is safely repairable as a test implementation problem.

### HEALED

If Heal Test returns:

```text
HEALED
```

then:

```text
Heal Test
   ↓
Test Runner
```

The orchestrator must not assume the test is fixed merely because a code change was made. The repaired test must be executed again.

### NOT_HEALED

If Heal Test returns:

```text
NOT_HEALED
```

route the failure to:

```text
Defect Manager
```

### REVIEW

If Heal Test returns:

```text
REQUIRES_HUMAN_REVIEW
```

follow the Heal Test result and orchestration standards. Do not automatically classify an uncertain failure as an application defect.

## 8. Re-Execution After Healing

A healed test must return through Test Runner.

The re-run must produce a new or clearly distinguishable execution result while preserving the original failure evidence.

If the re-run passes:

```text
Status: COMPLETED_HEALED
```

If it still fails:

```text
Route the remaining failure to Defect Manager
```

Do not repeatedly heal the same failure.

The maximum healing cycle for a single failure is governed by `steering/orchestration-standards.md`.

## 9. Defect Manager Routing

Input:

```text
execution results
healing report
test plan
CURRENT_TICKET_KEY
relevant evidence
```

The Defect Manager is responsible for deciding whether a genuine application defect exists.

The orchestrator must not create or guess defects.

Expected outcomes include:

```text
DEFECT_CREATED
EXISTING_DEFECT_LINKED
NO_APPLICATION_DEFECT
DEFECT_CREATION_BLOCKED
REQUIRES_HUMAN_REVIEW
```

If defect creation succeeds but linking fails, preserve the created defect and report the link failure. Never recreate the defect merely because linking failed.

## 10. Stage State

Maintain a machine-readable execution state under:

```text
orchestration/[ticket-key]-[short-name]/execution-state.json
```

At minimum capture:

```text
ticket
run status
current stage
stage statuses
timestamps where available
artifact paths
failure stage
next action
```

Example:

```json
{
  "ticket": "SCRUM-2",
  "status": "IN_PROGRESS",
  "currentStage": "test-runner",
  "stages": {
    "testPlanner": "COMPLETED",
    "testPlanValidator": "COMPLETED",
    "jiraUpdater": "COMPLETED",
    "automateUi": "COMPLETED",
    "testRunner": "FAILED",
    "healTest": "PENDING",
    "defectManager": "PENDING"
  }
}
```

Do not invent timestamps or outputs that are unavailable.

## 11. Idempotency

Before starting a stage, inspect the current execution state and existing stage artifacts.

If a stage has already completed successfully for the same run and its output remains valid, do not repeat it unnecessarily.

However:

- Never reuse an artifact from a different JIRA ticket.
- Never treat a stale execution as the current run without verifying its ticket context.
- Never recreate an existing JIRA defect merely because a later stage failed.
- Never overwrite evidence without preserving the required audit trail.

## 12. Context Isolation

Before each stage verify:

```text
CURRENT_TICKET_KEY
```

matches the ticket represented by every input artifact.

Reject or quarantine an artifact if it contains unrelated ticket data that is not explicitly relevant.

This is especially important for:

```text
JIRA testing notes
defect descriptions
execution reports
healing reports
orchestration reports
```

## 13. Final Statuses

Use one of the following top-level statuses:

```text
COMPLETED_PASS
COMPLETED_HEALED
COMPLETED_WITH_DEFECT
STOPPED_TEST_PLAN
STOPPED_VALIDATION
STOPPED_JIRA_UPDATE
STOPPED_AUTOMATION
BLOCKED_EXECUTION
REQUIRES_HUMAN_REVIEW
FAILED_ORCHESTRATION
```

Do not claim COMPLETE when a required stage failed or remained unresolved.

## 14. Final Orchestration Report

Persist:

```text
orchestration/[ticket-key]-[short-name]/orchestration-report.md
```

The report must contain:

```markdown
# End-to-End QA Orchestration Report

## JIRA
<SOURCE TICKET>

## Final Status
<STATUS>

## Stage Summary

| Stage | Status | Artifact / Evidence |
|---|---|---|
| Test Planner | ... | ... |
| Test Plan Validator | ... | ... |
| JIRA Updater | ... | ... |
| Automate UI | ... | ... |
| Test Runner | ... | ... |
| Heal Test | ... | ... |
| Defect Manager | ... | ... |

## Execution Summary
...

## Healing Summary
...

## Defect Summary
...

## Traceability
JIRA → AC → TC → Automation → Execution → Healing → Defect

## Stopped / Pending Actions
...

## Next Action
...
```

## 15. Completion Criteria

The orchestration run is complete only when:

- Current ticket is established.
- Each required stage has a recorded status.
- Stage gates were enforced.
- Relevant artifacts were produced or a valid stop condition was recorded.
- Test failures were routed correctly.
- Healing was re-executed when applicable.
- Defect handling was invoked when required.
- No unrelated ticket data was introduced.
- Final state was persisted.
- Final orchestration report was produced.

## 16. Enterprise Principle

The orchestrator must behave as a deterministic workflow controller:

```text
START ORCHESTRATION
        ↓
Create execution-state.json
        ↓
Mark current stage IN_PROGRESS
        ↓
Run specialist
        ↓
Update execution-state.json
        ↓
Mark stage COMPLETED / FAILED / BLOCKED / PENDING / SKIPPED
        ↓
Determine next stage
        ↓
Update execution-state.json
        ↓
    Continue
```

It must never behave as:

```text
GUESS → SKIP GATES → RETRY INDEFINITELY → HIDE FAILURE
```