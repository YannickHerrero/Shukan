import { Outlet } from "react-router";
import BottomNav from "@/components/BottomNav";

export default function AppLayout() {
  return (
    <div className="flex min-h-svh flex-col">
      <main className="flex-1 overflow-y-auto pb-16">
        <Outlet />
      </main>
      <div className="fixed inset-x-0 bottom-0 z-10">
        <BottomNav />
      </div>
    </div>
  );
}
