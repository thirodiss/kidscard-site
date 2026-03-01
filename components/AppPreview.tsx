export default function AppPreview() {
  return (
    <section className="py-24 bg-gray-900 text-center px-6">
      <h2 className="text-4xl font-bold mb-10">
        Aplicativo Exclusivo
      </h2>

      <p className="max-w-3xl mx-auto mb-10">
        Extrato padrão organizado por data, estabelecimento e valor.
        Clique para visualizar o extrato detalhado de cada compra.
      </p>

      <div className="bg-black p-8 rounded-xl max-w-md mx-auto shadow-lg">
        <p>Supermercado Central - R$ 350,00</p>
        <p>Farmácia Vida - R$ 89,90</p>
        <p>Escola Futuro - R$ 720,00</p>
      </div>
    </section>
  );
}