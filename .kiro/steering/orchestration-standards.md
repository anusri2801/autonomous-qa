# Orchestration Standards

## Purpose

Define enterprise standards for coordinating the QA automation lifecycle for one JIRA ticket.

The orchestrator coordinates specialist skills. It does not replace them.

## 1. Source of Truth

The source of truth for each run is the supplied JIRA ticket:

```text
CURRENT_TICKET_KEY
```

Example:

```text
SCRUM-2
```

All stages must remain scoped to that ticket.

JIRA remains the primary source of truth for requirements and acceptance criteria.

## 2. Specialist Responsibilities

The orchestrator delegates specialist work:

| Stage | Specialist |
|---|---|
| Test planning | `test-planner` |
| Test plan validation | `test-plan-validator` |
| JIRA testing notes | `jira-updater` |
| UI automation | `automate-ui` |
| Test execution | `test-runner` |
| Test healing | `heal-test` |
| Defect management | `defect-manager` |

The orchestrator must not duplicate their domain rules.

## 3. Mandatory Workflow

```text
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
PASS ───────────────→ COMPLETE
    ↓ FAIL
Heal Test
    ↓
HEALED ─────────────→ Test Runner
    ↓ NOT_HEALED
Defect Manager
    ↓
COMPLETE / REVIEW
```

## 4. Stage Gates

A stage may proceed only when its predecessor satisfies the defined success gate.

### Gate 1 — Test Plan

Required:

```text
testplan/[ticket-key]-[short-name].md
```

If missing or unreadable:

```text
STOPPED_TEST_PLAN
```

### Gate 2 — Validation

Required:

```text
Validation: PASS
```

If validation is FAIL:

```text
STOPPED_VALIDATION
```

### Gate 3 — JIRA Update

Required:

```text
JIRA testing notes update completed
```

If the required update fails:

```text
STOPPED_JIRA_UPDATE
```

### Gate 4 — Automation

Required:

- Required Playwright artifacts exist.
- Automation follows project conventions.
- TypeScript compilation succeeds.
- No unresolved automation blocker remains.

If not:

```text
STOPPED_AUTOMATION
```

### Gate 5 — Execution

Every selected test must have a final execution state.

Allowed final states include:

```text
PASSED
FAILED
SKIPPED
BLOCKED
PASS_WITH_RETRY
```

A failure proceeds to healing only when the failure is eligible for healing analysis.

## 5. Failure Routing

Failure routing must be evidence-driven.

```text
Test Runner
    ↓
Failure
    ↓
Heal Test
    ↓
┌───────────────┬──────────────────────────┐
│ HEALED        │ NOT_HEALED / REVIEW      │
│               │                          │
▼               ▼                          │
Re-run       Defect Manager                │
               │                            │
               └────────────────────────────┘
```

Environment, infrastructure and test-data failures must not automatically become application defects.

## 6. Healing Limit

Do not create infinite healing loops.

For one failure chain:

```text
Initial execution
    ↓
One healing attempt
    ↓
One verification execution
    ↓
If still failing → Defect Manager / Human Review
```

The orchestrator must not repeatedly invoke Heal Test for the same unchanged failure.

## 7. Defect Creation and Linking

Defect creation and defect linking are independent operations.

Required state model:

```text
DEFECT_CREATED
DEFECT_ALREADY_EXISTS
LINK_CREATED
LINK_FAILED
LINK_VERIFIED
LINK_NOT_VERIFIED
```

If creation succeeds but linking fails:

```text
Preserve created defect
Record defect key
Record link failure
Do not recreate defect
Return human-review status when required
```

Maximum issue-link attempts:

```text
2 total attempts
```

If the JIRA MCP reports link-type incompatibility:

- Do not guess another link type.
- Do not enter a retry loop.
- Preserve the defect.
- Record the exact error.
- Mark the link stage failed.
- Continue only according to the Defect Manager contract.

## 8. Context Isolation

This is a mandatory control.

At the beginning of a run:

```text
CURRENT_TICKET_KEY = supplied ticket
```

Before every stage, verify all inputs belong to that ticket.

Only information whose source is the current ticket or explicitly relevant evidence may be copied forward.

For example:

```text
Current ticket: SCRUM-2

Allowed:
SCRUM-2
its ACs
its TCs
its execution evidence
its healing evidence
its defects

Not allowed without explicit relevance:
SCRUM-6
SCRUM-7
their test cases
their defect descriptions
their execution results
```

