"use client";

import Link from "next/link";
import Image from "next/image";
import { useState } from "react";

export default function Header() {
  const [open, setOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 bg-white/85 backdrop-blur-md border-b border-black/10">
      <div className="container-page px-6 py-4 flex items-center justify-between">

        <Link href="/">
          <Image src="/logo.png" alt="Kids Card" width={150} height={44} />
        </Link>

        {/* Desktop */}
        <nav className="hidden md:flex items-center gap-8 text-sm font-semibold text-black/80">
          <Link href="/produtos">Produtos</Link>
          <Link href="/planos">Planos</Link>
          <Link href="/sobre">Sobre</Link>
          <Link href="/investidores">Investidores</Link>
          <Link href="/contato">Contato</Link>
        </nav>

        {/* CTA */}
        <div className="hidden md:block">
          <Link
            href="/planos"
            className="rounded-full bg-black text-white px-5 py-2.5 text-sm font-semibold"
          >
            Ver planos
          </Link>
        </div>

        {/* Mobile button */}
        <button
          className="md:hidden flex flex-col gap-1"
          onClick={() => setOpen(!open)}
          aria-label="Menu"
        >
          <span className="w-6 h-[2px] bg-black"></span>
          <span className="w-6 h-[2px] bg-black"></span>
          <span className="w-6 h-[2px] bg-black"></span>
        </button>
      </div>

      {/* Mobile menu */}
      {open && (
        <div className="md:hidden border-t border-black/10 bg-white">
          <div className="flex flex-col px-6 py-4 gap-4 text-sm font-semibold text-black/80">
            <Link href="/produtos" onClick={() => setOpen(false)}>Produtos</Link>
            <Link href="/planos" onClick={() => setOpen(false)}>Planos</Link>
            <Link href="/sobre" onClick={() => setOpen(false)}>Sobre</Link>
            <Link href="/investidores" onClick={() => setOpen(false)}>Investidores</Link>
            <Link href="/contato" onClick={() => setOpen(false)}>Contato</Link>
          </div>
        </div>
      )}
    </header>
  );
}