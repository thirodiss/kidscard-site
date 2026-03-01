import Image from "next/image";

export default function Hero() {
  return (
    <section className="gradient-bg pt-40 pb-32 text-center px-6">
      <h1 className="text-5xl font-bold mb-6">
        A primeira fintech focada em Pensão Alimentícia
      </h1>

      <p className="text-xl mb-10 max-w-3xl mx-auto">
        Controle total, extrato detalhado por produto e segurança para garantir
        que o valor da pensão seja direcionado exclusivamente à criança.
      </p>

      <div className="flex justify-center mb-12">
        <Image src="/card.png" alt="Cartão Kids Card" width={600} height={380} />
      </div>

      <button className="bg-white text-black px-8 py-4 rounded-full font-semibold hover:scale-105 transition">
        Quero Conhecer os Planos
      </button>
    </section>
  );
}