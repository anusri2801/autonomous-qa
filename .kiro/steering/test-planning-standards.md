---
inclusion: always
---

# Test Planning Standards

## Purpose

Define standards for generating high-quality, traceable and
automation-ready test plans from JIRA requirements.

---

## When to Apply

Apply these rules when the user asks to plan, design or create test
scenarios/test plans for a web application or website.

Trigger phrases include:

- "plan tests"
- "create test plan"
- "create test scenarios for"
- "generate test plan for ticket"

---

## JIRA Integration

The JIRA instance is configured via the Atlassian Rovo MCP Server.
Use the configured JIRA site hostname.

1. **Fetch the ticket** — Retrieve full ticket details.
2. **Focus on Acceptance Criteria** — The Acceptance Criteria section is the primary source for test coverage.
   Each Acceptance Criterion must map to one or more test scenarios and test cases as required.
   A single Acceptance Criterion may produce multiple scenarios, including functional, non-functional,
   regression or security scenarios where applicable.
3. **Extract supporting context** — Use Business Rules (BR), Functional Requirements (FR) and descriptions for preconditions.
4. **Handle out-of-scope items** — Ignore requirements or acceptance criteria that are explicitly marked as
   struck-through, removed, cancelled, or out of scope in JIRA.
   Do not assume that an item is out of scope unless the JIRA ticket clearly indicates this.

---

## Output Format

The test plan MUST use a markdown table with these columns:

```markdown
# [TICKET-KEY] [Title]

## Summary
- **Ticket:** [KEY]
- **Title:** [Summary]
- **Fix Version:** [version]
- **Feature:** [area]

## Test Data References
| Key              | Description                      |
|------------------|----------------------------------|
| New user         | Unregistered user                |
| Registered user  | Login credentials available      |

## Scenarios
| Test Case ID | Title | Test Type | Priority | Acceptance Criteria Ref | Preconditions | Test Data Ref | Screen/URL | Test Steps | Expected Result | Automation Candidate | Tags |
|---|---|---|---|---|---|---|---|---|---|---|---|
| TC-001 | Dashboard verification | Functional | High | AC-01 | User must be registered | Registered user | Login -> Dashboard | 1. Login as registered user. 2. Verify dashboard is displayed. | 1. Dashboard is displayed. 2. Accounts displayed with no errors. | Yes | @smoke, @regression |
```

---

## Table Column Rules

| Column                    | Rule |
|---------------------------|------|
| **Test Case ID**           | Sequential: `TC-001`, `TC-002` |
| **Title**                  | Short descriptive name derived from AC |
| **Test Type**              | Supported types: `Functional`, `Non-Functional`, `Regression`, `Security` |
| **Priority**               | Supported values: `Critical`, `High`, `Medium`, `Low`. Based on: business impact, risk, requirement criticality, user impact and failure impact. The Test Planner must not arbitrarily assign Critical priority. |
| **Acceptance Criteria Ref**| Every test case must map to one or more acceptance criteria. Every acceptance criterion must have at least one test case unless explicitly marked as non-testable. |
| **Preconditions**          | Use Business Rules (BR), Functional Requirements (FR) and descriptions for preconditions. |
| **Test Data Ref**          | Comma-separated `data refs` if the same scenario is tested for different data sets. |
| **Screen/URL**             | Navigation path: `Login -> Dashboard` or direct URL. |
| **Test Steps**             | Maximum 5–6 concise steps per scenario. |
| **Expected Result**        | Numbered, verifiable outcomes. |
| **Automation Candidate**   | Each test case must indicate `Yes` or `No`. A test is normally an automation candidate when it is repeatable, has deterministic expected results, is suitable for UI automation, and provides regression value. A test may not be an automation candidate when it requires subjective human judgement, visual assessment beyond defined automation capabilities, external systems unavailable to the framework, or manual-only processes. The reason must be documented when automation is not recommended. |
| **Tags**                   | Use only approved framework tags: `@smoke`, `@sanity`, `@regression`. Tag selection must reflect test intent. Example — primary business path: `@smoke @regression`. |

---

## Steps Writing Rules

- Maximum 5–6 steps per scenario.
- Use imperative verbs: `Login`, `Navigate`, `Click`, `Fill`, `Submit`, `Verify`.
- Do not describe UI details (selectors, buttons, labels).
- Combine related sub-actions into one step (e.g. "Fill login credentials and submit" is one step).
- Authentication must be explicitly represented either as a precondition, test step, or framework-managed setup.
  Do not repeat authentication steps when authentication is handled by the test framework.

---

## Project Conventions

| Convention        | Value |
|-------------------|-------|
| Test plan location | `testplan/[ticket-key]-[short-name].md` |
| Tags source        | `utils/configuration.ts` — `@regression`, `@smoke`, `@sanity` |
| Test data location | `src/testdata` |

