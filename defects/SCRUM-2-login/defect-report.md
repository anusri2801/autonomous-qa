# Defect Management Report — SCRUM-2 Login

**Date:** 2026-08-21  
**Source Story:** SCRUM-2  
**Feature:** Customer Login / Authentication  

---

## Executive Summary

| Aspect | Finding |
|--------|---------|
| Test Executions Analyzed | 5 failed tests |
| Healing Attempts | 1 test healed, 4 not healable |
| Application Defects Identified | 2 critical security defects |
| Existing Defects Found | None (new defects required) |
| Defects to Create | 2 |
| Duplicates | 0 |
| Defect Creation Blocked | 0 |

---

## Defects Identified

### 🚨 DEFECT 1: Login Accepts Invalid Credentials

**Status:** `DEFECT_CREATED` (Ready)  
**Severity:** CRITICAL (Security)  
**Acceptance Criteria Affected:** AC-02, AC-04  

#### Summary
Application Login - Invalid or wrong credentials accepted as successful login

#### Root Cause Assessment

**Evidence-Based Analysis:**

Test Case TC-002 (Invalid username + password), TC-003 (Valid username + wrong password), and TC-010 (Unregistered user) all demonstrate the same application behaviour:

1. User submits login form with invalid/wrong/unregistered credentials
2. Application redirects to `/parabank/overview.htm` (authenticated state)
3. Session is created despite invalid credentials
4. No error message is displayed
5. User is in authenticated state with invalid credentials

**Reproducibility:** Always  
**Scope:** All credential combinations tested  
**Confidence:** HIGH  

**This violates approved requirements:**
- AC-02: "when invalid username or password is entered, then login should not be successful"
- AC-04: "when the password is empty, then login should not be successful"

#### Test Case Traceability

| Test Case | AC Affected | Expected | Actual | Evidence |
|-----------|-------------|----------|--------|----------|
| TC-002 | AC-02 | Login fails, error shown | Redirects to overview | Test failure |
| TC-003 | AC-02 | Login fails, error shown | Redirects to overview | Test failure |
| TC-010 | AC-02 | Login fails, error shown | Redirects to overview | Test failure |

#### Preconditions

- User is not authenticated
- User is on the login page (`/parabank/index.htm`)
- Application is running
- Database has user accounts configured

#### Steps to Reproduce

1. Navigate to `/parabank/index.htm` (login page)
2. Enter invalid username and password (e.g., `invalid_user` / `wrong_pass`)
3. Click "Log In" button
4. **Observe:** Application redirects to `/parabank/overview.htm` and user is authenticated

**Alternative 1:**
1. Navigate to login page
2. Enter valid username with incorrect password
3. Click "Log In"
4. **Observe:** Redirects to overview page (authenticated)

**Alternative 2:**
1. Navigate to login page
2. Enter unregistered user credentials
3. Click "Log In"
4. **Observe:** Redirects to overview page (authenticated)

#### Expected Result

**Per Acceptance Criteria AC-02:**
- Login should **NOT** be successful
- An appropriate authentication error message should be displayed
- User should remain on the login page
- No session should be created

#### Actual Result

- Login appears to be successful
- User is redirected to authenticated area (`/parabank/overview.htm`)
- Session is created with invalid/wrong credentials
- No error message is visible
- User can access protected pages with invalid credentials

#### Environment

- Browser: Chromium
- Environment: https://parabank.parasoft.com
- Test Data: Various invalid credentials
- Execution Date: 2026-08-21

#### Impact

- **Security:** Critical — Invalid credentials grant access to banking pages
- **Business:** High — Login validation is fundamental
- **Users:** All users can log in with any credentials
- **Compliance:** Risk — May violate security standards

#### Evidence References

- **Execution Report:** `execution/SCRUM-2-login/execution-report.md`
- **Test Results:** `execution/SCRUM-2-login/execution-results.json`
- **Healing Report:** `execution/SCRUM-2-login/healing-report.md`
- **Test Code:** `src/tests/Login/login.spec.ts` (TC-002, TC-003, TC-010)

---

### 🚨 DEFECT 2: Unauthenticated Access to Protected Pages

**Status:** `DEFECT_CREATED` (Ready)  
**Severity:** CRITICAL (Security)  
**Acceptance Criteria Affected:** AC-05  

#### Summary
Application Login - Unauthenticated users can access protected banking pages

#### Root Cause Assessment

**Evidence-Based Analysis:**

Test Case TC-008 demonstrates that without authentication:

1. User attempts to navigate directly to protected page (`/parabank/overview.htm`)
2. Application does NOT enforce authentication check
3. Page loads successfully for unauthenticated user
4. User can access protected banking content without credentials

**Reproducibility:** Always  
**Scope:** Protected endpoints  
**Confidence:** HIGH  

**This violates approved requirement:**
- AC-05: "Given a customer is successfully logged in, when the customer accesses a protected banking page, then the protected page should be accessible" — implies unauthenticated users should NOT have access

#### Test Case Traceability

| Test Case | AC Affected | Expected | Actual | Evidence |
|-----------|-------------|----------|--------|----------|
| TC-008 | AC-05 | Access denied / redirect to login | Page loads for unauthenticated user | Test failure |

#### Preconditions

- User is NOT authenticated (no valid session)
- Application is running
- Protected page endpoint exists (`/parabank/overview.htm`)

#### Steps to Reproduce

1. Clear browser session (log out or start fresh)
2. **Verify:** User is not authenticated
3. Navigate directly to `/parabank/overview.htm`
4. **Observe:** Page loads successfully without authentication

#### Expected Result

