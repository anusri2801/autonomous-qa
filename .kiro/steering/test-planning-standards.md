# Test Planning Standards

## Purpose

Define standards for generating high-quality, traceable and
automation-ready test plans from JIRA requirements.

## When to apply
Apply these rules when the user asks to plan, design or create test scenarios/test plans for a web application or website. Trigger phrases include "plan tests", "create test plan", "create test scenarios for", "generate test plan for ticket"


## JIRA Integration

The JIRA instance is "<>". Use the configured JIRA site hostname.

1. **Fetch the ticket**: Retrieve full ticket details
2. **Focus on Acceptance Criteria**:
   The Acceptance Criteria section is the primary source for test coverage.

   Each Acceptance Criteria must map to one or more test scenarios
   and test cases as required.

   A single Acceptance Criterion may produce multiple scenarios,
   including functional, non-functional, regression or security
   scenarios where applicable.

3. **Extract supporting context**: Use Business rules(BR),Functional Requierments(FR) and descriptions for preconditions
4. **Handle out-of-scope items**:
   Ignore requirements or acceptance criteria that are explicitly
   marked as struck-through, removed, cancelled, or out of scope in JIRA.

   Do not assume that an item is out of scope unless the JIRA ticket
   clearly indicates this.

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
| Key             | Description         |
|-----------------|---------------------|
|  New user       | Unregistered user   |
|  Registered user| Login credentials available|

## Scenarios
|Test Case ID|Title|Test Type|Priority|Acceptance Criteria Ref|Preconditions|Test Data Ref|Screen/URL|Test Steps|Expected Result|Automation Candidate|Tags|
|-----------|-----|---------|--------|-----------------------|-------------|-------------|----------|----------|------
------|--------------------||---|
|TC-001      | Dashboard verification| Functional| High | AC-01| User must be registered|Registered user|Login -> Dashboard |1. Login as registered user, 2. Verify dashboard is displayed| 1.Dashboard is displayed,2.Accounts displayed with no errors| Yes | @smoke, @regression |
```

## Table Column Rules
| Column                    | Rule                     |
|---------------------------|--------------------------|
| **Test Case ID**           |Sequential: TC-001, TC-002|
|**Title**                  |Short descriptive name derived from AC|
|**Test Type**              |Supported test types: Functional, Non-Functional,Regression,Security|
|**Priority**               |Supported priorities:Critical,High , Medium or Low.Priority should be based on:Business impact, Risk,Requirement criticality,User impact and Failure impact.The Test Planner must not arbitrarily assign Critical priority.|
|**Acceptance Criteria Ref**|Every test case must map to one or more acceptance criteria.Every acceptance criteria must have at least one test case unless explicitly marked as non-testable.|
|**Preconditions**          |Use Business rules(BR),Functional Requierments(FR) and descriptions for preconditions|
|**Test Data ref**          | Comma separated `data refs` if same scenario is tested for different data sets      |
|**Screen/URL**             | Navigation Path: `Login-> Dashboard` or direct url |
|**Test Steps**             | Maximum 5-6 concise steps per scenario |
|**Expected Result**        | Numbered verifiable outcomes           |
|**Automation Candidate**   |Each test case must indicate:Yes / No. A test should normally be considered an automation candidate when it: Is repeatable, Has deterministic expected results,Is suitable for UI automation,Provides regression value. A test may not be an automation candidate when it requires: Subjective human judgement,Visual assessment beyond defined automation capabilities,External systems unavailable to the framework,Manual-only processes. The reason should be documented when automation is not recommended.|
|**Tags**                   | Use only approved framework tags: @smoke,@sanity, @regression. Tag selection must reflect test intent. Examples: Primary business path:@smoke @regression |               

## Steps Writing Rules

- Maximum 5-6 steps per scenario
- Use imperative verbs: Login, Navigate, Click, Fill, Submit, Verify
- DO NOT describe UI details (selectors, buttons, labels)
- Combine related sub-actions into one step (e.g. "Fill login credentials and click on login button" is one step)
- Authentication must be explicitly represented either as a precondition, test step, or framework-managed setup. Do not repeat authentication steps when authentication is handled by the test framework

## Project Conventions

- Test plans: `testplan/[ticket-key]-[short-name].md`
- Scenarios must be independent and  can run in any order
- Never hardcode URLs, credentials or environment-specific values
- Tags: `@regression`, `@smoke`, `@sanity` from `utils/configuration.ts`
- Test data: `src/testdata`


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

## 3. Test Case Structure

Each test case must contain:

- Test Case ID
- Title
- Test type
- Priority
- Acceptance criterion Ref
- Preconditions
- Test data Ref
- Screen
- URL
- Test steps
- Expected result
- Automation candidate
- Tags

Example:

TC-001

Title:
Reset password using registered email

Type:
Functional

Priority:
High

Acceptance Criteria:
AC-01

Preconditions:
User has a registered account

Test Data:
Registered user

Screen:
Password Reset

URL:
/password-reset

Automation Candidate:
Yes

Tags:
@smoke @regression

## 3. Positive Scenarios

For each functional requirement, identify the primary successful
business flow.

Example:

Valid registered email
→ password reset request
→ confirmation displayed

## 4. Negative Scenarios

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

## 5. Boundary Testing

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

## 6. Test Scope

The test plan must explicitly identify:

### In Scope

Functionality directly affected by the JIRA ticket.

### Out of Scope

Functionality not affected by the change or not supported by the
current test objective.

## 7. Risks

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

## 8. Open Questions

Any ambiguity that could materially affect testing must be documented.

Example:

> Password expiry period is not defined in the requirement.

The Test Planner must not silently assume a value.

## 9. Test Data

Identify required test data.

Examples:

- Registered user
- New user
- Unregistered user
- Valid email
- Invalid email
- Expired account

Sensitive credentials must never be included directly in the test
plan.

Test Data References should be in below format:
| Key | Description |


## 10. Regression Impact

Identify whether existing functionality may be affected.

Consider:

- Related features
- Shared components
- Authentication flows
- Existing integrations
- Existing automation coverage

## 11. Test Plan Location

All generated test plans must follow:

testplan/[ticket-key]-[short-name].md

Example:

testplan/DEMO-001-password-reset.md

## 12. Quality Gate

A test plan is considered valid only when:

- The JIRA requirement has been successfully retrieved.
- Requirements have been analysed.
- All applicable acceptance criteria have been identified.
- Every acceptance criterion has appropriate test coverage.
- Appropriate positive scenarios have been considered.
- Appropriate negative scenarios have been considered.
- Boundary scenarios have been considered where applicable.
- Test cases have clear expected results.
- Test cases are traceable to acceptance criteria.
- Test data references are identified where required.
- Screen and URL information is identified where applicable.
- Test steps are concise, atomic and executable.
- Automation candidates are identified.
- Approved tags are used.
- Test priorities are appropriate.
- Regression impact has been assessed.
- Relevant risks have been documented.
- Open questions have been documented.
- No unsupported requirements, business rules, URLs, test data or
  expected behaviour have been invented.
- The test plan follows the project naming and folder conventions.

The Test Plan Validator is responsible for enforcing this quality gate.