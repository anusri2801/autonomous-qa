import { test, expect } from '@playwright/test';
import { LoginPage } from '../../pages/LoginPage';
import { loginData } from '../../testdata/logindata';

/**
 * JIRA:     SCRUM-2 — Allow registered customers to log in securely
 * Feature:  Customer Login / Authentication
 * Test Plan: testplan/SCRUM-2-login.md
 * Validation: validation/SCRUM-2-login-validation.md — PASS
 */

test.describe('SCRUM-2 — Customer Login', () => {

  let loginPage: LoginPage;

  test.beforeEach(async ({ page }) => {
    loginPage = new LoginPage(page);
    await loginPage.goto();
  });

  // ---------------------------------------------------------------------------
  // TC-001 | AC-01 | Functional | High | @smoke @regression
  // ---------------------------------------------------------------------------
  test('TC-001 — Successful login with valid credentials',
    { tag: ['@smoke', '@regression'] },
    async ({ page }) => {
      // JIRA: SCRUM-2 | AC: AC-01 | Test Case: TC-001

      await loginPage.login(
        loginData.registeredUser.username,
        loginData.registeredUser.password
      );

      await loginPage.assertLoginSuccessful();
    }
  );

  // ---------------------------------------------------------------------------
  // TC-002 | AC-02 | Functional | High | @regression
  // ---------------------------------------------------------------------------
  test('TC-002 — Login fails with invalid username and password',
    { tag: ['@regression'] },
    async () => {
      // JIRA: SCRUM-2 | AC: AC-02 | Test Case: TC-002

      await loginPage.login(
        loginData.invalidCredentials.username,
        loginData.invalidCredentials.password
      );

      await loginPage.assertLoginFailed();
      await loginPage.assertErrorMessageVisible();
    }
  );

  // ---------------------------------------------------------------------------
  // TC-003 | AC-02 | Functional | High | @regression
  // ---------------------------------------------------------------------------
  test('TC-003 — Login fails with valid username and wrong password',
    { tag: ['@regression'] },
    async () => {
      // JIRA: SCRUM-2 | AC: AC-02 | Test Case: TC-003

      await loginPage.login(
        loginData.registeredUser.username,
        loginData.invalidCredentials.password
      );

      await loginPage.assertLoginFailed();
      await loginPage.assertErrorMessageVisible();
    }
  );

  // ---------------------------------------------------------------------------
  // TC-004 | AC-03 | Functional | High | @regression
  // ---------------------------------------------------------------------------
  test('TC-004 — Login fails when username is empty',
    { tag: ['@regression'] },
    async () => {
      // JIRA: SCRUM-2 | AC: AC-03 | Test Case: TC-004

      await loginPage.loginWithPasswordOnly(loginData.registeredUser.password);

      await loginPage.assertStillOnLoginPage();
    }
  );

  // ---------------------------------------------------------------------------
  // TC-005 | AC-04 | Functional | High | @regression
  // ---------------------------------------------------------------------------
  test('TC-005 — Login fails when password is empty',
    { tag: ['@regression'] },
    async () => {
      // JIRA: SCRUM-2 | AC: AC-04 | Test Case: TC-005

      await loginPage.loginWithUsernameOnly(loginData.registeredUser.username);

      await loginPage.assertStillOnLoginPage();
    }
  );

  // ---------------------------------------------------------------------------
  // TC-006 | AC-03, AC-04 | Functional | Medium | @regression
  // ---------------------------------------------------------------------------
  test('TC-006 — Login fails when both username and password are empty',
    { tag: ['@regression'] },
    async () => {
      // JIRA: SCRUM-2 | AC: AC-03, AC-04 | Test Case: TC-006

      await loginPage.submitEmpty();

      await loginPage.assertStillOnLoginPage();
    }
  );

  // ---------------------------------------------------------------------------
  // TC-007 | AC-05 | Functional | High | @smoke @regression
  // ---------------------------------------------------------------------------
  test('TC-007 — Authenticated user can access a protected banking page',
    { tag: ['@smoke', '@regression'] },
    async ({ page }) => {
      // JIRA: SCRUM-2 | AC: AC-05 | Test Case: TC-007

      await loginPage.login(
        loginData.registeredUser.username,
        loginData.registeredUser.password
      );

      await loginPage.assertLoginSuccessful();

      // Navigate to a protected banking page (Accounts Overview)
      await page.goto('/parabank/overview.htm');
      await loginPage.assertProtectedPageAccessible();
    }
  );

  // ---------------------------------------------------------------------------
  // TC-008 | AC-05 | Security | High | @regression
  // ---------------------------------------------------------------------------
  test('TC-008 — Unauthenticated user cannot access a protected banking page',
    { tag: ['@regression'] },
    async ({ page }) => {
      // JIRA: SCRUM-2 | AC: AC-05 | Test Case: TC-008

      // Attempt to access protected page without logging in
      await page.goto('/parabank/overview.htm');

      // Should be redirected to login or receive an unauthorised response
      await expect(page).not.toHaveURL(/overview\.htm/);
    }
  );

  // ---------------------------------------------------------------------------
  // TC-009 | AC-01, AC-03, AC-04 | Functional | Medium | @smoke @sanity
  // ---------------------------------------------------------------------------
  test('TC-009 — Login page renders correctly',
    { tag: ['@smoke', '@sanity'] },
    async () => {
      // JIRA: SCRUM-2 | AC: AC-01, AC-03, AC-04 | Test Case: TC-009

      await loginPage.assertOnLoginPage();
    }
  );

  // ---------------------------------------------------------------------------
  // TC-010 | AC-02 | Functional | Medium | @regression
  // ---------------------------------------------------------------------------
  test('TC-010 — Login with unregistered user credentials fails',
    { tag: ['@regression'] },
    async () => {
      // JIRA: SCRUM-2 | AC: AC-02 | Test Case: TC-010

      await loginPage.login(
        loginData.unregisteredUser.username,
        loginData.unregisteredUser.password
      );

      await loginPage.assertLoginFailed();
      await loginPage.assertErrorMessageVisible();
    }
  );

  // ---------------------------------------------------------------------------
  // TC-011 | AC-01 | Non-Functional | Medium | @regression
  // ---------------------------------------------------------------------------
  test('TC-011 — Password field masks input',
    { tag: ['@regression'] },
    async () => {
      // JIRA: SCRUM-2 | AC: AC-01 | Test Case: TC-011

      await loginPage.passwordInput.fill('anyvalue');
      await loginPage.assertPasswordIsMasked();
    }
  );

});
