# Autonomous QA Power

**Version:** 0.1  
**Status:** Initial Architecture  
**Purpose:** Enterprise Agentic QA Automation Framework

# 1. Purpose

Autonomous QA is an enterprise agentic testing framework that transforms
a JIRA ticket into a structured test plan, executable Playwright
automation, test execution results, failure analysis, self-healing
where appropriate, and JIRA reporting.

The framework is designed around:

- Specialized AI agents
- Reusable skills
- Steering instructions
- MCP servers
- Structured inputs and outputs
- Schema validation
- Sequential workflow orchestration
- Human approval gates
- Requirement traceability
- Test automation standards
- Auditability and security

The system must prioritize correctness, traceability, maintainability,
security and controlled autonomy over unrestricted automation.

# 2. High-Level Architecture

The framework consists of the following layers:

## 2.1 Agents

Agents are responsible for reasoning, decision-making and orchestration.

Examples:

- Planner Agent
- Test Planning Agent
- Automation Agent
- Failure Analysis Agent
- JIRA Updater Agent

## 2.2 Skills

Skills represent specific capabilities that agents can invoke.

Examples:

- testplanner
- testplan-validator
- automate-ui
- test-runner
- heal-test
- jira-updater

## 2.3 Steering

Steering files define persistent instructions, standards and behavioural
rules for agents and skills.

Examples:

- Planner Agent standards
- Test planning standards
- Playwright standards
- JIRA update standards
- Healing policies
- Security policies

## 2.4 MCP Servers

MCP servers provide controlled access to external systems and tools.

Examples:

- JIRA MCP Server
- Playwright MCP Server
- Repository/File System tools

## 2.5 Structured State

The workflow must maintain structured state between agents and skills.

The state should contain information such as:

- JIRA ticket
- Requirements
- Acceptance criteria
- Test plan
- Validation result
- Generated automation
- Execution results
- Failure analysis
- Healing attempts
- JIRA update status

Agents must consume and produce structured data wherever possible.

# 3. MCP Servers

## 3.1 JIRA Atlassian Rovo MCP

### Purpose:
Provides Jira access for retrieving and updating Jira issues.

Endpoint:
https://mcp.atlassian.com/v1/mcp/authv2

Authentication:
OAuth 2.1

Access:
Based on authenticated user's Jira permissions.

### Capabilities

- Retrieve issue by ticket ID
- Retrieve issue summary
- Retrieve issue description
- Retrieve acceptance criteria
- Retrieve issue metadata
- Retrieve comments
- Add comments
- Update testing notes
- Update issue fields where permitted
- Add execution results
- Add attachments where permitted

### Used By

- Planner Agent
- Test Planner
- JIRA Updater Agent

### Security

JIRA credentials must never be included in prompts.

Credentials must be managed through secure configuration or secret
management.

Read and write permissions must be explicitly controlled.

# 3.2 Playwright MCP Server

### Purpose

Provide browser and UI interaction capabilities to agents where
browser inspection or interaction is required.

### Capabilities

- Launch browser
- Navigate to application
- Inspect page
- Inspect elements
- Interact with UI
- Capture screenshots
- Inspect browser state
- Assist with locator discovery
- Assist with failure investigation

### Used By

- Automate UI
- Test Runner
- Failure Analysis
- Heal Test

# 3.3 Repository / File System Tools

### Purpose

Provide controlled access to the automation repository.

### Capabilities

- Read source files
- Read existing Page Objects
- Read fixtures
- Read test data
- Create test files
- Modify test files
- Create Page Objects
- Inspect project structure

### Used By

- Automate UI
- Code Validator
- Heal Test

### Security

Agents must not modify files outside approved project directories.

Application source code must not be modified by the QA automation
agents unless explicitly authorized.


# 4. Skills

# 4.1 testplanner

## Purpose

Retrieve and analyze a JIRA ticket and generate a structured,
traceable test plan.

## Input

