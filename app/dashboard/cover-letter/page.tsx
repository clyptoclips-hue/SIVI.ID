"use client";

import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { createClient } from "@/lib/supabase/client";
import { useRouter } from "next/navigation";

// Schema
const coverLetterSchema = z.object({
  companyName: z.string().min(2, "Nama perusahaan minimal 2 karakter"),
  jobTitle: z.string().min(2, "Posisi minimal 2 karakter"),
  jobDescription: z.string().min(50, "Deskripsi pekerjaan minimal 50 karakter"),
  tone: z.enum(["profesional", "ramah", "antusias", "formal"]),
  language: z.enum(["id", "en"]),
  length: z.enum(["pendek", "sedang", "panjang"]),
});

type CoverLetterFormData = z.infer<typeof coverLetterSchema>;

export default function CoverLetterPage() {
  const [generatedContent, setGeneratedContent] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);
  const [editedContent, setEditedContent] = useState("");
  const [isEditing, setIsEditing] = useState(false);
  const [showCopySuccess, setShowCopySuccess] = useState(false);
  const router = useRouter();

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

  useEffect(() => {
    setEditedContent(generatedContent);
  }, [generatedContent]);

  const onSubmit = async (data: CoverLetterFormData) => {
    setIsGenerating(true);
    setGeneratedContent("");

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
          setGeneratedContent(fullContent);
        }
      }
    } catch (error) {
      console.error("Error generating cover letter:", error);
      setGeneratedContent(
        "Terjadi kesalahan saat generate cover letter. Silakan coba lagi.",
      );
    } finally {
      setIsGenerating(false);
    }
  };

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(editedContent);
      setShowCopySuccess(true);
      setTimeout(() => setShowCopySuccess(false), 2000);
    } catch (error) {
      console.error("Failed to copy:", error);
    }
  };

  const handleExportTxt = () => {
    const blob = new Blob([editedContent], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `cover-letter-${Date.now()}.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 px-6 py-4 mb-6">
        <h1 className="text-2xl font-bold text-gray-900">
          Generate Cover Letter dengan AI
        </h1>
        <p className="text-gray-600 text-sm mt-1">
          Buat cover letter profesional dalam hitungan detik dengan bantuan AI
        </p>
      </div>

      {/* Main Content: 2 Column Layout */}
      <div className="px-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Left: Input Form */}
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
                      Posisi yang Dilamar{" "}
                      <span className="text-red-500">*</span>
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
                      Deskripsi Pekerjaan{" "}
                      <span className="text-red-500">*</span>
                    </label>
                    <textarea
                      {...register("jobDescription")}
                      rows={6}
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
                <h2 className="text-lg font-bold text-gray-900 mb-4">
                  Preferensi
                </h2>

                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Tone
                    </label>
                    <div className="grid grid-cols-2 gap-2">
                      {["profesional", "ramah", "antusias", "formal"].map(
                        (tone) => (
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
                        ),
                      )}
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

          {/* Right: Preview */}
          <div className="sticky top-6 h-fit">
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
              <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-6 py-4">
                <h3 className="font-semibold text-lg">Preview Cover Letter</h3>
                <p className="text-sm text-blue-100 mt-1">
                  {isGenerating
                    ? "Generating..."
                    : generatedContent
                      ? "Edit atau simpan cover letter Anda"
                      : "Hasil akan muncul di sini"}
                </p>
              </div>

              <div className="p-6">
                {!generatedContent && !isGenerating && (
                  <div className="text-center py-12">
                    <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                      <svg
                        className="w-10 h-10 text-gray-400"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                        />
                      </svg>
                    </div>
                    <p className="text-gray-500">
                      Isi form dan klik "Generate dengan AI"
                    </p>
                  </div>
                )}

                {isGenerating && !generatedContent && (
                  <div className="flex items-center justify-center py-12">
                    <div className="text-center">
                      <svg
                        className="animate-spin h-12 w-12 text-blue-600 mx-auto mb-4"
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
                      <p className="text-gray-600 font-medium">
                        AI sedang menulis cover letter Anda...
                      </p>
                    </div>
                  </div>
                )}

                {generatedContent && (
                  <>
                    {isEditing ? (
                      <textarea
                        value={editedContent}
                        onChange={(e) => setEditedContent(e.target.value)}
                        rows={20}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none font-mono text-sm"
                      />
                    ) : (
                      <div className="prose prose-sm max-w-none">
                        <div className="whitespace-pre-wrap text-gray-800 leading-relaxed">
                          {editedContent}
                          {isGenerating && (
                            <span className="inline-block w-2 h-4 bg-blue-600 animate-pulse ml-1" />
                          )}
                        </div>
                      </div>
                    )}

                    {!isGenerating && (
                      <div className="mt-6 pt-6 border-t border-gray-200 flex flex-wrap gap-3">
                        <button
                          onClick={() => setIsEditing(!isEditing)}
                          className="px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg font-medium transition"
                        >
                          {isEditing ? "👁️ Preview" : "✏️ Edit"}
                        </button>

                        <button
                          onClick={handleCopy}
                          className="px-4 py-2 bg-blue-100 hover:bg-blue-200 text-blue-700 rounded-lg font-medium transition relative"
                        >
                          📋 Copy
                          {showCopySuccess && (
                            <span className="absolute -top-8 left-1/2 transform -translate-x-1/2 bg-green-600 text-white text-xs px-2 py-1 rounded">
                              Copied!
                            </span>
                          )}
                        </button>

                        <button
                          onClick={handleExportTxt}
                          className="px-4 py-2 bg-purple-100 hover:bg-purple-200 text-purple-700 rounded-lg font-medium transition"
                        >
                          📄 Export TXT
                        </button>
                      </div>
                    )}
                  </>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
