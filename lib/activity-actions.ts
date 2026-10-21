"use server";

import { revalidatePath } from "next/cache";
import { approveComment, rejectComment, submitComment } from "./activity";

export async function submitCommentAction(formData: FormData): Promise<{ error?: string; ok?: boolean }> {
  const name = String(formData.get("name") ?? "").trim();
  const role = String(formData.get("role") ?? "").trim();
  const project = String(formData.get("project") ?? "").trim();
  const body = String(formData.get("body") ?? "").trim();

  // Hidden field people never see; bots that fill every input get dropped quietly.
  if (String(formData.get("website") ?? "").trim()) {
    return { ok: true };
  }

  if (!name || !project || !body) {
    return { error: "Please add your name, pick a page, and write a comment." };
  }
  if (body.length > 2000) {
    return { error: "That comment is too long." };
  }

  try {
    await submitComment({ name, role: role || undefined, project, body });
  } catch {
    return { error: "Your comment couldn't be saved. Please try again in a minute." };
  }

  revalidatePath("/activity");
  revalidatePath("/activity/review");
  return { ok: true };
}

function checkSecret(key: string): boolean {
  const secret = process.env.REVIEW_SECRET;
  return Boolean(secret) && key === secret;
}

export async function approveCommentAction(formData: FormData): Promise<void> {
  const key = String(formData.get("key") ?? "");
  const id = Number(formData.get("id"));
  if (!checkSecret(key) || !Number.isFinite(id)) return;
  await approveComment(id);
  revalidatePath("/activity");
  revalidatePath("/activity/review");
}

export async function rejectCommentAction(formData: FormData): Promise<void> {
  const key = String(formData.get("key") ?? "");
  const id = Number(formData.get("id"));
  if (!checkSecret(key) || !Number.isFinite(id)) return;
  await rejectComment(id);
  revalidatePath("/activity");
  revalidatePath("/activity/review");
}
