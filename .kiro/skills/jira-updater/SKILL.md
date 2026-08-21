---
name: jira-updater
description: Publish validated QA test-plan summaries to JIRA testing notes. Use when updating JIRA with validated test plans, acceptance criteria coverage, testing scope, automation summaries and regression impact.
---

# JIRA Updater Skill

**Skill Name:** jira-updater
**Version:** 1.0
**Status:** Active
**Skill Type:** JIRA Test Documentation
**Primary Actor:** JIRA Updater Agent
**Framework:** Autonomous QA Test Automation Framework
**Execution Environment:** Kiro

---

## 1. Purpose

The JIRA Updater Agent publishes validated test-plan information to the
appropriate JIRA testing-note location.

The agent provides a concise testing summary in JIRA while maintaining
the complete test plan in the repository.

The authoritative rules for JIRA testing notes are defined in:

`steering/jira-testing-notes-standards.md`

The JIRA Updater must follow those standards and must not redefine or
override them.

---

## 2. Role

Act as a Senior QA Documentation Agent responsible for maintaining
testing information in JIRA.

The JIRA Updater must:

- Consume only validated test plans.
- Verify the associated JIRA ticket.
- Read the validated test plan.
- Generate the JIRA testing-note content.
- Preserve requirement traceability.
- Prevent unnecessary duplicate updates.
- Publish the testing summary to JIRA.
- Report update status.

The JIRA Updater must not:

- Generate test plans.
- Modify test cases.
- Generate Playwright code.
- Execute tests.
- Heal tests.
- Create JIRA defects.
- Modify unrelated JIRA fields.

---

## 3. Framework Dependencies

The JIRA Updater operates within the following framework hierarchy:

```text
power.md
    |
    v
global-standards.md
    |
    v
steering/jira-testing-notes-standards.md
    |
    v
skills/jira-updater.md
```

The authoritative source for JIRA testing-note rules is:

`steering/jira-testing-notes-standards.md`

The JIRA Updater must read and follow that file before performing an update.

---

## 4. Input

The primary input is a validated test plan.

Expected input:

```text
testplan/[ticket-key]-[short-name].md
```

Example:

```text
testplan/PROJ-1234-password-reset.md
```

The test plan must have successfully passed the Test Plan Validator.

Expected validation state:

```text
PASS
```

The JIRA Ticket ID must be identifiable from the test plan.

Example:

```text
PROJ-1234
```

---

## 5. Prerequisite

The JIRA Updater must not proceed when the test plan has not passed validation.

Required flow:

```text
Test Planner
    |
    v
Test Plan
    |
    v
Test Plan Validator
    |
    +---- FAIL ---> STOP
    |
    +---- PASS ---> JIRA Updater
```

If validation status cannot be established:

```text
JIRA_UPDATE_BLOCKED
```

Do not update JIRA.

---

## 6. JIRA Integration

Use the configured Atlassian Rovo MCP Server.

JIRA configuration is externalized.

Expected configuration:

```text
JIRA_INSTANCE_URL
JIRA_SITE_HOSTNAME
JIRA_PROJECT
```

Authentication must be handled by the configured JIRA MCP server.

Do not hard-code:

- Credentials.
- Passwords.
- API tokens.
- Access tokens.
- Authentication headers.
- Enterprise secrets.

---

## 7. JIRA Ticket Validation

Before updating JIRA:

1. Extract the JIRA Ticket ID from the test plan.
2. Retrieve the JIRA ticket through the Atlassian Rovo MCP Server.
3. Confirm that the ticket exists.
4. Confirm that the test plan refers to the same ticket.
5. Confirm that the test-plan feature matches the ticket.

If the ticket cannot be retrieved:

```text
JIRA_UPDATE_FAILED
```

Do not publish the testing note.

---

## 8. Sequential Workflow

Execute the following workflow sequentially:

1. Receive validated test-plan path.
2. Verify the test plan exists.
3. Read the JIRA Testing Notes Standards.
4. Verify validation status is `PASS`.
5. Extract JIRA Ticket ID.
6. Fetch the JIRA ticket.
7. Validate ticket identity.
8. Read the complete test plan.
9. Extract required testing information.
10. Calculate coverage and automation counts.
11. Generate the JIRA testing-note content.
12. Check for an existing QA Test Plan update.
13. Determine create vs update behaviour.
14. Publish the testing note through Atlassian Rovo MCP.
15. Verify the update where supported.
16. Return completion status.

---

## 9. Test Plan Reading

Read the validated test plan as the source for:

- Test-plan summary.
- Scope.
- Acceptance criteria.
- Test scenarios.
- Test cases.
- Test types.
- Test data.
- Automation candidates.
- Regression impact.
- Risks.
- Open questions.

Do not create new test scenarios.

Do not modify the source test plan.

---

## 10. Coverage Calculation

Calculate coverage information directly from the validated test plan.

Determine:

- Number of Functional test cases.
- Number of Non-Functional test cases.
- Number of Regression test cases.
- Number of Security test cases.
- Number of Automation Candidates.
- Number of Manual Only cases.

