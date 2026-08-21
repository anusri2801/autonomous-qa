# SCRUM-2 Allow registered customers to log in securely

## Summary
- **Ticket:** SCRUM-2
- **Title:** Allow registered customers to log in securely
- **Fix Version:** Not specified
- **Feature:** Customer Login / Authentication

---

## Test Data References

| Key                | Description                                              |
|--------------------|----------------------------------------------------------|
| Registered user    | A customer with a valid registered account and credentials |
| Invalid credentials| A username/password combination that does not match any account |
| Unregistered user  | A user account that does not exist in the system         |

---

## Test Scope

### In Scope
- Login with valid credentials
- Login with invalid credentials (wrong username, wrong password)
- Login with empty username
- Login with empty password
- Access to protected banking pages after successful login

### Out of Scope
- Password reset / forgot password flow
- Account registration
- Multi-factor authentication (not referenced in ticket)
- Session timeout behaviour (not defined in ticket)
- Remember me / persistent login (not defined in ticket)

---

## Scenarios

| Test Case ID | Title | Test Type | Priority | Acceptance Criteria Ref | Preconditions | Test Data Ref | Screen/URL | Test Steps | Expected Result | Automation Candidate | Tags |
|---|---|---|---|---|---|---|---|---|---|---|---|
| TC-001 | Successful login with valid credentials | Functional | High | AC-01 | User has a registered account; user is on the login page | Registered user | Login page | 1. Navigate to the login page. 2. Enter valid username and valid password. 3. Submit the login form. | 1. Authentication is successful. 2. User is redirected to their account/dashboard page. 3. No error message is displayed. | Yes | @smoke, @regression |
| TC-002 | Login fails with invalid username and password | Functional | High | AC-02 | User is on the login page | Invalid credentials | Login page | 1. Navigate to the login page. 2. Enter an invalid username and invalid password. 3. Submit the login form. | 1. Login is not successful. 2. An appropriate authentication error message is displayed. 3. User remains on the login page. | Yes | @regression |
| TC-003 | Login fails with valid username and wrong password | Functional | High | AC-02 | User is on the login page; a registered account exists | Registered user, Invalid credentials | Login page | 1. Navigate to the login page. 2. Enter the valid username and an incorrect password. 3. Submit the login form. | 1. Login is not successful. 2. An appropriate authentication error message is displayed. 3. User remains on the login page. | Yes | @regression |
| TC-004 | Login fails when username is empty | Functional | High | AC-03 | User is on the login page | Registered user | Login page | 1. Navigate to the login page. 2. Leave the username field empty. 3. Enter a valid password. 4. Submit the login form. | 1. Login is not successful. 2. A validation or error message is displayed indicating username is required. 3. User remains on the login page. | Yes | @regression |
| TC-005 | Login fails when password is empty | Functional | High | AC-04 | User is on the login page | Registered user | Login page | 1. Navigate to the login page. 2. Enter a valid username. 3. Leave the password field empty. 4. Submit the login form. | 1. Login is not successful. 2. A validation or error message is displayed indicating password is required. 3. User remains on the login page. | Yes | @regression |
| TC-006 | Login fails when both username and password are empty | Functional | Medium | AC-03, AC-04 | User is on the login page | None | Login page | 1. Navigate to the login page. 2. Leave both the username and password fields empty. 3. Submit the login form. | 1. Login is not successful. 2. Validation or error messages are displayed for both required fields. 3. User remains on the login page. | Yes | @regression |
| TC-007 | Authenticated user can access a protected banking page | Functional | High | AC-05 | User is successfully logged in | Registered user | Login page → Protected banking page | 1. Login successfully as a registered user. 2. Navigate to a protected banking page. | 1. The protected page is accessible. 2. Page content is displayed without errors. 3. No redirect to login page occurs. | Yes | @smoke, @regression |
| TC-008 | Unauthenticated user cannot access a protected banking page | Security | High | AC-05 | User is not logged in | None | Protected banking page (direct URL) | 1. Without logging in, navigate directly to a protected banking page URL. | 1. Access is denied. 2. User is redirected to the login page or receives an unauthorised response. | Yes | @regression |
| TC-009 | Login page renders correctly | Functional | Medium | AC-01, AC-03, AC-04 | User is on the login page | None | Login page | 1. Navigate to the login page. 2. Verify that the username field, password field, and login button are present. | 1. Login page is displayed. 2. Username field is visible and interactive. 3. Password field is visible and interactive. 4. Login submit action is available. | Yes | @smoke, @sanity |
| TC-010 | Login with unregistered user credentials | Functional | Medium | AC-02 | User is on the login page | Unregistered user | Login page | 1. Navigate to the login page. 2. Enter credentials for a user that does not exist. 3. Submit the login form. | 1. Login is not successful. 2. An appropriate authentication error message is displayed. 3. User remains on the login page. | Yes | @regression |
| TC-011 | Password field masks input | Non-Functional | Medium | AC-01 | User is on the login page | None | Login page | 1. Navigate to the login page. 2. Enter a value into the password field. 3. Observe the password field display. | 1. Password characters are masked and not shown in plain text. | Yes | @regression |

---

## Regression Impact

The following existing functionality may be affected by changes related to this ticket:

- **Authentication flow** — any change to the login mechanism may affect all features that depend on authenticated sessions.
- **Session management** — login state is used across all protected pages; changes could break session handling.
- **Protected page access control** — authorisation checks on protected banking pages are directly validated by AC-05.
- **Existing login automation** — any existing automated tests covering the login journey should be reviewed and re-executed.

---

## Risks

| Risk | Description |
|------|-------------|
| Authentication error messages not defined | AC-02 requires an "appropriate authentication message" but the exact wording is not specified, making assertion validation ambiguous. |
| Protected page URLs not specified | AC-05 refers to "a protected banking page" without identifying which page(s), requiring clarification for targeted test execution. |
| Test environment dependency | Login functionality depends on a test environment with a functioning authentication service and test user accounts. |
| Test data dependency | Tests require pre-existing registered user accounts with known credentials in the test environment. |
| Browser compatibility | Login behaviour may vary across browsers; cross-browser coverage should be confirmed. |

---

## Open Questions

| # | Question |
|---|----------|
| OQ-01 | What is the exact error message displayed when invalid credentials are entered (AC-02)? This is required to write deterministic assertions. |
| OQ-02 | Which specific protected banking page(s) should be used to validate AC-05? |
| OQ-03 | Is there a maximum number of failed login attempts before an account is locked? If so, this introduces additional boundary test scenarios. |
| OQ-04 | Are there any input length constraints on the username or password fields? If defined, boundary tests should be added. |
| OQ-05 | Is the password field expected to have a show/hide toggle? If so, TC-011 should be extended. |

---

## Validation Status

- [x] JIRA ticket successfully retrieved
- [x] Requirements analysed
- [x] All acceptance criteria identified (AC-01 through AC-05)
- [x] Every acceptance criterion has test coverage
- [x] Positive scenarios included
- [x] Negative scenarios included
- [x] Boundary considerations documented as open questions (limits not defined in ticket)
- [x] Test cases have clear expected results
- [x] All test cases traceable to acceptance criteria
- [x] Test data references identified
- [x] Screen and URL information identified where available
- [x] Test steps are concise and executable (max 5–6 steps)
- [x] Automation candidates identified
- [x] Approved tags used (@smoke, @regression, @sanity)
- [x] Priorities are appropriate
- [x] Regression impact assessed
- [x] Risks documented
- [x] Open questions documented
- [x] No unsupported requirements or behaviour invented
- [x] Test plan follows project naming and folder conventions
