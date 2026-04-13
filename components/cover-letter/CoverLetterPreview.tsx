"use client";

import { useState, useEffect } from "react";
import { saveCoverLetter } from "@/lib/actions/cover-letter";
import { useRouter } from "next/navigation";

interface CoverLetterPreviewProps {
  content: string;
  isGenerating: boolean;
}

export default function CoverLetterPreview({
  content,
  isGenerating,
}: CoverLetterPreviewProps) {
  const [editedContent, setEditedContent] = useState("");
  const [isEditing, setIsEditing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [showCopySuccess, setShowCopySuccess] = useState(false);
  const router = useRouter();

  useEffect(() => {
    setEditedContent(content);
  }, [content]);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(editedContent);
      setShowCopySuccess(true);
      setTimeout(() => setShowCopySuccess(false), 2000);
    } catch (error) {
      console.error("Failed to copy:", error);
    }
  };

  const handleSave = async () => {
    if (!editedContent.trim()) return;

    setIsSaving(true);
    try {
      await saveCoverLetter({
        content: editedContent,
        companyName: "Unknown", // TODO: Pass from form
        jobTitle: "Unknown", // TODO: Pass from form
      });
      alert("Cover letter berhasil disimpan!");
      router.refresh();
    } catch (error) {
      console.error("Error saving cover letter:", error);
      alert("Gagal menyimpan cover letter");
    } finally {
      setIsSaving(false);
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
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-6 py-4">
        <h3 className="font-semibold text-lg">Preview Cover Letter</h3>
        <p className="text-sm text-blue-100 mt-1">
          {isGenerating
            ? "Generating..."
            : content
              ? "Edit atau simpan cover letter Anda"
              : "Hasil akan muncul di sini"}
        </p>
      </div>

      {/* Content */}
      <div className="p-6">
        {!content && !isGenerating && (
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

        {isGenerating && !content && (
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

        {content && (
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

            {/* Action Buttons */}
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
                  onClick={handleSave}
                  disabled={isSaving}
                  className="px-4 py-2 bg-green-100 hover:bg-green-200 text-green-700 rounded-lg font-medium transition disabled:opacity-50"
                >
                  {isSaving ? "Menyimpan..." : "💾 Simpan"}
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
  );
}
