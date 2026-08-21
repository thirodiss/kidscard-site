export default function PrivacidadePage() {
  return (
    <main className="container-page max-w-4xl px-6 py-16">
      <div className="text-sm font-semibold text-[#5b2cff]">Versão preliminar • 21/08/2026</div>
      <h1 className="mt-3 text-4xl font-bold">Aviso de Privacidade da pré-adesão</h1>
      <div className="mt-8 space-y-5 leading-7 text-black/70">
        <p>A KidsCard usa os dados enviados nesta etapa para registrar o interesse, entrar em contato e preparar a futura validação cadastral.</p>
        <p>São coletados nome do responsável, e-mail, telefone, cidade, estado, finalidade de uso e quantidade de dependentes. CPF, documento e biometria não são solicitados neste formulário.</p>
        <p>Dados de identidade e comprovação só deverão ser enviados no ambiente seguro do parceiro homologado de KYC, quando essa integração estiver ativa.</p>
        <p>Este texto é uma versão operacional preliminar e deverá passar por revisão jurídica e adequação final à LGPD antes do lançamento comercial.</p>
      </div>
    </main>
  );
}
