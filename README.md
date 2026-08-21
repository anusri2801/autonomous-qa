power.md defines what exists and the overall contract like agents, capability of each agent(skills) , steering files which define instructions , behaviour of each capability, sequential workflow, mcp servers used, project conventions etc.

The skill defines what the capability does(purpose), input and output
The steering defines how that capability must behave.

1. Install Playwright
2. Create kiro folders
3. Create skills files which define capabilty of each agent (purpose, workflow, what agent should do)
4. Create steering files which define the rules and how each capability must behave

**Repo**:
1. Created Global-standards.md and test-planning-standards.md file(steering)
2. Create test-planner.md file(skills)
3. Create test-plan-validator.md file(skills)


**Atlassian JIRA Link**
https://testjiraanu.atlassian.net/jira/software/projects/SCRUM/boards/1?filter=&groupBy=none

**JIRA site:**
https://testjiraanu.atlassian.net

**JIRA project:**
SCRUM

**Test ticket:**
SCRUM-2

The recommended approach is OAuth authentication. Atlassian's current Rovo MCP endpoint is:
https://mcp.atlassian.com/v1/mcp/authv2

Atlassian specifically recommends this endpoint; the older /v1/sse endpoint is no longer supported after June 30, 2026

**Atlassian Token Name**
AI Agentic Workflow

**Atlassian API Key**
ATATT3xFfGF0uO_8gbio2bJEAlVwobz0umCNoIwg1-MtndTp4U4CGUrKCk2kP2cSQ9Ss2FibsmOXQgS14wUnjeV1u51GULIXDqzx2GBYGFRZBMozuG6lRaLE5ETXTV-ZSzTknh_Gs-OL45O88Nnt34NDwvxv1gs8uj0tXkUjRKIO1grE68OiYME=5594E5E9

**Kiro**
1. Install Kiro IDE
2. Install VSX extension in Kiro

**power.md** => The entry point steering file - an onboarding manual which tells what overall framework and high level architecture, what agents are available, what's their purpose, skills or capabilities of each agent, steering files , MCP servers etc

**Kiro supports MCP configuration at the project level**:
.kiro/settings/mcp.json

It also supports **user-level configuration**:
~/.kiro/settings/mcp.json

For our project, I recommend the **workspace-level configuration** because we want this Jira connection associated with this particular framework:

Open the command palette in VSC: Cmd + Shift + P
Search for: Kiro: Open workspace MCP config (JSON)
Kiro will open/create: .kiro/settings/mcp.json

Now, in mcp.json file, **add JIRA MCP endpoint details**:
{
  "mcpServers": {
    "atlassian": {
      "url": "https://mcp.atlassian.com/v1/mcp/authv2"
    }
  }
}
Kiro should reconnect the MCP server automatically after the configuration is saved.
