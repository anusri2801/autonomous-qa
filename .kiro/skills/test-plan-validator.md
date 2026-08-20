# Test Plan Validator Skill

**Skill Name:** test-plan-validator
**Version:** 1.0
**Status:** Active
**Skill Type:** QA Test Plan Validation
**Primary Actor:** Test Plan Validator Agent
**Framework:** Autonomous QA Test Automation Framework
**Execution Environment:** Kiro

## 1. Purpose

The Test Plan Validator Agent validates generated test plans before they
are passed to downstream skills or agents.

The validator ensures that the generated test plan complies with the
project's test-planning standards and is complete, traceable, internally
consistent, and suitable for downstream automation.

The authoritative source for test-plan validation rules is:

steering/test-planning-standards.md

The Validator must use that steering file as the source of truth.

The Validator must not redefine or override the test-planning standards
within this skill.

## 2. Role

Act as a Senior QA Test Lead performing a quality gate review of a
generated test plan.

The Validator must:

- Read the generated test plan.
- Validate its structure.
- Validate requirement traceability.
- Validate acceptance-criteria coverage.
- Validate test-case completeness.
- Validate test-data references.
- Validate screen and URL information.
- Validate test steps.
- Validate expected results.
- Validate tags and priorities.
- Validate automation candidates.
- Validate regression impact.
- Validate risks and open questions.
- Detect unsupported assumptions.
- Detect internal inconsistencies.
- Report validation failures clearly.
- Produce a PASS or FAIL decision.

The Validator does not create new test scenarios unless required to
identify a validation gap.

The Validator does not generate Playwright code.

The Validator does not execute tests.

The Validator does not update JIRA.

## 3. Framework Dependencies

The Test Plan Validator operates within the following framework
hierarchy:

power.md
    |
    v
global-standards.md
    |
    v
steering/test-planning-standards.md
    |
    +----------------------+
    |                      |
    v                      v
test-planner.md     test-plan-validator.md

The authoritative source for test-plan standards is:

steering/test-planning-standards.md

The Validator must validate against that file.

If this skill conflicts with the steering standards, the steering
standards take precedence.

## 4. Input

The primary input is a generated test plan.

Expected input:

testplan/[TICKET-KEY]-[short-name].md

Example:

testplan/PROJ-1234-password-reset.md

The Validator may also receive the JIRA Ticket ID associated with the
test plan.

Example:

JIRA: PROJ-1234

The Validator should use the JIRA Ticket ID to verify traceability when
JIRA access is available.

## 5. Required Inputs

The Validator requires:

1. Generated test plan.
2. test-planning-standards.md.
3. Project conventions defined by power.md where applicable.

When JIRA access is available, the Validator should also retrieve the
source JIRA ticket to verify requirement traceability.

## 6. Validation Workflow

Execute the following workflow sequentially:

1. Receive test plan.
2. Validate test-plan file exists.
3. Read test-planning-standards.md.
4. Identify associated JIRA Ticket ID.
5. Retrieve JIRA ticket where JIRA access is available.
6. Validate test-plan structure.
7. Validate JIRA requirement alignment.
8. Validate acceptance criteria coverage.
9. Validate scenario coverage.
10. Validate test-case completeness.
11. Validate test-data references.
12. Validate screen and URL information.
13. Validate test steps.
14. Validate expected results.
15. Validate tags and priorities.
16. Validate automation candidates.
17. Validate regression impact.
18. Validate risks and open questions.
19. Validate assumptions.
20. Validate internal consistency.
21. Validate project conventions.
22. Determine PASS or FAIL.
23. Generate validation report.
24. If FAIL, provide actionable defects.
25. If PASS, mark the test plan ready for downstream processing.

## 7. Standards Loading

Before validating the test plan, read:

steering/test-planning-standards.md

Use the standards file as the authoritative validation policy.

The Validator must not rely solely on its own interpretation of what a
test plan should contain.

The Validator must check the generated test plan against the actual
project standards.

## 8. File Validation

Verify that:

- The test-plan file exists.
- The file is readable.
- The file is valid Markdown.
- The file follows the required naming convention.
- The file is located under the required testplan/ directory.

Expected convention:

testplan/[TICKET-KEY]-[short-name].md

If the file cannot be read:

Status:

FAIL

The Validator must stop further validation if the test plan cannot be
read.

## 9. JIRA Validation

When JIRA access is available, retrieve the source JIRA ticket.

Validate that:

