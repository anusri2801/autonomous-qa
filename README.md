# Autonomous QA Framework

## Overview

`power.md` is the entry point — an onboarding manual that defines the overall framework and high-level architecture, including available agents, their capabilities (skills), steering files, MCP servers and project conventions.

- The **skill** defines what a capability does (purpose, input, output, workflow).
- The **steering** defines how that capability must behave (rules, standards, constraints).

The framework follows this separation:

**Layer	File** => **Purpose**
Skill	-> SKILL.md	=> What the agent does — role, inputs, outputs, workflow steps, completion criteria
Steering ->	*-standards.md	=> How it must behave — rules, constraints, quality standards, enforcement policies

The skill is the agent's job description. 
The steering is the compliance rulebook. 
An agent reads both — the skill tells it what to do, the steering tells it how to do it correctly.

---

## Setup

### 1. Install Playwright

```bash
npm install
npx playwright install
```

### 2. Create Kiro folders

The framework uses `.kiro/` for skills, steering and settings.

```text
.kiro/
  skills/
    test-planner/SKILL.md
    test-plan-validator/SKILL.md
    jira-updater/SKILL.md
  steering/
    global-standards.md
    test-planning-standards.md
    jira-testing-notes-standards.md
  settings/
    mcp.json
```

### 3. Create skill files

Skills define the capability of each agent — purpose, workflow, inputs and outputs.

### 4. Create steering files

Steering files define the rules and behavioural standards for each capability.

---

## Repository Structure

| Artifact         | Location |
|------------------|----------|
| Test plans       | `testplan/[ticket-key]-[short-name].md` |
| Playwright tests | `src/tests/ui/[app-folder]/[feature-name].spec.ts` |
| Page Objects     | `src/pages/ui/[Feature]Page.ts` |
| Test data        | `src/testdata/` |
| Execution results| `execution-results/` |
| Validation reports | `validation/` |

**Created so far:**

- `global-standards.md` and `test-planning-standards.md` (steering)
- `test-planner` SKILL.md
- `test-plan-validator` SKILL.md
- `jira-updater` SKILL.md

---

## JIRA Configuration

**JIRA Link:** [SCRUM board](https://testjiraanu.atlassian.net/jira/software/projects/SCRUM/boards/1)

**JIRA Site:** `https://testjiraanu.atlassian.net`

**JIRA Project:** `SCRUM`

**Test Ticket:** `SCRUM-2`

---

## Atlassian MCP Setup

The recommended approach is OAuth authentication.

**Atlassian Rovo MCP endpoint:**

```text
https://mcp.atlassian.com/v1/mcp/authv2
```

> Note: The older `/v1/sse` endpoint is no longer supported after June 30, 2026.

**Token Name:** AI Agentic Workflow

### Configure MCP in Kiro

Kiro supports MCP configuration at two levels:

- **Workspace level** (recommended for this project): `.kiro/settings/mcp.json`
- **User level** (global/cross-workspace): `~/.kiro/settings/mcp.json`

**Steps:**

1. Open the command palette: `Cmd + Shift + P`
2. Search for: `Kiro: Open workspace MCP config (JSON)`
3. Kiro will open/create `.kiro/settings/mcp.json`
4. Add the JIRA MCP endpoint:

```json
{
  "mcpServers": {
    "atlassian": {
      "url": "https://mcp.atlassian.com/v1/mcp/authv2"
    }
  }
}
```

Kiro reconnects the MCP server automatically after the configuration is saved.

---

## Kiro IDE

1. Install Kiro IDE
2. Install the VSX extension in Kiro
