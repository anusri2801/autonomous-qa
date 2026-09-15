#!/usr/bin/env node
/// <reference types="node" />

/**
 * Persistent orchestration state manager.
 *
 * Standard Node.js modules only. No external packages required.
 */

import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import process from 'node:process';
import { fileURLToPath } from 'node:url';

export type StageStatus =
  | 'PENDING'
  | 'IN_PROGRESS'
  | 'COMPLETED'
  | 'FAILED'
  | 'BLOCKED'
  | 'SKIPPED';

export interface StageState {
  status: StageStatus;
  startedAt: string | null;
  completedAt: string | null;
  artifacts: string[];
  error: string | null;
}

export interface OrchestrationState {
  schemaVersion: string;
  runId: string;
  ticketKey: string;
  shortName: string;
  status: 'IN_PROGRESS' | 'COMPLETED' | 'FAILED' | 'BLOCKED' | 'WAITING_FOR_APPROVAL';
  currentStage: string;
  nextAction: string;
  createdAt: string;
  updatedAt: string;
  stages: Record<string, StageState>;
  history: Array<{
    timestamp: string;
    event: string;
    stage?: string;
    message?: string;
  }>;
}

const STAGES = [
  'testPlanner',
  'testPlanValidator',
  'jiraUpdater',
  'automateUI',
  'testRunner',
  'healTest',
  'defectManager',
];

function nowUtc(): string {
  return new Date().toISOString();
}

function makeRunId(ticketKey: string, shortName: string): string {
  const timestamp = nowUtc()
    .replace(/[-:]/g, '')
    .replace(/\.\d{3}Z$/, 'Z');
  const random = crypto.randomBytes(3).toString('hex');
  return `${ticketKey}-${shortName}-${timestamp}-${random}`;
}

function createEmptyStage(): StageState {
  return {
    status: 'PENDING',
    startedAt: null,
    completedAt: null,
    artifacts: [],
    error: null,
  };
}

function atomicWriteJson(filePath: string, data: unknown): void {
  const directory = path.dirname(filePath);
  fs.mkdirSync(directory, { recursive: true });

  const tempPath = `${filePath}.${process.pid}.tmp`;
  fs.writeFileSync(tempPath, `${JSON.stringify(data, null, 2)}\n`, 'utf8');
  fs.renameSync(tempPath, filePath);
}

export class StateManager {
  private readonly projectRoot: string;
  private readonly ticketKey: string;
  private readonly shortName: string;
  readonly runId: string;
  readonly runDirectory: string;
  readonly statePath: string;

  constructor(
    projectRoot: string,
    ticketKey: string,
    shortName: string,
    runId?: string,
  ) {
    this.projectRoot = path.resolve(projectRoot);
    this.ticketKey = ticketKey;
    this.shortName = shortName;
    this.runId = runId ?? makeRunId(ticketKey, shortName);

    this.runDirectory = path.join(
      this.projectRoot,
      'orchestration',
      `${ticketKey}-${shortName}`,
    );
    this.statePath = path.join(this.runDirectory, 'execution-state.json');
  }

  createInitialState(): OrchestrationState {
    if (fs.existsSync(this.statePath)) {
      const existing = this.readState();

      if (existing.ticketKey !== this.ticketKey) {
        throw new Error(
          `Existing state belongs to ${existing.ticketKey}, not ${this.ticketKey}.`,
        );
      }

      return existing;
    }

    const timestamp = nowUtc();
    const stages: Record<string, StageState> = {};
    for (const stage of STAGES) {
      stages[stage] = createEmptyStage();
    }

    const state: OrchestrationState = {
      schemaVersion: '1.1',
      runId: this.runId,
      ticketKey: this.ticketKey,
      shortName: this.shortName,
      status: 'IN_PROGRESS',
      currentStage: 'testPlanner',
      nextAction: 'Run test planner',
      createdAt: timestamp,
      updatedAt: timestamp,
      stages,
      history: [
        {
          timestamp,
          event: 'RUN_CREATED',
          message: `Orchestration run ${this.runId} created.`,
        },
      ],
    };

    this.writeState(state);
    return state;
  }

