# Autonomous QA Framework

Enterprise-grade autonomous QA automation for Playwright UI tests with end-to-end orchestration, test planning, validation, automation, execution, healing and defect management.

## Overview

`power.md` is the entry point — an onboarding manual that defines the overall framework and high-level architecture, including available agents, their capabilities (skills), steering files, MCP servers and project conventions.

### Core Concepts

- The **skill** defines what a capability does (purpose, input, output, workflow).
- The **steering** defines how that capability must behave (rules, standards, constraints).
- The **orchestrator** coordinates specialist skills to execute complete QA workflows for JIRA tickets.

### Framework Architecture

```
Test Planner
    ↓
Test Plan
    ↓
Test Plan Validator
    ↓ (PASS required)
JIRA Updater → JIRA Testing Notes
    ↓
Automate UI
    ↓
Test Runner
    ↓
   PASS ───────────────→ COMPLETED
    ↓ FAIL
Heal Test
    ↓
  HEALED ──────────────→ Test Runner
    ↓ NOT_HEALED
Defect Manager
    ↓
COMPLETED_WITH_DEFECT
```

### Separation of Concerns

**Layer	** | **File** | **Purpose**
---|---|---
Skill | `SKILL.md` | What the agent does — role, inputs, outputs, workflow steps, completion criteria
Steering | `*-standards.md` | How it must behave — rules, constraints, quality standards, enforcement policies
Orchestration | `orchestration-standards.md` | How specialists coordinate on a single JIRA ticket

The skill is the agent's job description. The steering is the compliance rulebook. The orchestrator is the workflow coordinator.

---

## Available Agents & Skills

| Agent | Skill | Purpose |
|-------|-------|---------|
| test-planner | Generate structured, traceable test plans from JIRA tickets |
| test-plan-validator | Validate test plans against 20+ quality gates |
| jira-updater | Publish validated test-plan summaries to JIRA testing notes |
| automate-ui | Convert validated test plans into executable Playwright automation |
| test-runner | Execute approved tests and collect execution evidence |
| heal-test | Repair failing tests when classified as test defects |
| defect-manager | Create/link JIRA defects for genuine application failures |
| orchestrator | Coordinate all agents through complete QA workflow for one ticket |

---

## Setup

### 1. Install Dependencies

```bash
npm install
npx playwright install
```

### 2. Environment Configuration

Copy and customize environment files:

```bash
# SIT Environment (default)
cp .env.SIT .env.SIT

# Update with your test credentials
TEST_USERNAME=your_registered_user
TEST_PASSWORD=your_password
BASE_URL=https://your-app-url
```

### 3. Verify Project Structure

The framework uses structured directories for artifacts:

```text
.kiro/
  steering/                          # Behavioral standards
    global-standards.md
    test-planning-standards.md
    test-runner-standards.md
    heal-test-standards.md
    defect-management-standards.md
    orchestration-standards.md
    jira-testing-notes-standards.md
  settings/
    mcp.json                         # Atlassian MCP configuration
    
testplan/                            # Approved test plans
  SCRUM-2-login.md
  
validation/                          # Validation reports (quality gates)
  SCRUM-2-login-validation.md
  
execution/                           # Execution results & healing reports
  SCRUM-2-login/
    execution-report.md
    execution-results.json
    healing-report.md
    
defects/                             # Defect management reports
  SCRUM-2-login/
    defect-report.md
    defect-results.json
    
orchestration/                       # Orchestration state & logs
  SCRUM-2-login/
    orchestration-report.md
    execution-state.json

src/
  tests/
    [Feature]/[feature-name].spec.ts  # Playwright test specifications
  pages/                              # Page Objects
    [Feature]Page.ts
  testdata/                           # Test data definitions
    [feature]data.ts
  utils/                              # Shared utilities
  fixtures/                           # Test fixtures
```

### 4. Configure Atlassian MCP

Required for JIRA integration (see JIRA Configuration section below)

---

## Repository Structure

### Test Artifacts

| Artifact | Location | Purpose |
|----------|----------|---------|
| Test plans | `testplan/[ticket-key]-[short-name].md` | Approved test scenarios with full traceability |
| Validation reports | `validation/[ticket-key]-[short-name]-validation.md` | Quality gate enforcement (PASS/FAIL) |
| Playwright specs | `src/tests/[Feature]/[feature-name].spec.ts` | Executable UI test automation |
| Page Objects | `src/pages/[Feature]Page.ts` | Reusable locator abstractions & UI interactions |
| Test data | `src/testdata/[feature]data.ts` | Environment-safe test data references |
| Execution reports | `execution/[ticket-key]-[short-name]/` | Test run results, failure evidence, healing attempts |
| Defect reports | `defects/[ticket-key]-[short-name]/` | Application defect analysis & JIRA linking |
| Orchestration logs | `orchestration/[ticket-key]-[short-name]/` | End-to-end workflow state & stage gates |

