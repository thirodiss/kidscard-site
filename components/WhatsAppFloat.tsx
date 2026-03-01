export default function WhatsAppFloat() {
  const number = "5511959819146"; // ajuste depois
  const text = encodeURIComponent(
    "Olá! Quero conhecer a Kids Card (Pensão e Mesada). Pode me ajudar?"
  );

  return (
    <a
      href={`https://wa.me/${number}?text=${text}`}
      target="_blank"
      rel="noreferrer"
      className="fixed bottom-5 right-5 z-[70] group"
      aria-label="Falar no WhatsApp"
      title="Falar no WhatsApp"
    >
      <div className="flex items-center gap-3 rounded-full px-4 py-3 border border-white/15 bg-black/50 backdrop-blur-md shadow-soft hover:scale-105 transition">
        <span className="grid place-items-center h-10 w-10 rounded-full bg-white text-black font-bold">
          W
        </span>
        <div className="hidden sm:block">
          <div className="text-sm font-semibold">WhatsApp</div>
          <div className="text-xs text-white/70">Falar com a Kids Card</div>
        </div>
      </div>
    </a>
  );
}