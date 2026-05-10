"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { Brain, Wrench } from "lucide-react";
import { DomainSelector } from "@/components/DomainSelector";
import type { Domain } from "@/lib/types";

export function LandingContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const domain = (searchParams.get("domain") as Domain) ?? "diesel";

  function go(mode: "capture" | "apprentice") {
    router.push(`/${mode}?domain=${domain}`);
  }

  return (
    <div className="flex flex-col min-h-screen">
      {/* Header */}
      <header className="border-b border-border/40 px-6 py-4 flex items-center justify-between">
        <div>
          <h1 className="text-xl font-semibold tracking-tight">Mentor</h1>
          <p className="text-xs text-muted-foreground mt-0.5">
            Capture expert reasoning. Guide the next generation.
          </p>
        </div>
        <DomainSelector value={domain} />
      </header>

      {/* Main */}
      <main className="flex-1 flex flex-col items-center justify-center px-6 py-16">
        <div className="max-w-2xl w-full space-y-10">
          {/* Hero */}
          <div className="text-center space-y-3">
            <p className="text-sm font-medium text-muted-foreground uppercase tracking-widest">
              {domain === "diesel" ? "Diesel Mechanic" : "Field Inspector"} domain
            </p>
            <h2 className="text-4xl font-bold tracking-tight">
              Senior knowledge,
              <br />
              structured for everyone.
            </h2>
            <p className="text-muted-foreground max-w-md mx-auto text-base leading-relaxed">
              {domain === "diesel"
                ? "30 years of diagnostic intuition, encoded into a walkthrough any junior tech can follow on the floor."
                : "Two decades of inspection experience, distilled into a step-by-step guide any new hire can run."}
            </p>
          </div>

          {/* Mode cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <button
              onClick={() => go("capture")}
              className="group text-left rounded-2xl border border-border bg-card p-6 hover:border-primary/50 hover:shadow-md transition-all space-y-3"
            >
              <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center group-hover:bg-primary/20 transition-colors">
                <Brain className="w-5 h-5 text-primary" />
              </div>
              <div>
                <h3 className="font-semibold text-base">Capture Mode</h3>
                <p className="text-sm text-muted-foreground mt-1 leading-relaxed">
                  You&apos;re the expert. Describe your diagnostic process in plain language — we turn it into a structured decision tree.
                </p>
              </div>
              <span className="inline-flex items-center gap-1 text-sm font-medium text-primary">
                Start capturing →
              </span>
            </button>

            <button
              onClick={() => go("apprentice")}
              className="group text-left rounded-2xl border border-border bg-card p-6 hover:border-primary/50 hover:shadow-md transition-all space-y-3"
            >
              <div className="w-10 h-10 rounded-xl bg-amber-500/10 flex items-center justify-center group-hover:bg-amber-500/20 transition-colors">
                <Wrench className="w-5 h-5 text-amber-600" />
              </div>
              <div>
                <h3 className="font-semibold text-base">Apprentice Mode</h3>
                <p className="text-sm text-muted-foreground mt-1 leading-relaxed">
                  You&apos;re learning the ropes. Pick a saved diagnosis tree and walk through it one question at a time.
                </p>
              </div>
              <span className="inline-flex items-center gap-1 text-sm font-medium text-amber-600">
                Start learning →
              </span>
            </button>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-border/40 px-6 py-4 flex items-center justify-between text-xs text-muted-foreground">
        <span>Built by Aayush Sawant in a weekend.</span>
        <a
          href="https://github.com/aayushsawant"
          target="_blank"
          rel="noopener noreferrer"
          className="hover:text-foreground transition-colors"
        >
          Source on GitHub →
        </a>
      </footer>
    </div>
  );
}
