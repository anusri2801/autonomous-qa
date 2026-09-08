---
inclusion: always
---

# Heal Test Standards

## Purpose

Define enterprise standards for safely repairing failing Playwright UI tests when the root cause has been classified as a test defect (not an application defect, environment issue, or test data problem).

These standards ensure healing fixes actual test implementation issues without hiding application bugs, reducing coverage, or changing expected behaviour.

Authoritative source for the `heal-test` skill.

---

## 1. Healing Eligibility

Only heal when **ALL** of the following are true:

```
1. Failure classification = TEST_DEFECT (from failure-analyzer)
2. Root cause clearly identified with evidence
3. Repair is minimal and focused on root cause
4. Repair does not weaken assertions
5. Repair does not hide application defects
6. Repair does not change expected business behaviour
7. Repair maintains full test coverage
8. Healing attempt count < configured retry limit
9. Confidence >= configured threshold
```

If any condition is false, **do not heal**. Stop and report the blocker.

---

## 2. Root Cause Categories

### Stale Selectors

**Problem:** Selector no longer matches the DOM.

**Evidence:** `NoSuchElementException`, `TimeoutError` on element not found.

**Valid repair:** Update selector to match current DOM structure.

```typescript
// Before
page.locator('button.login-btn')

// After (class changed)
page.locator('button.submit-auth')
```

### Race Conditions in Locators

**Problem:** Locator query executed before element appeared.

**Evidence:** Intermittent failures, sometimes passes, sometimes `TimeoutError`.

**Valid repair:** Add explicit wait or improve auto-wait target.

```typescript
// Before
await page.locator('modal').click()

// After
await expect(page.locator('modal')).toBeVisible()
await page.locator('modal').click()
```

### Flaky Assertions

**Problem:** Assertion checked before state stabilized.

**Evidence:** Assertion fails occasionally but not consistently.

**Valid repair:** Add wait before assertion or improve assertion specificity.

```typescript
// Before
expect(page.locator('.message')).toContainText('Success')

// After
await expect(page.locator('.message')).toContainText('Success', { timeout: 5000 })
```

### Changed Application Structure

**Problem:** Test assumes old DOM or field names.

**Evidence:** Error shows expected structure doesn't exist, but new structure visible in screenshot.

**Valid repair:** Update test to match new structure (if change confirmed intentional).

```typescript
// Before (old form structure)
await page.fill('input[name="username"]', user)

// After (new form structure)
await page.locator('input#userId').fill(user)
```

### Test Data Mismatch

**Problem:** Test data reference broken or mismatched.

**Evidence:** Assertion fails expecting certain data, but data key wrong or missing.

**Valid repair:** Fix test data reference or add missing data.

```typescript
// Before
const user = testData.registeredUser
await login(user.email, user.pass)  // 'pass' doesn't exist

// After
const user = testData.registeredUser
await login(user.email, user.password)  // correct key
```

### Assertion Uses Outdated State

**Problem:** Assertion checks for page element or state that no longer exists.

**Evidence:** Screenshot shows page is correct, but assertion fails.

**Valid repair:** Update assertion to match current page structure (confirm change is intentional in JIRA).

```typescript
// Before (checking for deprecated error field)
expect(page.locator('.error-banner')).toBeVisible()

// After (updated to new error UI)
expect(page.locator('[role="alert"]')).toContainText('Error')
```

---

## 3. Healing Constraints

### Must NOT Heal

❌ **Remove meaningful assertions** — Never delete or weaken an assertion to make a test pass.

```typescript
// DO NOT DO THIS
// Before: expect(page.locator('.result')).toContainText('Success')
// After: expect(page.locator('.result')).toBeVisible() // weakened
```

❌ **Ignore application defects** — If app behaviour changed unintentionally, test should fail until app is fixed.

```typescript
// Application bug: validation field removed
// DO NOT delete the test
// INSTEAD: Report as application defect
```

❌ **Change expected business behaviour** — Never modify test to validate different behaviour than specified.

```typescript
// DO NOT change expectations
// If login should require 2FA and now doesn't, that's an app change
// Test should fail until intent is clarified
```

❌ **Reduce coverage** — Never remove test cases or scenarios to achieve pass.

```typescript
// DO NOT skip test cases
// If test failing because of coverage, coverage is correct
```

❌ **Disable or skip tests** — Never use `.skip()` or conditional execution to hide failures.

```typescript
// DO NOT DO THIS
test.skip('Flaky test', async () => { ... })
```

---

## 4. Healing Decision Rules

### Heal if:

✅ Test code itself has a bug (wrong locator, bad assertion logic, race condition)  
✅ Selector is stale but element still exists with different selector  
✅ Test has race condition or timing issue  
✅ Test data reference is broken or misnamed  
✅ Application structure changed and change confirmed as intentional  
✅ Assertion is checking for obsolete page state (and change is intentional)  

### Do NOT heal if:

❌ Application has a bug (report as application defect)  
❌ Test data doesn't exist in environment (report as test data issue)  
❌ Application URL unreachable (report as environment issue)  
❌ Assertion failure indicates app behaves differently than expected (report as requirement clarification)  
❌ Healing would require changing what test validates  

---

## 5. Healing Process

### Step 1 — Analyse Failure Evidence

Read the failure output:

- Error message
- Stack trace
- Screenshot
- Video / trace (if available)
- Test code
- Page Object

Identify the exact point of failure.

### Step 2 — Classify Root Cause

Is the failure:

- A stale selector?
- A race condition?
- A flaky assertion?
- Changed application structure?
- Test data mismatch?
- Something else?

