import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

interface StageState {
  status?: string;
  startedAt?: string | null;
  completedAt?: string | null;
  artifacts?: string[];
  error?: string | null;
  message?: string | null;
}

interface OrchestrationState {
  schemaVersion?: string;
  runId: string;
  ticketKey: string;
  shortName?: string;
  status: string;
  currentStage?: string;
  nextAction?: string;
  createdAt?: string;
  updatedAt?: string;
  stages?: Record<string, StageState>;
  history?: Array<{
    timestamp?: string;
    event?: string;
    stage?: string;
    message?: string;
    details?: string;
  }>;
}

export class ReportGenerator {
  public generateFromStateFile(
    stateFilePath: string,
    outputFilePath?: string,
  ): string {
    const state = this.loadState(stateFilePath);
    const resolvedOutput =
      outputFilePath ??
      path.join(
        path.dirname(path.resolve(stateFilePath)),
        "orchestration-report.md",
      );

    const report = this.generateReport(state);
    fs.mkdirSync(path.dirname(resolvedOutput), { recursive: true });
    fs.writeFileSync(resolvedOutput, report, "utf8");
    return resolvedOutput;
  }

  public generateReport(state: OrchestrationState): string {
    const lines: string[] = [
      `# Orchestration Report — ${state.ticketKey}`,
      "",
      `**Overall Status:** \`${state.status}\``,
      `**Run ID:** \`${state.runId}\``,
      `**Current Stage:** \`${state.currentStage ?? "N/A"}\``,
      `**Next Action:** ${state.nextAction ?? "None"}`,
      "",
      "## Run Information",
      "",
      `- **Ticket:** \`${state.ticketKey}\``,
      `- **Short Name:** \`${state.shortName ?? "N/A"}\``,
      `- **Schema Version:** \`${state.schemaVersion ?? "N/A"}\``,
      `- **Created:** ${state.createdAt ?? "N/A"}`,
      `- **Last Updated:** ${state.updatedAt ?? "N/A"}`,
      "",
      "## Stage Summary",
      "",
      "| Stage | Status | Started | Completed |",
      "|---|---|---|---|",
    ];

    for (const [stageName, stage] of Object.entries(state.stages ?? {})) {
      lines.push(
        `| \`${stageName}\` | \`${stage.status ?? "UNKNOWN"}\` | ` +
          `${stage.startedAt ?? "-"} | ${stage.completedAt ?? "-"} |`,
      );
    }

    lines.push("", "## Stage Details", "");

    for (const [stageName, stage] of Object.entries(state.stages ?? {})) {
      lines.push(`### ${stageName}`, "");
      lines.push(`- **Status:** \`${stage.status ?? "UNKNOWN"}\``);
      if (stage.startedAt) lines.push(`- **Started:** ${stage.startedAt}`);
      if (stage.completedAt) lines.push(`- **Completed:** ${stage.completedAt}`);
      if (stage.message) lines.push(`- **Message:** ${stage.message}`);
      if (stage.error) lines.push(`- **Error:** ${stage.error}`);

      if (stage.artifacts && stage.artifacts.length > 0) {
        lines.push("- **Artifacts:**");
        for (const artifact of stage.artifacts) {
          lines.push(`  - \`${artifact}\``);
        }
      }
      lines.push("");
    }

    const history = state.history ?? [];
    if (history.length > 0) {
      lines.push(
        "## Execution History",
        "",
        "| Time | Event | Stage | Details |",
        "|---|---|---|---|",
      );

      for (const event of history) {
        lines.push(
          `| ${event.timestamp ?? "-"} | ${event.event ?? "-"} | ` +
            `${event.stage ?? "-"} | ${event.message ?? event.details ?? ""} |`,
        );
      }
      lines.push("");
    }

    lines.push(
      "## Generated",
      "",
      `Report generated at ${new Date().toISOString()}.`,
      "",
    );

    return lines.join("\n");
  }

  private loadState(stateFilePath: string): OrchestrationState {
    const resolvedPath = path.resolve(stateFilePath);
    if (!fs.existsSync(resolvedPath)) {
      throw new Error(`State file not found: ${resolvedPath}`);
    }

    const content = fs.readFileSync(resolvedPath, "utf8");
    let state: unknown;
    try {
      state = JSON.parse(content);
    } catch (error) {
      throw new Error(
        `Invalid JSON in state file: ${
          error instanceof Error ? error.message : String(error)
        }`,
      );
    }

    if (!this.isValidState(state)) {
      throw new Error(
        "State file is missing required fields: runId, ticketKey, or status.",
      );
    }
    return state;
  }

  private isValidState(value: unknown): value is OrchestrationState {
    if (typeof value !== "object" || value === null) return false;
    const state = value as Record<string, unknown>;
    return (
      typeof state.runId === "string" &&
      typeof state.ticketKey === "string" &&
      typeof state.status === "string"
    );
  }
}

function main(): void {
  const args = process.argv.slice(2);
  let stateFile = "";
  let outputFile: string | undefined;

  for (let index = 0; index < args.length; index += 1) {
    const argument = args[index];
    if (argument === "--state") stateFile = args[++index] ?? "";
    else if (argument === "--output") outputFile = args[++index];
    else if (argument === "--help") {
      console.log(`
Usage:
  npx tsx orchestrator/runner/report-generator.ts \\
    --state orchestration/SCRUM-2-login/execution-state.json

Options:
  --state <path>    Path to execution-state.json
  --output <path>   Optional output path
  --help            Show this help
`);
      return;
    }
  }

  if (!stateFile) throw new Error("--state is required.");

  const generator = new ReportGenerator();
  const outputPath = generator.generateFromStateFile(stateFile, outputFile);
  console.log(`Report generated: ${outputPath}`);
}

const currentFile = fileURLToPath(import.meta.url);
if (process.argv[1] === currentFile) {
  main();
}
