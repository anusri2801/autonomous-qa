import { Page, Locator, expect } from '@playwright/test';

/**
 * LoginPage — Page Object for the ParaBank Customer Login page.
 *
 * JIRA: SCRUM-2
 * URL:  /parabank/index.htm
 *
 * Locators verified against live application DOM inspection.
 * No data-testid attributes present on this page;
 * name-attribute CSS selectors and role-based locators are used.
 */
export class LoginPage {
  readonly page: Page;

  // --- Locators ---
  readonly usernameInput: Locator;
  readonly passwordInput: Locator;
  readonly loginButton: Locator;
  readonly errorMessage: Locator;
  readonly loginHeading: Locator;

  constructor(page: Page) {
    this.page = page;
    this.usernameInput = page.locator('input[name="username"]');
    this.passwordInput = page.locator('input[name="password"]');
    this.loginButton   = page.locator('input[type="submit"][value="Log In"]');
    this.errorMessage  = page.locator('p.error');
    this.loginHeading  = page.getByRole('heading', { name: 'Customer Login' });
  }

  // --- Navigation ---

  async goto(): Promise<void> {
    await this.page.goto('/parabank/index.htm');
  }

  // --- Actions ---

  /**
   * Fill credentials and submit the login form.
   */
  async login(username: string, password: string): Promise<void> {
    await this.usernameInput.fill(username);
    await this.passwordInput.fill(password);
    await this.loginButton.click();
  }

  /**
   * Fill username only (leave password empty) and submit.
   */
  async loginWithUsernameOnly(username: string): Promise<void> {
    await this.usernameInput.fill(username);
    await this.loginButton.click();
  }

  /**
   * Fill password only (leave username empty) and submit.
   */
  async loginWithPasswordOnly(password: string): Promise<void> {
    await this.passwordInput.fill(password);
    await this.loginButton.click();
  }

  /**
   * Submit the form with both fields empty.
   */
  async submitEmpty(): Promise<void> {
    await this.loginButton.click();
  }

  // --- Assertions ---

  async assertOnLoginPage(): Promise<void> {
    await expect(this.loginHeading).toBeVisible();
    await expect(this.usernameInput).toBeVisible();
    await expect(this.passwordInput).toBeVisible();
    await expect(this.loginButton).toBeVisible();
  }

  async assertLoginSuccessful(): Promise<void> {
    await expect(this.page).toHaveURL(/overview\.htm/);
  }

  async assertLoginFailed(): Promise<void> {
    await expect(this.errorMessage).toBeVisible();
    await expect(this.page).not.toHaveURL(/overview\.htm/);
  }

  async assertErrorMessageVisible(): Promise<void> {
    await expect(this.errorMessage).toBeVisible();
  }

  async assertStillOnLoginPage(): Promise<void> {
    await expect(this.page).not.toHaveURL(/overview\.htm/);
  }

  async assertPasswordIsMasked(): Promise<void> {
    await expect(this.passwordInput).toHaveAttribute('type', 'password');
  }
}
