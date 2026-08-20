# JIRA Testing Notes Standards

## Purpose

Define the standards for publishing validated QA test-plan information to
JIRA testing notes.

These standards ensure that JIRA contains a consistent, concise,
traceable, and reviewable representation of the testing planned for a
JIRA ticket.

## 1. Source of Truth

The validated test plan is the source of truth for JIRA testing-note
content.

The JIRA Updater must use:

`testplan/[ticket-key]-[short-name].md`

as the primary source.

The JIRA Updater must not invent:

- Test scenarios
- Test cases
- Acceptance criteria
- Test results
- Coverage counts
- Risks
- Open questions
- Automation status

All published testing information must originate from the validated
test plan or explicitly supplied test-execution results.

## 2. Validation Requirement

Only a test plan that has successfully passed the Test Plan Validator
may be published to JIRA.

Required workflow:

Test Planner
    |
    v
Test Plan
    |
    v
Test Plan Validator
    |
    +---- FAIL ---> Stop
    |
    +---- PASS ---> JIRA Updater

If validation status cannot be confirmed, the JIRA Updater must not
publish the testing notes.

## 3. JIRA Scope

The JIRA Updater may update only the configured testing-note location.

Unless explicitly configured otherwise, it must not modify unrelated
JIRA fields such as:

- Summary
- Description
- Acceptance Criteria
- Priority
- Status
- Assignee
- Reporter
- Labels
- Components
- Sprint
- Story Points
- Other unrelated fields

## 4. Testing Note Objective

The JIRA testing note must provide a concise summary of the validated
test plan.

It should communicate:

- What functionality is covered.
- Acceptance-criteria coverage.
- Test coverage by type.
- Automation candidates.
- Test-data references.
- Regression impact.
- Relevant risks.
- Open questions.
- Test-plan location.
- Validation status.

The complete test plan remains in the repository.

JIRA should contain a summary, not a duplicate of the complete test
plan.

## 5. Required Testing Note Format

The JIRA testing note must follow this structure:

## QA Test Plan

### Test Plan

Test Plan:
`testplan/[ticket-key]-[short-name].md`

### Scope

Brief summary of the functionality covered by the test plan.

### Test Coverage

| Test Type     | Count|
|---------------|-----:|
| Functional    | X    |
| Non-Functional| X    |
| Security      | X    |
| Regression    | X    |

Only include applicable test types.

### Acceptance Criteria Coverage

| AC ID  | Test Cases     | Status  |
|--------|----------------|---------|
| AC-001 | TC-001         | Covered |
| AC-002 | TC-002, TC-003 | Covered |

### Automation

| Metric                | Value |
|-----------------------|------:|
| Automation Candidates | X     |
| Manual Only           | X     |

### Test Data

| Test Data ID | Description     |
|--------------|-----------------|
| TD-001       | Registered user |
| TD-002       | Invalid email   |

Do not include credentials or secrets.

### Regression Impact

Brief summary of relevant regression areas.

### Risks

List only risks relevant to the feature.

### Open Questions

List unresolved questions that materially affect testing.

### Status

Test Plan: Validated

## 6. Conciseness

JIRA testing notes must be concise and readable.

Do not copy:

- Complete test cases.
- Detailed test steps.
- Playwright code.
- Page Object code.
- Selectors.
- Locators.
- Debug logs.
- Large sections of the test plan.

The repository test plan remains the detailed source.

## 7. Test Plan Reference

Always include the generated test-plan path.

Example:

`testplan/PROJ-1234-password-reset.md`

If the environment supports repository links, the JIRA Updater may use
the configured repository URL.

The JIRA Updater must not invent repository URLs.

## 8. Acceptance Criteria Traceability

Acceptance criteria must remain traceable to test cases.

Use:

| AC ID  | Test Cases     | Status  |
|--------|----------------|---------|
| AC-001 | TC-001         | Covered |
| AC-002 | TC-002, TC-003 | Covered |

Every applicable acceptance criterion should have corresponding test
coverage.

If an acceptance criterion is explicitly identified as non-testable,
the reason must be documented in the test plan.

The JIRA note must reflect the validated test plan and must not create
new mappings.

## 9. Test Coverage Counts

Coverage counts must be calculated directly from the validated test
plan.

Examples:

- Functional
- Non-Functional
- Security
- Regression

Do not estimate or manually invent counts.

The counts in JIRA must match the validated test plan.

## 10. Automation Summary

The automation summary must come from the validated test plan.

Use:

- Automation Candidates
- Manual Only

An automation candidate means the test is suitable for automation.

It does not mean that Playwright code has already been generated.

Do not claim that a test is:

`Automated`

unless executable automation has actually been generated and the
downstream workflow has confirmed it.

## 11. Testing Status

For the test-planning workflow, use:

`Test Plan: Validated`

Do not report:

- Testing Passed
- Testing Failed
- All Tests Passed
- All Tests Failed

unless actual test execution has occurred and execution results have
been supplied by the Test Runner workflow.

Test planning status and test execution status must remain separate.

## 12. Duplicate Update Prevention

The JIRA Updater must avoid creating duplicate testing notes for the
same test-plan version.

Use a stable identifier.

Recommended identifier:

`QA Test Plan: [JIRA KEY]`

Before creating a new testing note, the updater should determine whether
a previous QA Test Plan update exists.

## 13. Update Behaviour

If no previous QA Test Plan update exists:

Create the testing note.

If a previous QA Test Plan update exists and the test plan has changed:

Update the existing testing note where safe update functionality is
available.

If safe update functionality is unavailable:

Create a new versioned testing note according to project conventions.

The updater must not overwrite unrelated JIRA comments or documentation.

## 14. Version Identification

Where versioning is required, use:

`Test Plan Version: X`

Example:

`Test Plan Version: 1.1`

Version numbers must follow an established project convention where one
exists.

The updater must not invent a versioning scheme if the project has not
defined one.

## 15. Test Data

JIRA testing notes may reference test-data IDs.

Example:

| Test Data ID | Description     |
|--------------|-----------------|
| TD-001       | Registered user |
| TD-002       | Invalid email   |

Never publish:

- Passwords
- API keys
- Access tokens
- Authentication credentials
- Secrets
- Production credentials
- Sensitive personal information

Use test-data references instead.

## 16. Sensitive Information

Before publishing the testing note, verify that it does not contain
sensitive information.

If sensitive information is detected:

1. Do not publish the note.
2. Return a blocked/failed update status.
3. Identify that sensitive information was detected.
4. Do not expose the sensitive value in the error message.

## 17. Source Traceability

The JIRA testing note must preserve the following traceability:

JIRA Ticket
    |
    v
Test Plan
    |
    v
Acceptance Criteria
    |
    v
Test Cases

The JIRA note is a summary and reference point.

The repository test plan remains the detailed source for test design.

## 18. Regression Impact

Include regression impact when applicable.

The summary should identify affected or related areas such as:

- Existing functionality
- Shared components
- Authentication
- Related workflows
- Existing integrations
- Business-critical paths

Do not include unrelated regression areas.

## 19. Risks

Include only risks identified by the validated test plan.

Examples:

- Requirement ambiguity
- Test-data dependency
- Environment dependency
- Authentication dependency
- External-system dependency
- Integration dependency
- Browser compatibility

Do not invent risks.

## 20. Open Questions

Include only material unresolved questions from the validated test plan.

Examples:

- Undefined validation limits
- Missing expected behaviour
- Undefined user roles
- Undefined error behaviour
- Missing test-data requirements
- Undefined dependencies

Do not silently convert open questions into confirmed requirements.

## 21. Formatting Standards

Use:

- Clear headings
- Markdown tables
- Short bullet lists
- Consistent terminology
- Concise descriptions

Avoid:

- Excessive prose
- Duplicate information
- Implementation details
- Playwright code
- Locators
- Selectors
- Debug output

## 22. No-Invention Rule

The JIRA Updater must not introduce information that is not supported
by the validated test plan.

Do not invent:

- Requirements
- Acceptance criteria
- Test scenarios
- Test cases
- Expected results
- Coverage counts
- Risks
- Open questions
- Automation status
- Test execution results

If information is unavailable, preserve the absence rather than making
an assumption.

## 23. Test Execution Separation

These standards define JIRA documentation for test planning.

They do not define test execution reporting.

Execution results must be supplied by the Test Runner workflow.

The following distinction must always be maintained:

Test Plan
    =
Planned test coverage

Test Execution
    =
Actual test results

A validated test plan must not be described as successful test
execution.

## 24. Quality Gate

A JIRA testing note is valid only when:

- The source test plan passed validation.
- The JIRA Ticket ID is correct.
- The test-plan reference is present.
- Acceptance-criteria traceability is preserved.
- Test counts match the validated test plan.
- Automation information matches the validated test plan.
- Relevant regression impact is included.
- Relevant risks are included.
- Relevant open questions are included.
- No sensitive information is exposed.
- No unsupported testing claims are made.
- No unrelated JIRA fields are modified.

## 25. Failure Handling

If the JIRA update fails, the updater must not report success.

Use:

`JIRA_UPDATE_FAILED`

The failure should include:

- JIRA Ticket ID
- Test-plan path
- Failure reason
- Whether the test plan itself remains valid

The validated test plan must remain unchanged.

## 26. Completion State

After successful publication:

`JIRA_TESTING_NOTES_UPDATED`

The underlying detailed test plan remains stored at:

`testplan/[ticket-key]-[short-name].md`

The JIRA testing note acts as a concise, traceable summary of the
validated test plan.