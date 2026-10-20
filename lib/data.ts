import fs from "node:fs";
import path from "node:path";

const DATA_DIR = path.join(process.cwd(), "data");

export interface ModelAssumption {
  label: string;
  value: string;
}

export interface ModelVersion {
  version: string;
  date: string;
  changelog: string;
}

export interface Model {
  slug: string;
  company: string;
  ticker: string;
  currency: "INR" | "USD";
  /** True for fictional/reserved entries whose summary is still a TODO note, not real research. */
  placeholder: boolean;
  sector: string;
  publishDate: string;
  summary: string;
  assumptions: ModelAssumption[];
  impliedValuePerShare: number;
  priceAtPublish: number;
  latestPrice: number;
  dilutedShares: number;
  netDebt: number;
  excelUrl: string | null;
  valuePickrUrl: string | null;
  substackUrl: string | null;
  versions: ModelVersion[];
}

function readJsonFile<T>(relativePath: string): T {
  const fullPath = path.join(DATA_DIR, relativePath);
  const raw = fs.readFileSync(fullPath, "utf8");
  return JSON.parse(raw) as T;
}

export function getModels(): Model[] {
  return readJsonFile<Model[]>("models.json");
}

export function getModel(slug: string): Model | undefined {
  return getModels().find((m) => m.slug === slug);
}