Only include applicable categories.

Do not invent counts.

---

## 11. Acceptance Criteria Summary

Extract the acceptance-criteria-to-test-case mapping from the test plan.

Generate:

| AC ID  | Test Cases      | Status  |
|--------|-----------------|---------|
| AC-001 | TC-001          | Covered |
| AC-002 | TC-002, TC-003  | Covered |

Do not create mappings that do not exist in the validated test plan.

---

## 12. Testing Note Generation

Generate the JIRA note according to:

`steering/jira-testing-notes-standards.md`

Do not create an alternative format.

The generated note must be concise and must not duplicate the complete test plan.

---

## 13. Test Plan Reference

Always include the test-plan path:

```text
testplan/[ticket-key]-[short-name].md
```

Do not invent repository URLs.

If a configured repository URL exists and the project supports clickable
links, use the configured value.

---

## 14. Automation Status

The JIRA testing note must distinguish between:

```text
Automation Candidate
```

and:

```text
Automated
```

A test marked `Automation: Yes` means the test is suitable for automation.

It does not mean that Playwright code has been generated or executed.

Do not claim `Automated` unless actual automation implementation has been
completed by a downstream workflow.

---

## 15. Test Execution Status

The JIRA Updater is responsible for test-plan documentation only.

Do not report execution results.

Do not publish:

- Passed.
- Failed.
- All tests passed.
- All tests failed.

unless actual execution results have been supplied by the Test Runner
workflow and the update request explicitly concerns execution results.

For test planning, use:

```text
Test Plan: Validated
```

---

## 16. Duplicate Detection

Before creating a new JIRA testing note, determine whether an existing
QA Test Plan update exists.

Use the stable identifier defined in:

`steering/jira-testing-notes-standards.md`

Recommended identifier:

```text
QA Test Plan: [JIRA KEY]
```

If an existing update is found:

- Determine whether the current test plan represents a new version.
- Update the existing testing note when safe update functionality is available.
- Otherwise create a versioned update according to the standards.

Do not overwrite unrelated JIRA comments.

---

## 17. JIRA Update Scope

Only update the configured testing-note location.

Do not modify unrelated fields.

Unless explicitly configured otherwise, do not modify:

- Summary.
- Description.
- Acceptance Criteria.
- Priority.
- Status.
- Assignee.
- Reporter.
- Labels.
- Components.
- Sprint.
- Story Points.
- Other unrelated fields.

---

## 18. Sensitive Information

Before publishing, verify that the generated note contains no:

- Passwords.
- API keys.
- Access tokens.
- Credentials.
- Secrets.
- Production personal data.

Use Test Data IDs instead.

If sensitive information is detected:

1. Do not publish.
2. Return `JIRA_UPDATE_BLOCKED`.
3. Identify that sensitive information was detected without exposing the sensitive value.

---

## 19. Update Failure Handling

If the Atlassian Rovo MCP update fails, return:

```text
JIRA_UPDATE_FAILED

JIRA: [JIRA KEY]

Test Plan:
testplan/[ticket-key]-[short-name].md

Reason:
[Failure reason]
```

The validated test plan remains unchanged.

Do not claim that the JIRA update succeeded.

---

## 20. Update Verification

Where the Atlassian Rovo MCP supports retrieval after an update:

1. Re-fetch the relevant JIRA testing-note location.
2. Confirm that the update exists.
3. Confirm that the JIRA Ticket ID is correct.
4. Confirm that the test-plan reference is present.

If verification is unavailable:

```text
JIRA_UPDATE_VERIFICATION: NOT_AVAILABLE
```

Do not treat lack of verification as proof that the update failed.

---

## 21. No-Invention Principle

The JIRA Updater must never invent:

- Test cases.
- Acceptance criteria.
- Coverage counts.
- Test results.
- Automation implementation status.
- Risks.
- Open questions.
- Requirements.

All published testing information must originate from the validated test
plan or explicitly supplied execution information.

---

## 22. Completion

The JIRA Updater is complete when:

1. The validated test plan was successfully read.
2. Validation status was confirmed as `PASS`.
3. The JIRA ticket was successfully identified.
4. The JIRA ticket was successfully retrieved.
5. Testing-note content was generated according to the standards.
6. Coverage counts were calculated from the test plan.
7. Acceptance-criteria traceability was preserved.
8. Duplicate-update handling was performed.
9. The JIRA update was successfully submitted.
10. Update verification was completed where supported.

---

## 23. Successful Output

```text
JIRA_TESTING_NOTES_UPDATED

JIRA:
[JIRA KEY]

Test Plan:
testplan/[ticket-key]-[short-name].md

Validation:
PASS

JIRA Update:
SUCCESS

Status:
Testing Notes Updated
```

---

## 24. Failed Output

```text
JIRA_TESTING_NOTES_UPDATE_FAILED

JIRA:
[JIRA KEY]

Test Plan:
testplan/[ticket-key]-[short-name].md

Validation:
[PASS / NOT VERIFIED]

JIRA Update:
FAILED

Reason:
[Failure reason]

Status:
Manual Investigation Required
```
