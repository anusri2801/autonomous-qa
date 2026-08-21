# Autonomous QA Power

**Version:** 0.1
**Status:** Initial Architecture
**Purpose:** Enterprise Agentic QA Automation Framework

---

## 1. Purpose

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

---

## 2. High-Level Architecture

The framework consists of the following layers:

### 2.1 Agents

Agents are responsible for reasoning, decision-making and orchestration.

Examples:

- Planner Agent
- Test Planning Agent
- Automation Agent
- Failure Analysis Agent
- JIRA Updater Agent

### 2.2 Skills

Skills represent specific capabilities that agents can invoke.

Examples:

- `test-planner`
- `test-plan-validator`
- `automate-ui`
- `test-runner`
- `heal-test`
- `jira-updater`

### 2.3 Steering

Steering files define persistent instructions, standards and behavioural
rules for agents and skills.

Examples:

- `global-standards.md`
- `test-planning-standards.md`
- `jira-testing-notes-standards.md`

### 2.4 MCP Servers

MCP servers provide controlled access to external systems and tools.

Examples:

- JIRA Atlassian Rovo MCP Server
- Playwright MCP Server
- Repository / File System tools

### 2.5 Structured State

The workflow must maintain structured state between agents and skills.

The state should contain:

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

---

## 3. MCP Servers

### 3.1 JIRA Atlassian Rovo MCP

**Purpose:** Provides JIRA access for retrieving and updating JIRA issues.

**Endpoint:** `https://mcp.atlassian.com/v1/mcp/authv2`

**Authentication:** OAuth 2.1

**Access:** Based on the authenticated user's JIRA permissions.

#### Capabilities

- Retrieve issue by ticket ID
- Retrieve issue summary, description, acceptance criteria and metadata
- Retrieve comments
- Add comments
- Update testing notes
- Update issue fields where permitted
- Add execution results and attachments where permitted

#### Used By

- Planner Agent
- Test Planner
- JIRA Updater Agent

#### Security

JIRA credentials must never be included in prompts.

Credentials must be managed through secure configuration or secret management.

Read and write permissions must be explicitly controlled.

---

### 3.2 Playwright MCP Server

**Purpose:** Provide browser and UI interaction capabilities to agents where
browser inspection or interaction is required.

#### Capabilities

- Launch browser
- Navigate to application
- Inspect page and elements
- Interact with UI
- Capture screenshots
- Inspect browser state
- Assist with locator discovery
- Assist with failure investigation

#### Used By

- Automate UI
- Test Runner
- Failure Analysis
- Heal Test

---

### 3.3 Repository / File System Tools

**Purpose:** Provide controlled access to the automation repository.

#### Capabilities

- Read source files, Page Objects, fixtures, test data
- Create and modify test files
- Create Page Objects
- Inspect project structure

#### Used By

- Automate UI
- Code Validator
- Heal Test

#### Security

Agents must not modify files outside approved project directories.

Application source code must not be modified by QA automation agents
unless explicitly authorized.

---

## 4. Skills

### 4.1 test-planner

**Purpose:** Retrieve and analyze a JIRA ticket and generate a structured,
traceable test plan.

**Input:** JIRA ticket ID (e.g. `DEMO-001`)

**Output:** `testplan/[ticket-key]-[short-name].md`

**Process:**

1. Retrieve the JIRA ticket.
2. Read the ticket summary, description, acceptance criteria, business rules and comments.
3. Identify functional requirements, negative scenarios, boundary conditions and validation rules.
4. Identify authorization requirements, regression impact and test data requirements.
5. Identify ambiguities.
6. Generate structured test cases mapped to acceptance criteria.
7. Identify automation candidates and assign approved test tags.
8. Generate the test plan.

**Test plan must contain:**

- JIRA ticket and feature summary
- Scope and out of scope
- Assumptions, risks and open questions
- Test scenarios and test cases
- Acceptance criterion traceability
- Test data requirements
- Automation candidates and test tags

**Dependencies:** JIRA Atlassian Rovo MCP Server, test-planning-standards.md

**Restrictions:** Must not modify JIRA, generate Playwright code, execute tests, or invent requirements. Ambiguous requirements must be explicitly identified.

---

### 4.2 test-plan-validator

**Purpose:** Validate the generated test plan against JIRA requirements
and acceptance criteria.

**Input:**

- JIRA ticket ID
- Generated test plan

**Output:** Structured validation result containing validation status, requirement coverage, acceptance criteria coverage, missing scenarios, duplicate scenarios, quality issues and recommendations.

**Validation Areas:**

- Functional, negative, boundary, validation and authorization coverage
- Regression impact
- Test data completeness
- Expected result quality
- Requirement traceability
- Automation suitability

**Dependencies:** JIRA Atlassian Rovo MCP Server, test-planning-standards.md

---

### 4.3 automate-ui

