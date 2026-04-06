"use client";

import { useEffect, useRef, useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { usersApi } from "@/lib/api/users";
import { useAuth } from "@/contexts/auth-context";
import { capitalizeName } from "@/lib/utils";
import PageHeader from "@/components/ui/page-header";

const schema = z
  .object({
    name: z.string().min(1, "Name is required"),
    email: z.string().email("Invalid email"),
    old_password: z.string().optional(),
    password: z.string().optional(),
  })
  .refine((d) => !(d.password && !d.old_password), {
    message: "Current password is required",
    path: ["old_password"],
  });

type FormData = z.infer<typeof schema>;

const inputClass = "w-full border border-slate-200 rounded-xl px-4 py-2.5 text-sm bg-white placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition";
const labelClass = "block text-sm font-medium text-slate-700 mb-1.5";

export default function ProfilePage() {
  const { user, refreshUser } = useAuth();
  const [success, setSuccess] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);

  const { register, handleSubmit, reset, formState: { errors, isSubmitting } } = useForm<FormData>({
    resolver: zodResolver(schema),
  });

  useEffect(() => {
    if (user) reset({ name: user.name, email: user.email });
  }, [user, reset]);

  async function onSubmit(data: FormData) {
    await usersApi.updateProfile(data);
    setSuccess(true);
    setTimeout(() => setSuccess(false), 3000);
  }

  async function handleAvatarChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file || !user) return;
    const formData = new FormData();
    formData.append("user_id", user.id);
    formData.append("file", file);
    await usersApi.updateAvatar(formData);
    await refreshUser();
  }

  return (
    <>
      <PageHeader title="Profile" />
      <div className="max-w-lg bg-white rounded-2xl border border-slate-200 shadow-sm p-6">
        <div className="flex items-center gap-4 mb-8 pb-6 border-b border-slate-100">
          <div
            onClick={() => fileRef.current?.click()}
            className="w-16 h-16 rounded-2xl bg-indigo-100 flex items-center justify-center text-indigo-600 font-bold text-xl cursor-pointer hover:opacity-80 transition overflow-hidden shrink-0"
          >
            {user?.avatar ? (
              <img src={`${process.env.NEXT_PUBLIC_R2_URL}/${user.avatar}`} alt="avatar" className="w-16 h-16 object-cover" />
            ) : (
              user?.name?.[0]?.toUpperCase()
            )}
          </div>
          <div>
            <p className="font-semibold text-slate-900">{user?.name ? capitalizeName(user.name) : ""}</p>
            <p className="text-sm text-slate-500">{user?.email}</p>
            <button onClick={() => fileRef.current?.click()} className="text-xs text-indigo-600 hover:text-indigo-700 font-medium mt-1">
              Change photo
            </button>
          </div>
          <input ref={fileRef} type="file" accept="image/*" className="hidden" onChange={handleAvatarChange} />
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-5">
          <div>
            <label className={labelClass}>Name</label>
            <input {...register("name")} className={inputClass} />
            {errors.name && <p className="text-red-500 text-xs mt-1.5">{errors.name.message}</p>}
          </div>
          <div>
            <label className={labelClass}>Email</label>
            <input {...register("email")} type="email" className={inputClass} />
            {errors.email && <p className="text-red-500 text-xs mt-1.5">{errors.email.message}</p>}
          </div>

          <div className="border-t border-slate-100 pt-5">
            <p className="text-sm font-medium text-slate-700 mb-4">Change password</p>
            <div className="flex flex-col gap-4">
              <div>
                <label className={labelClass}>Current password</label>
                <input {...register("old_password")} type="password" placeholder="••••••••" className={inputClass} />
                {errors.old_password && <p className="text-red-500 text-xs mt-1.5">{errors.old_password.message}</p>}
              </div>
              <div>
                <label className={labelClass}>New password</label>
                <input {...register("password")} type="password" placeholder="••••••••" className={inputClass} />
              </div>
            </div>
          </div>

          {success && (
            <div className="bg-green-50 border border-green-200 rounded-xl px-4 py-3 text-green-700 text-sm text-center">
              Profile updated successfully!
            </div>
          )}

          <button
            type="submit"
            disabled={isSubmitting}
            className="bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl py-2.5 text-sm font-semibold transition disabled:opacity-50"
          >
            {isSubmitting ? "Saving..." : "Save changes"}
          </button>
        </form>
      </div>
    </>
  );
}
