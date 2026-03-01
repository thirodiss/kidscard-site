export default function PlansCompareTable() {
  const rows = [
    {
      feature: "Conta digital + cartão",
      basic: true,
      premium: true,
      prime: true,
    },
    {
      feature: "Cartão Pensão + Cartão Mesada",
      basic: true,
      premium: true,
      prime: true,
    },
    {
      feature: "Extrato por estabelecimento (padrão)",
      basic: true,
      premium: true,
      prime: true,
    },
    {
      feature: "Extrato detalhado por item (por produto)",
      basic: false,
      premium: true,
      prime: true,
      note: "Disponível conforme plano e cobertura de parceiros/segmentos.",
    },
    {
      feature: "Cashback e bônus (por uso)",
      basic: false,
      premium: true,
      prime: true,
    },
    {
      feature: "Clube de benefícios / promoções",
      basic: true,
      premium: true,
      prime: true,
    },
    {
      feature: "Assessoria jurídica",
      basic: false,
      premium: true,
      prime: true,
    },
    {
      feature: "Assessoria psicológica",
      basic: false,
      premium: false,
      prime: true,
    },
    {
      feature: "Seguro Pensão",
      basic: false,
      premium: true,
      prime: true,
    },
    {
      feature: "Prime Intercâmbio (benefício adicional)",
      basic: false,
      premium: false,
      prime: true,
    },
  ];

  const Cell = ({ ok }: { ok: boolean }) => (
    <div className="flex items-center justify-center">
      <span
        className={`inline-flex h-7 w-7 items-center justify-center rounded-full ${
          ok ? "bg-white text-black" : "bg-white/10 text-white/40"
        }`}
      >
        {ok ? "✓" : "—"}
      </span>
    </div>
  );

  return (
    <div className="rounded-3xl border border-white/10 bg-white/5 overflow-hidden">
      <div className="px-6 py-5 border-b border-white/10">
        <h3 className="text-xl font-bold">Comparação de benefícios</h3>
        <p className="text-white/70 mt-1 text-sm">
          Veja rapidamente o que você recebe em cada plano.
        </p>
      </div>

      <div className="overflow-x-auto">
        <table className="min-w-[780px] w-full text-sm">
          <thead className="bg-black/30">
            <tr>
              <th className="text-left px-6 py-4 font-semibold">Benefício</th>
              <th className="px-6 py-4 font-semibold text-center">Básico</th>
              <th className="px-6 py-4 font-semibold text-center">Premium</th>
              <th className="px-6 py-4 font-semibold text-center">Prime</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((r, idx) => (
              <tr
                key={r.feature}
                className={idx % 2 === 0 ? "bg-white/0" : "bg-black/20"}
              >
                <td className="px-6 py-4">
                  <div className="font-medium">{r.feature}</div>
                  {r.note ? (
                    <div className="text-white/60 text-xs mt-1">{r.note}</div>
                  ) : null}
                </td>
                <td className="px-6 py-4">
                  <Cell ok={r.basic} />
                </td>
                <td className="px-6 py-4">
                  <Cell ok={r.premium} />
                </td>
                <td className="px-6 py-4">
                  <Cell ok={r.prime} />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="px-6 py-5 border-t border-white/10 text-xs text-white/60">
        * Recursos e benefícios podem variar conforme regras do plano, cobertura
        de parceiros e disponibilidade regional.
      </div>
    </div>
  );
}