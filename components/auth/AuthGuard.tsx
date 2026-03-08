"use client";

import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function AuthGuard({
  children,
}: {
  children: React.ReactNode;
}) {
  const { status } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (status === "unauthenticated") {
      router.replace("/login");
    }
  }, [status, router]);

  if (status === "loading") {
    return (
      <div className="rounded-3xl border border-black/10 bg-white p-8 soft-shadow">
        <div className="text-sm font-semibold text-[#5b2cff]">Verificando acesso</div>
        <div className="mt-3 text-2xl font-bold">Carregando ambiente seguro...</div>
        <p className="mt-3 text-black/60">
          Aguarde enquanto validamos sua sessão na plataforma.
        </p>
      </div>
    );
  }

  if (status === "unauthenticated") {
    return null;
  }

  return <>{children}</>;
}