# Test Runner Standards

## Purpose

Define enterprise standards for executing approved Playwright UI automation, collecting reliable execution evidence, classifying results and producing machine-readable and human-readable reports for downstream processing.

## 1. Source of Truth

Execution scope must come from approved automation and, where applicable:

```text
testplan/[ticket-key]-[short-name].md
```

The validation report is the quality gate:

```text
validation/[ticket-key]-[short-name]-validation.md
```

Automation must not execute when the validation gate is:

```text
FAIL
```

## 2. Separation of Responsibilities

The Test Runner is responsible for:

- Test execution
- Test selection
- Result collection
- Evidence collection
- Failure classification
- Traceability
- Reporting

The Test Runner is not responsible for:

- Test generation
- Page Object creation
- Locator creation
- Failure healing
- JIRA requirement changes

Architecture:

```text
Test Planner
    ↓
Test Plan
    ↓
Validator
    ↓
Automate UI
    ↓
Test Runner
    ↓
Execution Results
    ↓
Heal Test
```

## 3. Execution Scope

Supported execution scopes should include:

- Individual test
- Test case
- Feature
- Test file
- JIRA ticket
- Tag
- Smoke
- Regression
- Full approved UI suite

The runner must not execute unrelated tests.

## 4. Playwright Configuration

Use the repository's existing Playwright configuration.

Respect:

- Browser projects
- Base URL
- Fixtures
- Timeouts
- Retries
- Workers
- Reporter configuration
- Output directories
- Environment configuration

Do not override project configuration without a specific execution requirement.

## 5. Retry Standards

Retries are controlled by project configuration.

Reports must distinguish:

```text
Initial Attempt
Retry Attempt
Final Result
```

A test that initially fails but passes after retry must be reported as:

```text
PASS_WITH_RETRY
```

The original failure evidence must remain available.

Retries are not healing.

## 6. Result Statuses

Required statuses:

```text
PASSED
FAILED
SKIPPED
BLOCKED
```

Optional:

```text
PASS_WITH_RETRY
```

Definitions:

### PASSED

All required test actions and assertions completed successfully.

### FAILED

The test executed but failed because of an assertion, action, locator, application or other test-execution problem.

### SKIPPED

The test was intentionally not executed.

### BLOCKED

The test could not meaningfully execute because of environment, dependency, setup or infrastructure conditions.

### PASS_WITH_RETRY

The test failed initially and passed on a configured retry.

## 7. Failure Classification

Where evidence supports classification, use:

```text
ASSERTION_FAILURE
LOCATOR_FAILURE
TIMEOUT
NAVIGATION_FAILURE
AUTHENTICATION_FAILURE
NETWORK_FAILURE
APPLICATION_ERROR
ENVIRONMENT_FAILURE
TEST_DATA_FAILURE
CONFIGURATION_FAILURE
UNKNOWN
```

Classification must be evidence-based.

## 8. Evidence

For failed or blocked tests, retain available:

- Error message
- Stack trace
- Failed assertion
- Failed step
- Screenshot
- Video
- Trace
- Console errors
- Network information
- Browser
- Environment
- Duration

Do not fabricate missing evidence.

## 9. Traceability

Execution must preserve:

```text
JIRA
  ↓
Acceptance Criterion
  ↓
Test Case
  ↓
Playwright Test
  ↓
Execution Result
```

Example:

```text
SCRUM-2
AC-01
TC-001
login.spec.ts
PASSED
```

Missing traceability must be reported rather than invented.

## 10. Expected Results

The test plan's expected results are the reference for intended behaviour.

The runner must not alter expected results.

If implementation assertions differ from the approved test plan, report the discrepancy.

Do not silently modify tests.

## 11. Environment Capture

Where available, capture:

- Environment
- Base URL
- Browser
- Browser version
- Playwright version
- Operating system
- Project
- Execution timestamp
- Duration

Never expose secrets.

## 12. Secret Protection

Execution reports must never contain:

- Passwords
- API keys
- Access tokens
- Session cookies
- Authentication secrets
- Private credentials

Sensitive values must be masked or omitted.

## 13. Artifact Location

Execution artifacts must be stored under:

```text
execution/[ticket-key]-[short-name]/
```

Example:

```text
execution/SCRUM-2-login/
```

Required:

```text
execution-report.md
execution-results.json
```

Playwright screenshots, videos and traces must follow the project's configured artifact location.

## 14. Human-Readable Report

Every execution must produce a Markdown report containing:

- JIRA
- Test plan
- Validation status
- Execution scope
- Environment
- Browser
- Result counts
- Test-level results
- Failure details
- Retry information
- Evidence references
- Downstream healing status

## 15. Machine-Readable Report

Every execution must produce:

```text
execution-results.json
```

The JSON must contain enough information for downstream agents to consume without parsing the Markdown report.

At minimum include:

```text
JIRA
test plan
validation status
execution status
summary counts
test case ID
acceptance criterion
test title
spec path
result
failure category where applicable
error information where applicable
evidence paths where applicable
retry information
```

## 16. Downstream Healing Contract

The `healTest` agent consumes:

```text
execution-results.json
```

The runner must provide sufficient failure information for healing analysis.

The runner must not change the failed test.

## 17. JIRA Separation

The Test Runner should not directly update JIRA testing notes.

Preferred:

```text
Test Runner
    ↓
Execution Report
    ↓
JIRA Updater
    ↓
JIRA Testing Notes
```

## 18. No Silent Failure

The runner must never:

- Suppress failures.
- Convert failures to skipped.
- Treat blocked tests as passed.
- Delete evidence.
- Hide retry failures.
- Modify assertions.
- Ignore selected tests.

Every selected test must have a final reported state.

## 19. Execution Quality Gate

An execution is valid only when:

- Requested scope was identified.
- Validation status was checked.
- Selected tests were executed or explicitly blocked/skipped.
- Every selected test has a final state.
- Failure evidence was collected where available.
- Results were classified.
- Traceability was evaluated.
- Markdown report was generated.
- JSON report was generated.
- Artifacts were persisted.

## 20. Enterprise Principle

The Test Runner must be deterministic, auditable and evidence-driven.

The runner's responsibility is:

```text
EXECUTE → OBSERVE → CLASSIFY → REPORT
```

Not:

```text
EXECUTE → MODIFY → HIDE FAILURE
```

Failure correction belongs to:

```text
healTest
```