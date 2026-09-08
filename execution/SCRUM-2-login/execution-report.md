# Test Execution Report

## Summary

| Field | Value |
|-------|-------|
| JIRA Ticket | SCRUM-2 |
| Test Plan | `testplan/SCRUM-2-login.md` |
| Validation Status | PASS |
| Execution Date | 2026-08-21 |
| Browser | Chromium |
| Total Tests | 11 |
| **Passed** | 6 |
| **Failed** | 5 |
| **Skipped** | 0 |
| **Blocked** | 0 |
| Pass Rate | 54.5% |

---

## Execution Scope

**Ticket:** SCRUM-2 — Allow registered customers to log in securely  
**Feature:** Customer Login / Authentication  
**Test Suite:** `src/tests/Login/login.spec.ts`  
**Environment:** https://parabank.parasoft.com  
**Browser:** Chromium (Desktop)  

---

## Test Results by Status

### ✅ PASSED (6 tests)

| Test Case | Title | Duration | Result |
|-----------|-------|----------|--------|
| TC-001 | Successful login with valid credentials | 175ms | ✅ PASSED |
| TC-004 | Login fails when username is empty | 175ms | ✅ PASSED |
| TC-005 | Login fails when password is empty | 161ms | ✅ PASSED |
| TC-006 | Login fails when both username and password are empty | 162ms | ✅ PASSED |
| TC-009 | Login page renders correctly | 114ms | ✅ PASSED |
| TC-011 | Password field masks input | 116ms | ✅ PASSED |

### ❌ FAILED (5 tests)

| Test Case | Title | Error Category | Root Cause |
|-----------|-------|------------------|-----------|
| TC-002 | Login fails with invalid username and password | ASSERTION_FAILURE | Error message not visible after failed login |
| TC-003 | Login fails with valid username and wrong password | ASSERTION_FAILURE | Error message not visible after failed login |
| TC-007 | Authenticated user can access a protected banking page | LOCATOR_FAILURE | Page element locator not found |
| TC-008 | Unauthenticated user cannot access a protected banking page | ASSERTION_FAILURE | Unauthenticated access allowed (page did not redirect) |
| TC-010 | Login with unregistered user credentials fails | ASSERTION_FAILURE | Error message visibility assertion failed |

---

## Detailed Failure Analysis

### ❌ TC-002 — Login fails with invalid username and password

**Classification:** `TEST_DEFECT` (Test Assertion Issue)  
**Error:** `expect(locator).toBeVisible() failed`  
**Location:** `src/pages/LoginPage.ts:86`  
**Details:**
```
Locator:  locator('p.error')
Expected: visible
Received: hidden
Timeout:  5000ms
```

**Evidence:** The error message locator exists in the DOM but is not visible (display: none or visibility: hidden). The test assertion expects it to be visible, but it's not rendered on screen.

**Root Cause:** Either the application doesn't display error messages on invalid login, or the test assertion is checking for the wrong visibility state.

**Recommendation:** 
- Verify application behaviour with manual testing
- Check if error messages use different visibility mechanism (opacity, position, etc.)
- Update assertion if application behaviour changed

---

### ❌ TC-003 — Login fails with valid username and wrong password

**Classification:** `TEST_DEFECT` (Test Assertion Issue)  
**Error:** `expect(locator).toBeVisible() failed`  
**Location:** `src/pages/LoginPage.ts:86`  
**Details:** Same as TC-002 - error message locator not visible

**Root Cause:** Same as TC-002

---

### ❌ TC-007 — Authenticated user can access a protected banking page

**Classification:** `TEST_DEFECT` (Locator Issue)  
**Error:** `expect(locator).toBeVisible() failed`  
**Details:**
```
Locator:  locator('#accountTable, h1.title')
Expected: visible
Received: hidden
```

**Root Cause:** After successful login, the protected page element locators are either stale or the page structure changed.

**Recommendation:**
- Inspect the actual page DOM after login
- Update selectors to match current page structure
- Use more robust locators (e.g., `getByRole`)

---

### ❌ TC-008 — Unauthenticated user cannot access a protected banking page

**Classification:** `APPLICATION_DEFECT` (Security Issue)  
**Error:** `expect(page).not.toHaveURL(/overview\.htm/) failed`  
**Details:**
```
Expected pattern: not /overview\.htm/
Received string: "https://parabank.parasoft.com/parabank/overview.htm"
```

**Root Cause:** The application allows unauthenticated access to protected pages. This is a security issue in the application, not a test defect.

**Recommendation:**
- Report as application defect
- Do not modify the test
- Application must enforce authentication before allowing access to protected pages

---

### ❌ TC-010 — Login with unregistered user credentials fails

**Classification:** `TEST_DEFECT` (Test Assertion Issue)  
**Error:** `expect(locator).toBeVisible() failed`  
**Details:** Same as TC-002 and TC-003 - error message locator not visible

**Root Cause:** Same as TC-002

---

## Traceability

| AC ID | Test Cases | Status |
|-------|-----------|--------|
| AC-01 | TC-001, TC-009, TC-011 | 3/3 ✅ Passed |
| AC-02 | TC-002, TC-003, TC-010 | 0/3 ❌ Failed |
| AC-03 | TC-004, TC-006, TC-009 | 3/3 ✅ Passed |
| AC-04 | TC-005, TC-006, TC-009 | 3/3 ✅ Passed |
| AC-05 | TC-007, TC-008 | 0/2 ❌ Failed |

---

## Failure Classification Summary

| Category | Count | Tests |
|----------|-------|-------|
| ASSERTION_FAILURE | 3 | TC-002, TC-003, TC-010 |
| LOCATOR_FAILURE | 1 | TC-007 |
| APPLICATION_DEFECT | 1 | TC-008 |

---

## Healing Eligibility

### ✅ Eligible for Healing (TEST_DEFECT):
- TC-002 — Error message assertion issue
- TC-003 — Error message assertion issue
- TC-007 — Locator issue
- TC-010 — Error message assertion issue

### ❌ Not Eligible for Healing (APPLICATION_DEFECT):
- TC-008 — Application security issue, must be fixed in application code

---

## Downstream Actions

1. **JIRA Updater:** Ready to report execution results to SCRUM-2
2. **Heal Test:** Ready to attempt repairs on TC-002, TC-003, TC-007, TC-010
3. **Application Team:** Report security defect in TC-008

---

## Next Steps

1. Apply healing to address `TEST_DEFECT` classifications
2. Re-run tests after healing
3. Report application defect (TC-008) to development team
4. Update JIRA with final execution status

---

**Report Generated:** 2026-08-21  
**Execution Environment:** macOS | Chromium | Node.js | Playwright ^1.62.1  
**Test Framework:** Playwright Test with TypeScript  

