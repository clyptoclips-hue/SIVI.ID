"use client";

import { useState } from "react";
import dynamic from "next/dynamic";

// Dynamic import to avoid SSR issues
const CoverLetterForm = dynamic(
  () => import("@/components/cover-letter/CoverLetterForm"),
  {
    ssr: false,
    loading: () => (
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 animate-pulse h-96" />
    ),
  },
);

const CoverLetterPreview = dynamic(
  () => import("@/components/cover-letter/CoverLetterPreview"),
  {
    ssr: false,
    loading: () => (
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 animate-pulse h-96" />
    ),
  },
);

const CoverLetterHistory = dynamic(
  () => import("@/components/cover-letter/CoverLetterHistory"),
  {
    ssr: false,
    loading: () => (
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 animate-pulse h-48" />
    ),
  },
);

export default function CoverLetterPage() {
  const [generatedContent, setGeneratedContent] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);

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
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
          {/* Left: Input Form */}
          <div>
            <CoverLetterForm
              onGenerate={setGeneratedContent}
              isGenerating={isGenerating}
              setIsGenerating={setIsGenerating}
            />
          </div>

          {/* Right: Preview */}
          <div className="sticky top-6 h-fit">
            <CoverLetterPreview
              content={generatedContent}
              isGenerating={isGenerating}
            />
          </div>
        </div>

        {/* History Section */}
        <div className="mt-8">
          <CoverLetterHistory />
        </div>
      </div>
    </div>
  );
}
