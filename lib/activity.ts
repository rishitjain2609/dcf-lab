import { sql } from "@vercel/postgres";

export interface ActivityComment {
  id: number | string;
  name: string;
  role: string | null;
  project: string;
  body: string;
  createdAt: string;
  approved: boolean;
  placeholder?: boolean;
}

/**
 * Seed placeholder comments, shown until a real database is connected and real
 * feedback is approved. TODO(Rishit): once real evaluator feedback exists in the
 * database, you can delete these by removing this array (or leave them mixed in,
 * they're clearly flagged with `placeholder: true` in the UI).
 */
export const PLACEHOLDER_COMMENTS: ActivityComment[] = [
  {
    id: "p1",
    name: "TODO(Rishit)",
    role: "e.g. a teacher, mentor, or peer reviewer",
    project: "Why DCF",
    body: "Sample placeholder: replace with what this reviewer actually said about the Why DCF page.",
    createdAt: "2026-09-20",
    approved: true,
    placeholder: true,
  },
  {
    id: "p2",
    name: "TODO(Rishit)",
    role: "e.g. a finance student",
    project: "Guide",
    body: "Sample placeholder: replace with real feedback on the step-by-step guide.",
    createdAt: "2026-09-22",
    approved: true,
    placeholder: true,
  },
  {
    id: "p3",
    name: "TODO(Rishit)",
    role: null,
    project: "Models",
    body: "Sample placeholder: replace with real feedback on the Sample Co / Demo Industries models.",
    createdAt: "2026-09-24",
    approved: true,
    placeholder: true,
  },
  {
    id: "p4",
    name: "TODO(Rishit)",
    role: "e.g. a CA / analyst you know",
    project: "Models",
    body: "Sample placeholder: replace with real feedback evaluating the assumptions or methodology.",
    createdAt: "2026-09-26",
    approved: true,
    placeholder: true,
  },
  {
    id: "p5",
    name: "TODO(Rishit)",
    role: null,
    project: "Game",
    body: "Sample placeholder: replace with real feedback on the Valuation Game quiz.",
    createdAt: "2026-09-28",
    approved: true,
    placeholder: true,
  },
  {
    id: "p6",
    name: "TODO(Rishit)",
    role: "e.g. a parent or teacher",
    project: "Why DCF",
    body: "Sample placeholder: replace with real feedback on clarity for a non-finance reader.",
    createdAt: "2026-09-30",
    approved: true,
    placeholder: true,
  },
  {
    id: "p7",
    name: "TODO(Rishit)",
    role: null,
    project: "Guide",
    body: "Sample placeholder: replace with real feedback on whether the worked examples actually helped.",
    createdAt: "2026-10-02",
    approved: true,
    placeholder: true,
  },
  {
    id: "p8",
    name: "TODO(Rishit)",
    role: "e.g. another student building their own model",
    project: "Game",
    body: "Sample placeholder: replace with real feedback comparing their implied value to the reference model.",
    createdAt: "2026-10-04",
    approved: true,
    placeholder: true,
  },
];

let schemaReady: Promise<void> | null = null;

function ensureSchema(): Promise<void> {
  if (!schemaReady) {
    schemaReady = sql`
      CREATE TABLE IF NOT EXISTS activity_comments (
        id SERIAL PRIMARY KEY,
        name TEXT NOT NULL,
        role TEXT,
        project TEXT NOT NULL,
        body TEXT NOT NULL,
        approved BOOLEAN NOT NULL DEFAULT FALSE,
        created_at TIMESTAMPTZ NOT NULL DEFAULT now()
      )
    `.then(() => undefined);
  }
  return schemaReady;
}

/** True once POSTGRES_URL (or similar) is configured, i.e. a store is connected in Vercel. */
export function hasDatabase(): boolean {
  return Boolean(process.env.POSTGRES_URL || process.env.DATABASE_URL);
}

export async function getApprovedComments(): Promise<ActivityComment[]> {
  if (!hasDatabase()) return PLACEHOLDER_COMMENTS;
  try {
    await ensureSchema();
    const { rows } = await sql`
      SELECT id, name, role, project, body, created_at
      FROM activity_comments
      WHERE approved = TRUE
      ORDER BY created_at DESC
    `;
    const real: ActivityComment[] = rows.map((r) => ({
      id: r.id,
      name: r.name,
      role: r.role,
      project: r.project,
      body: r.body,
      createdAt: new Date(r.created_at).toISOString().slice(0, 10),
      approved: true,
    }));
    return [...real, ...PLACEHOLDER_COMMENTS];
  } catch {
    return PLACEHOLDER_COMMENTS;
  }
}

export async function getPendingComments(): Promise<ActivityComment[]> {
  if (!hasDatabase()) return [];
  await ensureSchema();
  const { rows } = await sql`
    SELECT id, name, role, project, body, created_at
    FROM activity_comments
    WHERE approved = FALSE
    ORDER BY created_at DESC
  `;
  return rows.map((r) => ({
    id: r.id,
    name: r.name,
    role: r.role,
    project: r.project,
    body: r.body,
    createdAt: new Date(r.created_at).toISOString().slice(0, 10),
    approved: false,
  }));
}

export async function submitComment(input: { name: string; role?: string; project: string; body: string }) {
  if (!hasDatabase()) {
    throw new Error("Comments are temporarily unavailable: no database is connected yet.");
  }
  await ensureSchema();
  await sql`
    INSERT INTO activity_comments (name, role, project, body, approved)
    VALUES (${input.name}, ${input.role ?? null}, ${input.project}, ${input.body}, FALSE)
  `;
}

export async function approveComment(id: number): Promise<void> {
  if (!hasDatabase()) return;
  await ensureSchema();
  await sql`UPDATE activity_comments SET approved = TRUE WHERE id = ${id}`;
}

export async function rejectComment(id: number): Promise<void> {
  if (!hasDatabase()) return;
  await ensureSchema();
  await sql`DELETE FROM activity_comments WHERE id = ${id}`;
}