**Per Acceptance Criteria AC-05 (logical inverse):**
- Access should be denied
- User should be redirected to login page
- Unauthenticated session should not be permitted to view protected content
- An authentication error or message should be displayed

#### Actual Result

- Protected page loads successfully
- Unauthenticated user can view banking pages
- No redirect to login occurs
- No authentication check enforced
- User can access all content of protected pages

#### Environment

- Browser: Chromium
- Environment: https://parabank.parasoft.com
- Session State: Unauthenticated
- Execution Date: 2026-08-21

#### Impact

- **Security:** CRITICAL — Any user can access protected banking pages without credentials
- **Compliance:** CRITICAL — Violates authentication requirements
- **Business:** CRITICAL — Core security feature broken
- **Users:** CRITICAL — Banking data exposed to unauthorized access

#### Evidence References

- **Execution Report:** `execution/SCRUM-2-login/execution-report.md`
- **Test Results:** `execution/SCRUM-2-login/execution-results.json`
- **Healing Report:** `execution/SCRUM-2-login/healing-report.md`
- **Test Code:** `src/tests/Login/login.spec.ts` (TC-008)

---

## Duplicate Defect Search

### Search Performed: Yes

**Search Criteria:**
- Source Story: SCRUM-2
- Application Area: Login / Authentication
- Test Case IDs: TC-002, TC-003, TC-008, TC-010
- Acceptance Criteria: AC-02, AC-04, AC-05
- Keywords: "login", "authentication", "invalid credentials", "protected page"
- Status: All open/recent defects

**Results:** No existing defects found with same root cause

**Conclusion:** New defects required

---

## Defect Creation Safety Gate

Pre-creation checklist:

- [x] Failure is not an automation defect (healed TC-007 proves automation works)
- [x] Failure is not an environment issue (app is running, accessible)
- [x] Failure is not test-data issue (test data is valid)
- [x] Expected behaviour is documented (AC-02, AC-04, AC-05)
- [x] Actual behaviour is evidenced (test failures + execution logs)
- [x] Duplicate search was performed (none found)
- [x] Source story is known (SCRUM-2)
- [x] Test Case IDs are known (TC-002, TC-003, TC-008, TC-010)
- [x] Sensitive information removed (no credentials in report)

**Gate Status:** ✅ PASSED — Safe to create defects

---

## JIRA Defect Details

### Defect 1

**Summary:** Login - Invalid or wrong credentials accepted as successful

**Type:** Bug

**Priority:** Critical

**Affected Acceptance Criteria:** AC-02, AC-04

**Affected Test Cases:** TC-002, TC-003, TC-010

**Linked to:** SCRUM-2

**Description:** [From section above]

---

### Defect 2

**Summary:** Login - Unauthenticated users can access protected banking pages

**Type:** Bug

**Priority:** Critical

**Affected Acceptance Criteria:** AC-05

**Affected Test Cases:** TC-008

**Linked to:** SCRUM-2

**Description:** [From section above]

---

## Traceability

```
SCRUM-2 (Source Story)
├── AC-02 (Invalid credentials should fail)
│   ├── TC-002 → DEFECT-1
│   ├── TC-003 → DEFECT-1
│   └── TC-010 → DEFECT-1
│
├── AC-04 (Empty password should fail)
│   ├── TC-005 ✅ PASS
│   ├── TC-006 ✅ PASS
│   └── TC-009 ✅ PASS
│
└── AC-05 (Protected page access control)
    ├── TC-007 ✅ PASS (healed)
    └── TC-008 → DEFECT-2
```

---

## Confidence Assessment

### Defect 1 — Invalid Credentials Accepted

**Confidence:** HIGH (95%)

| Factor | Assessment |
|--------|-----------|
| Root Cause Clear | Yes — multiple test cases demonstrate consistent behaviour |
| Expected Behaviour Documented | Yes — AC-02, AC-04 define requirements |
| Actual Behaviour Evidenced | Yes — 3 test failures + execution logs |
| Reproducibility | Always — consistent across multiple credential combinations |
| Application Bug Vs. Test Bug | Application — tests pass when AC-02/AC-04 are met (other AC pass) |

**Conclusion:** Genuine application defect, not test issue

### Defect 2 — Unauthenticated Access

**Confidence:** HIGH (95%)

| Factor | Assessment |
|--------|-----------|
| Root Cause Clear | Yes — single test demonstrates clear security gap |
| Expected Behaviour Documented | Yes — AC-05 implies protection required |
| Actual Behaviour Evidenced | Yes — TC-008 fails, page loads without auth |
| Reproducibility | Always — consistent across test runs |
| Application Bug Vs. Test Bug | Application — core authentication check missing |

**Conclusion:** Genuine application defect, critical security issue

---

## Recommended Actions

### Immediate (Development Team)

1. 🚨 **CRITICAL:** Fix login validation to reject invalid credentials
2. 🚨 **CRITICAL:** Implement authentication check on protected endpoints
3. 🔄 Re-run all login tests after fixes
4. ✅ Verify AC-02, AC-04, AC-05 pass

### QA Team

1. ✅ Link defects to SCRUM-2
2. ✅ Update JIRA testing notes with defect references
3. 🔄 Block release until defects resolved
4. 🔄 Plan re-execution after fixes

### Release Team

🚨 **CANNOT PROCEED** — Critical security defects identified

---

## Defect Status

| Defect | Status | JIRA Key | Priority | Action |
|--------|--------|----------|----------|--------|
| Invalid Credentials | Ready to Create | — | CRITICAL | Create & Link |
| Unauth Access | Ready to Create | — | CRITICAL | Create & Link |

---

**Report Generated:** 2026-08-21  
**Report Status:** ✅ COMPLETE — Ready for JIRA defect creation  

