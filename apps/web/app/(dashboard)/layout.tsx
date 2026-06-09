// "use client";

// import { AuthGuard } from "@/components/auth/AuthGuard";
// import { VerificationBanner } from "@/components/auth/VerificationBanner";

// export default function DashboardLayout({
//   children,
// }: {
//   children: React.ReactNode;
// }) {
//   return (
//     <AuthGuard>
//       <div className="min-h-screen bg-gray-50">
//         <VerificationBanner />
//         <main>{children}</main>
//       </div>
//     </AuthGuard>
//   );
// }

import { DashboardShell } from "@/components/layout/Dashboardshell";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <DashboardShell>{children}</DashboardShell>;
}
