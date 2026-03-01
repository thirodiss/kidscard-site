"use client";

import { useMemo, useState } from "react";

type PurchaseItem = {
  name: string;
  qty: number;
  price: number;
};

type Purchase = {
  id: string;
  date: string;
  merchant: string;
  category: "Alimentação" | "Saúde" | "Educação" | "Vestuário" | "Outros";
  total: number;
  items: PurchaseItem[];
};

function brl(v: number) {
  return v.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });
}

export default function AppMock() {
  const purchases: Purchase[] = useMemo(
    () => [
      {
        id: "p1",
        date: "Hoje",
        merchant: "Supermercado Central",
        category: "Alimentação",
        total: 350,
        items: [
          { name: "Leite integral", qty: 2, price: 9.9 },
          { name: "Arroz 5kg", qty: 1, price: 29.9 },
          { name: "Frango (kg)", qty: 2, price: 18.5 },
          { name: "Frutas variadas", qty: 1, price: 32.0 },
        ],
      },
      {
        id: "p2",
        date: "Ontem",
        merchant: "Farmácia Vida",
        category: "Saúde",
        total: 89.9,
        items: [
          { name: "Vitamina C", qty: 1, price: 29.9 },
          { name: "Protetor solar", qty: 1, price: 59.99 },
        ],
      },
      {
        id: "p3",
        date: "02/03",
        merchant: "Colégio Futuro",
        category: "Educação",
        total: 720,
        items: [
          { name: "Mensalidade escolar", qty: 1, price: 720.0 },
        ],
      },
      {
        id: "p4",
        date: "28/02",
        merchant: "Kids Store",
        category: "Vestuário",
        total: 149.9,
        items: [
          { name: "Tênis", qty: 1, price: 129.9 },
          { name: "Meias", qty: 2, price: 10.0 },
        ],
      },
    ],
    []
  );

  const [selected, setSelected] = useState<Purchase | null>(null);

  const categoryColor = (c: Purchase["category"]) => {
    switch (c) {
      case "Alimentação":
        return "bg-emerald-400/20 text-emerald-200 border-emerald-300/20";
      case "Saúde":
        return "bg-sky-400/20 text-sky-200 border-sky-300/20";
      case "Educação":
        return "bg-purple-400/20 text-purple-200 border-purple-300/20";
      case "Vestuário":
        return "bg-amber-400/20 text-amber-200 border-amber-300/20";
      default:
        return "bg-white/10 text-white/80 border-white/10";
    }
  };

  return (
    <section className="px-6 py-24 bg-[#070b16]">
      <div className="mx-auto max-w-6xl">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold">App Kids Card</h2>
          <p className="text-white/70 mt-4 max-w-3xl mx-auto">
            Extrato padrão por estabelecimento e, no cartão Pensão, o diferencial:
            <b> extrato detalhado por item</b> (conforme plano e cobertura).
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-10 items-start">
          {/* Phone mock */}
          <div className="rounded-[32px] border border-white/10 bg-black/40 p-4 shadow-2xl">
            <div className="rounded-[28px] bg-[#0b1224] border border-white/10 overflow-hidden">
              <div className="px-5 py-4 border-b border-white/10 flex items-center justify-between">
                <div>
                  <div className="text-sm text-white/60">Extrato</div>
                  <div className="font-semibold">Kids Card • Pensão</div>
                </div>
                <div className="text-xs px-3 py-1 rounded-full bg-white/10 border border-white/10">
                  Detalhado
                </div>
              </div>

              <div className="p-5 space-y-3">
                {purchases.map((p) => (
                  <button
                    key={p.id}
                    onClick={() => setSelected(p)}
                    className="w-full text-left rounded-2xl border border-white/10 bg-white/5 hover:bg-white/10 transition p-4"
                  >
                    <div className="flex items-start justify-between gap-4">
                      <div>
                        <div className="text-sm text-white/60">{p.date}</div>
                        <div className="font-semibold">{p.merchant}</div>
                        <div
                          className={`inline-flex mt-2 text-xs px-2.5 py-1 rounded-full border ${categoryColor(
                            p.category
                          )}`}
                        >
                          {p.category}
                        </div>
                      </div>

                      <div className="font-bold">{brl(p.total)}</div>
                    </div>

                    <div className="mt-3 text-xs text-white/60">
                      Clique para ver itens da compra →
                    </div>
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Explanation */}
          <div className="rounded-3xl border border-white/10 bg-white/5 p-8">
            <h3 className="text-2xl font-bold">Extrato detalhado (por item)</h3>
            <p className="text-white/75 mt-4">
              No Kids Card Pensão, cada compra pode ser exibida com:
            </p>

            <ul className="mt-6 space-y-3 text-white/85">
              <li className="flex gap-3">
                <span className="mt-1.5 h-2 w-2 rounded-full bg-purple-300" />
                Nome do produto, quantidade e valor individual
              </li>
              <li className="flex gap-3">
                <span className="mt-1.5 h-2 w-2 rounded-full bg-purple-300" />
                Categorias para análise (saúde, educação, alimentação…)
              </li>
              <li className="flex gap-3">
                <span className="mt-1.5 h-2 w-2 rounded-full bg-purple-300" />
                Mais transparência e visibilidade dos gastos
              </li>
            </ul>

            <div className="mt-8 rounded-2xl border border-white/10 bg-black/30 p-5">
              <div className="text-sm text-white/60">Dica</div>
              <div className="mt-1 text-white/80">
                Clique em qualquer compra no mock ao lado para abrir o extrato detalhado.
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Modal */}
      {selected && (
        <div
          className="fixed inset-0 bg-black/70 backdrop-blur-sm z-[60] flex items-center justify-center px-4"
          onClick={() => setSelected(null)}
        >
          <div
            className="w-full max-w-2xl rounded-3xl border border-white/10 bg-[#0b1224] shadow-2xl overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="px-6 py-5 border-b border-white/10 flex items-start justify-between gap-6">
              <div>
                <div className="text-sm text-white/60">{selected.date}</div>
                <div className="text-xl font-bold">{selected.merchant}</div>
                <div className="text-white/70 mt-1">
                  Total: <span className="font-semibold">{brl(selected.total)}</span>
                </div>
              </div>
              <button
                className="rounded-full bg-white/10 border border-white/10 px-4 py-2 text-sm hover:bg-white/15 transition"
                onClick={() => setSelected(null)}
              >
                Fechar ✕
              </button>
            </div>

            <div className="p-6">
              <div className="text-sm text-white/60 mb-3">Itens da compra</div>

              <div className="rounded-2xl border border-white/10 overflow-hidden">
                <div className="grid grid-cols-12 bg-black/30 text-xs text-white/70 px-4 py-3">
                  <div className="col-span-7">Produto</div>
                  <div className="col-span-2 text-center">Qtd</div>
                  <div className="col-span-3 text-right">Valor</div>
                </div>

                {selected.items.map((it, i) => (
                  <div
                    key={`${selected.id}-${i}`}
                    className="grid grid-cols-12 px-4 py-3 border-t border-white/10"
                  >
                    <div className="col-span-7 font-medium">{it.name}</div>
                    <div className="col-span-2 text-center text-white/80">
                      {it.qty}
                    </div>
                    <div className="col-span-3 text-right font-semibold">
                      {brl(it.price * it.qty)}
                    </div>
                  </div>
                ))}
              </div>

              <div className="mt-5 text-xs text-white/60">
                * Demonstração visual do extrato detalhado. Itens e valores são ilustrativos.
              </div>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}