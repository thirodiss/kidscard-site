export default function Plans() {
  return (
    <section className="py-24 text-center px-8">
      <h2 className="text-4xl font-bold mb-16">Planos Kids Card</h2>

      <div className="grid md:grid-cols-3 gap-8">
        <div className="bg-gray-800 p-8 rounded-xl">
          <h3 className="text-2xl font-bold mb-4">Básico</h3>
          <p>Extrato padrão</p>
          <p>Cartão internacional</p>
          <p className="text-3xl font-bold mt-6">R$ 29/mês</p>
        </div>

        <div className="bg-purple-700 p-8 rounded-xl scale-105">
          <h3 className="text-2xl font-bold mb-4">Premium</h3>
          <p>Extrato detalhado por produto</p>
          <p>Assessoria jurídica</p>
          <p>Seguro pensão</p>
          <p className="text-3xl font-bold mt-6">R$ 79/mês</p>
        </div>

        <div className="bg-gray-800 p-8 rounded-xl">
          <h3 className="text-2xl font-bold mb-4">Prime</h3>
          <p>Todos benefícios Premium</p>
          <p>Intercâmbio educacional</p>
          <p>Assistência psicológica</p>
          <p className="text-3xl font-bold mt-6">R$ 149/mês</p>
        </div>
      </div>
    </section>
  );
}