"use server";

import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";

export async function saveCoverLetter(data: {
  content: string;
  companyName: string;
  jobTitle: string;
  tone?: string;
  language?: string;
}) {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    throw new Error("User not authenticated");
  }

  const { error } = await supabase.from("cover_letters").insert({
    user_id: user.id,
    company_name: data.companyName,
    role_name: data.jobTitle,
    content_id: data.language === "id" ? data.content : null,
    content_en: data.language === "en" ? data.content : null,
    tone: data.tone || "profesional",
  });

  if (error) {
    console.error("Error saving cover letter:", error);
    throw new Error("Failed to save cover letter");
  }

  revalidatePath("/dashboard/cover-letter");
  return { success: true };
}

export async function getCoverLetters() {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return [];
  }

  const { data, error } = await supabase
    .from("cover_letters")
    .select("*")
    .eq("user_id", user.id)
    .order("created_at", { ascending: false });

  if (error) {
    console.error("Error fetching cover letters:", error);
    return [];
  }

  return data || [];
}

export async function deleteCoverLetter(id: string) {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    throw new Error("User not authenticated");
  }

  const { error } = await supabase
    .from("cover_letters")
    .delete()
    .eq("id", id)
    .eq("user_id", user.id);

  if (error) {
    console.error("Error deleting cover letter:", error);
    throw new Error("Failed to delete cover letter");
  }

  revalidatePath("/dashboard/cover-letter");
  return { success: true };
}
