"use client";

import { useCVStore } from "@/lib/stores/cv-store";

export default function SummaryForm() {
  const { cvData, updateSummary } = useCVStore();

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-bold text-gray-900 mb-2">
          Ringkasan Profesional
        </h2>
        <p className="text-gray-600 text-sm">
          Tulis ringkasan singkat tentang diri Anda dan tujuan karir
        </p>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Ringkasan (minimal 50 karakter)
        </label>
        <textarea
          value={cvData.summary}
          onChange={(e) => updateSummary(e.target.value)}
          rows={8}
          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
          placeholder="Contoh: Software Engineer berpengalaman 5+ tahun dalam pengembangan aplikasi web dan mobile. Ahli dalam JavaScript, React, dan Node.js. Memiliki track record dalam memimpin tim dan menyelesaikan proyek kompleks tepat waktu. Passionate dalam teknologi terbaru dan continuous learning."
        />
        <div className="mt-2 flex items-center justify-between">
          <p className="text-sm text-gray-500">
            {cvData.summary.length} karakter
            {cvData.summary.length < 50 && ` (minimal 50 karakter)`}
          </p>
          {cvData.summary.length >= 50 && (
            <span className="text-sm text-green-600 font-medium">
              ✓ Ringkasan sudah cukup
            </span>
          )}
        </div>
      </div>

      <div className="bg-blue-50 rounded-lg p-4 border border-blue-200">
        <h3 className="font-semibold text-gray-900 mb-2">
          💡 Tips Menulis Ringkasan:
        </h3>
        <ul className="text-sm text-gray-700 space-y-1 list-disc list-inside">
          <li>Mulai dengan posisi/profesi Anda saat ini</li>
          <li>Sebutkan pengalaman kerja (berapa tahun)</li>
          <li>Highlight keahlian utama Anda (3-5 skills)</li>
          <li>Tambahkan pencapaian atau value proposition</li>
          <li>Tutup dengan tujuan karir atau passion Anda</li>
        </ul>
      </div>
    </div>
  );
}
