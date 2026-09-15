import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

export type ArtifactType = "markdown" | "json" | "file";

export interface ArtifactRequest {
  type: ArtifactType;
  relativePath: string;
}

export interface ArtifactValidationResult {
  valid: boolean;
  ticketKey: string;
  checked: string[];
  errors: string[];
  warnings: string[];
}

export class ArtifactValidator {
  private readonly projectRoot: string;

  constructor(projectRoot: string) {
    this.projectRoot = path.resolve(projectRoot);
  }

  public validate(ticketKey: string, artifacts: ArtifactRequest[]): ArtifactValidationResult {
    const result: ArtifactValidationResult = {
      valid: true,
      ticketKey,
      checked: [],
      errors: [],
      warnings: [],
    };

    for (const artifact of artifacts) {
      const relativePath = artifact.relativePath.trim();

      if (!relativePath) {
        result.errors.push("Artifact path cannot be empty.");
        continue;
      }

      try {
        const absolutePath = this.resolveSafePath(relativePath);
        result.checked.push(relativePath);

        if (!fs.existsSync(absolutePath)) {
          result.errors.push(`Missing artifact: ${relativePath}`);
          continue;
        }

        const stat = fs.statSync(absolutePath);
        if (!stat.isFile()) {
          result.errors.push(`Artifact is not a file: ${relativePath}`);
          continue;
        }

        if (stat.size === 0) {
          result.errors.push(`Artifact is empty: ${relativePath}`);
          continue;
        }

        if (artifact.type === "markdown") {
          this.validateMarkdown(absolutePath, relativePath, ticketKey, result);
        } else if (artifact.type === "json") {
          this.validateJson(absolutePath, relativePath, ticketKey, result);
        }
      } catch (error) {
        result.errors.push(error instanceof Error ? error.message : String(error));
      }
    }

    result.valid = result.errors.length === 0;
    return result;
  }

  private resolveSafePath(relativePath: string): string {
    const absolutePath = path.resolve(this.projectRoot, relativePath);
    const relativeToRoot = path.relative(this.projectRoot, absolutePath);

    if (relativeToRoot.startsWith("..") || path.isAbsolute(relativeToRoot)) {
      throw new Error(`Artifact path is outside project root: ${relativePath}`);
    }

    return absolutePath;
  }

  private validateMarkdown(
    absolutePath: string,
    relativePath: string,
    ticketKey: string,
    result: ArtifactValidationResult,
  ): void {
    const content = fs.readFileSync(absolutePath, "utf8");

    if (!content.trim()) {
      result.errors.push(`Markdown artifact is empty: ${relativePath}`);
      return;
    }

    if (relativePath.startsWith("testplan/") && !content.includes("TC-")) {
      result.errors.push(
        `Test plan does not contain a test-case identifier (TC-): ${relativePath}`,
      );
    }

    if (!path.basename(relativePath).toLowerCase().includes(ticketKey.toLowerCase())) {
      result.warnings.push(
        `Artifact filename does not contain ticket key ${ticketKey}: ${relativePath}`,
      );
    }
  }

  private validateJson(
    absolutePath: string,
    relativePath: string,
    ticketKey: string,
    result: ArtifactValidationResult,
  ): void {
    const content = fs.readFileSync(absolutePath, "utf8");

    let parsed: unknown;
    try {
      parsed = JSON.parse(content);
    } catch {
      result.errors.push(`Invalid JSON artifact: ${relativePath}`);
      return;
    }

    if (typeof parsed === "object" && parsed !== null && "ticketKey" in parsed) {
      const artifactTicketKey = (parsed as { ticketKey?: unknown }).ticketKey;
      if (typeof artifactTicketKey === "string" && artifactTicketKey !== ticketKey) {
        result.errors.push(
          `Ticket key mismatch in ${relativePath}: expected ${ticketKey}, found ${artifactTicketKey}`,
        );
      }
    }
  }
}

function parseArtifact(value: string): ArtifactRequest {
  const separatorIndex = value.indexOf(":");
  if (separatorIndex === -1) {
    throw new Error(
      `Invalid artifact format "${value}". Expected type:path, for example markdown:testplan/SCRUM-2-login.md`,
    );
  }

  const type = value.slice(0, separatorIndex) as ArtifactType;
  const relativePath = value.slice(separatorIndex + 1);

  if (!["markdown", "json", "file"].includes(type)) {
    throw new Error(`Unsupported artifact type "${type}". Use markdown, json, or file.`);
  }

  return { type, relativePath };
}

function main(): void {
  const args = process.argv.slice(2);
  let projectRoot = ".";
  let ticketKey = "";
  const artifacts: ArtifactRequest[] = [];

  for (let index = 0; index < args.length; index += 1) {
    const argument = args[index];

    if (argument === "--project-root") {
      projectRoot = args[++index] ?? ".";
    } else if (argument === "--ticket-key") {
      ticketKey = args[++index] ?? "";
    } else if (argument === "--artifact") {
      const value = args[++index];
      if (!value) throw new Error("--artifact requires a value.");
      artifacts.push(parseArtifact(value));
    } else if (argument === "--help") {
      console.log(`
Usage:
  npx tsx orchestrator/runner/artifact-validator.ts \\
    --project-root . \\
    --ticket-key SCRUM-2 \\
    --artifact markdown:testplan/SCRUM-2-login.md
`);
      return;
    }
  }

  if (!ticketKey) throw new Error("--ticket-key is required.");
  if (artifacts.length === 0) throw new Error("At least one --artifact is required.");

  const validator = new ArtifactValidator(projectRoot);
  const result = validator.validate(ticketKey, artifacts);

  console.log(JSON.stringify(result, null, 2));
  if (!result.valid) process.exitCode = 1;
}

const currentFile = fileURLToPath(import.meta.url);

if (process.argv[1] === currentFile) {
    main();
}
