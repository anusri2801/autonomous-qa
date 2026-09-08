# QA Test Plan: SCRUM-2

## Test Plan

Test Plan: `testplan/SCRUM-2-login.md`

Validation: PASS (2026-08-21)

---

## Scope

Allow registered customers to log in securely using valid credentials while preventing unauthorized access with invalid or empty credentials. Verify protected banking pages are only accessible to authenticated users.

---

## Test Coverage

| Test Type     | Count |
|---------------|------:|
| Functional    | 8     |
| Non-Functional| 1     |
| Security      | 1     |
| Regression    | 1     |

**Total Test Cases:** 11

---

## Acceptance Criteria Coverage

| AC ID  | Test Cases             | Status  |
|--------|------------------------|---------|
| AC-01  | TC-001, TC-009, TC-011 | Covered |
| AC-02  | TC-002, TC-003, TC-010 | Covered |
| AC-03  | TC-004, TC-006, TC-009 | Covered |
| AC-04  | TC-005, TC-006, TC-009 | Covered |
| AC-05  | TC-007, TC-008         | Covered |

**Coverage:** All 5 acceptance criteria covered by 11 test cases.

---

## Automation

| Metric                | Value |
|-----------------------|------:|
| Automation Candidates | 11    |
| Manual Only           | 0     |

All 11 test cases are suitable for Playwright UI automation.

---

## Test Data

| Test Data ID   | Description                                      |
|----------------|--------------------------------------------------|
| Registered user| A customer with a valid registered account      |
| Invalid credentials | Username/password combination that doesn't match any account |
| Unregistered user | A user account that does not exist in the system |

---

## Automation Status

Generated Playwright automation:
- **Spec File:** `src/tests/Login/login.spec.ts`
- **Page Object:** `src/pages/LoginPage.ts`
- **Test Data:** `src/testdata/logindata.ts`
- **Status:** Generated and ready for execution

---

## Execution Results (Latest Run)

| Result | Count |
|--------|------:|
| Passed | 7     |
| Failed | 4     |
| Total  | 11    |

**Pass Rate:** 64%

**Failures:** 
- 1 test defect (healed)
- 3 application defects (security/login validation issues)
- 1 security defect (TC-008)

---

## Regression Impact

**Affected Areas:**
- Authentication and login flow
- Session management and user state
- Protected page access control
- Existing login automation (if present)
- Customer onboarding workflows

**Related Features:**
- Password reset flow
- User registration
- Account management
- Protected banking operations

---

## Risks

1. **Application Login Validation Issue:** Tests reveal application may accept invalid credentials (TC-002, TC-003, TC-010)
2. **Authentication Flow Security:** Unauthenticated users can access protected pages (TC-008)
3. **Password Field Masking:** Security assertion on field type attribute (TC-011)
4. **Session Management:** Test coverage on authenticated state preservation
5. **Error Message Consistency:** Application error message visibility inconsistent across scenarios

---

## Open Questions

1. **OQ-01:** Should error messages for invalid username vs. invalid password be different or the same?
2. **OQ-02:** What is the expected timeout for session expiration?
3. **OQ-03:** Should "Remember Me" functionality be implemented?
4. **OQ-04:** Are there account lockout restrictions after N failed attempts?
5. **OQ-05:** What are the password complexity requirements?

---

## Issues Identified

### 🚨 Critical Issues

**Issue 1:** Application Login Validation Broken
- Tests TC-002, TC-003, TC-010 fail because application accepts **any** credentials
- Invalid, wrong, or unregistered user credentials still result in successful login
- **Acceptance Criteria Affected:** AC-02 (invalid credentials should fail), AC-04
- **Recommendation:** Block release until fixed
- **Severity:** CRITICAL (Security)

**Issue 2:** Unauthenticated Access to Protected Pages
- Test TC-008 fails because unauthenticated users can access `/parabank/overview.htm`
- **Acceptance Criteria Affected:** AC-05
- **Recommendation:** Implement authentication check on protected endpoints
- **Severity:** CRITICAL (Security)

### ⚠️ Medium Issues

**Issue 3:** Error Message Visibility
- Error messages (`p.error`) exist in DOM but not visible after failed login
- Affects TC-002, TC-003, TC-010
- **Recommendation:** Verify error message display mechanism

---

## Status

**Test Plan:** Validated (PASS)

**Automation:** Generated (11/11 test cases automated)

**Execution:** Complete (7/11 passed on latest run)

**Quality Gate:** ⚠️ **BLOCKED** — Application defects must be resolved before production release

**Recommendation:** 
- ✅ Accept test plan and automation
- 🚨 Escalate application defects to development team
- ⏸️ Schedule release after application fixes

---

## Test Execution Date

2026-08-21 (Chromium browser, https://parabank.parasoft.com)

---

## Test Plan Version

Version: 1.0

Last Updated: 2026-08-21

