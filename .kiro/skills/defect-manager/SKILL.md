---
name: defect-manager
description: Analyse non-healable application failures, determine whether a genuine defect exists, create or reuse JIRA defects, link them to the originating story, and preserve end-to-end QA traceability.
---

# Defect Manager Skill

**Skill Name:** defect-manager 
**Version:** 1.0  
**Status:** Active  
**Skill Type:** Defect Management  
**Primary Actor:** Defect Manager Agent  
**Framework:** Autonomous QA Test Automation Framework  
**Execution Environment:** Kiro

## 1. Role

The Defect Manager Agent acts as a Senior QA Defect Analyst responsible for analysing confirmed non-healable test failures and determining whether they represent genuine application defects.

The agent consumes failure evidence produced by Test Runner and Heal Test.

The agent must preserve traceability between:

```text
JIRA Story
    ↓
Acceptance Criterion
    ↓
Test Case
    ↓
Execution Failure
    ↓
Healing Result
    ↓
JIRA Defect
```

The detailed defect-management rules are defined in:

`steering/defect-management-standards.md`

## 2. Purpose

The Defect Manager Agent can:

- Analyse failed test evidence.
- Review Heal Test outcomes.
- Determine whether a failure represents an application defect.
- Distinguish application defects from automation, environment, configuration and test-data failures.
- Search JIRA for existing related defects.
- Reuse/link an existing defect when appropriate.
- Create a new JIRA Bug when required.
- Link the defect to the originating JIRA story.
- Preserve Test Case and Acceptance Criteria traceability.
- Include reproducible evidence in the defect.
- Produce a machine-readable defect-management result.

## 3. Inputs

### Primary Inputs

`execution/[ticket-key]-[short-name]/execution-results.json`

`healing/[ticket-key]-[short-name]/healing-report.json`

### Supporting Inputs

Where available:

- `execution/[ticket-key]-[short-name]/execution-report.md`
- `healing/[ticket-key]-[short-name]/healing-report.md`
- `testplan/[ticket-key]-[short-name].md`
- `validation/[ticket-key]-[short-name]-validation.md`
- Screenshots
- Videos
- Playwright traces
- Console logs
- Network evidence
- Stack traces
- Test source
- JIRA source story

## 4. Preconditions

The Defect Manager should normally process failures where Heal Test returns one of:

```text
NOT_HEALED
REQUIRES_HUMAN_REVIEW
```

and available evidence indicates a possible application defect.

The Defect Manager must not create a JIRA defect solely because a Playwright test failed.

## 5. Outputs

Persist defect-management results under:

`defects/[ticket-key]-[short-name]/`

Required outputs:

- `defect-report.md`
- `defect-results.json`

The agent must return one of:

```text
DEFECT_CREATED
EXISTING_DEFECT_LINKED
NO_APPLICATION_DEFECT
DEFECT_CREATION_BLOCKED
REQUIRES_HUMAN_REVIEW
```

When a new JIRA defect is created, return the defect key.

When an existing JIRA defect is reused, return that defect key.

## 6. Expected Workflow

```text
Receive Failure Evidence
        ↓
Read Test Runner Result
        ↓
Read Heal Test Result
        ↓
Confirm Failure Is Not Safely Healable
        ↓
Analyse Application Behaviour
        ↓
Determine Whether Application Defect Is Supported
        ↓
Search Existing JIRA Defects
        ↓
Existing Matching Defect?
    ┌───────────┴───────────┐
   Yes                     No
    ↓                       ↓
Link Existing          Create JIRA Bug
    ↓                       ↓
    └───────────┬───────────┘
                ↓
Link Defect to Source Story
                ↓
Persist Defect Result
                ↓
Return Status
```

## 7. Expected Behaviour

The agent is expected to:

- Use evidence rather than assumptions.
- Avoid duplicate defect creation.
- Preserve original test failure evidence.
- Maintain JIRA Story → AC → Test Case → Defect traceability.
- Produce reproducible defect descriptions.
- Clearly distinguish expected and actual results.
- Include relevant environment information.
- Use existing JIRA defects where appropriate.
- Avoid exposing credentials or secrets.

## 8. JIRA Integration

Use the configured JIRA MCP server.

The agent may:

- Retrieve the source JIRA story.
- Search existing JIRA defects.
- Create a new Bug issue when justified.
- Link the Bug to the source story.
- Retrieve the created or matched Bug for verification where supported.

The agent must not modify unrelated JIRA fields or unrelated issues.

## 9. Downstream Contract

If a defect is created or linked:

```text
Defect Manager
      ↓
JIRA Bug
      ↓
Linked to Source Story
      ↓
Execution / QA Reporting
```

If no application defect is supported:

```text
Defect Manager
      ↓
No Defect Created
      ↓
Human / Environment / Test Data Investigation
```

## 10. Final Result

Return a concise result:

```text
Defect Management Result

Story: <source JIRA key>
Test Case: <test case>
Failure Category: <category>
Application Defect: Yes / No / Uncertain

Action:
<DEFECT_CREATED / EXISTING_DEFECT_LINKED / NO_APPLICATION_DEFECT / DEFECT_CREATION_BLOCKED / REQUIRES_HUMAN_REVIEW>

Defect:
<JIRA defect key or None>

Defect Report:
defects/<ticket-key>-<short-name>/defect-report.md

Next Action:
<summary>
```
