"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";

const coverLetterSchema = z.object({
  companyName: z.string().min(2, "Nama perusahaan minimal 2 karakter"),
  jobTitle: z.string().min(2, "Posisi minimal 2 karakter"),
  jobDescription: z.string().min(50, "Deskripsi pekerjaan minimal 50 karakter"),
  cvId: z.string().optional(),
  tone: z.enum(["profesional", "ramah", "antusias", "formal"]),
  language: z.enum(["id", "en"]),
  length: z.enum(["pendek", "sedang", "panjang"]),
});

type CoverLetterFormData = z.infer<typeof coverLetterSchema>;

interface CoverLetterFormProps {
  onGenerate: (content: string) => void;
  isGenerating: boolean;
  setIsGenerating: (value: boolean) => void;
}

export default function CoverLetterForm({
  onGenerate,
  isGenerating,
  setIsGenerating,
}: CoverLetterFormProps) {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<CoverLetterFormData>({
    resolver: zodResolver(coverLetterSchema),
    defaultValues: {
      tone: "profesional",
      language: "id",
      length: "sedang",
    },
  });

  const onSubmit = async (data: CoverLetterFormData) => {
    setIsGenerating(true);
    onGenerate(""); // Clear previous content

    try {
      const response = await fetch("/api/cover-letter/generate", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        throw new Error("Failed to generate cover letter");
      }

      const reader = response.body?.getReader();
      const decoder = new TextDecoder();
      let fullContent = "";

      if (reader) {
        while (true) {
          const { done, value } = await reader.read();
          if (done) break;

          const chunk = decoder.decode(value);
          fullContent += chunk;
          onGenerate(fullContent);
        }
      }
    } catch (error) {
      console.error("Error generating cover letter:", error);
      onGenerate(
        "Terjadi kesalahan saat generate cover letter. Silakan coba lagi.",
      );
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        <div>
          <h2 className="text-lg font-bold text-gray-900 mb-4">
            Informasi Pekerjaan
          </h2>

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Nama Perusahaan <span className="text-red-500">*</span>
              </label>
              <input
                {...register("companyName")}
                type="text"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                placeholder="PT. Example Indonesia"
              />
              {errors.companyName && (
                <p className="mt-1 text-sm text-red-600">
                  {errors.companyName.message}
                </p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Posisi yang Dilamar <span className="text-red-500">*</span>
              </label>
              <input
                {...register("jobTitle")}
                type="text"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                placeholder="Software Engineer"
              />
              {errors.jobTitle && (
                <p className="mt-1 text-sm text-red-600">
                  {errors.jobTitle.message}
                </p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Deskripsi Pekerjaan <span className="text-red-500">*</span>
              </label>
              <textarea
                {...register("jobDescription")}
                rows={8}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                placeholder="Paste deskripsi pekerjaan dari job listing di sini..."
              />
              {errors.jobDescription && (
                <p className="mt-1 text-sm text-red-600">
                  {errors.jobDescription.message}
                </p>
              )}
            </div>
          </div>
        </div>

        <div className="border-t border-gray-200 pt-6">
          <h2 className="text-lg font-bold text-gray-900 mb-4">Preferensi</h2>

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Tone
              </label>
              <div className="grid grid-cols-2 gap-2">
                {["profesional", "ramah", "antusias", "formal"].map((tone) => (
                  <label
                    key={tone}
                    className="flex items-center gap-2 p-3 border border-gray-300 rounded-lg cursor-pointer hover:bg-gray-50"
                  >
                    <input
                      {...register("tone")}
                      type="radio"
                      value={tone}
                      className="w-4 h-4 text-blue-600"
                    />
                    <span className="text-sm capitalize">{tone}</span>
                  </label>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Bahasa
              </label>
              <div className="grid grid-cols-2 gap-2">
                <label className="flex items-center gap-2 p-3 border border-gray-300 rounded-lg cursor-pointer hover:bg-gray-50">
                  <input
                    {...register("language")}
                    type="radio"
                    value="id"
                    className="w-4 h-4 text-blue-600"
                  />
                  <span className="text-sm">🇮🇩 Indonesia</span>
                </label>
                <label className="flex items-center gap-2 p-3 border border-gray-300 rounded-lg cursor-pointer hover:bg-gray-50">
                  <input
                    {...register("language")}
                    type="radio"
                    value="en"
                    className="w-4 h-4 text-blue-600"
                  />
                  <span className="text-sm">🇬🇧 English</span>
                </label>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Panjang
              </label>
              <div className="grid grid-cols-3 gap-2">
                {["pendek", "sedang", "panjang"].map((length) => (
                  <label
                    key={length}
                    className="flex items-center gap-2 p-3 border border-gray-300 rounded-lg cursor-pointer hover:bg-gray-50"
                  >
                    <input
                      {...register("length")}
                      type="radio"
                      value={length}
                      className="w-4 h-4 text-blue-600"
                    />
                    <span className="text-sm capitalize">{length}</span>
                  </label>
                ))}
              </div>
            </div>
          </div>
        </div>

        <button
          type="submit"
          disabled={isGenerating}
          className="w-full py-3 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-semibold rounded-lg transition disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
        >
          {isGenerating ? (
            <>
              <svg
                className="animate-spin h-5 w-5"
                fill="none"
                viewBox="0 0 24 24"
              >
                <circle
                  className="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="4"
                />
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                />
              </svg>
              Generating...
            </>
          ) : (
            <>
              <span>✨</span>
              Generate dengan AI
            </>
          )}
        </button>
      </form>
    </div>
  );
}
