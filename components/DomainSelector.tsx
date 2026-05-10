"use client";

import { useRouter, usePathname, useSearchParams } from "next/navigation";
import { DOMAIN_LABELS } from "@/lib/prompts";
import type { Domain } from "@/lib/types";

interface Props {
  value: Domain;
}

export function DomainSelector({ value }: Props) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  function handleChange(domain: Domain) {
    const params = new URLSearchParams(searchParams.toString());
    params.set("domain", domain);
    router.push(`${pathname}?${params.toString()}`);
  }

  return (
    <div className="flex items-center gap-1 bg-muted rounded-full p-1">
      {(Object.keys(DOMAIN_LABELS) as Domain[]).map((d) => (
        <button
          key={d}
          onClick={() => handleChange(d)}
          className={`px-4 py-1.5 rounded-full text-sm font-medium transition-all ${
            value === d
              ? "bg-background text-foreground shadow-sm"
              : "text-muted-foreground hover:text-foreground"
          }`}
        >
          {DOMAIN_LABELS[d]}
        </button>
      ))}
    </div>
  );
}
