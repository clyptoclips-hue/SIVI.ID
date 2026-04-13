"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useCVStore } from "@/lib/stores/cv-store";
import { useEffect } from "react";

const personalInfoSchema = z.object({
  fullName: z.string().min(3, "Nama lengkap minimal 3 karakter"),
  email: z.string().email("Email tidak valid"),
  phone: z.string().min(10, "Nomor telepon minimal 10 digit"),
  location: z.string().min(3, "Lokasi minimal 3 karakter"),
  linkedinUrl: z
    .string()
    .url("URL LinkedIn tidak valid")
    .optional()
    .or(z.literal("")),
  githubUrl: z
    .string()
    .url("URL GitHub tidak valid")
    .optional()
    .or(z.literal("")),
  websiteUrl: z
    .string()
    .url("URL Website tidak valid")
    .optional()
    .or(z.literal("")),
  photoUrl: z.string().optional(),
});

type PersonalInfoFormData = z.infer<typeof personalInfoSchema>;

export default function PersonalInfoForm() {
  const { cvData, updatePersonalInfo } = useCVStore();

  const {
    register,
    watch,
    formState: { errors },
  } = useForm<PersonalInfoFormData>({
    resolver: zodResolver(personalInfoSchema),
    defaultValues: cvData.personalInfo,
    mode: "onChange",
  });

  // Auto-save on change
  useEffect(() => {
    const subscription = watch((value) => {
      updatePersonalInfo(value as Partial<PersonalInfoFormData>);
    });
    return () => subscription.unsubscribe();
  }, [watch, updatePersonalInfo]);

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-bold text-gray-900 mb-2">Data Diri</h2>
        <p className="text-gray-600 text-sm">Lengkapi informasi pribadi Anda</p>
      </div>

      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Nama Lengkap <span className="text-red-500">*</span>
          </label>
          <input
            {...register("fullName")}
            type="text"
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
            placeholder="John Doe"
          />
          {errors.fullName && (
            <p className="mt-1 text-sm text-red-600">
              {errors.fullName.message}
            </p>
          )}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Email <span className="text-red-500">*</span>
            </label>
            <input
              {...register("email")}
              type="email"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
              placeholder="john@example.com"
            />
            {errors.email && (
              <p className="mt-1 text-sm text-red-600">
                {errors.email.message}
              </p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              No. HP <span className="text-red-500">*</span>
            </label>
            <input
              {...register("phone")}
              type="tel"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
              placeholder="+62 812 3456 7890"
            />
            {errors.phone && (
              <p className="mt-1 text-sm text-red-600">
                {errors.phone.message}
              </p>
            )}
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Kota/Lokasi <span className="text-red-500">*</span>
          </label>
          <input
            {...register("location")}
            type="text"
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
            placeholder="Jakarta, Indonesia"
          />
          {errors.location && (
            <p className="mt-1 text-sm text-red-600">
              {errors.location.message}
            </p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            LinkedIn URL
          </label>
          <input
            {...register("linkedinUrl")}
            type="url"
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
            placeholder="https://linkedin.com/in/johndoe"
          />
          {errors.linkedinUrl && (
            <p className="mt-1 text-sm text-red-600">
              {errors.linkedinUrl.message}
            </p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            GitHub URL
          </label>
          <input
            {...register("githubUrl")}
            type="url"
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
            placeholder="https://github.com/johndoe"
          />
          {errors.githubUrl && (
            <p className="mt-1 text-sm text-red-600">
              {errors.githubUrl.message}
            </p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Website/Portfolio URL
          </label>
          <input
            {...register("websiteUrl")}
            type="url"
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
            placeholder="https://johndoe.com"
          />
          {errors.websiteUrl && (
            <p className="mt-1 text-sm text-red-600">
              {errors.websiteUrl.message}
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
