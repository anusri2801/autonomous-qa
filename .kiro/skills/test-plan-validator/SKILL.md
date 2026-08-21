---

name: test-plan-validator
description: Validate QA test plans for requirement traceability, acceptance criteria coverage, test structure, expected results, automation candidates, tags, risks, open questions, unsupported assumptions, duplicate scenarios, internal consistency, and project standards. Use when validating or reviewing a generated test plan before downstream processing.
---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------

# Test Plan Validator Skill

**Skill Name:** test-plan-validator
**Version:** 1.1
**Status:** Active
**Skill Type:** QA Test Plan Validation
**Primary Actor:** Test Plan Validator Agent
**Framework:** Autonomous QA Test Automation Framework
**Execution Environment:** Kiro

---

## 1. Purpose

The Test Plan Validator Agent validates generated test plans before they are passed to downstream skills or agents.

The Validator ensures that the generated test plan is:

* Complete.
* Traceable.
* Internally consistent.
* Aligned with project standards.
* Suitable for downstream automation.
* Free from unsupported requirements and assumptions.
* Ready for downstream processing only when all blocking quality gates pass.

The authoritative source for test-plan validation rules is:

`steering/test-planning-standards.md`

The Validator must use that steering file as the source of truth.

The Validator must not redefine, override, or silently supplement the test-planning standards with personal QA preferences.

If this skill conflicts with:

`steering/test-planning-standards.md`

the steering standards take precedence.

---

## 2. Role

Act as a Senior QA Test Lead performing an independent quality-gate review of a generated test plan.

The Validator must:

* Read the generated test plan.
* Load the applicable project standards.
* Identify the associated JIRA ticket.
* Retrieve the JIRA requirement when JIRA access is available and required.
* Validate test-plan structure.
* Validate requirement traceability.
* Validate acceptance-criteria coverage.
* Validate scenario coverage.
* Validate test-case completeness.
* Validate test-data references.
* Validate screen and URL information.
* Validate test steps.
* Validate expected results.
* Validate test types.
* Validate priorities.
* Validate tags.
* Validate automation candidates.
* Validate regression impact.
* Validate risks.
* Validate open questions.
* Detect unsupported assumptions.
* Detect unsupported requirements.
* Detect internal inconsistencies.
* Detect duplicate or redundant scenarios.
* Identify blocking and non-blocking findings.
* Produce a PASS or FAIL decision.
* Persist every finding in a validation report.
* Persist the final validation decision.
* Return a concise execution summary after the report has been saved.

The Validator does not create new test scenarios unless required to identify a validation gap.

The Validator must not:

* Generate Playwright code.
* Modify the test plan automatically.
* Create Page Objects.
* Execute tests.
* Heal tests.
* Update JIRA testing notes.
* Create JIRA defects.
* Modify JIRA requirements.
* Remove test cases.
* Silently correct the test plan.

Those activities belong to downstream skills or agents.

---

## 3. Framework Dependencies

The Test Plan Validator operates within the following framework hierarchy:

```text
power.md
    |
    v
global-standards.md
    |
    v
steering/test-planning-standards.md
    |
    v
test-plan-validator/SKILL.md
    |
    v
Generated Test Plan
```

The authoritative source for test-plan standards is:

`steering/test-planning-standards.md`

Project-wide conventions may also be defined in:

* `power.md`
* `global-standards.md`

The Validator must use these files where applicable.

If a convention is not defined by the project standards, the Validator must not invent one.

---

## 4. Input

The primary input is a generated test plan.

Expected input:

```text
testplan/[ticket-key]-[short-name].md
```

Example:

```text
testplan/PROJ-1234-password-reset.md
```

The Validator may also receive the associated JIRA Ticket ID.

Example:

```text
JIRA: PROJ-1234
```

The Validator should use the JIRA Ticket ID to verify requirement traceability when JIRA access is available.

The Validator must not require the user to manually provide JIRA requirements when the ticket can be retrieved through the configured JIRA MCP.

---

## 5. Required Inputs

The Validator requires:

1. Generated test plan.
2. `steering/test-planning-standards.md`.
3. Project conventions defined by `power.md` where applicable.

When JIRA access is available, the Validator should also retrieve the source JIRA ticket to verify:

* Requirement alignment.
* Acceptance criteria.
* Scope.
* Requirement summary.
* Explicit out-of-scope requirements.

---

## 6. Validation Workflow

The Validator MUST follow this sequential workflow:

```text
Receive Test Plan
        |
        v
Validate Test Plan Exists
        |
        v
Identify JIRA Ticket
        |
        v
Load Project Standards
        |
        v
Retrieve JIRA Requirement if required/available
        |
        v
Validate Test Plan Structure
        |
        v
Validate Requirement Coverage
        |
        v
Validate Acceptance Criteria Traceability
        |
        v
Validate Test Scenarios
        |
        v
Validate Test Cases
        |
        v
Validate Test Data
        |
        v
Validate Screens / URLs
        |
        v
Validate Test Steps
        |
        v
Validate Expected Results
        |
        v
Validate Test Types
        |
        v
Validate Priorities
        |
        v
Validate Tags
        |
        v
Validate Automation Candidates
        |
        v
Validate Regression Impact
        |
        v
Validate Risks
        |
        v
Validate Open Questions
        |
        v
Identify Unsupported Assumptions
        |
        v
Identify Unsupported Requirements
        |
        v
Identify Duplicate / Redundant Scenarios
        |
        v
Validate Internal Consistency
        |
        v
Validate Project Conventions
        |
        v
Validate Complete Traceability
        |
        v
Classify Findings
        |
        v
Determine PASS / FAIL
        |
        v
Generate Validation Report
        |
        v
Persist Validation Report
        |
        v
Return Validation Result
```

The validation report must be created and successfully persisted before the Validator returns the final execution summary.

---

## 7. Standards Loading

Before validating the test plan, read:

`steering/test-planning-standards.md`

Use the standards file as the authoritative validation policy.

The Validator must determine:

* Mandatory sections.
* Optional sections.
* Approved metadata.
* Approved test types.
* Approved priorities.
* Approved tags.
* Test-case structure.
* Test-step guidance.
* Expected-result guidance.
* Automation criteria.
* Naming conventions.
* Directory conventions.
* Test-data conventions.
* Other project-specific requirements.

The Validator must not rely solely on generic QA knowledge.

---

## 8. File Validation

Verify that:

* The test-plan file exists.
* The file is readable.
* The file is valid Markdown.
* The file is located under the required `testplan/` directory.
* The file follows the required naming convention.

Expected convention:

```text
testplan/[ticket-key]-[short-name].md
```

If the file cannot be read:

```text
Validation: FAIL
```

The Validator must stop further validation if the test plan cannot be read.

This is a BLOCKER finding.

---

## 9. JIRA Validation

When JIRA access is available, retrieve the source JIRA ticket.

Validate that:

* The JIRA Ticket ID matches the test plan.
* The test-plan summary aligns with the JIRA feature.
* The requirement summary represents the JIRA requirement.
* Acceptance criteria are consistent with JIRA.
* Explicitly out-of-scope requirements are not incorrectly included.
* The test plan does not introduce unsupported requirements.
* Requirement terminology is not materially misrepresented.

The Validator must not silently modify the test plan.

If the JIRA ticket cannot be retrieved, record:

```text
JIRA Validation: NOT VERIFIED
```

Do not automatically fail the entire test plan solely because JIRA is unavailable unless the project standards explicitly require live JIRA verification.

The report must clearly distinguish:

* JIRA Verified.
* JIRA Not Verified.
* JIRA Unavailable.

---

## 10. Test Plan Structure Validation

Validate that all mandatory sections defined by:

`steering/test-planning-standards.md`

are present.

The Validator must verify:

* Required headings.
* Required tables.
* Required fields.
* Required metadata.
* Required traceability information.
* Required test-data information.
* Required risk information.
* Required automation information.

Missing mandatory sections are validation failures.

If a required section is missing:

**Severity:** BLOCKER or MAJOR
**Blocking:** Yes

The exact severity must be based on the impact of the missing section and applicable project standards.

Optional sections must not be incorrectly treated as mandatory.

---

## 11. Acceptance Criteria Validation

Validate that all applicable acceptance criteria from the JIRA ticket are represented in the test plan.

For each acceptance criterion verify:

* AC ID exists.
* AC description is represented.
* At least one scenario covers the AC.
* At least one test case covers the AC.
* The mapping is explicit.
* The mapping references valid scenario/test-case IDs.

Expected traceability:

```text
Acceptance Criterion
        |
        v
Scenario
        |
        v
Test Case
```

An acceptance criterion with no test coverage is a blocking validation failure unless it is explicitly identified as non-testable according to the project standards.

The Validator must identify orphan acceptance criteria.

---

## 12. Scenario Validation

Validate that test scenarios:

* Have unique IDs.
* Map to acceptance criteria where applicable.
* Are relevant to the requirement.
* Are not duplicate scenarios.
* Have an appropriate test type.
* Have an appropriate priority.
* Have appropriate tags where required.
* Have sufficient coverage for the associated requirement.

The Validator should verify that applicable:

* Functional scenarios.
* Negative scenarios.
* Boundary scenarios.
* Security scenarios.
* Authorization scenarios.
* Non-functional scenarios.
* Regression scenarios.