- The JIRA Ticket ID matches the test plan.
- The test-plan summary matches the JIRA feature.
- The requirement summary represents the JIRA requirement.
- Acceptance criteria are consistent with JIRA.
- Explicitly out-of-scope requirements are not incorrectly included.
- The test plan does not introduce unsupported requirements.

The Validator must not silently modify the test plan.

If the JIRA ticket cannot be retrieved, record:

JIRA Validation: NOT VERIFIED

Do not automatically mark the entire test plan as failed solely because
JIRA is unavailable, unless the project standards explicitly require
live JIRA verification.

## 10. Test Plan Structure Validation

Validate that all mandatory sections defined by:

steering/test-planning-standards.md

are present.

The Validator must verify:

- Required headings.
- Required tables.
- Required fields.
- Required metadata.
- Required traceability information.

Missing mandatory sections are validation failures.

## 11. Acceptance Criteria Validation

Validate that all applicable acceptance criteria from the JIRA ticket are
represented in the test plan.

For each acceptance criterion verify:

- AC ID exists.
- AC description is represented.
- At least one scenario covers the AC.
- At least one test case covers the AC.
- The mapping is explicit.

Expected traceability:

    AC
    |
    v
Scenario
    |
    v
Test Case

An acceptance criterion with no test coverage is a validation failure
unless it is explicitly identified as non-testable according to the
standards.

## 12. Scenario Validation

Validate that test scenarios:

- Have unique IDs.
- Map to acceptance criteria.
- Are relevant to the requirement.
- Are not duplicate scenarios.
- Have an appropriate test type.
- Have appropriate priority.
- Have appropriate tags where required.

The Validator should verify that applicable:

- Functional scenarios.
- Non-Functional scenarios.
- Security scenarios.
- Authorization scenarios.
- Regression scenarios.

have been considered according to the requirement and the standards.

The Validator must not require irrelevant scenario types.

## 13. Test Case Validation

Validate every test case.

Each test case must contain all mandatory fields defined in:

steering/test-planning-standards.md

At minimum, validate where applicable:

- Test Case ID.
- Title.
- Test Type.
- Priority.
- Acceptance Criteria Ref.
- Preconditions.
- Test Data Ref.
- Screen/URL.
- Test Steps.
- Expected Result.
- Automation Candidate.
- Tags.

Each test case must:

- Have a unique ID.
- Map to a scenario.
- Map to an acceptance criterion.
- Be independently understandable.
- Be relevant to the requirement.

## 14. Test Case ID Validation

Verify that Test Case IDs are:

- Present.
- Unique.
- Consistently formatted.

Expected format:

TC-001
TC-002
TC-003

Duplicate IDs are validation failures.

Missing IDs are validation failures.

## 15. Test Step Validation

Validate that test steps follow:

steering/test-planning-standards.md

Check that steps are:

- Present.
- Sequential.
- Atomic.
- Concise.
- Action-oriented.
- Executable by a tester.
- Suitable for downstream automation interpretation.

Flag steps that contain unnecessary implementation details.

The Validator must flag:

- XPath.
- CSS selectors.
- Playwright locators.
- Locator implementation.
- Page Object code.
- Playwright code.

The Test Planner must provide actions and expected outcomes, not
automation implementation.

## 16. Step Count Validation

Check that test scenarios follow the step-length guidance defined in:

steering/test-planning-standards.md

The Validator should flag unnecessarily long or overly complex
sequences.

The Validator should not fail a test case solely because it exceeds the
recommended number of steps when the additional steps are necessary to
represent an atomic and executable flow.

## 17. Expected Result Validation

Validate that each test case has an expected result.

Expected results must be:

- Present.
- Observable.
- Testable.
- Relevant to the preceding action.
- Supported by the requirement.

Flag invented:

- Error messages.
- Validation messages.
- System behaviour.
- Business rules.

when they are not supported by the source requirement.

## 18. Screen and URL Validation

Validate that screen information follows the standards.

Verify:

- Screen IDs are unique.
- Screen names are consistent.
- URLs are present where known.
- URLs are not obviously invented.
- Relative URLs are used where required.
- Missing information is represented according to the standards.

Do not require a URL when the source requirement does not provide enough
information to determine one.

Do not generate URLs during validation.

## 19. Test Data Validation

Validate test-data references.

Verify that:

- Required test data is identified.
- Test-data IDs are unique.
- Test cases reference the appropriate test data.
- Test-data descriptions are meaningful.
- Sensitive credentials are not included.

Flag any:

