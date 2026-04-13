"use client";

import { useEffect, useState } from "react";
import { getCoverLetters, deleteCoverLetter } from "@/lib/actions/cover-letter";

interface CoverLetter {
  id: string;
  company_name: string;
  role_name: string;
  content_id: string | null;
  content_en: string | null;
  tone: string;
  created_at: string;
}

export default function CoverLetterHistory() {
  const [coverLetters, setCoverLetters] = useState<CoverLetter[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedLetter, setSelectedLetter] = useState<CoverLetter | null>(
    null,
  );

  useEffect(() => {
    loadCoverLetters();
  }, []);

  const loadCoverLetters = async () => {
    setIsLoading(true);
    try {
      const data = await getCoverLetters();
      setCoverLetters(data as CoverLetter[]);
    } catch (error) {
      console.error("Error loading cover letters:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Yakin ingin menghapus cover letter ini?")) return;

    try {
      await deleteCoverLetter(id);
      await loadCoverLetters();
    } catch (error) {
      console.error("Error deleting cover letter:", error);
      alert("Gagal menghapus cover letter");
    }
  };

  const getPreview = (letter: CoverLetter) => {
    const content = letter.content_id || letter.content_en || "";
    return content.slice(0, 150) + (content.length > 150 ? "..." : "");
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat("id-ID", {
      day: "numeric",
      month: "long",
      year: "numeric",
    }).format(date);
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-xl font-bold text-gray-900">
            Riwayat Cover Letter
          </h2>
          <p className="text-sm text-gray-600 mt-1">
            Cover letter yang pernah Anda buat
          </p>
        </div>
        <span className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm font-medium">
          {coverLetters.length} Cover Letter
        </span>
      </div>

      {isLoading ? (
        <div className="text-center py-12">
          <svg
            className="animate-spin h-8 w-8 text-blue-600 mx-auto mb-2"
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
          <p className="text-gray-600">Memuat riwayat...</p>
        </div>
      ) : coverLetters.length === 0 ? (
        <div className="text-center py-12">
          <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg
              className="w-8 h-8 text-gray-400"
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
          <p className="text-gray-500">Belum ada cover letter yang disimpan</p>
        </div>
      ) : (
        <div className="space-y-3">
          {coverLetters.map((letter) => (
            <div
              key={letter.id}
              className="border border-gray-200 rounded-lg p-4 hover:border-blue-300 transition"
            >
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <h3 className="font-semibold text-gray-900">
                      {letter.company_name}
                    </h3>
                    <span className="px-2 py-0.5 bg-gray-100 text-gray-600 text-xs rounded">
                      {letter.role_name}
                    </span>
                  </div>
                  <p className="text-sm text-gray-600 mb-2">
                    {getPreview(letter)}
                  </p>
                  <div className="flex items-center gap-3 text-xs text-gray-500">
                    <span>📅 {formatDate(letter.created_at)}</span>
                    <span>•</span>
                    <span className="capitalize">{letter.tone}</span>
                  </div>
                </div>
                <div className="flex items-center gap-2 ml-4">
                  <button
                    onClick={() => setSelectedLetter(letter)}
                    className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition"
                    title="Lihat"
                  >
                    <svg
                      className="w-5 h-5"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                      />
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                      />
                    </svg>
                  </button>
                  <button
                    onClick={() => handleDelete(letter.id)}
                    className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition"
                    title="Hapus"
                  >
                    <svg
                      className="w-5 h-5"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                      />
                    </svg>
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Modal untuk view detail */}
      {selectedLetter && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl max-w-3xl w-full max-h-[80vh] overflow-hidden">
            <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-6 py-4 flex items-center justify-between">
              <div>
                <h3 className="font-semibold text-lg">
                  {selectedLetter.company_name}
                </h3>
                <p className="text-sm text-blue-100">
                  {selectedLetter.role_name}
                </p>
              </div>
              <button
                onClick={() => setSelectedLetter(null)}
                className="p-2 hover:bg-white/20 rounded-lg transition"
              >
                <svg
                  className="w-6 h-6"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </button>
            </div>
            <div className="p-6 overflow-auto max-h-[calc(80vh-80px)]">
              <div className="prose prose-sm max-w-none">
                <div className="whitespace-pre-wrap text-gray-800 leading-relaxed">
                  {selectedLetter.content_id || selectedLetter.content_en}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