have been considered according to the requirement and project standards.

The Validator must not require irrelevant scenario types.

---

## 13. Derived Scenarios

The Test Planner may generate scenarios that are not explicitly stated in an acceptance criterion when they are justified by:

* Security implications.
* Business rules.
* Risk.
* Standard QA practices.
* Logical inverse of explicitly stated behaviour.
* Regression impact.
* Clearly implied behaviour.

Example:

```text
AC:
Authenticated users can access protected page.

Derived scenario:
Unauthenticated users cannot access protected page.
```

Derived scenarios are allowed.

However, materially derived scenarios must be distinguishable from directly specified requirements.

If the origin or rationale of a materially derived scenario is not identified:

**Severity:** MINOR
**Blocking:** No

unless the derived behaviour introduces an unsupported requirement or assertion.

The Validator must not reject a valid test plan merely because it contains justified derived scenarios.

---

## 14. Test Case Validation

Validate every test case.

Each test case must contain all mandatory fields defined in:

`steering/test-planning-standards.md`

At minimum, validate where applicable:

* Test Case ID.
* Title.
* Test Type.
* Priority.
* Acceptance Criteria Reference.
* Scenario Reference.
* Preconditions.
* Test Data Reference.
* Screen / URL.
* Test Steps.
* Expected Result.
* Automation Candidate.
* Tags.

Each test case must:

* Have a unique ID.
* Map to a valid scenario.
* Map to an acceptance criterion where applicable.
* Be independently understandable.
* Be relevant to the requirement.
* Contain sufficient information for downstream automation interpretation.

---

## 15. Test Case ID Validation

Verify that Test Case IDs are:

* Present.
* Unique.
* Consistently formatted.
* Referenced consistently throughout the test plan.

Expected format:

```text
TC-001
TC-002
TC-003
```

Duplicate IDs are validation failures.

Missing IDs are validation failures.

Invalid references to non-existent test-case IDs are validation failures.

---

## 16. Test Step Validation

Validate that test steps follow:

`steering/test-planning-standards.md`

Check that steps are:

* Present.
* Sequential.
* Atomic.
* Concise.
* Action-oriented.
* Executable by a tester.
* Suitable for downstream automation interpretation.

The Validator should flag steps containing unnecessary implementation details.

The Validator must flag:

* XPath.
* CSS selectors.
* Playwright locators.
* Locator implementation.
* Page Object implementation.
* Playwright code.
* Programming-language-specific automation instructions.

The Test Planner must provide tester-oriented actions and expected outcomes, not automation implementation.

Example of inappropriate test-plan content:

```text
Click locator('button[type="submit"]')
```

Example of appropriate content:

```text
Click the Submit button.
```

The Validator must not rewrite the step automatically.

---

## 17. Step Count Validation

Check that test scenarios follow the step-length guidance defined in:

`steering/test-planning-standards.md`

The Validator should flag unnecessarily long or overly complex sequences.

The Validator must not fail a test case solely because it exceeds a recommended step count when the additional steps are necessary to represent an atomic and executable business flow.

---

## 18. Expected Result Validation

Validate that every test case has an expected result.

Expected results must be:

* Present.
* Observable.
* Testable.
* Relevant to the preceding action.
* Supported by the requirement or a clearly justified derived scenario.

Flag invented:

* Error messages.
* Validation messages.
* System behaviour.
* Business rules.
* Exact limits.
* Status codes.
* UI behaviour.

when they are not supported by an authoritative source.

Example:

```text
Requirement:
User can log in.

Unsupported expected result:
Account is locked after exactly 5 failed attempts.
```

If no source supports the behaviour, report an unsupported requirement finding unless the behaviour is explicitly identified as an open question.

---

## 19. Screen and URL Validation

Validate that screen information follows the project standards.

Verify:

* Screen IDs are unique.
* Screen names are consistent.
* Screen references are valid.
* URLs are present where known.
* URLs are not obviously invented.
* Relative URLs are used where required.
* Missing information is represented according to the standards.

Do not require a URL when the source requirement does not provide enough information to determine one.

Do not generate URLs during validation.

If a URL cannot be verified, the Validator must not treat an invented URL as confirmed application behaviour.

---

## 20. Test Data Validation

Validate test-data references.

Verify that:

* Required test data is identified.
* Test-data IDs are unique.
* Test cases reference appropriate test data.
* Test-data descriptions are meaningful.
* References point to valid test-data entries.
* Required data dependencies are documented.

The Validator must check for sensitive information.

Flag:

* Passwords.
* API keys.
* Access tokens.
* Secrets.
* Production credentials.
* Authentication tokens.
* Sensitive personal information.

The Validator must never expose sensitive values in the validation report.

