"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Sidebar } from "@/components/layout/SideBar";
import { useAuthStore } from "@/store/auth.store";
import { PageLoader } from "@/components/ui/spinner";
import { useAuth } from "@/hooks/useAuth";
import { tokenStorage } from "@/lib/axios";
import { Header } from "./Header";

export function DashboardShell({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const { isAuthenticated, isHydrated, user } = useAuthStore();
  const { fetchMe } = useAuth();
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    if (!isHydrated) return;

    const accessToken = tokenStorage.getAccess();

    if (!accessToken) {
      router.replace("/login?session=expired");
      return;
    }

    if (!isAuthenticated || !user) {
      // Token exists but no user in store — re-hydrate
      fetchMe()
        .then(() => setIsReady(true))
        .catch(() => {
          router.replace("/login?session=expired");
        });
      return;
    }

    setIsReady(true);
  }, [isHydrated, isAuthenticated]);

  if (!isReady) return <PageLoader />;

  return (
    <div className="flex h-screen overflow-hidden bg-gray-50">
      <Sidebar />
      <main className="flex-1 overflow-y-auto">
        <Header />
        <div className="mx-auto max-w-7xl px-6 py-8">{children}</div>
      </main>
    </div>
  );
}
