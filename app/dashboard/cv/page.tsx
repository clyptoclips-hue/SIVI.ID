"use client";

import { useCVStore } from "@/lib/stores/cv-store";
import PersonalInfoForm from "@/components/cv/steps/PersonalInfoForm";
import ExperienceForm from "@/components/cv/steps/ExperienceForm";
import EducationForm from "@/components/cv/steps/EducationForm";
import SkillsForm from "@/components/cv/steps/SkillsForm";
import SummaryForm from "@/components/cv/steps/SummaryForm";
import CVPreview from "@/components/cv/CVPreview";

const steps = [
  { number: 1, name: "Data Diri", component: PersonalInfoForm },
  { number: 2, name: "Pengalaman", component: ExperienceForm },
  { number: 3, name: "Pendidikan", component: EducationForm },
  { number: 4, name: "Keahlian", component: SkillsForm },
  { number: 5, name: "Ringkasan", component: SummaryForm },
];

export default function CVBuilderPage() {
  const { currentStep, setCurrentStep, atsScore, isSaving, saveCv } =
    useCVStore();

  const CurrentStepComponent = steps[currentStep - 1].component;

  const getATSColor = (score: number) => {
    if (score >= 71) return "bg-green-500";
    if (score >= 41) return "bg-yellow-500";
    return "bg-red-500";
  };

  const handleNext = () => {
    if (currentStep < steps.length) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handlePrevious = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 px-6 py-4 sticky top-0 z-10">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold text-gray-900">CV Builder</h1>
          <div className="flex items-center gap-4">
            {/* ATS Score Badge */}
            <div className="flex items-center gap-2">
              <span className="text-sm text-gray-600">Skor ATS:</span>
              <div
                className={`${getATSColor(atsScore)} text-white px-4 py-2 rounded-full font-bold text-sm`}
              >
                {atsScore}/100
              </div>
            </div>
            <button
              onClick={saveCv}
              disabled={isSaving}
              className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-semibold transition disabled:opacity-50"
            >
              {isSaving ? "Menyimpan..." : "Simpan"}
            </button>
            <button className="px-4 py-2 bg-gray-900 hover:bg-gray-800 text-white rounded-lg font-semibold transition">
              Export PDF
            </button>
          </div>
        </div>

        {/* Stepper */}
        <div className="mt-6 flex items-center justify-center gap-2">
          {steps.map((step, index) => (
            <div key={step.number} className="flex items-center">
              <button
                onClick={() => setCurrentStep(step.number)}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg transition ${
                  currentStep === step.number
                    ? "bg-blue-600 text-white"
                    : currentStep > step.number
                      ? "bg-green-100 text-green-700"
                      : "bg-gray-100 text-gray-600"
                }`}
              >
                <span className="font-bold">{step.number}</span>
                <span className="text-sm font-medium">{step.name}</span>
              </button>
              {index < steps.length - 1 && (
                <svg
                  className="w-4 h-4 mx-2 text-gray-400"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path
                    fillRule="evenodd"
                    d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z"
                    clipRule="evenodd"
                  />
                </svg>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Main Content: 2 Column Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 p-6">
        {/* Left: Form Editor */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <CurrentStepComponent />

          {/* Navigation Buttons */}
          <div className="flex items-center justify-between mt-8 pt-6 border-t border-gray-200">
            <button
              onClick={handlePrevious}
              disabled={currentStep === 1}
              className="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg font-semibold hover:bg-gray-50 transition disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Sebelumnya
            </button>
            <button
              onClick={handleNext}
              disabled={currentStep === steps.length}
              className="px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-semibold transition disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {currentStep === steps.length ? "Selesai" : "Selanjutnya"}
            </button>
          </div>
        </div>

        {/* Right: CV Preview */}
        <div className="sticky top-24 h-fit">
          <CVPreview />
        </div>
      </div>
    </div>
  );
}
