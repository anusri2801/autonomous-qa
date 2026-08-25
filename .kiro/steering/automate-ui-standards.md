# Automate UI Standards

## Purpose

Define enterprise standards for converting validated QA test plans into maintainable, reusable and executable Playwright UI automation.

These standards apply to the `automateUi` skill and any downstream UI automation workflow.

---

## 1. Source of Truth

The validated test plan is the source of truth for automation scope.

The Test Plan Validator is the quality gate.

Automation must not start unless:

```text
Validation Status = PASS
```

The automation agent must not modify the approved test plan.

---

## 2. Automation Principle

The primary framework principle is:

```text
REUSE → EXTEND → CREATE
```

Never:

```text
CREATE → discover duplicates later
```

Before creating any automation artifact, inspect the existing framework.

---

## 3. Existing Framework Inspection

The automation agent must inspect existing:

- Page Objects
- Components
- Locators
- Locator constants
- Utilities
- Fixtures
- Authentication helpers
- API helpers
- Test-data files
- Existing specs
- Shared workflows
- Browser/context helpers
- Assertions
- Configuration

Typical project locations:

```text
src/pages/
tests/
src/testdata/
src/utils/
src/fixtures/
```

The actual repository structure takes precedence if it differs.

---

## 4. Reuse Rules

An existing artifact must be reused when it provides the required capability without creating inappropriate coupling.

Examples:

```text
Existing LoginPage.ts
        ↓
Reuse LoginPage.ts
```

Do not create:

```text
CustomerLoginPage.ts
```

simply because the JIRA ticket uses different terminology.

If an existing artifact requires a small, cohesive capability, extend it rather than creating a duplicate.

---

## 5. New Artifact Rule

A new Page Object, component, utility, locator abstraction, fixture, helper or test-data file may be created only when:

1. No suitable existing artifact exists.
2. An existing artifact cannot reasonably be extended.
3. Creating the artifact follows the framework architecture.
4. The new artifact has a clear responsibility.

The reason must be recorded in the automation summary.

---

## 6. Application Inspection

When application access is available, inspect the real application before implementing selectors.

Verify:

- URL
- Page
- Controls
- Labels
- Buttons
- Links
- Messages
- Navigation
- Relevant DOM attributes
- Stable selectors
- Application state

Selectors must not be invented.

If application inspection is unavailable, the agent must clearly report the limitation.

---

## 7. Locator Standards

Preferred locator strategy:

```text
1. getByRole
2. getByLabel
3. getByPlaceholder
4. getByText
5. Stable data-testid/test-id
6. Stable application-specific attribute
7. CSS
8. XPath only when necessary
```

Avoid:

- Dynamic IDs
- Generated CSS classes
- Positional selectors
- Deep DOM selectors
- Fragile XPath
- Styling-dependent selectors

Existing stable locator abstractions must be reused.

---

## 8. Page Object Standards

Page Objects must:

- Represent a meaningful page or component.
- Encapsulate locators.
- Encapsulate reusable UI interactions.
- Avoid unrelated responsibilities.
- Avoid duplicate locators.
- Reuse shared components.
- Provide intention-revealing methods.

Example:

```text
LoginPage
    login()
    getLoginError()
```

rather than exposing every low-level interaction to each test.

---

## 9. Playwright Standards

Generated tests must:

- Use the project's configured Playwright setup.
- Be independent where practical.
- Use deterministic test data.
- Use Playwright auto-waiting.
- Avoid unnecessary sleeps.
- Avoid `waitForTimeout()` unless justified.
- Use meaningful assertions.
- Use reusable fixtures.
- Preserve test-case traceability.

---

## 10. Test Scope

Only test cases where:

```text
Automation Candidate = Yes
```

should be automated by default.

Do not silently automate scenarios marked:

```text
Automation Candidate = No
```

Do not invent additional business scenarios solely for automation coverage.

---

## 11. Traceability

Every automated test must map to:

```text
JIRA Ticket
    ↓
Acceptance Criterion
    ↓
Test Case ID
    ↓
Playwright Test
```

Recommended source metadata:

```typescript
// JIRA: SCRUM-2
// AC: AC-01
// Test Case: TC-001
```

