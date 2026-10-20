import { createClient as createServerSupabase } from "./supabase/server";
import { hasSupabase } from "./supabase/env";
import type { GameAssumptions } from "./game";

export interface PublishedModel {
  id: string;
  ownerId: string;
  ownerUsername: string | null;
  companySlug: string;
  status: "draft" | "published";
  visibility: "public" | "unlisted" | "private";
  source: "builder" | "upload";
  thesis: string | null;
  assumptions: GameAssumptions | null;
  impliedPrice: number | null;
  marketPriceAtPublish: number | null;
  forkedFromId: string | null;
  createdAt: string;
  updatedAt: string;
}

function mapRow(row: Record<string, unknown>): PublishedModel {
  const profile = row.profiles as { username?: string } | null;
  return {
    id: row.id as string,
    ownerId: row.owner_id as string,
    ownerUsername: profile?.username ?? null,
    companySlug: row.company_slug as string,
    status: row.status as "draft" | "published",
    visibility: row.visibility as "public" | "unlisted" | "private",
    source: row.source as "builder" | "upload",
    thesis: (row.thesis as string | null) ?? null,
    assumptions: (row.assumptions as GameAssumptions | null) ?? null,
    impliedPrice: (row.implied_price as number | null) ?? null,
    marketPriceAtPublish: (row.market_price_at_publish as number | null) ?? null,
    forkedFromId: (row.forked_from_id as string | null) ?? null,
    createdAt: row.created_at as string,
    updatedAt: row.updated_at as string,
  };
}

export interface PublishModelInput {
  companySlug: string;
  thesis: string;
  visibility: "public" | "unlisted" | "private";
  assumptions: GameAssumptions;
  impliedPrice: number;
  marketPriceAtPublish: number;
  forkedFromId?: string;
}

export async function publishModel(input: PublishModelInput): Promise<{ id: string } | { error: string }> {
  if (!hasSupabase()) return { error: "Publishing isn't connected to a database yet." };
  const supabase = await createServerSupabase();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return { error: "You need to sign in first." };

  const { data, error } = await supabase
    .from("models")
    .insert({
      owner_id: user.id,
      company_slug: input.companySlug,
      status: "published",
      visibility: input.visibility,
      source: "builder",
      thesis: input.thesis,
      assumptions: input.assumptions,
      implied_price: input.impliedPrice,
      market_price_at_publish: input.marketPriceAtPublish,
      forked_from_id: input.forkedFromId ?? null,
    })
    .select("id")
    .single();

  if (error || !data) return { error: error?.message ?? "Couldn't publish. Try again." };

  await supabase.from("model_versions").insert({
    model_id: data.id,
    version_number: 1,
    assumptions: input.assumptions,
    thesis: input.thesis,
  });

  await supabase.from("activity_events").insert({
    actor_id: user.id,
    type: input.forkedFromId ? "forked" : "published",
    model_id: data.id,
    visible_publicly: input.visibility === "public",
  });

  return { id: data.id as string };
}

export async function getPublishedModelsForCompany(companySlug: string): Promise<PublishedModel[]> {
  if (!hasSupabase()) return [];
  const supabase = await createServerSupabase();
  const { data, error } = await supabase
    .from("models")
    .select("*, profiles(username)")
    .eq("company_slug", companySlug)
    .eq("status", "published")
    .eq("visibility", "public")
    .order("created_at", { ascending: false });
  if (error || !data) return [];
  return data.map(mapRow);
}

export async function getRecentPublishedModels(limit = 6): Promise<PublishedModel[]> {
  if (!hasSupabase()) return [];
  const supabase = await createServerSupabase();
  const { data, error } = await supabase
    .from("models")
    .select("*, profiles(username)")
    .eq("status", "published")
    .eq("visibility", "public")
    .order("created_at", { ascending: false })
    .limit(limit);
  if (error || !data) return [];
  return data.map(mapRow);
}

export async function getModel(id: string): Promise<PublishedModel | null> {
  if (!hasSupabase()) return null;
  const supabase = await createServerSupabase();
  const { data, error } = await supabase.from("models").select("*, profiles(username)").eq("id", id).maybeSingle();
  if (error || !data) return null;
  return mapRow(data);
}

export async function getCommunityCountForCompany(companySlug: string): Promise<number> {
  if (!hasSupabase()) return 0;
  const supabase = await createServerSupabase();
  const { count } = await supabase
    .from("models")
    .select("id", { count: "exact", head: true })
    .eq("company_slug", companySlug)
    .eq("status", "published")
    .eq("visibility", "public");
  return count ?? 0;
}