JIRA ticket ID.

Example:

DEMO-001

## Process

1. Retrieve the JIRA ticket.
2. Read the ticket summary.
3. Read the description.
4. Read acceptance criteria.
5. Read relevant business rules, functional requirements, non-functional requirements.
6. Read relevant comments.
7. Identify functional requirements.
8. Identify negative scenarios.
9. Identify boundary conditions.
10. Identify validation rules.
11. Identify authorization requirements.
12. Identify regression impact.
13. Identify test data requirements.
14. Identify ambiguities.
15. Generate structured test cases.
16. Map test cases to acceptance criteria.
17. Identify automation candidates.
18. Assign approved test tags.
19. Generate the test plan.

## Output

A Markdown test plan:

testplan/[ticket-key]-[short-name].md

The test plan must contain:

- JIRA ticket
- Feature summary
- Scope
- Out of scope
- Assumptions
- Risks
- Test scenarios
- Test cases
- Acceptance criterion traceability
- Test data requirements
- Automation candidates
- Test tags
- Open questions

## Dependencies

- JIRA MCP Server
- Test planning steering
- Test plan schema

## Restrictions

The test planner must not:

- Modify JIRA
- Generate Playwright code
- Execute tests
- Invent requirements
- Ignore ambiguous requirements

Ambiguous requirements must be explicitly identified.


# 4.2 testplan-validator

## Purpose

Validate the generated test plan against the JIRA requirements
and acceptance criteria.

## Input

- JIRA ticket ID
- Generated test plan

## Output

Structured validation result containing:

- Validation status
- Requirement coverage
- Acceptance criteria coverage
- Missing scenarios
- Duplicate scenarios
- Quality issues
- Recommendations

## Validation Areas

- Functional coverage
- Negative coverage
- Boundary coverage
- Validation coverage
- Authorization coverage
- Regression impact
- Test data completeness
- Expected result quality
- Requirement traceability
- Automation suitability

## Dependencies

- JIRA MCP Server
- Test plan schema
- Test planning steering

# 4.3 automate-ui

## Purpose

Generate executable Playwright tests from an approved test plan.

## Input

- JIRA ticket ID
- Approved test plan
- Existing automation framework

## Output

Playwright test files:

src/tests/ui/[app-folder]/[feature-name].spec.ts

## Process

1. Inspect existing automation framework.
2. Inspect existing Page Objects.
3. Inspect fixtures.
4. Inspect utilities.
5. Inspect test data.
6. Identify reusable components.
7. Generate automation.
8. Apply approved test tags.
9. Add requirement traceability.
10. Validate generated code.

## Dependencies

- Repository/File System tools
- Playwright MCP Server
- Playwright steering
- Automation standards

## Restrictions

The agent must:

- Reuse existing Page Objects where possible.
- Reuse existing fixtures.
- Follow repository conventions.
- Avoid unnecessary duplication.
- Avoid hard-coded credentials.
- Avoid unnecessary waits.
- Use meaningful assertions.

# 4.4 test-runner

## Purpose

Execute Playwright tests and produce structured execution results.

## Input

- Playwright test files
- Test configuration
- Environment configuration

## Output

Execution result containing:

- Ticket ID
- Test case ID
- Test name
- Status
- Duration
- Error
- Screenshot reference
- Trace reference
- Video reference where enabled
- Timestamp

## Dependencies

- Playwright
- Repository/File System tools


# 4.5 failure-analyzer

## Purpose

Analyze failed automated tests and classify the failure.

## Input

- JIRA ticket ID
- Test case
- Test code
- Execution result
- Error
- Screenshot
- Trace
- Relevant logs

## Output

Failure analysis containing:

- Failure category
- Probable root cause
- Evidence
- Confidence
- Recommended action
- Healing eligibility

## Failure Categories

- TEST_DEFECT
- APPLICATION_DEFECT
- ENVIRONMENT_FAILURE
- TEST_DATA_FAILURE
- CONFIGURATION_FAILURE
- UNKNOWN

