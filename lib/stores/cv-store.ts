import { create } from "zustand";
import {
  CVData,
  PersonalInfo,
  Experience,
  Education,
  Skill,
  Language,
  Certification,
} from "@/lib/types/cv";
import { calculateATSScore } from "@/lib/ats-score";

interface CVStore {
  cvData: CVData;
  currentStep: number;
  atsScore: number;
  isLoading: boolean;
  isSaving: boolean;

  // Actions
  setCurrentStep: (step: number) => void;
  updatePersonalInfo: (info: Partial<PersonalInfo>) => void;

  addExperience: (experience: Experience) => void;
  updateExperience: (id: string, experience: Partial<Experience>) => void;
  removeExperience: (id: string) => void;
  reorderExperiences: (experiences: Experience[]) => void;

  addEducation: (education: Education) => void;
  updateEducation: (id: string, education: Partial<Education>) => void;
  removeEducation: (id: string) => void;

  addSkill: (skill: Skill) => void;
  removeSkill: (id: string) => void;

  addLanguage: (language: Language) => void;
  removeLanguage: (id: string) => void;

  addCertification: (cert: Certification) => void;
  removeCertification: (id: string) => void;

  updateSummary: (summary: string) => void;
  calculateATS: () => void;
  saveCv: () => Promise<void>;
  resetCV: () => void;
}

const initialCVData: CVData = {
  personalInfo: {
    fullName: "",
    email: "",
    phone: "",
    location: "",
    linkedinUrl: "",
    githubUrl: "",
    websiteUrl: "",
    photoUrl: "",
  },
  experiences: [],
  educations: [],
  skills: [],
  languages: [],
  certifications: [],
  summary: "",
};

export const useCVStore = create<CVStore>((set, get) => ({
  cvData: initialCVData,
  currentStep: 1,
  atsScore: 0,
  isLoading: false,
  isSaving: false,

  setCurrentStep: (step) => set({ currentStep: step }),

  updatePersonalInfo: (info) => {
    set((state) => ({
      cvData: {
        ...state.cvData,
        personalInfo: { ...state.cvData.personalInfo, ...info },
      },
    }));
    get().calculateATS();
  },

  addExperience: (experience) => {
    set((state) => ({
      cvData: {
        ...state.cvData,
        experiences: [...state.cvData.experiences, experience],
      },
    }));
    get().calculateATS();
  },

  updateExperience: (id, experience) => {
    set((state) => ({
      cvData: {
        ...state.cvData,
        experiences: state.cvData.experiences.map((exp) =>
          exp.id === id ? { ...exp, ...experience } : exp,
        ),
      },
    }));
    get().calculateATS();
  },

  removeExperience: (id) => {
    set((state) => ({
      cvData: {
        ...state.cvData,
        experiences: state.cvData.experiences.filter((exp) => exp.id !== id),
      },
    }));
    get().calculateATS();
  },

  reorderExperiences: (experiences) => {
    set((state) => ({
      cvData: {
        ...state.cvData,
        experiences,
      },
    }));
  },

  addEducation: (education) => {
    set((state) => ({
      cvData: {
        ...state.cvData,
        educations: [...state.cvData.educations, education],
      },
    }));
    get().calculateATS();
  },

  updateEducation: (id, education) => {
    set((state) => ({
      cvData: {
        ...state.cvData,
        educations: state.cvData.educations.map((edu) =>
          edu.id === id ? { ...edu, ...education } : edu,
        ),
      },
    }));
    get().calculateATS();
  },

  removeEducation: (id) => {
    set((state) => ({
      cvData: {
        ...state.cvData,
        educations: state.cvData.educations.filter((edu) => edu.id !== id),
      },
    }));
    get().calculateATS();
  },

  addSkill: (skill) => {
    set((state) => ({
      cvData: {
        ...state.cvData,
        skills: [...state.cvData.skills, skill],
      },
    }));
    get().calculateATS();
  },

  removeSkill: (id) => {
    set((state) => ({
      cvData: {
        ...state.cvData,
        skills: state.cvData.skills.filter((skill) => skill.id !== id),
      },
    }));
    get().calculateATS();
  },

  addLanguage: (language) => {
    set((state) => ({
      cvData: {
        ...state.cvData,
        languages: [...state.cvData.languages, language],
      },
    }));
  },

  removeLanguage: (id) => {
    set((state) => ({
      cvData: {
        ...state.cvData,
        languages: state.cvData.languages.filter((lang) => lang.id !== id),
      },
    }));
  },

  addCertification: (cert) => {
    set((state) => ({
      cvData: {
        ...state.cvData,
        certifications: [...state.cvData.certifications, cert],
      },
    }));
  },

  removeCertification: (id) => {
    set((state) => ({
      cvData: {
        ...state.cvData,
        certifications: state.cvData.certifications.filter(
          (cert) => cert.id !== id,
        ),
      },
    }));
  },

  updateSummary: (summary) => {
    set((state) => ({
      cvData: {
        ...state.cvData,
        summary,
      },
    }));
    get().calculateATS();
  },

  calculateATS: () => {
    const { cvData } = get();
    const result = calculateATSScore(cvData);
    set({ atsScore: result.score });
  },

  saveCv: async () => {
    set({ isSaving: true });
    try {
      // TODO: Implement save to Supabase
      await new Promise((resolve) => setTimeout(resolve, 1000));
      console.log("CV saved successfully");
    } catch (error) {
      console.error("Error saving CV:", error);
    } finally {
      set({ isSaving: false });
    }
  },

  resetCV: () => {
    set({
      cvData: initialCVData,
      currentStep: 1,
      atsScore: 0,
    });
  },
}));