If sensitive data is discovered, describe the issue without reproducing the value.

---

## 21. Tags Validation

Validate that only approved tags defined by:

`steering/test-planning-standards.md`

are used.

Flag:

* Unknown tags.
* Misspelled tags.
* Inconsistent tag usage.
* Invalid tag combinations.

Do not invent or automatically add tags during validation.

---

## 22. Priority Validation

Validate that priorities use the approved values defined by the standards.

Verify that priority is reasonable based on:

* Business impact.
* Requirement criticality.
* User impact.
* Failure impact.
* Risk.

Flag unsupported high-severity priorities where the requirement does not justify the classification.

The Validator should identify the issue rather than silently changing the priority.

---

## 23. Test Type Validation

Validate that every test case has an appropriate test type according to the project standards.

Examples may include:

* Functional.
* Negative.
* Boundary.
* Security.
* Authorization.
* Regression.
* Integration.
* API.
* Non-functional.

Only approved test types should be used.

Do not invent test types that are not defined by the project standards.

---

## 24. Automation Candidate Validation

Validate that every test case identifies whether it is an automation candidate.

Expected values must follow the standards.

When automation is marked `No`, verify that a reasonable explanation is provided when required by the standards.

Flag automation candidates that clearly conflict with the automation criteria defined in:

`steering/test-planning-standards.md`

Examples of potential automation concerns:

* Manual-only external dependency.
* Unstable third-party system.
* CAPTCHA.
* One-time operational activity.
* Non-repeatable environment activity.

The Validator must not generate Playwright code.

---

## 25. Regression Validation

Validate that regression impact has been considered.

Verify that the test plan identifies relevant affected areas where applicable.

Flag missing regression analysis when the JIRA change clearly impacts existing functionality.

Do not require regression scenarios when there is no reasonable regression impact.

---

## 26. Risk Validation

Validate that relevant testing risks are documented.

Consider where applicable:

* Requirement ambiguity.
* Test-data dependency.
* Environment dependency.
* Authentication dependency.
* External-system dependency.
* Integration dependency.
* Browser compatibility.
* Third-party dependency.
* Configuration dependency.
* Migration dependency.
* Feature-specific risks.

Do not require generic risks that are irrelevant to the feature.

---

## 27. Open Question Validation

Verify that material requirement ambiguities are documented.

Examples:

* Undefined validation limits.
* Missing expected behaviour.
* Undefined user roles.
* Undefined error behaviour.
* Missing test-data requirements.
* Undefined dependencies.
* Unclear integration behaviour.
* Unclear security behaviour.
* Unclear business rules.

The Validator must ensure that material unknowns are not silently treated as confirmed facts.

---

## 28. Assumption Validation

Review all assumptions.

Each assumption must:

* Be clearly identified.
* Not contradict the JIRA requirement.
* Not be presented as confirmed behaviour.
* Not introduce unsupported business rules.
* Be distinguishable from acceptance criteria.
* Be considered for Open Questions when it materially affects testing.

If an assumption materially affects test coverage, the Validator should verify that the uncertainty is also represented as an Open Question.

---

## 29. Requirement and No-Invention Validation

The Validator must identify unsupported information introduced into the test plan.

Check for unsupported:

* Requirements.
* Acceptance criteria.
* Business rules.
* Validation limits.
* Error messages.
* Screen names.
* URLs.
* User roles.
* Permissions.
* Test data.
* API behaviour.
* Database behaviour.
* Application behaviour.
* Integration behaviour.
* Security behaviour.

Potential sources of truth include:

* JIRA Acceptance Criteria.
* JIRA Description.
* Business Rules.
* Functional Requirements.
* Security Requirements.
* Non-functional Requirements.
* Clearly justified derived scenarios.

When information cannot be verified:

* Mark it as an Open Question where appropriate.
* Do not treat it as confirmed behaviour.
* Do not silently remove it.
* Do not silently modify it.

---

## 30. Unsupported Requirements and Assertions

The Validator must identify test cases or expected results that introduce behaviour not supported by an authoritative source.

Example:

```text
Requirement:
User can log in.

Unsupported assertion:
Account is locked after exactly 5 failed attempts.
```

If no authoritative source supports the behaviour:

**Severity:** MAJOR
**Blocking:** Yes

unless the behaviour is:

* Clearly identified as a derived scenario with appropriate rationale, or
* Clearly documented as an Open Question rather than confirmed behaviour.

The Validator must distinguish between:

* Confirmed Requirement.
* Justified Derived Behaviour.
* Open Question.
* Unsupported Assertion.

---

## 31. Traceability Validation

Validate complete end-to-end traceability:

```text
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
```

The Validator must detect:

* Orphan acceptance criteria.
* Orphan scenarios.
* Orphan test cases.
* Test cases without AC references where required.
* Test cases without scenario references.
* ACs without test coverage.
* Duplicate mappings.
* Invalid references.
* References to non-existent IDs.
* Broken traceability chains.

Traceability failures are blocking issues when they prevent reliable requirement-to-test coverage.

---

## 32. Internal Consistency Validation

Check that information is consistent across the entire test plan.

Examples:

* Test Case table vs Test Case details.
* Automation status vs Automation Candidates section.
* Tags vs Test Type.
* Priority vs Scenario Priority.
* Test Data table vs Test Data references.
* Screen table vs Screen references.
* Traceability table vs individual test cases.
* Scenario list vs individual scenario details.
* Acceptance Criteria list vs traceability matrix.
* Regression section vs individual regression scenarios.
* Risks vs documented assumptions/open questions.

Flag contradictions.

The Validator must not silently modify inconsistent information.

---

## 33. Project Convention Validation

Verify compliance with project conventions defined by:

`power.md`

and:

`steering/test-planning-standards.md`

Validate where applicable:

* Directory.
* File naming.
* Test-plan naming.
* Test-data references.
* Approved tags.
* Required output structure.
* Required metadata.
* Required artifact locations.

Do not introduce alternative project conventions.

---

## 34. Duplicate and Redundant Test Cases

The Validator should identify test cases that:

* Duplicate another test case.
* Test the same condition with no meaningful difference.
* Add no additional coverage.
* Are unnecessarily repetitive.
* Differ only in wording while validating the same behaviour.

Duplicates should normally be:

**Severity:** MINOR
**Blocking:** No

unless duplication causes significant planning, traceability, or automation problems.

The Validator must not remove duplicates automatically.

---

## 35. Validation Severity Model

The Validator must use the following severity model.

### BLOCKER

A BLOCKER means the test plan cannot safely proceed to downstream automation.

Examples:

* Test plan is missing or unreadable.
* Mandatory validation structure is fundamentally broken.
* Critical acceptance-criteria coverage is missing.
* Traceability is fundamentally broken.
* Test steps cannot be executed.
* Fundamental requirement misinterpretation.
* Critical unsupported requirement.
* Required information is absent to the point that downstream processing is unsafe.

**Blocking:** Yes

### MAJOR

A MAJOR issue is significant and must normally be corrected before downstream processing.

Examples:

* Unsupported requirement.
* Missing required test information.
* Missing required negative scenario.
* Invalid test type.
* Invalid tag.
* Missing expected result for an important scenario.
* Incorrect project convention.
* Significant internal inconsistency.
* Incorrect test-data reference.
* Significant traceability defect.

**Blocking:** Yes

### MINOR

A MINOR issue is a quality improvement that does not prevent downstream processing.

Examples:

* Wording ambiguity.
* Minor formatting inconsistency.
* Slightly ambiguous screen description.
* Passive step wording.
* Duplicate scenario with no material impact.
* Missing rationale for an otherwise valid derived scenario.

**Blocking:** No

### INFO

An INFO finding is an observation or recommendation that does not represent a defect.

Examples:

* Optional improvement.
* Optimization opportunity.
* Documentation suggestion.

**Blocking:** No

---

## 36. Finding Classification

Every finding must contain:

* Finding ID.
* Severity.
* Blocking status.
* Category.
* Location where applicable.
* Test Case ID or section where applicable.
* Description.
* Recommendation.

Finding IDs must be unique within the validation report.

Expected format:

```text
VAL-001
VAL-002
VAL-003
```

Example:

```text
VAL-001 | MAJOR | Yes | Traceability | AC-003 | AC-003 has no test coverage | Add coverage for AC-003.
```

The Validator must preserve every finding in the persisted validation report.

---

## 37. Validation Decision

The Validator must determine the final status using blocking findings.

### PASS

Return:

`TEST_PLAN_VALIDATED`

when:

* No BLOCKER findings exist.
* No unresolved blocking MAJOR findings exist.
* Mandatory standards are satisfied.
* Required traceability is complete.
* The test plan is suitable for downstream processing.
* All required quality gates have actually been evaluated.

MINOR and INFO findings do not automatically cause failure.

### FAIL

Return:

`TEST_PLAN_VALIDATION_FAILED`

when:

* One or more BLOCKER findings exist.
* One or more unresolved blocking MAJOR findings exist.
* Mandatory standards are not satisfied.
* Critical traceability is broken.
* The test plan is unsafe for downstream processing.

A failed test plan must not proceed to downstream automation.

---

## 38. Quality Gate Evaluation

The validation report must contain a quality-gate result for each applicable validation area.

At minimum, evaluate:

