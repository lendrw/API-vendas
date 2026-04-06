import { api } from "./client";
import type { Order } from "@/types/order";

export const ordersApi = {
  list: (params?: { page?: number; per_page?: number }) =>
    api.get<{ items: Order[]; total: number; current_page: number; per_page: number; last_page: number }>("/orders", { params }).then((r) => r.data),

  get: (id: string) => api.get<Order>(`/orders/${id}`).then((r) => r.data),

  create: (data: { customer_id: string; products: { id: string; quantity: number }[] }) =>
    api.post<Order>("/orders", data).then((r) => r.data),
};