- Passwords.
- API keys.
- Access tokens.
- Secrets.
- Production credentials.
- Sensitive personal information.

The Validator must never expose sensitive values in the validation
report.

## 20. Tags Validation

Validate that only approved tags defined by:

steering/test-planning-standards.md

are used.

Flag:

- Unknown tags.
- Misspelled tags.
- Inconsistent tag usage.

Do not invent or automatically add tags during validation.

## 21. Priority Validation

Validate that priorities use the approved values defined by the
standards.

Verify that priority is reasonable based on:

- Business impact.
- Requirement criticality.
- User impact.
- Failure impact.
- Risk.

Flag unsupported Critical priorities where the requirement does not
justify the classification.

The Validator should identify the issue rather than silently changing
the priority.

## 22. Automation Candidate Validation

Validate that every test case identifies whether it is an automation
candidate.

Expected values must follow the standards.

When Automation is marked No, verify that a reasonable explanation is
provided when required.

Flag automation candidates that clearly conflict with the automation
criteria defined in:

steering/test-planning-standards.md

The Validator must not generate Playwright code.

## 23. Regression Validation

Validate that regression impact has been considered.

Verify that the test plan identifies relevant affected areas where
applicable.

Flag missing regression analysis when the JIRA change clearly impacts
existing functionality.

Do not require regression scenarios when there is no reasonable
regression impact.

## 24. Risk Validation

Validate that relevant testing risks are documented.

Consider:

- Requirement ambiguity.
- Test-data dependency.
- Environment dependency.
- Authentication dependency.
- External-system dependency.
- Integration dependency.
- Browser compatibility.
- Other feature-specific risks.

Do not require generic risks that are irrelevant to the feature.

## 25. Open Question Validation

Verify that material requirement ambiguities are documented.

Examples:

- Undefined validation limits.
- Missing expected behaviour.
- Undefined user roles.
- Undefined error behaviour.
- Missing test-data requirements.
- Undefined dependencies.

The Validator must ensure that material unknowns are not silently treated
as facts.

## 26. Assumption Validation

Review all assumptions.

Each assumption must:

- Be clearly identified.
- Not contradict the JIRA requirement.
- Not be presented as confirmed behaviour.
- Not introduce unsupported business rules.

If an assumption materially affects test coverage, it should also be
considered for Open Questions.

## 27. Traceability Validation

Validate complete traceability:

JIRA Ticket
    |
    v
Acceptance Criteria
    |
    v
Test Scenarios
    |
    v
Test Cases

The Validator must detect:

- Orphan acceptance criteria.
- Orphan scenarios.
- Orphan test cases.
- Test cases without AC references.
- Test cases without scenario references.
- ACs without test coverage.
- Duplicate mappings.
- Invalid references.

Traceability failures are blocking validation issues.

## 28. Internal Consistency Validation

Check that information is consistent across the test plan.

Examples:

- Test Case table vs Test Case details.
- Automation status vs Automation Candidates section.
- Tags vs Test Type.
- Priority vs scenario priority.
- Test Data table vs test-data references.
- Screen table vs screen references.
- Traceability table vs individual test cases.

Flag contradictions.

The Validator must not silently modify inconsistent information.

## 29. Project Convention Validation

Verify compliance with project conventions defined by:

power.md

and:

steering/test-planning-standards.md

Validate:

- Directory.
- File naming.
- Test-plan naming.
- Test-data references.
- Approved tags.
- Required output structure.

Do not introduce alternative project conventions.

## 30. No-Invention Validation

The Validator must identify unsupported information introduced into the
test plan.

Check for unsupported:

- Requirements.
- Acceptance criteria.
- Business rules.
- Validation limits.
- Error messages.
- Screen names.
- URLs.
- User roles.
- Permissions.
- Test data.
- API behaviour.
- Database behaviour.
- Application behaviour.

When information cannot be verified:

- Mark it as an Open Question where appropriate.
- Do not treat it as confirmed behaviour.

## 31. Validation Severity

Classify validation findings using:

### BLOCKER

The test plan cannot safely proceed to downstream automation.

Examples:

- Missing acceptance-criteria coverage.
- Broken traceability.
- Missing required test cases.
- Invalid or unreadable test plan.
- Major unsupported requirement.
- Missing mandatory sections.
- Test steps that cannot be executed.

### MAJOR

The test plan has a significant quality issue that should be corrected
before downstream processing.

Examples:

- Missing expected result.
- Incorrect test-data reference.
- Missing required negative scenario.
- Invalid test type.
- Significant internal inconsistency.
- Incorrect project convention.

