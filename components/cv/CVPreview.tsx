"use client";

import { useCVStore } from "@/lib/stores/cv-store";
import { calculateATSScore } from "@/lib/ats-score";

export default function CVPreview() {
  const { cvData } = useCVStore();
  const atsResult = calculateATSScore(cvData);

  return (
    <div className="bg-white rounded-xl shadow-lg border border-gray-200 overflow-hidden">
      {/* Preview Header */}
      <div className="bg-gray-900 text-white px-4 py-3 flex items-center justify-between">
        <h3 className="font-semibold">Preview CV</h3>
        <div className="flex items-center gap-2">
          <span className="text-xs">Zoom:</span>
          <span className="text-xs bg-gray-800 px-2 py-1 rounded">70%</span>
        </div>
      </div>

      {/* CV Content - Scaled to 70% */}
      <div className="p-6 bg-gray-50 overflow-auto max-h-[800px]">
        <div
          className="bg-white shadow-sm"
          style={{
            transform: "scale(0.7)",
            transformOrigin: "top left",
            width: "142.86%",
          }}
        >
          <div className="p-12 font-sans">
            {/* Header Section */}
            <div className="border-b-2 border-gray-900 pb-6 mb-6">
              <h1 className="text-4xl font-bold text-gray-900 mb-2">
                {cvData.personalInfo.fullName || "Nama Lengkap"}
              </h1>
              <div className="flex flex-wrap gap-4 text-sm text-gray-600">
                {cvData.personalInfo.email && (
                  <span className="flex items-center gap-1">
                    <svg
                      className="w-4 h-4"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z" />
                      <path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z" />
                    </svg>
                    {cvData.personalInfo.email}
                  </span>
                )}
                {cvData.personalInfo.phone && (
                  <span className="flex items-center gap-1">
                    <svg
                      className="w-4 h-4"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path d="M2 3a1 1 0 011-1h2.153a1 1 0 01.986.836l.74 4.435a1 1 0 01-.54 1.06l-1.548.773a11.037 11.037 0 006.105 6.105l.774-1.548a1 1 0 011.059-.54l4.435.74a1 1 0 01.836.986V17a1 1 0 01-1 1h-2C7.82 18 2 12.18 2 5V3z" />
                    </svg>
                    {cvData.personalInfo.phone}
                  </span>
                )}
                {cvData.personalInfo.location && (
                  <span className="flex items-center gap-1">
                    <svg
                      className="w-4 h-4"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path
                        fillRule="evenodd"
                        d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z"
                        clipRule="evenodd"
                      />
                    </svg>
                    {cvData.personalInfo.location}
                  </span>
                )}
              </div>
              <div className="flex flex-wrap gap-3 mt-2 text-sm text-blue-600">
                {cvData.personalInfo.linkedinUrl && (
                  <a
                    href={cvData.personalInfo.linkedinUrl}
                    className="hover:underline"
                  >
                    LinkedIn
                  </a>
                )}
                {cvData.personalInfo.githubUrl && (
                  <a
                    href={cvData.personalInfo.githubUrl}
                    className="hover:underline"
                  >
                    GitHub
                  </a>
                )}
                {cvData.personalInfo.websiteUrl && (
                  <a
                    href={cvData.personalInfo.websiteUrl}
                    className="hover:underline"
                  >
                    Website
                  </a>
                )}
              </div>
            </div>

            {/* Summary Section */}
            {cvData.summary && (
              <div className="mb-6">
                <h2 className="text-xl font-bold text-gray-900 mb-3 uppercase tracking-wide">
                  Ringkasan Profesional
                </h2>
                <p className="text-gray-700 leading-relaxed">
                  {cvData.summary}
                </p>
              </div>
            )}

            {/* Experience Section */}
            {cvData.experiences.length > 0 && (
              <div className="mb-6">
                <h2 className="text-xl font-bold text-gray-900 mb-3 uppercase tracking-wide">
                  Pengalaman Kerja
                </h2>
                <div className="space-y-4">
                  {cvData.experiences.map((exp) => (
                    <div key={exp.id}>
                      <div className="flex justify-between items-start mb-1">
                        <div>
                          <h3 className="font-bold text-gray-900">
                            {exp.position}
                          </h3>
                          <p className="text-gray-700">{exp.company}</p>
                        </div>
                        <span className="text-sm text-gray-600 whitespace-nowrap">
                          {exp.startDate} -{" "}
                          {exp.isCurrently ? "Sekarang" : exp.endDate}
                        </span>
                      </div>
                      {exp.description && (
                        <p className="text-gray-700 text-sm mb-2">
                          {exp.description}
                        </p>
                      )}
                      {exp.achievements &&
                        exp.achievements.length > 0 &&
                        exp.achievements[0] && (
                          <ul className="list-disc list-inside text-sm text-gray-700 space-y-1">
                            {exp.achievements
                              .filter((a) => a)
                              .map((achievement, idx) => (
                                <li key={idx}>{achievement}</li>
                              ))}
                          </ul>
                        )}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Education Section */}
            {cvData.educations.length > 0 && (
              <div className="mb-6">
                <h2 className="text-xl font-bold text-gray-900 mb-3 uppercase tracking-wide">
                  Pendidikan
                </h2>
                <div className="space-y-3">
                  {cvData.educations.map((edu) => (
                    <div key={edu.id}>
                      <div className="flex justify-between items-start">
                        <div>
                          <h3 className="font-bold text-gray-900">
                            {edu.degree} - {edu.field}
                          </h3>
                          <p className="text-gray-700">{edu.institution}</p>
                        </div>
                        <span className="text-sm text-gray-600 whitespace-nowrap">
                          {edu.startDate} - {edu.endDate}
                        </span>
                      </div>
                      {edu.gpa && (
                        <p className="text-sm text-gray-600">IPK: {edu.gpa}</p>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Skills Section */}
            {cvData.skills.length > 0 && (
              <div className="mb-6">
                <h2 className="text-xl font-bold text-gray-900 mb-3 uppercase tracking-wide">
                  Keahlian
                </h2>
                <div className="flex flex-wrap gap-2">
                  {cvData.skills.map((skill) => (
                    <span
                      key={skill.id}
                      className="px-3 py-1 bg-gray-200 text-gray-800 text-sm rounded"
                    >
                      {skill.name}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Languages Section */}
            {cvData.languages.length > 0 && (
              <div className="mb-6">
                <h2 className="text-xl font-bold text-gray-900 mb-3 uppercase tracking-wide">
                  Bahasa
                </h2>
                <div className="space-y-1">
                  {cvData.languages.map((lang) => (
                    <p key={lang.id} className="text-gray-700">
                      <span className="font-semibold">{lang.name}</span> -{" "}
                      {lang.level}
                    </p>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* ATS Feedback */}
      <div className="border-t border-gray-200 p-4 bg-gray-50">
        <h4 className="font-semibold text-gray-900 mb-2">Feedback ATS:</h4>
        <div className="space-y-1 text-sm">
          {atsResult.suggestions.length > 0 ? (
            atsResult.suggestions.map((suggestion, idx) => (
              <p key={idx} className="text-orange-600">
                ⚠️ {suggestion}
              </p>
            ))
          ) : (
            <p className="text-green-600">✓ CV Anda sudah optimal untuk ATS!</p>
          )}
        </div>
      </div>
    </div>
  );
}