**Purpose:** Generate executable Playwright tests from an approved test plan.

**Input:**

- JIRA ticket ID
- Approved test plan
- Existing automation framework

**Output:** `src/tests/ui/[app-folder]/[feature-name].spec.ts`

**Process:**

1. Inspect existing automation framework, Page Objects, fixtures, utilities and test data.
2. Identify reusable components.
3. Generate automation with approved test tags and requirement traceability.
4. Validate generated code.

**Dependencies:** Repository/File System tools, Playwright MCP Server, playwright standards

**Restrictions:** Reuse existing Page Objects and fixtures. Follow repository conventions. Avoid hard-coded credentials and unnecessary waits. Use meaningful assertions.

---

### 4.4 test-runner

**Purpose:** Execute Playwright tests and produce structured execution results.

**Input:** Playwright test files, test configuration, environment configuration

**Output:** Execution result per test case containing:

- Ticket ID, test case ID, test name
- Status, duration, error
- Screenshot, trace and video references
- Timestamp

**Dependencies:** Playwright, Repository/File System tools

---

### 4.5 failure-analyzer

**Purpose:** Analyze failed automated tests and classify the failure.

**Input:** JIRA ticket ID, test case, test code, execution result, error, screenshot, trace, logs

**Output:** Failure analysis containing failure category, probable root cause, evidence, confidence, recommended action and healing eligibility.

**Failure Categories:**

| Category               | Description |
|------------------------|-------------|
| `TEST_DEFECT`          | Issue in the test implementation |
| `APPLICATION_DEFECT`   | Bug in the application under test |
| `ENVIRONMENT_FAILURE`  | Infrastructure or environment issue |
| `TEST_DATA_FAILURE`    | Missing or invalid test data |
| `CONFIGURATION_FAILURE`| Misconfiguration |
| `UNKNOWN`              | Requires human investigation |

---

### 4.6 heal-test

**Purpose:** Safely repair automation when a failure is determined to be
caused by the test implementation.

**Input:** Failed test, failure analysis, existing test code, relevant Page Object, execution evidence

**Output:** Proposed fix, modified test where permitted, change description, confidence, healing attempt number

**Healing Rules:**

Healing must not:

- Hide application defects.
- Remove meaningful assertions.
- Change expected business behaviour.
- Disable failing tests.
- Reduce test coverage to achieve a pass.

Healing is limited by a configurable maximum retry count. Human intervention
is required when the maximum retry count is reached or confidence is below
the configured threshold.

---

### 4.7 jira-updater

**Purpose:** Update the JIRA ticket with test planning, automation and execution information.

**Input:** JIRA ticket ID, test plan, validation result, automation status, execution results, failure analysis, healing results

**Output:** JIRA update result containing update status, updated fields, added comments, attachments and timestamp.

**Dependencies:** JIRA Atlassian Rovo MCP Server, jira-testing-notes-standards.md

---

## 5. Project Conventions

### 5.1 Test Plans

```text
testplan/[ticket-key]-[short-name].md
```

Example:

```text
testplan/DEMO-001-password-reset.md
```

### 5.2 UI Automation Tests

```text
src/tests/ui/[app-folder]/[feature-name].spec.ts
```

Example:

```text
src/tests/ui/auth/password-reset.spec.ts
```

### 5.3 Page Objects

```text
src/pages/ui/[Feature]Page.ts
```

Examples:

```text
src/pages/ui/LoginPage.ts
src/pages/ui/PasswordResetPage.ts
src/pages/ui/DashboardPage.ts
```

Automation agents must reuse existing Page Objects before creating new ones.

### 5.4 Test Data

```text
src/testdata/[domain]/[feature].data.ts
```

Example:

```text
src/testdata/auth/password-reset.data.ts
```

Credentials, passwords, API keys, tokens and other secrets must never
be stored in source-controlled test data.

---

## 6. Test Tags

The framework supports the following standard tags:

| Tag           | Description |
|---------------|-------------|
| `@smoke`      | Critical business-path tests used for rapid validation |
| `@regression` | Tests required as part of regression testing |
| `@functional` | Standard functional behaviour validation |
| `@negative`   | Invalid input, error handling and failure scenarios |
| `@boundary`   | Boundary and limit conditions |
| `@security`   | Authentication, authorization and security-related scenarios |
| `@critical`   | Business-critical functionality |

Agents must use only approved tags.

The Test Planner determines appropriate tags.

The Automation Agent applies the approved tags.

---

## 7. Requirement Traceability

Every test must be traceable through the following chain:

```text
JIRA Ticket
    ↓
Acceptance Criterion
    ↓
Test Case
    ↓
Automated Test
    ↓
Execution Result
```

Every generated test case must contain:

- JIRA ticket ID
- Test case ID
- Acceptance criterion reference
- Automation status
- Test tags

---

## 8. Naming Conventions