  readState(): OrchestrationState {
    if (!fs.existsSync(this.statePath)) {
      throw new Error(`State file not found: ${this.statePath}`);
    }

    const raw = fs.readFileSync(this.statePath, 'utf8');
    const state = JSON.parse(raw) as OrchestrationState;

    if (state.ticketKey !== this.ticketKey) {
      throw new Error(
        `State ticket mismatch. Expected ${this.ticketKey}, found ${state.ticketKey}.`,
      );
    }

    return state;
  }

  updateStage(
    stage: string,
    status: StageStatus,
    options: {
      artifacts?: string[];
      error?: string | null;
      message?: string;
    } = {},
  ): OrchestrationState {
    const state = this.readState();
    const stageState = state.stages[stage] ?? createEmptyStage();
    const timestamp = nowUtc();

    stageState.status = status;

    if (status === 'IN_PROGRESS' && !stageState.startedAt) {
      stageState.startedAt = timestamp;
    }

    if (['COMPLETED', 'FAILED', 'BLOCKED', 'SKIPPED'].includes(status)) {
      stageState.completedAt = timestamp;
    }

    if (options.artifacts) {
      stageState.artifacts = options.artifacts;
    }

    if (options.error !== undefined) {
      stageState.error = options.error;
    }

    state.stages[stage] = stageState;
    state.updatedAt = timestamp;
    state.currentStage = stage;

    state.history.push({
      timestamp,
      event: `STAGE_${status}`,
      stage,
      message: options.message,
    });

    this.writeState(state);
    return state;
  }

  setRouting(
    currentStage: string,
    nextAction: string,
  ): OrchestrationState {
    const state = this.readState();
    const timestamp = nowUtc();

    state.currentStage = currentStage;
    state.nextAction = nextAction;
    state.updatedAt = timestamp;

    state.history.push({
      timestamp,
      event: 'ROUTING_UPDATED',
      stage: currentStage,
      message: nextAction,
    });

    this.writeState(state);
    return state;
  }

  setTerminal(
    status: 'COMPLETED' | 'FAILED' | 'BLOCKED' | 'WAITING_FOR_APPROVAL',
    message: string,
  ): OrchestrationState {
    const state = this.readState();
    const timestamp = nowUtc();

    state.status = status;
    state.nextAction = message;
    state.updatedAt = timestamp;

    state.history.push({
      timestamp,
      event: `RUN_${status}`,
      message,
    });

    this.writeState(state);
    return state;
  }

  private writeState(state: OrchestrationState): void {
    atomicWriteJson(this.statePath, state);
  }
}

function parseArgs(): Record<string, string> {
  const args = process.argv.slice(2);
  const result: Record<string, string> = {};

  for (let i = 0; i < args.length; i += 1) {
    if (args[i].startsWith('--')) {
      const key = args[i].slice(2);
      const value = args[i + 1];
      if (!value || value.startsWith('--')) {
        throw new Error(`Missing value for --${key}`);
      }
      result[key] = value;
      i += 1;
    }
  }

  return result;
}

if (process.argv[1] && path.resolve(process.argv[1]) === path.resolve(fileURLToPath(import.meta.url))) {
  const args = parseArgs();

  const projectRoot = args['project-root'] ?? '.';
  const ticketKey = args['ticket-key'];
  const shortName = args['short-name'];

  if (!ticketKey || !shortName) {
    console.error(
      'Usage: npx tsx orchestrator/runner/state-manager.ts --project-root . --ticket-key SCRUM-2 --short-name login',
    );
    process.exit(1);
  }

  const manager = new StateManager(projectRoot, ticketKey, shortName);
  const state = manager.createInitialState();

  console.log(`State created/loaded: ${manager.statePath}`);
  console.log(`Run ID: ${state.runId}`);
  console.log(`Created: ${state.createdAt}`);
  console.log(`Updated: ${state.updatedAt}`);
}