- Scenarios must be independent and can run in any order.
- Never hardcode URLs, credentials or environment-specific values.

---

## 1. Source of Truth

JIRA is the authoritative source for requirements.

The Test Planner must analyse:

- Summary
- Description
- Acceptance criteria
- Business rules
- Relevant comments
- Priority
- Labels
- Dependencies where available

The Test Planner must not invent requirements.

---

## 2. Test Planning Objectives

The test plan must provide sufficient coverage to validate:

- Functional behaviour
- Non-Functional behaviour
- Regression scenarios
- Security scenarios
- Input validation
- Error handling
- Authorization where applicable
- Business-critical paths

---

## 3. Test Case Structure

Each test case must contain:

- Test Case ID
- Title
- Test type
- Priority
- Acceptance Criterion Ref
- Preconditions
- Test Data Ref
- Screen / URL
- Test steps
- Expected result
- Automation candidate
- Tags

Example:

```text
TC-001

Title:         Reset password using registered email
Type:          Functional
Priority:      High
AC:            AC-01
Preconditions: User has a registered account
Test Data:     Registered user
Screen:        Password Reset
URL:           /password-reset
Automation:    Yes
Tags:          @smoke @regression
```

---

## 4. Positive Scenarios

For each functional requirement, identify the primary successful business flow.

Example:

```text
Valid registered email
    → password reset request
    → confirmation displayed
```

---

## 5. Negative Scenarios

Identify relevant invalid conditions.

Examples:

- Invalid email
- Unknown email
- Missing required field
- Invalid format
- Unauthorized access
- Invalid state

Negative scenarios should be generated where they are supported by
the requirement or expected system behaviour.

---

## 6. Boundary Testing

Identify explicit or implied boundaries.

Examples:

- Minimum length
- Maximum length
- Minimum allowed value
- Maximum allowed value
- Just below boundary
- Just above boundary

Do not invent numeric limits when none are defined.

If the boundary is unknown, identify it as an open question.

---

## 7. Test Scope

The test plan must explicitly identify:

### In Scope

Functionality directly affected by the JIRA ticket.

### Out of Scope

Functionality not affected by the change or not supported by the
current test objective.

---

## 8. Risks

Identify relevant testing risks.

Examples:

- Requirement ambiguity
- Dependency on external system
- Test data dependency
- Environment dependency
- Authentication dependency
- Browser compatibility
- Integration dependency

Do not invent risks unrelated to the feature.

---

## 9. Open Questions

Any ambiguity that could materially affect testing must be documented.

Example:

> Password expiry period is not defined in the requirement.

The Test Planner must not silently assume a value.

---

## 10. Test Data

Identify required test data.

Examples:

- Registered user
- New user
- Unregistered user
- Valid email
- Invalid email
- Expired account

Sensitive credentials must never be included directly in the test plan.

Test Data References format:

| Key              | Description |
|------------------|-------------|
| Registered user  | ...         |
| Invalid email    | ...         |

---

## 11. Regression Impact

Identify whether existing functionality may be affected.

Consider:

- Related features
- Shared components
- Authentication flows
- Existing integrations
- Existing automation coverage

---

## 12. Test Plan Location

All generated test plans must follow:

```text
testplan/[ticket-key]-[short-name].md
```

Example:

```text
testplan/DEMO-001-password-reset.md
```

---

## 13. Quality Gate

A test plan is considered valid only when all gates below pass.

The Test Plan Validator is responsible for enforcing this quality gate.

Evaluate every applicable gate. Report `NOT VERIFIED` or `NOT APPLICABLE` where appropriate. Never report PASS for a gate that was not actually evaluated.

| Quality Gate | Source |
|---|---|
| Test plan file exists and is readable | §12 |
| File location and naming convention | §12 |
| Required sections present | Output Format |
| Requirements analysed | §1 |
| All ACs identified and covered | §13 |
| Positive scenarios covered | §4 |
| Negative scenarios covered | §5 |
| Boundary scenarios considered | §6 |
| Test case structure complete | §3 |
| Test Case IDs unique and sequential | §3 |
| Test steps follow rules | Steps Writing Rules |
| Expected results present and verifiable | §3 |
| Test types approved | Table Column Rules |
| Priorities appropriate | Table Column Rules |
| Tags approved | Table Column Rules |
| Automation candidates identified | Table Column Rules |
| Test data references present, no sensitive values | §10 |
| Screen / URL information present where known | Table Column Rules |
| Regression impact assessed | §11 |
| Risks documented | §8 |
| Open questions documented | §9 |
| No unsupported requirements invented | §1 |
| Traceability: JIRA → AC → Scenario → TC | §1, §3 |
| Internal consistency across all sections | All sections |
| Project naming and folder conventions | §12, `power.md` |
