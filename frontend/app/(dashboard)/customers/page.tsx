"use client";

import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { customersApi } from "@/lib/api/customers";
import { formatDate } from "@/lib/utils";
import { capitalizeName } from "@/lib/utils";
import type { Customer } from "@/types/customer";
import PageHeader from "@/components/ui/page-header";
import Table from "@/components/ui/table";
import Pagination from "@/components/ui/pagination";
import Modal from "@/components/ui/modal";

const schema = z.object({
  name: z.string().min(1, "Name is required"),
  email: z.string().email("Invalid email"),
});

type FormData = z.infer<typeof schema>;

export default function CustomersPage() {
  const [data, setData] = useState<{ items: Customer[]; last_page: number } | null>(null);
  const [page, setPage] = useState(1);
  const [filter, setFilter] = useState("");
  const [modalOpen, setModalOpen] = useState(false);

  const { register, handleSubmit, reset, setError, formState: { errors, isSubmitting } } = useForm<FormData>({
    resolver: zodResolver(schema),
  });

  async function load() {
    const res = await customersApi.list({ page, filter: filter || undefined });
    setData(res);
  }

  useEffect(() => { load(); }, [page, filter]);

  function openCreate() {
    reset({ name: "", email: "" });
    setModalOpen(true);
  }

  async function onSubmit(formData: FormData) {
    try {
      await customersApi.create(formData);
      setModalOpen(false);
      load();
    } catch (err: any) {
      const message = err.response?.data?.message ?? "Failed to create customer";
      setError("email", { message });
    }
  }

  const columns = [
    { key: "name", label: "Name", render: (c: Customer) => capitalizeName(c.name) },
    { key: "email", label: "Email" },
    {
      key: "created_at", label: "Created at",
      render: (c: Customer) => formatDate(c.created_at),
    },
  ];

  return (
    <>
      <PageHeader
        title="Customers"
        action={
          <button onClick={openCreate} className="bg-indigo-600 text-white px-4 py-2.5 rounded-xl text-sm font-semibold hover:bg-indigo-700 transition">
            + New customer
          </button>
        }
      />
      <div className="mb-4">
        <input
          placeholder="Search customer..."
          value={filter}
          onChange={(e) => { setFilter(e.target.value); setPage(1); }}
          className="border border-slate-200 rounded-xl px-4 py-2.5 text-sm w-72 bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition"
        />
      </div>
      <Table columns={columns} data={data?.items ?? []} keyExtractor={(c) => c.id} />
      <Pagination current={page} last={data?.last_page ?? 1} onChange={setPage} />

      <Modal open={modalOpen} onClose={() => setModalOpen(false)} title="New customer">
        <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1.5">Name</label>
            <input {...register("name")} className="w-full border border-slate-200 rounded-xl px-4 py-2.5 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition" />
            {errors.name && <p className="text-red-500 text-xs mt-1.5">{errors.name.message}</p>}
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1.5">Email</label>
            <input {...register("email")} type="email" className="w-full border border-slate-200 rounded-xl px-4 py-2.5 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition" />
            {errors.email && <p className="text-red-500 text-xs mt-1.5">{errors.email.message}</p>}
          </div>
          <button type="submit" disabled={isSubmitting} className="bg-indigo-600 text-white rounded-xl py-2.5 text-sm font-semibold hover:bg-indigo-700 transition disabled:opacity-50">
            {isSubmitting ? "Saving..." : "Save"}
          </button>
        </form>
      </Modal>
    </>
  );
}
