import fs from "node:fs";
import path from "node:path";
import type { GameCompany } from "./game";

export function getGameCompanies(): GameCompany[] {
  const fullPath = path.join(process.cwd(), "data", "game-companies.json");
  const raw = fs.readFileSync(fullPath, "utf8");
  return JSON.parse(raw) as GameCompany[];
}
