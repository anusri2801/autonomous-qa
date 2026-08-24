# Test Plan Validation Report

## Summary

| Field                  | Value                                  |
|------------------------|----------------------------------------|
| JIRA                   | SCRUM-2                                |
| Test Plan              | `testplan/SCRUM-2-login.md`            |
| Validation Status      | PASS                                   |
| JIRA Verified          | Yes                                    |
| Blocking Issues        | 0                                      |
| Major Issues           | 0                                      |
| Minor Issues           | 2                                      |
| Informational Issues   | 0                                      |
| Downstream Processing  | Allowed                                |

## Validation Timestamp

2026-08-21

## JIRA Information

| Field        | Value                                          |
|--------------|------------------------------------------------|
| Ticket       | SCRUM-2                                        |
| Summary      | Allow registered customers to log in securely  |
| Issue Type   | Story                                          |
| Priority     | Medium                                         |
| Status       | To Do                                          |
| Fix Version  | Not specified                                  |
| Labels       | None                                           |
| Reporter     | anukriti srivastava                            |

## Acceptance Criteria (from JIRA)

| AC ID | Description |
|-------|-------------|
| AC-01 | Given a registered customer on the login page, when valid credentials are entered, then the customer should be logged in successfully. |
| AC-02 | Given a customer on the login page, when an invalid username or password is entered, then login should not be successful and an appropriate authentication message should be displayed. |
| AC-03 | Given a customer on the login page, when the username is empty, then login should not be successful. |
| AC-04 | Given a customer on the login page, when the password is empty, then login should not be successful. |
| AC-05 | Given a customer is successfully logged in, when the customer accesses a protected banking page, then the protected page should be accessible. |

---

## Quality Gate Results

| Quality Gate                 | Status           | Notes |
|------------------------------|------------------|-------|
| Requirements analysed        | PASS             | JIRA ticket retrieved and analysed. Summary, description and all 5 ACs reviewed. |
| Acceptance criteria coverage | PASS             | All 5 ACs (AC-01 to AC-05) have at least one test case. |
| Traceability                 | PASS             | Complete JIRA → AC → Test Case mapping. No orphan ACs or test cases. |
| Test plan structure          | PASS             | All mandatory sections present: Summary, Test Data References, Test Scope, Scenarios, Regression Impact, Risks, Open Questions, Validation Status. |
| Test scenarios               | PASS             | Positive, negative, security/authorization and non-functional scenarios all present. |
| Test cases                   | PASS             | All 11 test cases contain mandatory fields. IDs are unique and sequential TC-001 to TC-011. |
| Test data                    | PASS             | 3 test data references defined. No sensitive data present. |
| Screen / URL                 | PASS / NOT VERIFIED | Screen names present. URL paths not defined — JIRA does not specify URLs. Correctly not invented. |
| Test steps                   | PASS             | Steps are atomic, imperative and within the 5–6 step limit. No selectors or automation code present. |
| Expected results             | PASS             | All test cases have numbered, observable and testable expected results. No invented error messages. |
| Test types                   | PASS             | Approved types used: Functional, Non-Functional, Security. |
| Priorities                   | PASS             | High and Medium priorities used appropriately. No unjustified Critical assigned. |
| Tags                         | PASS             | Only approved tags used: `@smoke`, `@sanity`, `@regression`. |
| Automation candidates        | PASS             | All 11 test cases marked Yes. All are repeatable and deterministic. |
| Regression impact            | PASS             | Authentication flow, session management, protected page access and existing automation coverage identified. |
| Risks                        | PASS             | 5 relevant risks documented. No invented risks. |
| Open questions               | PASS             | 5 material open questions documented. No ambiguities silently treated as confirmed facts. |
| Assumptions                  | PASS             | No unsupported assumptions found. Derived scenarios (TC-008, TC-011) are justified. |
| No-invention validation      | PASS             | All test cases traceable to JIRA ACs or clearly justified derived behaviour. |
| Internal consistency         | PASS             | Test data table, scenario table, AC references and validation checklist are consistent throughout. |
| Project conventions          | PASS             | File at `testplan/SCRUM-2-login.md`. Naming convention, tag format and TC ID format all comply. |

---

## Findings

| ID      | Severity | Blocking | Category    | Location              | Finding                                                                                                        | Recommendation                                                                                             |
|---------|----------|----------|-------------|-----------------------|----------------------------------------------------------------------------------------------------------------|------------------------------------------------------------------------------------------------------------|
| VAL-001 | MINOR    | No       | Test Type   | TC-002 to TC-006, TC-010 | Negative/invalid input scenarios are typed as `Functional`. The standards do not define a separate `Negative` type, so `Functional` is the correct approved type. Noted for awareness. | No change required. `Functional` is the correct type for these scenarios under the current approved type list. |
| VAL-002 | MINOR    | No       | Screen / URL | All test cases        | Screen references use plain English names ("Login page", "Protected banking page") without URL paths. JIRA does not define application URLs, so paths cannot be determined without invention. | No change required. When URLs are known (e.g. from application documentation), update the Screen/URL column accordingly. |

---

## Traceability Summary

| AC ID | Test Cases                        | Coverage Status |
|-------|-----------------------------------|-----------------|
| AC-01 | TC-001, TC-009, TC-011            | Covered         |
| AC-02 | TC-002, TC-003, TC-010            | Covered         |
| AC-03 | TC-004, TC-006, TC-009            | Covered         |
| AC-04 | TC-005, TC-006, TC-009            | Covered         |
| AC-05 | TC-007, TC-008                    | Covered         |

**Derived scenarios (justified):**

| Test Case | Derived From | Rationale |
|-----------|-------------|-----------|
| TC-008    | AC-05        | Logical inverse — unauthenticated access must be denied. Standard security/authorization derived scenario. |
| TC-011    | AC-01        | Standard non-functional behaviour for login — password field masking is implied security behaviour. |

---

## Finding Counts

| Severity  | Count |
|-----------|------:|
| BLOCKER   | 0     |
| MAJOR     | 0     |
| MINOR     | 2     |
| INFO      | 0     |
| **Total** | **2** |

---

## Final Decision

```
PASS
```

`TEST_PLAN_VALIDATED`

---

## Downstream Processing Eligibility

```
Ready for Downstream Processing
```

The test plan is eligible for:

- JIRA Updater Agent (`jira-updater`)
- Playwright Automation Agent (`automate-ui`)

---

## Downstream Recommendation

The test plan is complete, traceable and standards-compliant. Both minor findings are non-blocking observations with no corrective action required before downstream processing.

The 5 open questions (OQ-01 to OQ-05) should be resolved with the product team before Playwright assertions are written for error message text and before protected page URLs are hardened into automation configuration.