| Quality Gate                 | Possible Status              |
| ---------------------------- | ---------------------------- |
| Requirements analysed        | PASS / FAIL / NOT VERIFIED   |
| Acceptance criteria coverage | PASS / FAIL                  |
| Traceability                 | PASS / FAIL                  |
| Test plan structure          | PASS / FAIL                  |
| Test scenarios               | PASS / FAIL                  |
| Test cases                   | PASS / FAIL                  |
| Test data                    | PASS / FAIL                  |
| Screen / URL                 | PASS / FAIL / NOT VERIFIED   |
| Test steps                   | PASS / FAIL                  |
| Expected results             | PASS / FAIL                  |
| Test types                   | PASS / FAIL                  |
| Priorities                   | PASS / FAIL                  |
| Tags                         | PASS / FAIL                  |
| Automation candidates        | PASS / FAIL                  |
| Regression impact            | PASS / FAIL / NOT APPLICABLE |
| Risks                        | PASS / FAIL                  |
| Open questions               | PASS / FAIL                  |
| Assumptions                  | PASS / FAIL                  |
| No-invention validation      | PASS / FAIL                  |
| Internal consistency         | PASS / FAIL                  |
| Project conventions          | PASS / FAIL                  |

The exact quality-gate rows must reflect the current project standards.

The Validator must never report a gate as PASS if it was not actually evaluated.

Use `NOT VERIFIED` or `NOT APPLICABLE` where appropriate.

---

## 39. Validation Report

Every validation execution MUST produce a persistent validation report.

The report must be saved using:

```text
validation/[ticket-key]-[short-name]-validation.md
```

Example:

```text
validation/SCRUM-2-login-validation.md
```

The validation report is a separate artifact from the test plan.

The Validator must never modify the original test plan merely to record validation findings.

---

## 40. Validation Report as Official Workflow Artifact

The validation report is an official workflow artifact.

It acts as the quality-gate contract between the Test Plan Validator and downstream agents.

The validation report must contain:

* Validation status.
* JIRA information.
* Test plan reference.
* JIRA verification status.
* Quality-gate results.
* Complete findings.
* Traceability summary.
* Finding counts.
* Final decision.
* Downstream processing eligibility.
* Validation timestamp where available.

Every finding must be persisted in the report.

Findings must never exist only in the chat response.

---

## 41. Validation Report Format

The generated report must follow this structure:

```markdown
# Test Plan Validation Report

## Summary

| Field | Value |
|---|---|
| JIRA | SCRUM-2 |
| Test Plan | testplan/SCRUM-2-login.md |
| Validation Status | PASS |
| JIRA Verified | Yes |
| Blocking Issues | 0 |
| Major Issues | 0 |
| Minor Issues | 2 |
| Informational Issues | 0 |
| Downstream Processing | Allowed |

## Validation Timestamp

<timestamp if available>

## Quality Gate Results

| Quality Gate | Status | Notes |
|---|---|---|
| Requirements analysed | PASS | Requirement aligns with JIRA |
| Acceptance criteria coverage | PASS | All ACs have coverage |
| Traceability | PASS | Complete JIRA → AC → Scenario → TC mapping |
| Test plan structure | PASS | Mandatory sections present |
| Test scenarios | PASS | Scenarios are relevant and unique |
| Test cases | PASS | Required fields present |
| Test data | PASS | References are valid |
| Screen / URL | PASS | Information follows project standards |
| Test steps | PASS | Steps are atomic and executable |
| Expected results | PASS | Expected results are observable |
| Test types | PASS | Approved types used |
| Priorities | PASS | Priorities are appropriate |
| Tags | PASS | Approved tags used |
| Automation candidates | PASS | Candidates align with automation criteria |
| Regression impact | PASS | Regression impact assessed |
| Risks | PASS | Relevant risks documented |
| Open questions | PASS | Material unknowns addressed |
| Assumptions | PASS | Assumptions identified and qualified |
| No-invention validation | PASS | No unsupported requirements found |
| Internal consistency | PASS | No contradictions found |
| Project conventions | PASS | Naming and directory conventions satisfied |

## Findings

| ID | Severity | Blocking | Category | Location | Finding | Recommendation |
|---|---|---|---|---|---|---|
| VAL-001 | MINOR | No | Screen / URL | TC-001 | URL wording could be more specific | Replace placeholder with known URL or clearer page reference |
| VAL-002 | MINOR | No | Test Steps | TC-011 | Step wording is slightly passive | Use action-oriented wording |

## Summary of Findings

- BLOCKER: 0
- MAJOR: 0
- MINOR: 2
- INFO: 0

## Traceability Summary

| AC ID | Scenario ID | Test Case ID | Status |
|---|---|---|---|
| AC-001 | SC-001 | TC-001 | PASS |
| AC-002 | SC-002 | TC-002 | PASS |

## Final Decision

PASS

## Downstream Processing Eligibility

Ready for Downstream Processing

## Downstream Recommendation

The test plan is eligible for downstream JIRA update and Playwright automation processing.
```

