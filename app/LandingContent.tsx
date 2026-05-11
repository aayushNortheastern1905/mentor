"use client";

import { useRouter } from "next/navigation";
import { BookOpen, Play, ListChecks } from "lucide-react";
import { ThemeToggle } from "@/components/ThemeToggle";

function GithubIcon() {
  return (
    <svg viewBox="0 0 24 24" width="20" height="20" fill="currentColor">
      <path d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" />
    </svg>
  );
}

export function LandingContent() {
  const router = useRouter();

  return (
    <div className="flex flex-col min-h-screen">
      {/* Header */}
      <header className="border-b border-white/8 px-8 py-5 flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <div className="w-7 h-7 rounded-lg bg-primary flex items-center justify-center shadow-lg shadow-primary/30">
            <div className="w-2.5 h-2.5 rounded-sm bg-white" />
          </div>
          <span className="text-base font-semibold tracking-tight">Mentor <span className="text-primary">AI</span></span>
        </div>
        <div className="flex items-center gap-3">
          <ThemeToggle />
          <a
            href="https://github.com/aayushNortheastern1905/mentor"
            target="_blank"
            rel="noopener noreferrer"
            className="text-muted-foreground hover:text-foreground transition-colors"
          >
            <GithubIcon />
          </a>
        </div>
      </header>

      {/* Main */}
      <main className="flex-1 flex flex-col items-center justify-center px-6 py-16">
        <div className="max-w-2xl w-full space-y-10">

          {/* Badge */}
          <div className="flex justify-start">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-primary/30 bg-primary/10 text-xs text-primary font-medium">
              <span className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse" />
              Heavy Industry · Knowledge Transfer
            </div>
          </div>

          {/* Hero */}
          <div className="space-y-4">
            <h1 className="text-5xl font-bold tracking-tight leading-[1.1]">
              Senior knowledge,<br />
              <span className="text-primary">floor-ready.</span>
            </h1>
            <p className="text-muted-foreground text-lg leading-relaxed max-w-lg">
              Capture how your best people diagnose problems. Turn it into a step-by-step playbook any junior tech can follow — without asking questions.
            </p>
          </div>

          {/* Mode cards — equal height with pinned CTAs */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <button
              onClick={() => router.push("/capture?domain=inspection")}
              className="group text-left rounded-2xl border border-white/8 bg-white/4 p-6 hover:border-primary/50 hover:bg-primary/8 transition-all flex flex-col gap-4"
            >
              <div className="w-10 h-10 rounded-xl bg-primary/20 border border-primary/30 flex items-center justify-center group-hover:bg-primary/30 transition-colors shrink-0">
                <BookOpen className="w-5 h-5 text-primary" />
              </div>
              <div className="flex-1">
                <h3 className="font-semibold text-base text-foreground">Build a Playbook</h3>
                <p className="text-sm text-muted-foreground mt-1.5 leading-relaxed">
                  You&apos;re the expert. Describe how you diagnose a problem in plain language — we structure it automatically.
                </p>
              </div>
              <span className="inline-flex items-center gap-1.5 text-sm font-medium text-primary mt-auto">
                Start building →
              </span>
            </button>

            <button
              onClick={() => router.push("/apprentice?domain=inspection")}
              className="group text-left rounded-2xl border border-white/8 bg-white/4 p-6 hover:border-indigo-400/50 hover:bg-indigo-500/8 transition-all flex flex-col gap-4"
            >
              <div className="w-10 h-10 rounded-xl bg-indigo-500/20 border border-indigo-500/30 flex items-center justify-center group-hover:bg-indigo-500/30 transition-colors shrink-0">
                <Play className="w-5 h-5 text-indigo-400" />
              </div>
              <div className="flex-1">
                <h3 className="font-semibold text-base text-foreground">Run a Playbook</h3>
                <p className="text-sm text-muted-foreground mt-1.5 leading-relaxed">
                  On the floor and stuck? Pick a playbook and follow it one step at a time to a diagnosis.
                </p>
              </div>
              <span className="inline-flex items-center gap-1.5 text-sm font-medium text-indigo-400 mt-auto">
                Start running →
              </span>
            </button>

            <button
              onClick={() => router.push("/bom")}
              className="group text-left rounded-2xl border border-white/8 bg-white/4 p-6 hover:border-emerald-400/50 hover:bg-emerald-500/8 transition-all flex flex-col gap-4"
            >
              <div className="w-10 h-10 rounded-xl bg-emerald-500/20 border border-emerald-500/30 flex items-center justify-center group-hover:bg-emerald-500/30 transition-colors shrink-0">
                <ListChecks className="w-5 h-5 text-emerald-400" />
              </div>
              <div className="flex-1">
                <h3 className="font-semibold text-base text-foreground">Generate a BOM</h3>
                <p className="text-sm text-muted-foreground mt-1.5 leading-relaxed">
                  Describe any equipment and get a structured Bill of Materials — components, part numbers, failure notes.
                </p>
              </div>
              <span className="inline-flex items-center gap-1.5 text-sm font-medium text-emerald-400 mt-auto">
                Generate →
              </span>
            </button>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-white/8 px-8 py-4 flex items-center justify-center">
        <span className="text-xs text-muted-foreground/50 tracking-wide">
          Tacit knowledge. Structured.
        </span>
      </footer>
    </div>
  );
}
