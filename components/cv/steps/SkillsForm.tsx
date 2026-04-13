"use client";

import { useState } from "react";
import { useCVStore } from "@/lib/stores/cv-store";
import { Skill, Language } from "@/lib/types/cv";

const skillLevels = [
  { value: "pemula", label: "Pemula", color: "bg-gray-100 text-gray-700" },
  { value: "menengah", label: "Menengah", color: "bg-blue-100 text-blue-700" },
  { value: "mahir", label: "Mahir", color: "bg-green-100 text-green-700" },
  { value: "ahli", label: "Ahli", color: "bg-purple-100 text-purple-700" },
];

export default function SkillsForm() {
  const { cvData, addSkill, removeSkill, addLanguage, removeLanguage } =
    useCVStore();
  const [skillName, setSkillName] = useState("");
  const [skillLevel, setSkillLevel] = useState<
    "pemula" | "menengah" | "mahir" | "ahli"
  >("menengah");
  const [languageName, setLanguageName] = useState("");
  const [languageLevel, setLanguageLevel] = useState("");

  const handleAddSkill = () => {
    if (skillName.trim()) {
      addSkill({
        id: Date.now().toString(),
        name: skillName,
        level: skillLevel,
      });
      setSkillName("");
      setSkillLevel("menengah");
    }
  };

  const handleAddLanguage = () => {
    if (languageName.trim() && languageLevel.trim()) {
      addLanguage({
        id: Date.now().toString(),
        name: languageName,
        level: languageLevel,
      });
      setLanguageName("");
      setLanguageLevel("");
    }
  };

  const getLevelColor = (level: string) => {
    const found = skillLevels.find((l) => l.value === level);
    return found?.color || "bg-gray-100 text-gray-700";
  };

  return (
    <div className="space-y-8">
      {/* Skills Section */}
      <div>
        <h2 className="text-xl font-bold text-gray-900 mb-2">Keahlian</h2>
        <p className="text-gray-600 text-sm mb-4">
          Tambahkan keahlian teknis dan soft skills Anda
        </p>

        {/* Add Skill Form */}
        <div className="bg-blue-50 rounded-lg p-4 border border-blue-200 mb-4">
          <div className="flex flex-col md:flex-row gap-3">
            <input
              type="text"
              value={skillName}
              onChange={(e) => setSkillName(e.target.value)}
              onKeyPress={(e) => e.key === "Enter" && handleAddSkill()}
              className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
              placeholder="Contoh: JavaScript, Leadership, Problem Solving"
            />
            <select
              value={skillLevel}
              onChange={(e) => setSkillLevel(e.target.value as any)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
            >
              {skillLevels.map((level) => (
                <option key={level.value} value={level.value}>
                  {level.label}
                </option>
              ))}
            </select>
            <button
              onClick={handleAddSkill}
              className="px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-semibold whitespace-nowrap"
            >
              + Tambah
            </button>
          </div>
        </div>

        {/* Skills List */}
        <div className="flex flex-wrap gap-2">
          {cvData.skills.map((skill) => (
            <div
              key={skill.id}
              className={`${getLevelColor(skill.level)} px-4 py-2 rounded-full flex items-center gap-2 font-medium text-sm`}
            >
              <span>{skill.name}</span>
              <span className="text-xs opacity-75">
                ({skillLevels.find((l) => l.value === skill.level)?.label})
              </span>
              <button
                onClick={() => removeSkill(skill.id)}
                className="ml-1 hover:opacity-70"
              >
                <svg
                  className="w-4 h-4"
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
          ))}
        </div>

        {cvData.skills.length === 0 && (
          <p className="text-gray-500 text-sm text-center py-8">
            Belum ada keahlian. Tambahkan minimal 3 keahlian untuk meningkatkan
            skor ATS.
          </p>
        )}
      </div>

      {/* Languages Section */}
      <div>
        <h2 className="text-xl font-bold text-gray-900 mb-2">Bahasa</h2>
        <p className="text-gray-600 text-sm mb-4">
          Tambahkan bahasa yang Anda kuasai
        </p>

        {/* Add Language Form */}
        <div className="bg-green-50 rounded-lg p-4 border border-green-200 mb-4">
          <div className="flex flex-col md:flex-row gap-3">
            <input
              type="text"
              value={languageName}
              onChange={(e) => setLanguageName(e.target.value)}
              onKeyPress={(e) => e.key === "Enter" && handleAddLanguage()}
              className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 outline-none"
              placeholder="Contoh: Bahasa Indonesia, English"
            />
            <input
              type="text"
              value={languageLevel}
              onChange={(e) => setLanguageLevel(e.target.value)}
              onKeyPress={(e) => e.key === "Enter" && handleAddLanguage()}
              className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 outline-none"
              placeholder="Contoh: Native, Fluent, Intermediate"
            />
            <button
              onClick={handleAddLanguage}
              className="px-6 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg font-semibold whitespace-nowrap"
            >
              + Tambah
            </button>
          </div>
        </div>

        {/* Languages List */}
        <div className="space-y-2">
          {cvData.languages.map((lang) => (
            <div
              key={lang.id}
              className="bg-gray-50 rounded-lg p-3 border border-gray-200 flex items-center justify-between"
            >
              <div>
                <span className="font-medium text-gray-900">{lang.name}</span>
                <span className="text-sm text-gray-600 ml-2">
                  • {lang.level}
                </span>
              </div>
              <button
                onClick={() => removeLanguage(lang.id)}
                className="p-2 text-red-600 hover:bg-red-50 rounded-lg"
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
          ))}
        </div>

        {cvData.languages.length === 0 && (
          <p className="text-gray-500 text-sm text-center py-8">
            Belum ada bahasa. Tambahkan bahasa yang Anda kuasai.
          </p>
        )}
      </div>
    </div>
  );
}
