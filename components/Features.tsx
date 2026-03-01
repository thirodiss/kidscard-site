export default function Features() {
  return (
    <section className="py-24 px-8 text-center">
      <h2 className="text-4xl font-bold mb-16">
        O Diferencial da Kids Card
      </h2>

      <div className="grid md:grid-cols-3 gap-12">
        <div>
          <h3 className="text-2xl font-semibold mb-4">Extrato Detalhado</h3>
          <p>
            Veja estabelecimento, produto, quantidade e valor individual de
            cada compra.
          </p>
        </div>

        <div>
          <h3 className="text-2xl font-semibold mb-4">Segurança Total</h3>
          <p>
            Cartão protegido por senha e bloqueio imediato em caso de perda.
          </p>
        </div>

        <div>
          <h3 className="text-2xl font-semibold mb-4">App Exclusivo</h3>
          <p>
            Controle de limite, transferências, cashback e acompanhamento em
            tempo real.
          </p>
        </div>
      </div>
    </section>
  );
}