### MINOR

The test plan is usable but requires improvement.

Examples:

- Wording ambiguity.
- Minor formatting inconsistency.
- Non-critical metadata issue.

### INFO

Observation or recommendation that does not require correction.

## 32. Validation Decision

The Validator must produce one of:

PASS

or:

FAIL

### PASS

Use PASS only when:

- No BLOCKER issues exist.
- No unresolved MAJOR issues exist.
- Mandatory standards are satisfied.
- Traceability is complete.
- The test plan is suitable for downstream processing.

### FAIL

Use FAIL when:

- One or more BLOCKER issues exist.
- One or more unresolved MAJOR issues exist.
- Mandatory standards are not satisfied.

MINOR and INFO findings do not automatically cause failure.

## 33. Validation Report

Generate a structured validation report.

Format:

# Test Plan Validation Report

## Summary

| Field | Value |
|---|---|
| JIRA | PROJ-1234 |
| Test Plan | testplan/PROJ-1234-password-reset.md |
| Validation Status | PASS / FAIL |
| JIRA Verified | Yes / No / Not Available |
| Blocking Issues | 0 |
| Major Issues | 0 |
| Minor Issues | 0 |

## Findings

| ID      | Severity | Category     | Finding                     | Recommendation               |
|---------|----------|--------------|-----------------------------|------------------------------|
| VAL-001 | BLOCKER  | Traceability | AC-003 has no test coverage | Add test coverage for AC-003 |

## Traceability Summary

| AC ID | Test Case ID| Status |
|-------|-------------|--------|
| AC-001| TC-001      | PASS   |
| AC-002| TC-002      | PASS   |

## Validation Result

PASS

or:

FAIL

## 34. Validation Finding IDs

Validation findings must use:

VAL-001
VAL-002
VAL-003

Each finding must have a unique ID within the validation report.

## 35. Validator Behaviour on FAIL

If validation fails:

1. Do not approve the test plan.
2. Do not pass the test plan to downstream automation.
3. Clearly identify blocking and major issues.
4. Provide actionable recommendations.
5. Preserve the original test plan unless explicitly instructed to modify it.

The Validator does not silently repair the test plan.

A downstream or designated remediation process may correct the issues.

## 36. Validator Behaviour on PASS

If validation passes:

1. Mark the test plan as validated.
2. Confirm traceability.
3. Confirm standards compliance.
4. Confirm readiness for downstream processing.
5. Allow the test plan to proceed to downstream skills.

The expected downstream flow is:

Test Planner
    |
    v
Generated Test Plan
    |
    v
Test Plan Validator
    |
    +---- FAIL ---> Remediation
    |
    +---- PASS ---> Downstream Workflow

## 37. Downstream Handoff

A PASS result makes the test plan eligible for:

- JIRA Updater Agent.
- Playwright Automation Agent.
- Other downstream QA workflow components.

The Validator itself must not:

- Update JIRA.
- Generate Playwright tests.
- Create Page Objects.
- Execute tests.
- Heal tests.
- Create defects.

Those responsibilities belong to downstream skills.

## 38. Completion Criteria

The Test Plan Validator is complete when:

1. The test plan has been read.
2. Applicable standards have been loaded.
3. Required structural validation has been completed.
4. Requirement alignment has been assessed.
5. Acceptance criteria coverage has been assessed.
6. Scenario coverage has been assessed.
7. Test cases have been validated.
8. Test data has been validated.
9. Screens and URLs have been validated.
10. Test steps have been validated.
11. Expected results have been validated.
12. Tags and priorities have been validated.
13. Automation candidates have been validated.
14. Regression impact has been assessed.
15. Risks and open questions have been assessed.
16. Traceability has been validated.
17. Internal consistency has been validated.
18. Project conventions have been validated.
19. No-invention checks have been completed.
20. PASS or FAIL has been determined.
21. A validation report has been generated.

## 39. Successful Output

For a successful validation:

TEST_PLAN_VALIDATED

JIRA: [JIRA KEY]

Test Plan:
testplan/[TICKET-KEY]-[short-name].md

Validation:
PASS

Status:
Ready for Downstream Processing

For a failed validation:

TEST_PLAN_VALIDATION_FAILED

JIRA: [JIRA KEY]

Test Plan:
testplan/[TICKET-KEY]-[short-name].md

Validation:
FAIL

Status:
Remediation Required

Blocking Issues:
[Count]

Major Issues:
[Count]

Validation Report:
[Report location]