### Example: SCRUM-2 Login Feature

```
testplan/
  SCRUM-2-login.md                        # 11 test cases, 5 ACs, full coverage

validation/
  SCRUM-2-login-validation.md             # Quality gate validation (PASS)

execution/SCRUM-2-login/
  execution-report.md                     # Human-readable results
  execution-results.json                  # Machine-readable results
  healing-report.md                       # Test defect repairs
  
defects/SCRUM-2-login/
  defect-report.md                        # Application defect analysis
  defect-results.json                     # Defect creation & linking

src/tests/Login/
  login.spec.ts                           # 11 Playwright tests, 3 browsers = 33 instances

src/pages/
  LoginPage.ts                            # Page Object with stable locators

src/testdata/
  logindata.ts                            # Registered user, invalid credentials, etc.
```

**Created so far:**

- ✓ `testplan/SCRUM-2-login.md` (11 test cases)
- ✓ `validation/SCRUM-2-login-validation.md` (PASS)
- ✓ `src/tests/Login/login.spec.ts` (automated)
- ✓ `src/pages/LoginPage.ts` (Page Object)
- ✓ `src/testdata/logindata.ts` (test data)
- ✓ Full steering files (7 standards documents)

---

## JIRA Configuration

**JIRA Instance:** [SCRUM board](https://testjiraanu.atlassian.net/jira/software/projects/SCRUM/boards/1)

**JIRA Site:** `testjiraanu.atlassian.net`

**Project:** `SCRUM`

**Test Ticket Examples:**
- `SCRUM-2` — Customer login feature (11 test cases, 33 execution instances)

### Atlassian MCP Setup

The framework integrates with JIRA via Atlassian's Model Context Protocol (MCP) for:
- Retrieving ticket requirements & acceptance criteria
- Publishing test-plan summaries to testing notes
- Creating defects for application failures
- Linking defects to originating stories

**MCP Endpoint:** `https://mcp.atlassian.com/v1/mcp/authv2`

### Configure MCP in Kiro

1. **Open workspace MCP config:**
   ```
   Cmd + Shift + P → Kiro: Open workspace MCP config (JSON)
   ```

2. **Add Atlassian MCP endpoint:**
   ```json
   {
     "mcpServers": {
       "atlassian": {
         "url": "https://mcp.atlassian.com/v1/mcp/authv2"
       }
     }
   }
   ```

3. **Save** — Kiro reconnects automatically

---

## Running Automation

### Run Full E2E Workflow for a JIRA Ticket

```bash
# Orchestrate complete workflow (plan → validate → automate → execute → heal → defect)
npx tsx src/orchestration/orchestrator.ts SCRUM-2
```

### Run Tests Only

```bash
# Run all tests (chromium, firefox, webkit)
TEST_ENV=SIT npx playwright test

# Run specific feature
TEST_ENV=SIT npx playwright test src/tests/Login/login.spec.ts

# Run with specific tag
TEST_ENV=SIT npx playwright test --grep @smoke

# Run with tracing & video
TEST_ENV=SIT npx playwright test --trace on --video on
```

### View Execution Results

```bash
# Open Playwright HTML report
npx playwright show-report

# Or manually: open playwright-report/index.html
```

---

## Steering Files & Standards

Behavioral rules are enforced via steering files stored in `.kiro/steering/`:

| Standard | Enforces |
|----------|----------|
| `global-standards.md` | JIRA requirement integrity, security, error handling, change safety |
| `test-planning-standards.md` | Test plan structure, AC coverage, scenario generation, traceability |
| `test-runner-standards.md` | Test execution scope, result classification, evidence collection, reporting |
| `heal-test-standards.md` | Root cause classification, healing constraints, safety guardrails |
| `defect-management-standards.md` | Defect creation gates, duplicate detection, JIRA linking, traceability |
| `jira-testing-notes-standards.md` | JIRA update scope, formatting, duplicate prevention |
| `orchestration-standards.md` | Workflow stages, gates, routing, idempotency, context isolation |

Each steering file is a quality gate. Violations are reported and must be resolved before downstream processing.

---

## Execution Workflow

### Stage 1: Test Planning
**Agent:** `test-planner`  
**Input:** JIRA ticket (SCRUM-2)  
**Output:** `testplan/SCRUM-2-login.md` (11 test cases, full AC coverage)  
**Gate:** Test plan generated and contains all required sections

### Stage 2: Validation
**Agent:** `test-plan-validator`  
**Input:** `testplan/SCRUM-2-login.md`  
**Output:** `validation/SCRUM-2-login-validation.md` (PASS/FAIL)  
**Gate:** Validation must be PASS (20 quality gates enforced)

### Stage 3: JIRA Update
**Agent:** `jira-updater`  
**Input:** Validated test plan  
**Output:** JIRA testing notes published  
**Gate:** Testing notes successfully created on JIRA ticket

### Stage 4: Automation
**Agent:** `automate-ui`  
**Input:** Validated test plan  
**Output:** Playwright specs + Page Objects  
**Gate:** TypeScript compiles, all test specs executable

### Stage 5: Execution
**Agent:** `test-runner`  
**Input:** Playwright test specs (11 tests × 3 browsers = 33 instances)  
**Output:** `execution/SCRUM-2-login/execution-results.json`  
**Gate:** All selected tests have final status (PASSED/FAILED/BLOCKED/SKIPPED)

### Stage 6: Healing (if failures detected)
**Agent:** `heal-test`  
**Input:** Failed tests classified as TEST_DEFECT  
**Output:** Repaired test specs + `healing/SCRUM-2-login/healing-report.md`  
**Gate:** Healed tests re-executed to verify fix

### Stage 7: Defect Management (if application bugs detected)
**Agent:** `defect-manager`  
**Input:** Failed tests classified as APPLICATION_DEFECT  
**Output:** JIRA defects created & linked to story  
**Gate:** Defect key captured, link verified

### Final Status
- `COMPLETED_PASS` — All tests passed
- `COMPLETED_HEALED` — Tests failed, healing successful, re-run passed
- `COMPLETED_WITH_DEFECT` — Application defect identified and reported
- `STOPPED_*` — Mandatory stage failed (test plan, validation, JIRA, automation)
- `REQUIRES_HUMAN_REVIEW` — Ambiguous result or MCP failure

---

## Example: SCRUM-2 Recent Execution

**Ticket:** SCRUM-2 — Customer Login  
**Date:** 2026-09-08  
**Results:** 24/33 PASSED (72.7%)

```
TC-001 ❌ FAILED  → TEST_DATA_FAILURE (invalid credentials in SIT)
TC-002 ✓ PASSED  → Login rejects invalid credentials
TC-003 ✓ PASSED  → Login rejects wrong password
TC-004 ✓ PASSED  → Login validates empty username
TC-005 ✓ PASSED  → Login validates empty password
TC-006 ✓ PASSED  → Login validates empty fields
TC-007 ❌ FAILED  → TEST_DATA_FAILURE (depends on TC-001)
TC-008 ❌ FAILED  → APPLICATION_DEFECT (security: unauth access allowed)
TC-009 ✓ PASSED  → Login page renders correctly
TC-010 ✓ PASSED  → Unregistered user rejected
TC-011 ✓ PASSED  → Password field masked

Acceptance Criteria Coverage:
AC-01: 2/3 passing (TC-001 failed due to credentials)
AC-02: 3/3 passing ✓
AC-03: 3/3 passing ✓
AC-04: 3/3 passing ✓
AC-05: 0/2 passing (TC-008 security defect)

Next Actions:
1. Verify test credentials in .env.SIT
2. Create defect for TC-008 (authorization bypass)
3. Re-run after fixes
```

**Reports Generated:**
- `execution/SCRUM-2-login/execution-report-2026-09-08.md` (human-readable)
- `execution/SCRUM-2-login/execution-results-2026-09-08.json` (machine-readable)

---

## Playwright Configuration

**Config File:** `playwright.config.ts`

Key settings:
- **Test Directory:** `./src/tests`
- **Base URL:** From `.env.SIT` (or `.env.local`)
- **Browsers:** Chromium, Firefox, WebKit
- **Retries:** 0 (local), 2 (CI)
- **Timeout:** 30s per test
- **Reporter:** HTML (default), JSON (structured output)
- **Trace:** On first retry
- **Workers:** 4 (local), 1 (CI)

---

## Project Conventions

### Test File Naming
```
src/tests/[Feature]/[feature-name].spec.ts

Example: src/tests/Login/login.spec.ts
```

### Page Object Naming
```
src/pages/[Feature]Page.ts

Example: src/pages/LoginPage.ts
```

### Test Case IDs
```
TC-001, TC-002, ... TC-NNN (sequential)

Each test case has:
- Unique ID
- Title describing business behavior
- @tags for filtering (@smoke, @regression, @sanity)
- AC reference (AC-01, etc.)
- JIRA metadata in comments
```

### Locator Strategy (Priority Order)
1. `getByRole()` — semantic, accessible-first
2. `getByLabel()` — form labels
3. `getByPlaceholder()` — input placeholders
4. `getByText()` — visible text
5. Stable `data-testid`
6. Stable CSS selectors
7. XPath (last resort)

### Tags (Approved)
- `@smoke` — core business paths
- `@regression` — existing functionality coverage
- `@sanity` — basic functionality checks

### Test Data Structure
```typescript
export const loginData = {
  registeredUser: {
    username: process.env.TEST_USERNAME ?? '',
    password: process.env.TEST_PASSWORD ?? '',
  },
  invalidCredentials: { ... },
  unregisteredUser: { ... },
};
```

---

## Quality Gates

The framework enforces strict quality gates at each stage:

### Test Planning Gate
- All ACs identified and covered
- Positive, negative, boundary scenarios
- Test cases have clear expected results
- Automation candidates identified
- No unsupported requirements invented

### Validation Gate
- Test plan file exists
- Requirements analyzed from JIRA
- All ACs mapped to test cases
- Test case structure complete
- No duplicate or orphan cases
- Project conventions followed

### Automation Gate
- Page Objects implemented
- Locators stable (verified on live app)
- Specs compile (TypeScript)
- No secrets in code
- Traceability preserved

### Execution Gate
- All selected tests executed
- Results classified (PASSED/FAILED/SKIPPED/BLOCKED)
- Failure evidence collected
- Root causes identified
- Traceability maintained

### Defect Gate
- Root cause: APPLICATION_DEFECT (not TEST_DEFECT)
- Evidence sufficient for creation
- Duplicates checked
- JIRA fields populated
- Link to originating story verified

---

## Troubleshooting

### Tests Fail with "Locator Not Found"

1. **Application structure changed:**
   - Inspect live app with Playwright Inspector
   - Update locator in Page Object
   - Re-run test

2. **Selector is stale:**
   - Check if DOM element exists
   - Update selector using preferred strategy (see Locator Strategy)
   - May be eligible for healing

### Test Data Issues

1. **Credentials not working:**
   - Verify user exists in test environment
   - Check `.env.SIT` values
   - Confirm password hasn't expired

2. **Data inconsistent across browsers:**
   - Check for timing issues (add waits)
   - Verify test data setup is isolated per test

### JIRA Integration Issues

1. **MCP connection failed:**
   - Verify `.kiro/settings/mcp.json` contains Atlassian endpoint
   - Check JIRA site URL is correct
   - Confirm OAuth token is valid

2. **Defect creation failed:**
   - Verify JIRA issue type exists (Bug)
   - Check permissions on JIRA project
   - Confirm custom fields are populated

---

## Contributing

When adding new tests:

1. **Create test plan** (`testplan/[TICKET]-[name].md`)
   - Analyze JIRA ticket and ACs
   - Design test scenarios
   - Identify test data
   - Mark automation candidates

2. **Validate plan** against 20+ quality gates
   - Must achieve `PASS` status before automation

3. **Implement Page Object** (`src/pages/[Feature]Page.ts`)
   - Inspect live application
   - Use preferred locator strategy
   - Encapsulate UI interactions
   - Provide assertion helpers

4. **Implement specs** (`src/tests/[Feature]/[feature-name].spec.ts`)
   - One test = one scenario
   - Include JIRA metadata in comments
   - Use appropriate tags
   - Assert business behavior, not implementation

5. **Create test data** (`src/testdata/[feature]data.ts`)
   - Reference environment variables for secrets
   - Provide meaningful data for both positive & negative cases
   - Document data structure

6. **Test locally**
   ```bash
   npx playwright test src/tests/[Feature]/[feature-name].spec.ts --headed
   ```

7. **Commit with message referencing ticket**
   ```
   Add login automation (SCRUM-2)

   - Implement LoginPage Page Object
   - Add 11 test cases (TC-001 to TC-011)
   - 5 ACs fully covered
   - All tests pass across 3 browsers
   ```

---

## License & Attribution

Built on Playwright testing framework and Atlassian integration tools.

For questions or issues, refer to:
- **Playwright Docs:** https://playwright.dev
- **Test Plan:** `testplan/`
- **JIRA:** [SCRUM board](https://testjiraanu.atlassian.net)
