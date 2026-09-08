# Defect Management Standards

## Purpose

Define standards for identifying genuine application defects, creating JIRA defects, linking defects to their originating stories, avoiding duplicates, and maintaining complete traceability.

The `defect-manager` skill defines what the agent can do.
This steering file defines how the agent must perform those activities.

## 1. Source of Truth

Use only evidence from:
- Original JIRA story
- Approved test plan
- Test case
- Test execution result
- Failure evidence
- Heal Test result
- Existing JIRA defects

Do not invent application behaviour, requirements, expected results, or failure evidence.

## 2. Input

The Defect Manager receives:

```text
JIRA Story
+
Test Plan
+
Test Case
+
Execution Result
+
Failure Evidence
+
Heal Test Result
```

Primary execution input:

`execution/[ticket-key]-[short-name]/execution-results.json`

Supporting inputs may include:

```text
testplan/[ticket-key]-[short-name].md
healing/[ticket-key]-[short-name]/healing-report.md
healing/[ticket-key]-[short-name]/healing-report.json
execution evidence
screenshots
traces
videos
logs
```

## 3. Defect Decision Gate

A failed test must NOT automatically create a JIRA defect.

Classify the failure as one of:

```text
AUTOMATION
ENVIRONMENT
TEST_DATA
CONFIGURATION
APPLICATION
REQUIREMENT_AMBIGUITY
```

Only a sufficiently supported `APPLICATION` failure may proceed to defect creation.

If evidence is insufficient, return:

`REQUIRES_HUMAN_REVIEW`

## 4. Separate Defect Creation From Defect Linking

Defect creation and defect linking are separate operations.

Mandatory workflow:

```text
Analyse Failure
      ↓
Determine Genuine Application Defect
      ↓
Search Existing JIRA Defects
      ↓
Existing Defect?
   /           \\
 YES            NO
  |              |
  v              v
Use Existing   Create New Bug
Defect             |
  |                v
  |            Capture Bug Key
  |                |
  +-------+--------+
          |
          v
    Link Bug to Story
          |
          v
     Verify Link
          |
          v
     Final Report
```

Never treat "defect created" as equivalent to "defect linked".

Record these independently:

```text
DEFECT_CREATED
DEFECT_ALREADY_EXISTS
LINK_CREATED
LINK_FAILED
LINK_VERIFIED
LINK_NOT_VERIFIED
```

## 5. Failure Analysis

Before any JIRA mutation:

1. Identify the failed test case.
2. Identify the acceptance criterion.
3. Review execution evidence.
4. Review Heal Test result.
5. Determine root cause.
6. Determine whether the failure is an application defect.

If the evidence does not support an application defect, do not create one.

## 6. Duplicate Detection

Before creating a new defect, search JIRA for possible duplicates.

Consider:
- Same originating story
- Same acceptance criterion
- Same test case
- Similar summary
- Same error message
- Same application area
- Same observed behaviour
- Existing open/reopened defects

If a matching defect exists:

```text
Do not create duplicate
        ↓
Use existing defect
        ↓
Continue to linking/verification
```

## 7. Defect Creation

Create a JIRA Bug only after the defect decision gate passes.

Minimum supported fields:

```text
Issue Type
Summary
Description
Priority
Environment
Steps to Reproduce
Expected Result
Actual Result
Acceptance Criterion
Test Case
Originating Story
```

Use additional fields only when supported by the project configuration and evidence.

Do not invent field values.

## 8. Defect Description Integrity

The defect description must contain information only for the current defect candidate.

For example, when processing:

```text
SCRUM-2
```

do not accidentally include unrelated tickets such as:

```text
SCRUM-6
SCRUM-7
```

unless they are explicitly relevant and supported by evidence.

Before creation, verify:
- Originating story key is correct.
- Test case ID is correct.
- Acceptance criterion is correct.
- Test plan is correct.
- Execution evidence belongs to the current ticket.
- No stale context from another ticket has been copied.

## 9. Defect Description Format

Use:

```markdown
## Summary

<concise defect summary>

## Originating Story

<JIRA story key>

## Acceptance Criterion

<AC reference>

## Test Case

<test case ID and title>

## Environment

<environment>

## Preconditions

<relevant preconditions>

## Steps to Reproduce

1. <step>
2. <step>
3. <step>

## Expected Result

<expected behaviour from approved test plan>

## Actual Result

<actual observed behaviour>

## Failure Evidence

<relevant evidence references>

## Automation Status

<Heal Test result>

## Traceability

JIRA Story → Acceptance Criterion → Test Case → Playwright Spec → Execution
```

Never include unrelated ticket context.

## 10. Capture Defect Key

After successful JIRA defect creation:

```text
Create Bug
    ↓
Read returned issue key
    ↓
Store defect key
```

The agent must never guess or construct the JIRA key.

## 11. Link Defect to Story

After obtaining the real defect key, perform linking as a separate operation.

Required relationship:

```text
Originating Story
       ↕
    JIRA Bug
```

Before linking:
1. Confirm the story exists.
2. Confirm the defect exists.
3. Confirm the actual returned defect key.
4. Confirm the intended relationship.
5. Confirm the link type supported by JIRA/MCP.
6. Confirm permission where possible.

Do not assume a link type is supported.

## 12. Link-Type Validation

If the JIRA MCP exposes available link types, inspect/use the supported configured value.

Do not invent or blindly retry a link type.

If JIRA returns a link-type incompatibility error:
- Treat defect creation and linking as separate outcomes.
- Preserve the created defect key.
- Mark linking as `LINK_FAILED`.
- Record the actual error.
- Return `REQUIRES_HUMAN_REVIEW`.
- Do not recreate the defect merely because linking failed.