# 4.6 heal-test

## Purpose

Safely repair automation when a failure is determined to be
caused by the test implementation.

## Input

- Failed test
- Failure analysis
- Existing test code
- Relevant Page Object
- Execution evidence

## Output

- Proposed fix
- Modified test where permitted
- Change description
- Confidence
- Healing attempt number

## Healing Rules

Healing must not:

- Hide application defects.
- Remove meaningful assertions.
- Change expected business behaviour.
- Disable failing tests.
- Reduce test coverage to achieve a pass.

Healing must be limited by a configurable maximum retry count.

Human intervention is required when the maximum retry count is reached
or confidence is below the configured threshold.

# 4.7 jira-updater

## Purpose

Update the JIRA ticket with test planning, automation and execution
information.

## Input

- JIRA ticket ID
- Test plan
- Validation result
- Automation status
- Execution results
- Failure analysis
- Healing results

## Output

JIRA update result containing:

- Update status
- Updated fields
- Added comments
- Attachments
- Timestamp

## Dependencies

- JIRA MCP Server
- JIRA update steering

# 5. Project Conventions

## 5.1 Test Plans

All generated test plans must be stored under:

testplan/[ticket-key]-[short-name].md

Example:

testplan/DEMO-001-password-reset.md


## 5.2 UI Automation Tests

All UI Playwright tests must be stored under:

src/tests/ui/[app-folder]/[feature-name].spec.ts

Example:

src/tests/ui/auth/password-reset.spec.ts

## 5.3 Page Objects

All UI Page Objects must be stored under:

src/pages/ui/

Examples:

src/pages/ui/LoginPage.ts

src/pages/ui/PasswordResetPage.ts

src/pages/ui/DashboardPage.ts

Automation agents must reuse existing Page Objects before creating
new ones.


## 5.4 Test Data

All non-sensitive test data must be stored under:

src/testdata/

Examples:

src/testdata/auth/password-reset.data.ts

Credentials, passwords, API keys, tokens and other secrets must never
be stored in source-controlled test data.

# 6. Test Tags

The framework supports the following standard tags:

@smoke
@regression
@functional
@negative
@boundary
@security
@critical

## Tag Definitions

### @smoke

Critical business-path tests used for rapid validation.

### @regression

Tests required as part of regression testing.

### @functional

Standard functional behaviour validation.

### @negative

Invalid input, error handling and failure scenarios.

### @boundary

Boundary and limit conditions.

### @security

Authentication, authorization and security-related scenarios.

### @critical

Business-critical functionality.

Agents must use only approved tags.

The Test Planner determines appropriate tags.

The Automation Agent applies the approved tags.


# 7. Requirement Traceability

Every test must be traceable through the following chain:

JIRA Ticket
    ↓
Acceptance Criterion
    ↓
Test Case
    ↓
Automated Test
    ↓
Execution Result

Every generated test case must contain:

- JIRA ticket ID
- Test case ID
- Acceptance criterion reference
- Automation status
- Test tags

# 8. Naming Conventions

## Test Plan

[ticket-key]-[short-name].md

Example:

DEMO-001-password-reset.md

## Playwright Test

[feature-name].spec.ts

Example:

password-reset.spec.ts

## Page Object

[Feature]Page.ts

Example:

PasswordResetPage.ts

## Test Case

TC-[number]

Example:

TC-001

# 9. Playwright Standards

Generated Playwright tests must:

- Use TypeScript.
- Use Playwright Test.
- Follow existing repository patterns.
- Reuse Page Objects.
- Reuse fixtures.
- Prefer accessible locators.
- Avoid unnecessary CSS/XPath selectors.
- Avoid unnecessary hard waits.
- Use explicit assertions.
- Use meaningful test names.
- Keep tests independently executable.
- Avoid hard-coded credentials.
- Avoid duplicated setup logic.
- Use approved tags.
- Maintain JIRA/test-case traceability.

