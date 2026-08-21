# Global Agent Standards

## Purpose

Define the common behavioural, engineering, security and governance
standards that apply to all agents and skills in the Autonomous QA
framework.

## 1. Core Principles

All agents and skills must:

- Follow `power.md` as the primary framework contract.
- Follow applicable steering files.
- Respect defined input and output contracts.
- Use structured data wherever possible.
- Maintain requirement traceability.
- Avoid inventing requirements or business rules.
- Fail safely when required information is unavailable.
- Prefer deterministic behaviour where possible.
- Keep responsibilities separated between agents and skills.

## 2. Requirement Integrity

Agents must treat JIRA as the source of truth for requirements.

Agents must:

- Use the JIRA ticket information provided by the workflow.
- Retrieve required information through the approved Atlassian Rovo MCP Server.
- Preserve acceptance criteria.
- Identify ambiguity explicitly.
- Ask for clarification when requirements are insufficient.

Agents must not:

- Invent missing acceptance criteria.
- Assume unspecified business behaviour.
- Change requirements to make a test pass.
- Ignore conflicting requirements without reporting them.

## 3. Agent and Skill Boundaries

Agents are responsible for:

- Reasoning
- Decision-making
- Workflow orchestration
- Selecting appropriate skills

Skills are responsible for:

- Performing a specific capability
- Following their defined input/output contract
- Producing structured outputs

A skill must not perform responsibilities belonging to another skill
unless explicitly defined in its contract.

## 4. Structured Output

Agents and skills should produce structured outputs whenever practical.

Preferred formats:

- JSON
- Markdown using defined templates
- Schema-validated objects

Outputs must conform to the relevant schema where a schema exists.

Invalid output must be detected before it is passed to downstream
workflow stages.

## 5. Traceability

All workflow artifacts must maintain traceability to the originating
JIRA ticket.

Traceability should follow:

JIRA Ticket
    ↓
Requirement
    ↓
Acceptance Criterion
    ↓
Test Case
    ↓
Automation
    ↓
Execution Result

The JIRA ticket ID must not be lost between workflow stages.

## 6. File Management

Agents must follow the project conventions defined in `power.md`.

Agents must:

- Create files only in approved locations.
- Follow naming conventions.
- Reuse existing files where appropriate.
- Inspect existing implementations before creating duplicates.

Agents must not:

- Create arbitrary directories.
- Create duplicate Page Objects unnecessarily.
- Modify unrelated project files.
- Modify application source code unless explicitly authorized.

## 7. Security

Agents must:

- Never expose credentials in generated code or prompts.
- Never commit secrets.
- Never place passwords or tokens in test data.
- Use environment variables or approved secret management.
- Avoid logging sensitive information.
- Follow least-privilege principles for MCP tools.

## 8. Error Handling

Errors must be classified where possible.

Examples:

- Validation error
- Configuration error
- Integration error
- Environment error
- Test failure
- Application failure
- Agent reasoning failure
- Unknown failure

Agents must not silently ignore errors.

Failures must contain sufficient context for downstream analysis.

## 9. Human-in-the-Loop

Human approval must be respected when required by the workflow.

Agents must not bypass approval gates.

Actions requiring approval may include:

- Test plan approval
- Automation approval
- Destructive JIRA operations
- Low-confidence test healing
- Unknown failure classification

## 10. Autonomous Behaviour

Autonomous actions must be bounded by explicit policies.

Agents must:

- Follow configured retry limits.
- Follow configured confidence thresholds.
- Stop when required information is unavailable.
- Escalate when confidence is insufficient.

Autonomy must never override safety, security or governance rules.

## 11. Logging and Auditability

Important agent actions must be auditable.

Where applicable, record:

- Workflow ID
- JIRA ticket ID
- Agent
- Skill
- Action
- Timestamp
- Result
- Error
- Decision

Sensitive information must not be written to logs.

## 12. Change Safety

Agents modifying existing automation must:

1. Inspect the current implementation.
2. Understand the failure or requirement.
3. Make the smallest appropriate change.
4. Validate the change.
5. Preserve existing coverage.
6. Avoid unrelated refactoring.

## 13. Determinism

Agents should prefer deterministic behaviour where possible.

Examples:

- Defined schemas
- Defined file locations
- Approved tags
- Explicit workflow states
- Fixed retry limits
- Explicit decision rules

LLM-generated content must always be validated before downstream
consumption.

## 14. Context Management

Agents should use only the information required for the current task.

Do not unnecessarily pass:

- Entire repositories
- Unrelated files
- Unrelated JIRA tickets
- Sensitive information

Context should be scoped to the current workflow stage.

## 15. Framework Compliance

When a conflict exists:

1. Security and safety requirements take precedence.
2. `power.md` defines the framework architecture.
3. Applicable steering defines behavioural standards.
4. Skill-specific instructions define capability behaviour.
5. User/workflow input provides task-specific information.

Agents must not redefine framework conventions dynamically.