## 13. Link Failure Handling

For issue-link creation:

```text
Attempt link
     ↓
Failure
     ↓
Inspect error
     ↓
Transient error?
   /          \\
 YES           NO
  |             |
Retry once    Stop
  |             |
Failure       LINK_FAILED
  |             |
  v             v
Stop       REQUIRES_HUMAN_REVIEW
```

Maximum: **2 attempts total**.

Never enter a retry loop.

Example final state:

```text
Defect Creation: SUCCESS
Defect Key: BUG-123

Defect Linking: FAILED
Reason: <actual JIRA/MCP error>

Final Status: REQUIRES_HUMAN_REVIEW
```

Never claim the defect is linked when linking failed.

## 14. Link Verification

Successful link invocation is not sufficient.

Where supported, retrieve the relevant issue information and verify that the relationship exists.

Required state:

```text
Bug exists
    +
Story exists
    +
Link exists
    =
LINK_VERIFIED
```

If the link was created but cannot be verified:

```text
LINK_CREATED
LINK_NOT_VERIFIED
REQUIRES_HUMAN_REVIEW
```

Do not report `LINK_VERIFIED` without evidence.

## 15. JIRA MCP Failure Handling

For all JIRA MCP operations:

1. Perform the operation.
2. Inspect the result.
3. Retry only when the error appears transient.
4. Maximum two attempts.
5. Never repeatedly retry the same failed operation.
6. Preserve the actual MCP error.
7. Stop when the operation cannot safely continue.
8. Report the exact failed stage.

Possible stages:

```text
SEARCH_EXISTING_DEFECT
CREATE_DEFECT
CAPTURE_DEFECT_KEY
CREATE_ISSUE_LINK
VERIFY_ISSUE_LINK
UPDATE_JIRA
```

## 16. Severity and Priority

Do not arbitrarily assign Critical priority.

Base priority on:
- Business impact
- User impact
- Security impact
- Data integrity impact
- Frequency
- Acceptance criterion criticality
- Failure impact

If priority cannot be determined confidently, use the project-approved default if defined; otherwise request human review.

## 17. Evidence

Where available, retain references to:
- Screenshots
- Trace
- Video
- Console logs
- Network evidence
- Execution result
- Test plan
- Healing report

Do not include secrets or credentials.

Evidence must belong to the current execution.

## 18. Traceability

Every defect must maintain:

```text
JIRA Story
    ↓
Acceptance Criterion
    ↓
Test Case
    ↓
Playwright Spec
    ↓
Execution
    ↓
Failure
    ↓
Heal Test Result
    ↓
JIRA Defect
```

The originating story must be explicitly recorded.

## 19. Output

Store results under:

`defects/[ticket-key]-[short-name]/`

Required:

```text
defect-report.md
defect-report.json
```

The report must distinguish:

```text
Defect Analysis
Defect Creation
Defect Linking
Link Verification
```

## 20. Defect Report

Use:

```markdown
# Defect Report

## Summary

- JIRA Story: <story>
- Test Case: <test case>
- Acceptance Criterion: <AC>
- Classification: APPLICATION_DEFECT
- Final Status: <status>

## Defect

- Created: <YES/NO/EXISTING>
- Defect Key: <key>

## Root Cause

<evidence-based analysis>

## Expected Result

<expected>

## Actual Result

<actual>

## Defect Creation

Status: <status>

## Defect Linking

Status: <status>
Link Type: <type>
Source: <story>
Target: <bug>

## Link Verification

Status: <status>

## Evidence

<references>

## Traceability

JIRA Story → AC → Test Case → Spec → Execution → Defect

## Next Action

<next action>
```

## 21. Machine-Readable Report

Store:

`defects/[ticket-key]-[short-name]/defect-report.json`

Minimum fields:

```text
jiraStory
testCaseId
acceptanceCriterion
spec
failureCategory
classification
rootCause
defectCreationStatus
defectKey
defectLinkStatus
linkType
linkVerificationStatus
mcpError
evidence
nextAction
```

Do not fabricate values.

## 22. Idempotency

The agent must be safe to run more than once.

Before creating a defect:

```text
Search existing defects
```

Before creating a link:

```text
Check whether the link already exists
```

Do not create duplicate defects or issue links.

## 23. Human Review Triggers

Return:

`REQUIRES_HUMAN_REVIEW`

when:
- Application defect cannot be established confidently.
- Expected behaviour is ambiguous.
- Multiple existing defects may match.
- JIRA issue type is unavailable.
- JIRA permissions prevent creation/linking.
- Link type is unsupported or ambiguous.
- MCP operation fails after allowed retries.
- Link cannot be verified.
- Required evidence is missing.
- Defect description would require unsupported assumptions.

## 24. No False Defects

Never create a JIRA defect merely because:
- A test failed.
- A locator failed.
- A timeout occurred.
- A test environment was unavailable.
- Test data was invalid.
- The test was incorrectly implemented.
- Heal Test identified a repairable automation problem.

A JIRA defect must represent a sufficiently supported application problem.

## 25. Enterprise Defect Workflow

The mandatory workflow is:

```text
OBSERVE
   ↓
ANALYSE
   ↓
CLASSIFY
   ↓
CHECK DUPLICATES
   ↓
CREATE OR REUSE DEFECT
   ↓
CAPTURE DEFECT KEY
   ↓
LINK TO ORIGINATING STORY
   ↓
VERIFY LINK
   ↓
REPORT
```

Defect creation and defect linking must remain separate operations with independent statuses and error handling.