# 10. Sequential Workflow

The default end-to-end workflow is:

## Step 1 — Receive JIRA Ticket

Input:

JIRA ticket ID

Example:

DEMO-001


## Step 2 — Planner Agent

Planner Agent receives the ticket ID.

Responsibilities:

- Determine whether the ticket is valid.
- Retrieve ticket information.
- Determine whether the ticket is suitable for QA automation.
- Determine the required workflow.
- Identify ambiguity.
- Select the appropriate skills.

Output:

Workflow state.


## Step 3 — Test Planner

Planner invokes:

testplanner

Input:

DEMO-001

The skill retrieves the ticket through the JIRA MCP Server.

Output:

testplan/DEMO-001-password-reset.md


## Step 4 — Test Plan Validator

Validator evaluates:

- Requirement coverage
- Acceptance criteria coverage
- Negative scenarios
- Boundary scenarios
- Test data
- Traceability
- Automation suitability

Output:

Validation result.

## Step 5 — Decision Gate

If validation fails:

Test Plan Validator
        ↓
Planner Agent
        ↓
Test Planner
        ↓
Validator

The test plan may be regenerated.

If validation passes:

Continue to approval.

## Step 6 — Human Approval

The test plan must be approved before automation unless autonomous
execution is explicitly enabled.

Possible states:

TEST_PLAN_PENDING_APPROVAL

TEST_PLAN_APPROVED

TEST_PLAN_REJECTED


## Step 7 — JIRA Update

After approval:

jira-updater

updates the JIRA ticket with:

- Test scope
- Test plan summary
- Test case information
- Automation status

## Step 8 — UI Automation

Planner invokes:

automate-ui

Input:

- JIRA ticket ID
- Approved test plan

Output:

src/tests/ui/[app-folder]/[feature-name].spec.ts

## Step 9 — Code Validation

Generated Playwright code is validated for:

- Syntax
- Framework conventions
- Page Object usage
- Fixtures
- Locators
- Assertions
- Tags
- Traceability
- Security

If validation fails:

Code Validator
      ↓
Automate UI
      ↓
Code Validator

## Step 10 — Human Automation Approval

Automation may require human approval before execution.

Possible states:

AUTOMATION_PENDING_APPROVAL

AUTOMATION_APPROVED

AUTOMATION_REJECTED

## Step 11 — Test Execution

Planner invokes:

test-runner

Playwright executes the generated tests.

Output:

execution-results/

## Step 12 — Execution Decision

### If all tests pass

Proceed to:

JIRA Updater

### If tests fail

Invoke:

failure-analyzer

## Step 13 — Failure Analysis

Failure Analyzer classifies each failure.

### TEST_DEFECT

Eligible for healing.

→ Heal Test

### APPLICATION_DEFECT

Do not modify automation.

→ Record defect information

### ENVIRONMENT_FAILURE

Do not modify test.

→ Record environment failure

### TEST_DATA_FAILURE

Evaluate test data issue.

### UNKNOWN

Require human investigation.

## Step 14 — Test Healing

If eligible:

failure-analyzer
       ↓
heal-test
       ↓
code validation
       ↓
test-runner

Maximum healing attempts are configurable.


## Step 15 — Healing Decision

If healed test passes:

Continue.

If healed test fails:

Re-analyze.

If maximum healing attempts are exceeded:

Stop automatic healing and request human intervention.


## Step 16 — Final JIRA Update

JIRA Updater records:

- Test plan
- Automation status
- Execution summary
- Passed tests
- Failed tests
- Failure classifications
- Healing attempts
- Final status
- Relevant artifacts

## Step 17 — Workflow Completion

Final workflow states:

PASSED

FAILED_APPLICATION_DEFECT

FAILED_TEST_DEFECT

FAILED_ENVIRONMENT

REQUIRES_HUMAN_REVIEW

