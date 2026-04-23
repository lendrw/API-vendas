import Sidebar from "@/components/layout/sidebar";

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex h-screen bg-slate-50">
      <Sidebar />
      <main className="flex-1 overflow-y-auto p-4 pt-[calc(56px+1rem)] md:p-8 min-w-0">{children}</main>
    </div>
  );
}