| Artifact       | Convention                        | Example |
|----------------|-----------------------------------|---------|
| Test Plan      | `[ticket-key]-[short-name].md`    | `DEMO-001-password-reset.md` |
| Playwright Test| `[feature-name].spec.ts`          | `password-reset.spec.ts` |
| Page Object    | `[Feature]Page.ts`                | `PasswordResetPage.ts` |
| Test Case ID   | `TC-[number]`                     | `TC-001` |

---

## 9. Playwright Standards

Generated Playwright tests must:

- Use TypeScript and Playwright Test.
- Follow existing repository patterns.
- Reuse Page Objects and fixtures.
- Prefer accessible locators.
- Avoid unnecessary CSS/XPath selectors and hard waits.
- Use explicit assertions and meaningful test names.
- Keep tests independently executable.
- Avoid hard-coded credentials and duplicated setup logic.
- Use approved tags and maintain JIRA/test-case traceability.

---

## 10. Sequential Workflow

The default end-to-end workflow is:

```text
JIRA Ticket ID
    ↓
Planner Agent
    ↓
Test Planner  →  testplan/[ticket-key]-[short-name].md
    ↓
Test Plan Validator
    ↓ FAIL → back to Test Planner
    ↓ PASS
Human Approval
    ↓ APPROVED
JIRA Updater
    ↓
Automate UI  →  src/tests/ui/[...].spec.ts
    ↓
Code Validation
    ↓ FAIL → back to Automate UI
    ↓ PASS
Human Automation Approval
    ↓ APPROVED
Test Runner
    ↓ ALL PASS → JIRA Updater → Done
    ↓ FAILURES
Failure Analyzer
    ↓ TEST_DEFECT → Heal Test → Re-run
    ↓ APPLICATION_DEFECT → Record defect
    ↓ ENVIRONMENT_FAILURE → Record failure
    ↓ UNKNOWN → Human investigation
    ↓
Final JIRA Update
```

---

## 11. Workflow Decision Rules

| # | Condition | Action |
|---|-----------|--------|
| 1 | Invalid JIRA ticket | Stop workflow |
| 2 | JIRA unavailable | Stop — report integration failure |
| 3 | Requirements ambiguous | Request clarification |
| 4 | Test plan validation fails | Return to Test Planner |
| 5 | Test plan rejected | Stop automation |
| 6 | Generated automation fails code validation | Return to Automate UI |
| 7 | Automation rejected | Stop execution |
| 8 | Test execution passes | Proceed to JIRA reporting |
| 9 | Test execution fails | Invoke Failure Analyzer |
| 10 | Application defect | Do not modify automation |
| 11 | Test defect — high healing confidence | Invoke Heal Test |
| 12 | Healing confidence below threshold | Require human review |
| 13 | Maximum healing attempts reached | Require human review |
| 14 | Final result | Must always be recorded in JIRA |

---

## 12. Human-in-the-Loop

Human approval gates are required by default for:

- Test plan approval
- Generated automation approval
- Low-confidence healing
- Application defect confirmation
- Unknown failure classification
- Destructive JIRA operations

Autonomous mode may be enabled through configuration after the framework
has demonstrated sufficient reliability.

---

## 13. Structured State

The workflow must maintain a structured state containing:

- `ticketId`
- `workflowId`
- `currentStage`
- `requirements`
- `acceptanceCriteria`
- `testPlan`
- `validation`
- `automation`
- `execution`
- `failures`
- `healing`
- `jiraUpdates`
- `timestamps`
- `agentActions`

Every state transition must be auditable.

---

## 14. Configuration

The following values must be configurable:

- JIRA URL and project
- JIRA MCP configuration
- Playwright MCP configuration
- LLM provider and model
- Application base URL
- Maximum healing attempts
- Healing confidence threshold
- Human approval requirements
- Execution timeout
- Logging level
- Retry policy

Secrets must be supplied through environment variables or approved
secret-management mechanisms.

---

## 15. Security

The framework must:

- Never expose credentials in prompts.
- Never commit secrets.
- Never store passwords in test data.
- Restrict MCP permissions and file-system access.
- Prevent agents from modifying application source code.
- Require approval for destructive operations.
- Maintain an audit trail.
- Avoid exposing sensitive test data in logs.
- Sanitize external content before including it in prompts where appropriate.

---

## 16. Auditability

Every workflow execution must have a unique workflow ID.

The system should record:

- Workflow start time and ticket ID
- Agent and skill invoked
- Input and output references
- Decision made
- Tool/MCP operation
- Validation and execution results
- Healing attempts
- Final status

This information must be available for troubleshooting and audit.

---

## 17. Usage

Provide a JIRA ticket ID to start the framework.

Example:

```text
DEMO-001
```

The framework executes the full workflow from ticket retrieval through to
final JIRA update as defined in Section 10.

---

## 18. Enterprise Design Principles

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
