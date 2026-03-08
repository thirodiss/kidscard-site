import AppSidebar from "../../components/dashboard/AppSidebar";
import AppTopbar from "../../components/dashboard/AppTopbar";
import AuthGuard from "../../components/auth/AuthGuard";

export default function ClientAppLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <AuthGuard>
      <div className="min-h-screen bg-[#f6f7fb]">
        <AppTopbar />

        <main className="px-6 py-8">
          <div className="container-page flex items-start gap-8">
            <AppSidebar />
            <div className="min-w-0 flex-1 overflow-x-hidden">{children}</div>
          </div>
        </main>
      </div>
    </AuthGuard>
  );
}