"use client";

import { useEffect, useState } from "react";
import { useForm, useFieldArray } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { ordersApi } from "@/lib/api/orders";
import { formatDate } from "@/lib/utils";
import { capitalizeName } from "@/lib/utils";
import { customersApi } from "@/lib/api/customers";
import { productsApi } from "@/lib/api/products";
import type { Order } from "@/types/order";
import type { Customer } from "@/types/customer";
import type { Product } from "@/types/product";
import PageHeader from "@/components/ui/page-header";
import Modal from "@/components/ui/modal";
import Pagination from "@/components/ui/pagination";

const schema = z.object({
  customer_id: z.string().min(1, "Customer is required"),
  products: z.array(
    z.object({
      id: z.string().min(1, "Product is required"),
      quantity: z.coerce.number().int().min(1, "Minimum 1"),
    })
  ).min(1, "Add at least one product"),
});

type FormData = z.infer<typeof schema>;

export default function OrdersPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [page, setPage] = useState(1);
  const [lastPage, setLastPage] = useState(1);
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [viewOrder, setViewOrder] = useState<Order | null>(null);

  const { register, handleSubmit, control, reset, formState: { errors, isSubmitting } } = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: { customer_id: "", products: [{ id: "", quantity: 1 }] },
  });

  const { fields, append, remove } = useFieldArray({ control, name: "products" });

  async function load() {
    const res = await ordersApi.list({ page });
    setOrders(res.items);
    setLastPage(res.last_page);
  }

  useEffect(() => { load(); }, [page]);

  useEffect(() => {
    customersApi.list({ per_page: 100 }).then((r) => setCustomers(r.items));
    productsApi.list({ per_page: 100 }).then((r) => setProducts(r.items));
  }, []);

  function openCreate() {
    reset({ customer_id: "", products: [{ id: "", quantity: 1 }] });
    setModalOpen(true);
  }

  async function onSubmit(formData: FormData) {
    const payload = {
      customer_id: formData.customer_id,
      products: formData.products.map((p) => ({
        id: p.id,
        quantity: Number(p.quantity),
      })),
    };
    await ordersApi.create(payload);
    setModalOpen(false);
    load();
  }

  async function handleView(id: string) {
    const order = await ordersApi.get(id);
    setViewOrder(order);
  }

  return (
    <>
      <PageHeader
        title="Orders"
        action={
          <button onClick={openCreate} className="bg-indigo-600 text-white px-4 py-2.5 rounded-xl text-sm font-semibold hover:bg-indigo-700 transition">
            + New order
          </button>
        }
      />

      <div className="overflow-x-auto rounded-2xl border border-slate-200 bg-white shadow-sm">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-slate-100">
              <th className="px-5 py-3.5 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">ID</th>
              <th className="px-5 py-3.5 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">Customer</th>
              <th className="px-5 py-3.5 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">Items</th>
              <th className="px-5 py-3.5 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">Created at</th>
              <th className="px-5 py-3.5" />
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-50">
            {orders.map((order) => (
              <tr key={order.id} className="hover:bg-slate-50 transition-colors">
                <td className="px-5 py-4 text-slate-500 text-xs font-mono">{order.id.slice(0, 8)}...</td>
                <td className="px-5 py-4 text-slate-700">{capitalizeName(customers.find((c) => c.id === order.customer_id)?.name ?? "") || order.customer_id}</td>
                <td className="px-5 py-4 text-slate-700">{order.order_products.length}</td>
                <td className="px-5 py-4 text-slate-700">{formatDate(order.created_at)}</td>
                <td className="px-5 py-4">
                  <button onClick={() => handleView(order.id)} className="text-indigo-600 hover:text-indigo-700 text-xs font-medium">View</button>
                </td>
              </tr>
            ))}
            {orders.length === 0 && (
              <tr>
                <td colSpan={5} className="px-5 py-12 text-center text-slate-400 text-sm">No orders yet</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      <Pagination current={page} last={lastPage} onChange={setPage} />

      <Modal open={modalOpen} onClose={() => setModalOpen(false)} title="New order">
        <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1.5">Customer</label>
            <select {...register("customer_id")} className="w-full border border-slate-200 rounded-xl px-4 py-2.5 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition">
              <option value="">Select...</option>
              {customers.map((c) => <option key={c.id} value={c.id}>{capitalizeName(c.name)}</option>)}
            </select>
            {errors.customer_id && <p className="text-red-500 text-xs mt-1.5">{errors.customer_id.message}</p>}
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">Products</label>
            <div className="flex flex-col gap-2">
              {fields.map((field, i) => (
                <div key={field.id} className="flex gap-2 items-start">
                  <select {...register(`products.${i}.id`)} className="flex-1 border border-slate-200 rounded-xl px-4 py-2.5 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition">
                    <option value="">Select...</option>
                    {products.map((p) => <option key={p.id} value={p.id}>{p.name}</option>)}
                  </select>
                  <input {...register(`products.${i}.quantity`)} type="number" min={1} placeholder="Qty" className="w-20 border border-slate-200 rounded-xl px-4 py-2.5 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition" />
                  {fields.length > 1 && (
                    <button type="button" onClick={() => remove(i)} className="text-red-400 hover:text-red-600 text-lg leading-none mt-2">&times;</button>
                  )}
                </div>
              ))}
            </div>
            <button type="button" onClick={() => append({ id: "", quantity: 1 })} className="mt-2 text-indigo-600 hover:text-indigo-700 text-xs font-medium">
              + Add product
            </button>
            {errors.products && <p className="text-red-500 text-xs mt-1.5">{errors.products.message}</p>}
          </div>

          <button type="submit" disabled={isSubmitting} className="bg-indigo-600 text-white rounded-xl py-2.5 text-sm font-semibold hover:bg-indigo-700 transition disabled:opacity-50">
            {isSubmitting ? "Creating..." : "Create order"}
          </button>
        </form>
      </Modal>

      <Modal open={!!viewOrder} onClose={() => setViewOrder(null)} title="Order details">
        {viewOrder && (
          <div className="text-sm flex flex-col gap-3">
            <div className="flex justify-between text-slate-500">
              <span className="font-medium text-slate-700">ID</span>
              <span className="font-mono text-xs">{viewOrder.id}</span>
            </div>
            <div className="flex justify-between">
              <span className="font-medium text-slate-700">Customer</span>
              <span>{capitalizeName(customers.find((c) => c.id === viewOrder.customer_id)?.name ?? "") || viewOrder.customer_id}</span>
            </div>
            <div className="flex justify-between">
              <span className="font-medium text-slate-700">Date</span>
              <span>{formatDate(viewOrder.created_at)}</span>
            </div>
            <div className="border-t border-slate-100 pt-3">
              <p className="font-medium text-slate-700 mb-2">Products</p>
              <ul className="flex flex-col gap-2">
                {viewOrder.order_products.map((op) => (
                  <li key={op.id} className="flex justify-between text-slate-600">
                    <span>{products.find((p) => p.id === op.product_id)?.name ?? op.product_id}</span>
                    <span className="text-slate-400">{op.quantity}x — ${Number(op.price).toFixed(2)}</span>
                  </li>
                ))}
              </ul>
            </div>
            <div className="border-t border-slate-100 pt-3 flex justify-between font-semibold text-slate-900">
              <span>Total</span>
              <span>${viewOrder.order_products.reduce((acc, op) => acc + Number(op.price) * op.quantity, 0).toFixed(2)}</span>
            </div>
          </div>
        )}
      </Modal>
    </>
  );
}