The exact metadata style may follow the existing repository convention.

---

## 12. Test Data

Test data must be:

- Reusable
- Environment-safe
- Traceable to the test plan
- Free of secrets

Default location:

```text
src/testdata/
```

Existing test-data structures must be reused.

Never commit passwords, API keys, tokens or other secrets.

---

## 13. Tags

Only approved project tags may be used.

The tag list is governed by:

```text
steering/test-planning-standards.md
```

Examples may include:

```text
@smoke
@regression
@functional
@negative
@boundary
@security
@critical
@sanity
```

Do not introduce a new tag from the automation agent.

---

## 14. File Structure

Project conventions (governed by `testDir` in `playwright.config.ts`):

```text
tests/
└── [Feature]/
    └── [feature-name].spec.ts

src/
├── pages/
│   └── [Feature]Page.ts
├── testdata/
│   └── [feature]data.ts
├── utils/
└── fixtures/
```

- Specs live under `tests/` — matches `testDir: './tests'` in `playwright.config.ts`.
- Page Objects, test data, utilities and fixtures live under `src/`.
- If `testDir` is changed in `playwright.config.ts`, specs must be placed in the updated location.

Examples:

```
tests/Login/login.spec.ts
src/pages/LoginPage.ts
src/testdata/logindata.ts
```

Do not create alternate framework locations without justification.

---

## 15. Naming Standards

Page Objects:

```text
PascalCase + Page

LoginPage.ts
AccountsOverviewPage.ts
```

Specs:

```text
[feature-name].spec.ts
```

Test names must describe business behaviour.

Preferred:

```text
Successful login with valid credentials
```

Avoid:

```text
test1
loginTest2
clickLoginButton
```

---

## 16. Assertion Standards

Assertions must verify observable expected behaviour.

Assertions must be:

- Specific
- Deterministic
- Relevant
- Traceable to the test plan

Do not use meaningless assertions.

Avoid:

```typescript
expect(true).toBeTruthy();
```

---

## 17. Synchronization Standards

Prefer Playwright's built-in synchronization.

Avoid:

```typescript
await page.waitForTimeout(3000);
```

Use appropriate Playwright assertions, locator actions and wait mechanisms.

---

## 18. Maintainability Standards

Generated automation must:

- Avoid duplication.
- Avoid hard-coded environment-specific values.
- Avoid unnecessary abstraction.
- Reuse shared framework functionality.
- Keep Page Objects focused.
- Keep tests readable.
- Keep test data separate from test logic.
- Preserve existing framework conventions.

---

## 19. Reuse Audit

Every automation generation run must record reuse decisions.

Required information:

```markdown
## Reuse Analysis

| Artifact | Action | Reason |
|---|---|---|
| LoginPage.ts | Reused | Existing login functionality |
| auth.ts | Reused | Existing authentication helper |
| NewComponent.ts | Created | No suitable existing component |
```

This is required for framework auditability.

---

## 20. Automation Quality Gate

Automation output is considered complete only when:

- Validation status is PASS.
- Automation candidates are correctly selected.
- Existing artifacts have been inspected.
- Reuse has been evaluated.
- Duplicate artifacts have not been unnecessarily created.
- New artifacts are justified.
- Selectors are stable.
- Page Objects follow standards.
- Specs follow standards.
- Test data follows standards.
- Traceability is preserved.
- Tags are approved.
- No secrets are present.
- Generated code is maintainable.

---

## 21. Failure Handling

If automation cannot safely be generated:

- Stop the affected test case.
- Do not invent selectors or requirements.
- Record the blocker.
- Identify the affected Test Case ID.
- Continue with independent scenarios where safe.

The agent must report unresolved blockers explicitly.

---

## 22. Enterprise Design Principle

The automation framework must become stronger as more tickets are automated.

Therefore:

```text
Every new automation task should first look for opportunities
to reuse or improve the existing framework.
```

The agent must avoid creating ticket-specific implementations when a reusable framework capability is appropriate.

The desired evolution is:

```text
Ticket 1
   ↓
Reusable LoginPage

Ticket 2
   ↓
Reuse LoginPage

Ticket 3
   ↓
Extend LoginPage if required

Ticket N
   ↓
Mature reusable automation framework
```