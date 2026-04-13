"use client";

import { useState } from "react";
import { useCVStore } from "@/lib/stores/cv-store";
import { Experience } from "@/lib/types/cv";
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
} from "@dnd-kit/core";
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
  useSortable,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";

function SortableExperienceItem({
  experience,
  onEdit,
  onDelete,
}: {
  experience: Experience;
  onEdit: () => void;
  onDelete: () => void;
}) {
  const { attributes, listeners, setNodeRef, transform, transition } =
    useSortable({ id: experience.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className="bg-gray-50 rounded-lg p-4 border border-gray-200"
    >
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <div className="flex items-center gap-2">
            <button
              {...attributes}
              {...listeners}
              className="cursor-grab active:cursor-grabbing p-1 hover:bg-gray-200 rounded"
            >
              <svg
                className="w-5 h-5 text-gray-400"
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path d="M10 6a2 2 0 110-4 2 2 0 010 4zM10 12a2 2 0 110-4 2 2 0 010 4zM10 18a2 2 0 110-4 2 2 0 010 4z" />
              </svg>
            </button>
            <div>
              <h4 className="font-semibold text-gray-900">
                {experience.position}
              </h4>
              <p className="text-sm text-gray-600">{experience.company}</p>
              <p className="text-xs text-gray-500">
                {experience.startDate} -{" "}
                {experience.isCurrently ? "Sekarang" : experience.endDate}
              </p>
            </div>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={onEdit}
            className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg"
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
                d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
              />
            </svg>
          </button>
          <button
            onClick={onDelete}
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
      </div>
    </div>
  );
}

export default function ExperienceForm() {
  const {
    cvData,
    addExperience,
    updateExperience,
    removeExperience,
    reorderExperiences,
  } = useCVStore();
  const [isAdding, setIsAdding] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formData, setFormData] = useState<Partial<Experience>>({
    company: "",
    position: "",
    startDate: "",
    endDate: "",
    isCurrently: false,
    description: "",
    achievements: [""],
  });

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    }),
  );

  const handleDragEnd = (event: any) => {
    const { active, over } = event;
    if (active.id !== over.id) {
      const oldIndex = cvData.experiences.findIndex(
        (exp) => exp.id === active.id,
      );
      const newIndex = cvData.experiences.findIndex(
        (exp) => exp.id === over.id,
      );
      reorderExperiences(arrayMove(cvData.experiences, oldIndex, newIndex));
    }
  };

  const handleSubmit = () => {
    if (editingId) {
      updateExperience(editingId, formData);
      setEditingId(null);
    } else {
      addExperience({
        id: Date.now().toString(),
        ...formData,
      } as Experience);
    }
    setFormData({
      company: "",
      position: "",
      startDate: "",
      endDate: "",
      isCurrently: false,
      description: "",
      achievements: [""],
    });
    setIsAdding(false);
  };

  const handleEdit = (exp: Experience) => {
    setFormData(exp);
    setEditingId(exp.id);
    setIsAdding(true);
  };

  const handleAddAchievement = () => {
    setFormData({
      ...formData,
      achievements: [...(formData.achievements || []), ""],
    });
  };

  const handleRemoveAchievement = (index: number) => {
    const newAchievements =
      formData.achievements?.filter((_, i) => i !== index) || [];
    setFormData({ ...formData, achievements: newAchievements });
  };

  const handleAchievementChange = (index: number, value: string) => {
    const newAchievements = [...(formData.achievements || [])];
    newAchievements[index] = value;
    setFormData({ ...formData, achievements: newAchievements });
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-bold text-gray-900 mb-2">
          Pengalaman Kerja
        </h2>
        <p className="text-gray-600 text-sm">
          Tambahkan riwayat pekerjaan Anda
        </p>
      </div>

      {/* Experience List */}
      <DndContext
        sensors={sensors}
        collisionDetection={closestCenter}
        onDragEnd={handleDragEnd}
      >
        <SortableContext
          items={cvData.experiences.map((exp) => exp.id)}
          strategy={verticalListSortingStrategy}
        >
          <div className="space-y-3">
            {cvData.experiences.map((exp) => (
              <SortableExperienceItem
                key={exp.id}
                experience={exp}
                onEdit={() => handleEdit(exp)}
                onDelete={() => removeExperience(exp.id)}
              />
            ))}
          </div>
        </SortableContext>
      </DndContext>

      {/* Add/Edit Form */}
      {isAdding ? (
        <div className="bg-blue-50 rounded-lg p-6 space-y-4 border border-blue-200">
          <h3 className="font-semibold text-gray-900">
            {editingId ? "Edit Pengalaman" : "Tambah Pengalaman Baru"}
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Perusahaan
              </label>
              <input
                type="text"
                value={formData.company}
                onChange={(e) =>
                  setFormData({ ...formData, company: e.target.value })
                }
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                placeholder="PT. Example Indonesia"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Jabatan
              </label>
              <input
                type="text"
                value={formData.position}
                onChange={(e) =>
                  setFormData({ ...formData, position: e.target.value })
                }
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                placeholder="Software Engineer"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Tanggal Mulai
              </label>
              <input
                type="month"
                value={formData.startDate}
                onChange={(e) =>
                  setFormData({ ...formData, startDate: e.target.value })
                }
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Tanggal Selesai
              </label>
              <input
                type="month"
                value={formData.endDate}
                onChange={(e) =>
                  setFormData({ ...formData, endDate: e.target.value })
                }
                disabled={formData.isCurrently}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none disabled:bg-gray-100"
              />
            </div>
          </div>

          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              id="isCurrently"
              checked={formData.isCurrently}
              onChange={(e) =>
                setFormData({ ...formData, isCurrently: e.target.checked })
              }
              className="w-4 h-4 text-blue-600 rounded focus:ring-2 focus:ring-blue-500"
            />
            <label htmlFor="isCurrently" className="text-sm text-gray-700">
              Masih bekerja di sini
            </label>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Deskripsi Pekerjaan
            </label>
            <textarea
              value={formData.description}
              onChange={(e) =>
                setFormData({ ...formData, description: e.target.value })
              }
              rows={4}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
              placeholder="Jelaskan tanggung jawab dan tugas Anda..."
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Pencapaian
            </label>
            <div className="space-y-2">
              {formData.achievements?.map((achievement, index) => (
                <div key={index} className="flex items-center gap-2">
                  <input
                    type="text"
                    value={achievement}
                    onChange={(e) =>
                      handleAchievementChange(index, e.target.value)
                    }
                    className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                    placeholder="Contoh: Meningkatkan efisiensi sistem 40%"
                  />
                  <button
                    onClick={() => handleRemoveAchievement(index)}
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
                        d="M6 18L18 6M6 6l12 12"
                      />
                    </svg>
                  </button>
                </div>
              ))}
            </div>
            <button
              onClick={handleAddAchievement}
              className="mt-2 text-sm text-blue-600 hover:text-blue-700 font-medium"
            >
              + Tambah Pencapaian
            </button>
          </div>

          <div className="flex items-center gap-3 pt-4">
            <button
              onClick={handleSubmit}
              className="px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-semibold"
            >
              {editingId ? "Simpan Perubahan" : "Tambah Pengalaman"}
            </button>
            <button
              onClick={() => {
                setIsAdding(false);
                setEditingId(null);
                setFormData({
                  company: "",
                  position: "",
                  startDate: "",
                  endDate: "",
                  isCurrently: false,
                  description: "",
                  achievements: [""],
                });
              }}
              className="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg font-semibold hover:bg-gray-50"
            >
              Batal
            </button>
          </div>
        </div>
      ) : (
        <button
          onClick={() => setIsAdding(true)}
          className="w-full py-3 border-2 border-dashed border-gray-300 rounded-lg text-gray-600 hover:border-blue-500 hover:text-blue-600 font-medium transition"
        >
          + Tambah Pengalaman Kerja
        </button>
      )}
    </div>
  );
}
