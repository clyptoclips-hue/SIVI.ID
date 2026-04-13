import { CVData, ATSResult } from "@/lib/types/cv";

export function calculateATSScore(cvData: CVData): ATSResult {
  let score = 0;
  const feedback: string[] = [];
  const suggestions: string[] = [];

  // Data Diri lengkap: 20 poin (5 poin per field)
  const { personalInfo } = cvData;
  if (personalInfo.fullName) {
    score += 5;
    feedback.push("✓ Nama lengkap tersedia");
  } else {
    suggestions.push("Tambahkan nama lengkap");
  }

  if (personalInfo.email) {
    score += 5;
    feedback.push("✓ Email tersedia");
  } else {
    suggestions.push("Tambahkan email");
  }

  if (personalInfo.phone) {
    score += 5;
    feedback.push("✓ Nomor telepon tersedia");
  } else {
    suggestions.push("Tambahkan nomor telepon");
  }

  if (personalInfo.location) {
    score += 5;
    feedback.push("✓ Lokasi tersedia");
  } else {
    suggestions.push("Tambahkan lokasi/kota");
  }

  // Min 1 pengalaman kerja: 30 poin
  if (cvData.experiences.length > 0) {
    score += 30;
    feedback.push(`✓ ${cvData.experiences.length} pengalaman kerja`);
  } else {
    suggestions.push("Tambahkan minimal 1 pengalaman kerja");
  }

  // Min 1 pendidikan: 20 poin
  if (cvData.educations.length > 0) {
    score += 20;
    feedback.push(`✓ ${cvData.educations.length} riwayat pendidikan`);
  } else {
    suggestions.push("Tambahkan minimal 1 riwayat pendidikan");
  }

  // Min 3 skills: 20 poin
  if (cvData.skills.length >= 3) {
    score += 20;
    feedback.push(`✓ ${cvData.skills.length} keahlian`);
  } else if (cvData.skills.length > 0) {
    score += Math.floor((cvData.skills.length / 3) * 20);
    suggestions.push(
      `Tambahkan ${3 - cvData.skills.length} keahlian lagi (minimal 3)`,
    );
  } else {
    suggestions.push("Tambahkan minimal 3 keahlian");
  }

  // Ada summary/ringkasan: 10 poin
  if (cvData.summary && cvData.summary.length > 50) {
    score += 10;
    feedback.push("✓ Ringkasan profesional tersedia");
  } else {
    suggestions.push("Tambahkan ringkasan profesional (minimal 50 karakter)");
  }

  // Determine color
  let color: "red" | "yellow" | "green" = "red";
  if (score >= 71) {
    color = "green";
  } else if (score >= 41) {
    color = "yellow";
  }

  return {
    score,
    feedback,
    suggestions,
    color,
  };
}