Document classification with evidence from §2.

### Step 3 — Propose Minimal Repair

The repair must be:

- **Minimal** — Only change necessary to fix root cause
- **Focused** — Do not refactor surrounding code
- **Observable** — Change must be clear and reviewable
- **Safe** — Validate against constraints §3

```typescript
// Root cause: Button locator stale (class changed)
// Minimal repair: Update selector only

- await page.locator('button.login-btn').click()
+ await page.locator('button.submit-auth').click()
```

**NOT:** Refactor at same time

```typescript
// DO NOT do this
- await page.locator('button.login-btn').click()
+ const submitBtn = page.getByRole('button', { name: 'Submit' })
+ await submitBtn.click()
+ await expect(page).toHaveURL('/dashboard')  // unrelated
```

### Step 4 — Validate Against Constraints

Before healing, answer:

1. Does repair fix the actual root cause?
2. Does it preserve all meaningful assertions?
3. Does it preserve full test coverage?
4. Would it hide application defect if applied?
5. Does it change expected business behaviour?
6. Is repair justified by failure evidence?

If **any** answer is "no" or "unclear", **do NOT heal**. Report and stop.

### Step 5 — Implement Repair

Apply minimal change to:

- `src/tests/[Feature]/[feature-name].spec.ts`, or
- `src/pages/[Feature]Page.ts`

Test locally or request re-execution.

### Step 6 — Report Outcome

```markdown
HEALING_APPLIED

JIRA: [TICKET]
Test Case: [TC-ID]
Root Cause: [category from §2]
Repair: [one-line summary]
Files Changed: [paths]
Confidence: [HIGH / MEDIUM / LOW]
Healing Attempt: [N of MAX]
Next Status: [PASS / still FAILED]
```

---

## 6. Retry Limits

Configure per execution:

```
Max Healing Attempts: [default 2]
Confidence Threshold: [default 70%]
```

Healing must stop when:

- `attempts >= max_healing_attempts`, or
- `confidence < confidence_threshold`

When limit reached, report:

```
HEALING_BLOCKED_MAX_RETRIES

JIRA: [TICKET]
Test Case: [TC-ID]
Attempts: [N]
Last Attempt: [summary]
Recommendation: Manual investigation required
```

---

## 7. Confidence Scoring

Score healing confidence on 0–100:

| Factor | Confidence Impact |
|---|---|
| Clear root cause with strong evidence | +40 |
| Minimal, focused repair | +25 |
| Repair aligns with category best practice | +20 |
| Repair passes all safety constraints | +15 |
| **Deductions:** | |
| Uncertain root cause | -15 |
| Repair affects multiple areas | -20 |
| Assertion weakening required | -30 |
| Application bug suspected | -50 |

**Example:**
```
Stale selector, clear evidence (+40)
Single locator update (+25)
Matches locator best practices (+20)
Safety constraints pass (+15)
Confidence: 100% → SAFE, proceed
```

---

## 8. Safety Checklist

Before every healing, verify:

- [ ] Failure classification is `TEST_DEFECT`
- [ ] Root cause identified with evidence
- [ ] Repair is minimal and focused
- [ ] No meaningful assertions weakened
- [ ] No coverage reduced
- [ ] No application defects hidden
- [ ] No business behaviour changed
- [ ] Retry limit not exceeded
- [ ] Confidence >= threshold
- [ ] Test files modified only (no infrastructure)

**If any checkbox unchecked: DO NOT HEAL.**

---

## 9. Healing Report Format

After healing, persist:

```markdown
# Healing Report

## Test Case
- JIRA: [TICKET]
- Test Case: [TC-ID]
- Failure Class: TEST_DEFECT
- Root Cause: [category from §2]

## Evidence
- Error: [message]
- Screenshot: [path if available]
- Trace: [path if available]

## Repair
- Files Modified: [list]
- Changes: [summary]
- Confidence: [%]

## Validation
- Assertions preserved: Yes
- Coverage maintained: Yes
- Safety constraints met: Yes

## Outcome
- Status: HEALING_APPLIED / HEALING_REJECTED
- Next test run: [status]
- Attempt: [N of MAX]
```

---

## 10. When NOT to Heal

Stop and escalate if:

- Failure classification is not `TEST_DEFECT`
- Root cause cannot be determined from evidence
- Repair would weaken assertions
- Repair would hide application defects
- Repair would change business behaviour
- Retry limit reached
- Confidence below threshold
- Multiple unrelated issues in same test

Report blocker and recommend:

- Application bug investigation
- Test data review
- Environment validation
- Manual QA review
- Requirement clarification

---

## 11. Healing Audit Trail

Every healing must be traceable:

```
Test: TC-001
Failure Count: 2
Healing Attempt 1: [date] — [outcome]
Healing Attempt 2: [date] — [outcome]
Final Status: [PASS / BLOCKED]
```

Maintain history per test per ticket for analysis and pattern detection.

---

## 12. Escalation Criteria

Escalate (stop healing) if:

- Same test fails 3+ times after healing
- Different tests fail in same area (suggests systematic issue)
- Root cause changes between attempts
- Confidence cannot be established
- Multiple independent root causes in single test
- Application defect suspected but unconfirmed

**Escalation path:** Report to Test Runner → Failure Analyzer → Manual QA Review.


---

## 13. Artifact Location

Healing artifacts must be stored under:

```text
execution/[ticket-key]-[short-name]/
```

Example:

```text
execution/SCRUM-2-login/
```

Required:

```text
healing-report.md
healing-results.json
```

```
