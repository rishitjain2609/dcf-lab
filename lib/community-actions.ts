"use server";

import { revalidatePath } from "next/cache";
import { publishModel, type PublishModelInput } from "./community";

export async function publishModelAction(input: PublishModelInput) {
  const result = await publishModel(input);
  if ("error" in result) return result;
  revalidatePath("/community");
  revalidatePath("/game");
  revalidatePath(`/models/community/${result.id}`);
  return result;
}