BLOCKED

# 11. Workflow Decision Rules

1. Invalid JIRA ticket:
   Stop workflow.

2. JIRA unavailable:
   Stop workflow and report integration failure.

3. Requirements ambiguous:
   Request clarification.

4. Test plan validation fails:
   Return to Test Planner.

5. Test plan rejected:
   Stop automation.

6. Generated automation fails code validation:
   Return to Automate UI.

7. Automation rejected:
   Stop execution.

8. Test execution passes:
   Proceed to JIRA reporting.

9. Test execution fails:
   Invoke Failure Analyzer.

10. Application defect:
    Do not modify automation.

11. Test defect with high healing confidence:
    Invoke Heal Test.

12. Healing confidence below threshold:
    Require human review.

13. Maximum healing attempts reached:
    Require human review.

14. Final result must always be recorded in JIRA.

# 12. Human-in-the-Loop

Human approval gates are required by default for:

- Test plan approval
- Generated automation approval
- Low-confidence healing
- Application defect confirmation
- Unknown failure classification
- Destructive JIRA operations

Autonomous mode may be enabled through configuration after the
framework has demonstrated sufficient reliability.


# 13. Structured State

The workflow must maintain a structured state containing:

- ticketId
- workflowId
- currentStage
- requirements
- acceptanceCriteria
- testPlan
- validation
- automation
- execution
- failures
- healing
- jiraUpdates
- timestamps
- agentActions

Every state transition must be auditable.

# 14. Configuration

The following values must be configurable:

- JIRA URL
- JIRA project
- JIRA MCP configuration
- Playwright MCP configuration
- LLM provider
- LLM model
- Application base URL
- Maximum healing attempts
- Healing confidence threshold
- Human approval requirements
- Execution timeout
- Logging level
- Retry policy

Secrets must be supplied through environment variables or approved
secret-management mechanisms.

# 15. Security

The framework must:

- Never expose credentials in prompts.
- Never commit secrets.
- Never store passwords in test data.
- Restrict MCP permissions.
- Restrict file-system access.
- Prevent agents from modifying application source code.
- Require approval for destructive operations.
- Maintain an audit trail.
- Avoid exposing sensitive test data in logs.
- Sanitize external content before including it in prompts where
  appropriate.

# 16. Auditability

Every workflow execution must have a unique workflow ID.

The system should record:

- Workflow start time
- Ticket ID
- Agent invoked
- Skill invoked
- Input reference
- Output reference
- Decision made
- Tool/MCP operation
- Validation result
- Execution result
- Healing attempt
- Final status

This information must be available for troubleshooting and audit.

# 17. Usage

## Standard Usage

Provide a JIRA ticket ID.

Example:

DEMO-001

The framework executes:

JIRA Ticket
    ↓
Planner Agent
    ↓
Test Planner
    ↓
Test Plan Validator
    ↓
Human Approval
    ↓
JIRA Update
    ↓
Automate UI
    ↓
Code Validation
    ↓
Human Approval
    ↓
Test Runner
    ↓
Failure Analysis
    ↓
Heal Test if appropriate
    ↓
Re-run
    ↓
Final JIRA Update

# 18. Enterprise Design Principles

The framework follows these principles:

1. JIRA is the system of record for requirements and testing status.

2. Agents perform reasoning and decision-making.

3. Skills provide reusable capabilities.

4. Steering provides behavioural and engineering standards.

5. MCP provides controlled access to external systems.

6. Structured schemas define agent contracts.

7. Agents must not invent requirements.

8. Automation must follow repository conventions.

9. Human approval is preferred for high-impact operations.

10. Failures must be classified before attempting healing.

11. Application defects must never be hidden through test healing.

12. Every automated test must maintain requirement traceability.

13. All workflow actions must be auditable.

14. Security and least privilege apply to all agents and MCP tools.

15. Autonomous behaviour must be controlled by explicit policies.