The actual generated report must contain only the findings and quality-gate results applicable to the specific validation execution.

Do not copy example findings into a real report unless they are actually identified.

---

## 42. Findings Must Be Persisted

The Validator must never return findings only in the chat response and discard them.

The required workflow is:

```text
Test Plan Validator
        |
        v
Validation
        |
        +---- Finding VAL-001
        |
        +---- Finding VAL-002
        |
        v
Persist Validation Report
        |
        v
validation/[ticket-key]-[short-name]-validation.md
        |
        v
Return Execution Summary
```

This provides:

* Auditability.
* Traceability.
* Debugging.
* Agent-to-agent communication.
* Historical validation evidence.
* Quality reporting.
* Remediation support.

The persisted validation report is the authoritative record of the validation execution.

---

## 43. Validation Report as Downstream Input

Downstream agents may consume:

```text
testplan/[ticket-key]-[short-name].md
```

and:

```text
validation/[ticket-key]-[short-name]-validation.md
```

The validation report is the official quality-gate contract.

The JIRA Updater must use the validation report to determine whether downstream processing is permitted.

The Playwright Automation Agent must not process a test plan when:

```text
Validation Status: FAIL
```

or:

```text
Downstream Processing: Not Allowed
```

The downstream agent must treat the persisted validation decision as authoritative rather than relying only on the Validator's chat response.

---

## 44. JIRA Update Eligibility

The Validator must explicitly state whether the test plan is eligible for downstream JIRA processing.

Allowed values are:

```text
Ready for Downstream Processing
```

or:

```text
Stop Downstream Processing
```

The Validator must not update JIRA itself.

The JIRA Updater is responsible for consuming the validation decision.

---

## 45. Validator Output

After saving the validation report, the Validator must return a concise execution summary.

### PASS

```text
Validation Result

PASS

TEST_PLAN_VALIDATED

JIRA: SCRUM-2

Test Plan:
testplan/SCRUM-2-login.md

Validation Report:
validation/SCRUM-2-login-validation.md

Validation:
PASS

Findings:
- VAL-001 MINOR — URL placeholder wording
- VAL-002 MINOR — Passive step wording

Status:
Ready for Downstream Processing
```

### FAIL

```text
Validation Result

FAIL

TEST_PLAN_VALIDATION_FAILED

JIRA: SCRUM-2

Test Plan:
testplan/SCRUM-2-login.md

Validation Report:
validation/SCRUM-2-login-validation.md

Validation:
FAIL

Blocking Findings:
- VAL-001 BLOCKER — Missing AC-03 coverage
- VAL-002 MAJOR — Unsupported requirement

Status:
Stop Downstream Processing
```

The detailed findings must remain in the persisted validation report.

The chat response is only an execution summary.

---

## 46. Validator Behaviour on FAIL

If validation fails:

1. Do not approve the test plan.
2. Do not pass the test plan to downstream automation.
3. Clearly identify blocking findings.
4. Clearly identify major findings.
5. Provide actionable recommendations.
6. Persist all findings in the validation report.
7. Preserve the original test plan.
8. Do not silently repair the test plan.
9. Recommend remediation and revalidation.

A downstream or designated remediation process may correct the issues.

After remediation, the test plan must be validated again.

---

## 47. Validator Behaviour on PASS

If validation passes:

1. Mark the test plan as validated.
2. Confirm requirement traceability.
3. Confirm standards compliance.
4. Confirm readiness for downstream processing.
5. Persist the validation report.
6. Allow the test plan to proceed to downstream skills.

The expected downstream flow is:

```text
Test Planner
      |
      v
Generated Test Plan
      |
      v
Test Plan Validator
      |
      +---- FAIL ---> Remediation
      |                  |
      |                  v
      |             Re-validation
      |
      +---- PASS ---> Downstream Workflow
```

---

## 48. Downstream Handoff

A PASS result makes the test plan eligible for:

* JIRA Updater Agent.
* Playwright Automation Agent.
* Other downstream QA workflow components.

The Validator itself must not:

* Update JIRA.
* Generate Playwright tests.
* Create Page Objects.
* Execute tests.
* Heal tests.
* Create defects.

Those responsibilities belong to downstream skills.

The downstream workflow must consume the persisted validation report.

---

## 49. Quality Principles

The Validator must follow these principles:

1. Validate against project standards, not personal preference.
2. Validate independently from the Test Planner.
3. Do not invent requirements.
4. Do not silently correct the test plan.
5. Do not remove test cases.
6. Distinguish direct requirements from derived scenarios.
7. Distinguish derived scenarios from unsupported requirements.
8. Preserve every finding.
9. Persist findings before returning the execution result.
10. Separate blocking and non-blocking findings.
11. Do not fail valid plans because of minor wording issues.
12. Prevent failed plans from reaching downstream automation.
13. Maintain requirement-to-test traceability.
14. Produce an auditable validation report.
15. Keep the original test plan unchanged.
16. Treat the validation report as a formal downstream workflow artifact.
17. Never report a quality gate as PASS unless it was actually evaluated.
18. Do not expose secrets or sensitive values in validation output.
19. Prefer evidence from authoritative sources over assumptions.
20. Require revalidation after blocking issues are remediated.

---

## 50. Completion Criteria

The Test Plan Validator execution is complete only when all applicable activities below have been completed:

1. The test plan has been located.
2. The test plan has been read successfully.
3. Applicable project standards have been loaded.
4. JIRA requirements have been retrieved where required and available.
5. JIRA verification status has been determined.
6. Test-plan structure has been evaluated.
7. Requirement alignment has been assessed.
8. Acceptance-criteria coverage has been assessed.
9. Scenario coverage has been assessed.
10. Test cases have been validated.
11. Test case IDs have been validated.
12. Test data has been validated.
13. Screens and URLs have been validated.
14. Test steps have been validated.
15. Expected results have been validated.
16. Test types have been validated.
17. Tags have been validated.
18. Priorities have been validated.
19. Automation candidates have been validated.
20. Regression impact has been assessed.
21. Risks have been assessed.
22. Open questions have been assessed.
23. Assumptions have been assessed.
24. Unsupported requirements have been assessed.
25. No-invention validation has been completed.
26. Duplicate and redundant scenarios have been assessed.
27. Complete traceability has been validated.
28. Internal consistency has been validated.
29. Project conventions have been validated.
30. Findings have been classified.
31. Blocking status has been determined.
32. PASS or FAIL has been determined.
33. A persistent validation report has been generated.
34. All findings have been persisted.
35. Downstream eligibility has been explicitly recorded.
36. The validation report has been saved successfully.
37. The concise execution summary has been returned.

The Validator must not report completion until the validation report has been successfully persisted.

---

## 51. Successful Output Contract

For successful validation, the Validator must return:

```text
TEST_PLAN_VALIDATED

JIRA: [JIRA KEY]

Test Plan:
testplan/[ticket-key]-[short-name].md

Validation:
PASS

Validation Report:
validation/[ticket-key]-[short-name]-validation.md

Status:
Ready for Downstream Processing
```

Optional non-blocking findings may be included in the execution summary.

---

## 52. Failed Output Contract

For failed validation, the Validator must return:

```text
TEST_PLAN_VALIDATION_FAILED

JIRA: [JIRA KEY]

Test Plan:
testplan/[ticket-key]-[short-name].md

Validation:
FAIL

Validation Report:
validation/[ticket-key]-[short-name]-validation.md

Status:
Stop Downstream Processing

Blocking Issues:
[Count]

Major Issues:
[Count]

Remediation:
Required before downstream processing.
```

The detailed findings must remain in:

```text
validation/[ticket-key]-[short-name]-validation.md
```

---

## 53. Final Execution Rule

The Test Plan Validator is a **quality gate**, not a remediation agent.

Its responsibility is to determine whether the generated test plan is sufficiently correct, complete, traceable, internally consistent, standards-compliant, and safe for downstream processing.

The Validator must follow this execution model:

```text
READ
  |
VALIDATE
  |
CLASSIFY
  |
PERSIST FINDINGS
  |
DECIDE
  |
HAND OFF
```

It must never follow this model:

```text
VALIDATE
  |
SILENTLY FIX
  |
APPROVE
```

The original test plan must remain unchanged.

The persisted validation report is the authoritative evidence of the validation execution and the formal contract governing downstream processing.

The final workflow is:

```text
                         +----------------------+
                         |    Generated Plan    |
                         +----------+-----------+
                                    |
                                    v
                         +----------------------+
                         |  Test Plan Validator |
                         +----------+-----------+
                                    |
                    +---------------+---------------+
                    |                               |
                  FAIL                            PASS
                    |                               |
                    v                               v
          +-------------------+           +----------------------+
          | Persist Findings  |           | Persist Validation   |
          | + Remediation     |           | Report + Findings   |
          +---------+---------+           +----------+-----------+
                    |                                |
                    v                                v
             Re-validation                  Downstream Processing
                                                     |
                                      +--------------+--------------+
                                      |                             |
                                      v                             v
                               JIRA Updater              Playwright Automation
```
