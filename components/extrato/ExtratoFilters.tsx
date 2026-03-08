"use client";

import Link from "next/link";
import { usePathname, useSearchParams } from "next/navigation";

function buildQueryString(
  searchParams: URLSearchParams,
  key: string,
  value: string
) {
  const params = new URLSearchParams(searchParams.toString());
  params.set(key, value);
  return `?${params.toString()}`;
}

function Pill({
  href,
  label,
  active,
}: {
  href: string;
  label: string;
  active?: boolean;
}) {
  return (
    <Link
      href={href}
      className={`rounded-full px-4 py-2 text-sm font-semibold transition ${
        active
          ? "bg-[#5b2cff] text-white"
          : "border border-black/10 bg-white text-black/65 hover:bg-black/[0.03]"
      }`}
    >
      {label}
    </Link>
  );
}

export default function ExtratoFilters({
  currentType,
  currentLimit,
}: {
  currentType: string;
  currentLimit: string;
}) {
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const makeHref = (key: string, value: string) =>
    `${pathname}${buildQueryString(searchParams, key, value)}`;

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap gap-2">
        <Pill
          href={makeHref("type", "all")}
          label="Tudo"
          active={currentType === "all"}
        />
        <Pill
          href={makeHref("type", "entries")}
          label="Entradas"
          active={currentType === "entries"}
        />
        <Pill
          href={makeHref("type", "debits")}
          label="Saídas"
          active={currentType === "debits"}
        />
        <Pill
          href={makeHref("type", "transfers")}
          label="Transferências"
          active={currentType === "transfers"}
        />
        <Pill
          href={makeHref("type", "purchases")}
          label="Compras"
          active={currentType === "purchases"}
        />
      </div>

      <div className="flex flex-wrap gap-2">
        <Pill
          href={makeHref("limit", "20")}
          label="20 lançamentos"
          active={currentLimit === "20"}
        />
        <Pill
          href={makeHref("limit", "50")}
          label="50 lançamentos"
          active={currentLimit === "50"}
        />
        <Pill
          href={makeHref("limit", "100")}
          label="100 lançamentos"
          active={currentLimit === "100"}
        />
      </div>
    </div>
  );
}