If unrelated ticket data is discovered in a candidate artifact, stop that artifact from propagating and correct the context before continuing.

## 9. Artifact Structure

Use:

```text
orchestration/[ticket-key]-[short-name]/
    execution-state.json
    orchestration-report.md
```

The orchestrator references specialist artifacts rather than copying their entire contents.

Expected specialist locations include:

```text
testplan/[ticket-key]-[short-name].md

validation/[ticket-key]-[short-name]-validation.md

execution/[ticket-key]-[short-name]/
    execution-report.md
    execution-results.json

healing/[ticket-key]-[short-name]/
    healing-report.md
    healing-report.json

defects/[ticket-key]-[short-name]/
    defect-report.md
    defect-results.json
```

Use the actual output defined by the specialist skill if it differs, but do not silently invent an artifact.

## 10. State Management

`execution-state.json` must capture the orchestration state. The state file should be created BEFORE Test Planner is invoked, not at the end

Minimum fields:

```json
{
  "ticket": "<ticket>",
  "status": "<status>",
  "currentStage": "<stage>",
  "stages": {},
  "nextAction": "<action>"
}
```

Each stage should have one of:

```text
PENDING
IN_PROGRESS
COMPLETED
FAILED
BLOCKED
SKIPPED
```

Where relevant, also record:

```text
artifact
error
startedAt
completedAt
```

Only record values actually known.

## 11. Idempotency

The orchestrator must be safe to resume.

Before invoking a stage:

1. Check whether the stage has already completed.
2. Verify its artifact exists.
3. Verify the artifact belongs to `CURRENT_TICKET_KEY`.
4. Verify the artifact is still valid for downstream processing.
5. Reuse it when valid.

Never reuse artifacts from another ticket.

Never create a duplicate defect because orchestration resumed.

Never duplicate a JIRA update solely because the orchestrator was restarted unless the specialist contract requires it.

## 12. Retry Policy

Retries must be bounded and stage-specific.

Allowed:

```text
Specialist-defined retry
```

Not allowed:

```text
unbounded orchestrator retries
```

The orchestrator must distinguish:

```text
retry
re-execution after healing
recovery
duplicate invocation
```

These are not interchangeable.

## 13. JIRA Integrity

The orchestrator must:

- Use the exact source ticket key.
- Never guess issue keys.
- Preserve returned defect keys.
- Never modify unrelated issues.
- Never copy unrelated issue data.
- Preserve MCP errors.
- Preserve partial success.

A successful defect creation followed by a failed link is a partial success, not a total failure.

## 14. Security

Never place the following in orchestration artifacts:

- Passwords
- Access tokens
- API keys
- Session cookies
- Secrets
- Private credentials

Reference secure configuration rather than copying secret values.

## 15. Observability

The orchestration report must make the workflow auditable.

At minimum it must show:

```text
Ticket
Run status
Stage statuses
Artifacts
Execution outcome
Healing outcome
Defect outcome
Failure stage
Next action
```

Do not claim a stage succeeded without evidence.

## 16. Human Review

Human review is required when:

- Required specialist output is ambiguous.
- A mandatory stage cannot complete.
- JIRA operations cannot be safely completed.
- Defect linking cannot be verified.
- Healing classification is uncertain.
- Evidence is insufficient to determine the root cause.
- Context contamination cannot be safely resolved.
- A specialist reports `REQUIRES_HUMAN_REVIEW`.

## 17. Final Status

Use:

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

Definitions:

### COMPLETED_PASS

All required stages completed and execution passed without requiring healing.

### COMPLETED_HEALED

Execution initially failed, healing succeeded, and verification passed.

### COMPLETED_WITH_DEFECT

A genuine application defect was created or an existing defect was identified/linked.

### STOPPED_*

A mandatory stage failed and downstream processing was not safe.

### BLOCKED_EXECUTION

Execution could not meaningfully proceed because of environment, infrastructure or dependency conditions.

### REQUIRES_HUMAN_REVIEW

The workflow cannot safely determine or complete the next action autonomously.

### FAILED_ORCHESTRATION

The orchestrator itself failed to coordinate the workflow correctly.

## 18. Enterprise Principle

The orchestration layer must be:

```text
Deterministic
Bounded
Idempotent
Traceable
Auditable
Context-isolated
Evidence-driven
```

The orchestrator's responsibility is:

```text
COORDINATE → GATE → ROUTE → RECORD
```

Not:

```text
GUESS → DUPLICATE → RETRY FOREVER → HIDE FAILURE
```