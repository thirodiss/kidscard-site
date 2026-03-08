export default function DashboardShell({
  title,
  subtitle,
  children,
}: {
  title: string;
  subtitle?: string;
  children: React.ReactNode;
}) {
  return (
    <section className="min-w-0">
      <div className="mb-6">
        <h1 className="text-3xl font-bold tracking-tight text-[#0f172a]">{title}</h1>
        {subtitle ? (
          <p className="mt-2 max-w-3xl text-black/65">{subtitle}</p>
        ) : null}
      </div>

      {children}
    </section>
  );
}