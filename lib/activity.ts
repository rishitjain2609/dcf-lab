import { sql } from "@vercel/postgres";

export interface ActivityComment {
  id: number | string;
  name: string;
  role: string | null;
  project: string;
  body: string;
  createdAt: string;
  approved: boolean;
}

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
  if (!hasDatabase()) return [];
  try {
    await ensureSchema();
    const { rows } = await sql`
      SELECT id, name, role, project, body, created_at
      FROM activity_comments
      WHERE approved = TRUE
      ORDER BY created_at DESC
    `;
    return rows.map((r) => ({
      id: r.id,
      name: r.name,
      role: r.role,
      project: r.project,
      body: r.body,
      createdAt: new Date(r.created_at).toISOString().slice(0, 10),
      approved: true,
    }));
  } catch {
    return [];
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
