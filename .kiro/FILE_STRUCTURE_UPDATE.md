# File Structure Update — Tests Moved to src/tests

**Date:** August 21, 2026  
**Change:** Test folder moved from `tests/` (root) to `src/tests/`  
**Status:** ✅ Complete

---

## Overview

The test folder structure has been reorganized to co-locate tests with source code.

**Before:**
```
/
├── tests/
│   └── [Feature]/
│       └── [feature-name].spec.ts
├── src/
│   ├── pages/
│   ├── testdata/
│   ├── utils/
│   └── fixtures/
```

**After:**
```
/
├── src/
│   ├── tests/
│   │   └── [Feature]/
│   │       └── [feature-name].spec.ts
│   ├── pages/
│   ├── testdata/
│   ├── utils/
│   └── fixtures/
```

---

## Playwright Configuration

**playwright.config.ts** has been updated to reflect the new location:

```typescript
export default defineConfig({
  testDir: './src/tests',
  // ... rest of configuration
});
```

---

## Updated Files

### 1. power.md

**Section 4.3 — automate-ui**
- Output path: `src/tests/[Feature]/[feature-name].spec.ts`

**Section 5.2 — UI Automation Tests**
- Updated example: `src/tests/auth/password-reset.spec.ts`

### 2. .kiro/steering/automate-ui-standards.md

**Section 3 — Existing Framework Inspection**
- Project locations updated to show `src/tests/`

**Section 14 — File Structure**
- Updated file hierarchy to reflect new structure
- Updated examples: `src/tests/auth/login.spec.ts`
- Clarified: Specs under `src/tests/`, matches `testDir: './src/tests'` in `playwright.config.ts`

### 3. .kiro/steering/heal-test-standards.md

**Section 5 — Healing Process, Step 5**
- Repair locations: `src/tests/[Feature]/[feature-name].spec.ts`

### 4. .kiro/skills/automate-ui/SKILL.md

**Section 5 — Outputs**
- Playwright specs: `src/tests/[Feature]/[feature-name].spec.ts`
- Page Objects: `src/pages/[Feature]Page.ts`
- Test data: `src/testdata/[feature]data.ts`

### 5. .kiro/skills/heal-test/SKILL.md

**Inputs section**
- Spec file path: `src/tests/[Feature]/[feature-name].spec.ts`
- Supporting artifacts paths updated

### 6. .kiro/skills/test-runner/SKILL.md

**Section 3 — Inputs**
- Primary input: `src/tests/` directory

**Section 8 — Traceability**
- Example spec path: `src/tests/Login/login.spec.ts`

---

## Consistency Verification

All framework documentation now consistently references:

- ✅ **Specs location:** `src/tests/`
- ✅ **Page Objects location:** `src/pages/`
- ✅ **Test data location:** `src/testdata/`
- ✅ **Utilities location:** `src/utils/`
- ✅ **Fixtures location:** `src/fixtures/`
- ✅ **Playwright config:** `testDir: './src/tests'`

---

## For New Automation

When creating new Playwright tests via the `automate-ui` skill:

1. **Output location:** `src/tests/[Feature]/[feature-name].spec.ts`
2. **Page Objects:** `src/pages/[Feature]Page.ts`
3. **Test data:** `src/testdata/[feature]data.ts`
4. **Traceability metadata:**
   ```typescript
   // JIRA: SCRUM-2 | AC: AC-01 | Test Case: TC-001
   ```

---

## For Test Execution

When running tests via the `test-runner` skill:

1. **Configuration:** Uses `playwright.config.ts` which references `testDir: './src/tests'`
2. **Artifact storage:** `execution/[ticket-key]-[short-name]/`
3. **Reports:** Markdown and JSON in execution directory

---

## For Test Healing

When repairing tests via the `heal-test` skill:

1. **Spec files:** Located in `src/tests/[Feature]/[feature-name].spec.ts`
2. **Page Objects:** Located in `src/pages/[Feature]Page.ts`
3. **Test data:** Located in `src/testdata/[feature]data.ts`

---

## Notes

- The Playwright config already had `testDir: './src/tests'` configured, so this update aligns documentation with the actual configuration.
- All skills, steering files, and framework documentation now consistently reference the updated file structure.
- Existing automation (if any) should be moved to the new location.

---
