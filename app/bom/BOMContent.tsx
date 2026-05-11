"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft, Loader2, Download, RotateCcw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { ThemeToggle } from "@/components/ThemeToggle";

type BOMItem = {
  component: string;
  category: string;
  partNumber: string;
  quantity: string;
  notes: string;
};

type BOMResult = {
  title: string;
  equipment: string;
  items: BOMItem[];
};

const CATEGORY_COLORS: Record<string, string> = {
  Electrical: "bg-blue-500/10 text-blue-400 border-blue-500/20",
  Mechanical: "bg-orange-500/10 text-orange-400 border-orange-500/20",
  Structural: "bg-stone-500/10 text-stone-400 border-stone-500/20",
  Consumable: "bg-yellow-500/10 text-yellow-400 border-yellow-500/20",
  Control: "bg-purple-500/10 text-purple-400 border-purple-500/20",
  Optical: "bg-cyan-500/10 text-cyan-400 border-cyan-500/20",
  Fluid: "bg-teal-500/10 text-teal-400 border-teal-500/20",
  Safety: "bg-red-500/10 text-red-400 border-red-500/20",
};

const PLACEHOLDER = `e.g. Commercial LED high bay lighting fixture, 150W, designed for warehouse ceilings at 20-30 feet. Has a Meanwell driver, aluminum heat sink housing, PC lens cover, and connects to a 0-10V dimming system. IP65 rated.

Or: Cummins X15 diesel engine, 500HP, used in Class 8 heavy trucks. Includes high-pressure common rail fuel system, variable geometry turbocharger, EGR system, and Cummins ECM.`;

export function BOMContent() {
  const router = useRouter();
  const [description, setDescription] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<BOMResult | null>(null);

  async function handleGenerate() {
    if (!description.trim()) return;
    setError(null);
    setLoading(true);
    try {
      const res = await fetch("/api/bom", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ description }),
      });
      if (!res.ok) throw new Error("Failed to generate BOM.");
      const data = await res.json();
      setResult(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong.");
    } finally {
      setLoading(false);
    }
  }

  function handleBuildPlaybook() {
    if (!result) return;
    const context = `Equipment: ${result.title}
${result.equipment}

Key components:
${result.items.map((i) => `- ${i.component} (${i.category}): ${i.notes}`).join("\n")}

Based on these components, describe how you would diagnose common failures in this equipment. Walk through the most likely failure points, what to check first, and how to rule things out systematically.`;
    localStorage.setItem("mentor:capture-prefill", context);
    router.push("/capture?domain=inspection&from=bom");
  }

  function handleExportCSV() {
    if (!result) return;
    const header = "Component,Category,Part Number,Quantity,Notes\n";
    const rows = result.items
      .map((i) => `"${i.component}","${i.category}","${i.partNumber}","${i.quantity}","${i.notes}"`)
      .join("\n");
    const blob = new Blob([header + rows], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${result.title.replace(/\s+/g, "-").toLowerCase()}-bom.csv`;
    a.click();
    URL.revokeObjectURL(url);
  }

  return (
    <div className="flex flex-col min-h-screen">
      {/* Header */}
      <header className="border-b border-border/40 px-8 py-5 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <button
            onClick={() => router.push("/")}
            className="text-muted-foreground hover:text-foreground transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
          </button>
          <div className="flex items-center gap-2.5">
            <div className="w-6 h-6 rounded-md bg-primary/20 border border-primary/40 flex items-center justify-center">
              <div className="w-2 h-2 rounded-sm bg-primary" />
            </div>
            <span className="text-sm font-semibold tracking-tight text-muted-foreground">
              Mentor <span className="text-border mx-1">·</span> Bill of Materials
            </span>
          </div>
        </div>
        <ThemeToggle />
      </header>

      <main className="flex-1 px-6 py-10 max-w-4xl mx-auto w-full">
        {!result ? (
          /* Input state */
          <div className="space-y-6">
            <div className="space-y-2">
              <h2 className="text-3xl font-bold tracking-tight">Generate a BOM</h2>
              <p className="text-muted-foreground text-sm leading-relaxed">
                Describe your equipment in plain language — raw, partial, or detailed. We&apos;ll extract a structured Bill of Materials with components, part numbers, and failure notes.
              </p>
            </div>

            <Textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder={PLACEHOLDER}
              rows={8}
              className="resize-none text-sm leading-relaxed bg-card border-border/60 focus:border-primary/60"
              disabled={loading}
            />

            {error && <p className="text-sm text-destructive">{error}</p>}

            <div className="flex justify-end">
              <Button
                onClick={handleGenerate}
                disabled={loading || !description.trim()}
                size="lg"
              >
                {loading ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Extracting components…
                  </>
                ) : (
                  "Generate BOM →"
                )}
              </Button>
            </div>
          </div>
        ) : (
          /* Result state */
          <div className="space-y-6">
            {/* Title row */}
            <div className="flex items-start justify-between gap-4">
              <div>
                <h2 className="text-2xl font-bold tracking-tight">{result.title}</h2>
                <p className="text-sm text-muted-foreground mt-1">{result.equipment}</p>
              </div>
              <div className="flex items-center gap-2 shrink-0">
                <Button variant="outline" size="sm" onClick={handleExportCSV} className="border-border/60">
                  <Download className="w-3.5 h-3.5 mr-1.5" />
                  Export CSV
                </Button>
                <Button variant="outline" size="sm" onClick={() => setResult(null)} className="border-border/60">
                  <RotateCcw className="w-3.5 h-3.5 mr-1.5" />
                  New BOM
                </Button>
              </div>
            </div>

            {/* Stats */}
            <div className="flex items-center gap-4 text-sm text-muted-foreground">
              <span>{result.items.length} components</span>
              <span>·</span>
              <span>{[...new Set(result.items.map((i) => i.category))].length} categories</span>
            </div>

            {/* BOM table */}
            <div className="rounded-xl border border-border/60 overflow-hidden">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-border/60 bg-muted/40">
                    <th className="text-left px-4 py-3 font-medium text-muted-foreground w-8">#</th>
                    <th className="text-left px-4 py-3 font-medium text-muted-foreground">Component</th>
                    <th className="text-left px-4 py-3 font-medium text-muted-foreground">Category</th>
                    <th className="text-left px-4 py-3 font-medium text-muted-foreground hidden sm:table-cell">Part No.</th>
                    <th className="text-left px-4 py-3 font-medium text-muted-foreground w-20">Qty</th>
                    <th className="text-left px-4 py-3 font-medium text-muted-foreground hidden md:table-cell">Notes</th>
                  </tr>
                </thead>
                <tbody>
                  {result.items.map((item, i) => (
                    <tr
                      key={i}
                      className="border-b border-border/40 last:border-0 hover:bg-muted/20 transition-colors"
                    >
                      <td className="px-4 py-3 text-muted-foreground/50 tabular-nums">{i + 1}</td>
                      <td className="px-4 py-3 font-medium">{item.component}</td>
                      <td className="px-4 py-3">
                        <Badge
                          variant="outline"
                          className={`text-xs ${CATEGORY_COLORS[item.category] ?? "bg-muted text-muted-foreground"}`}
                        >
                          {item.category}
                        </Badge>
                      </td>
                      <td className="px-4 py-3 font-mono text-xs text-muted-foreground hidden sm:table-cell">
                        {item.partNumber || "—"}
                      </td>
                      <td className="px-4 py-3 text-muted-foreground">{item.quantity}</td>
                      <td className="px-4 py-3 text-muted-foreground text-xs leading-relaxed hidden md:table-cell">
                        {item.notes}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Build playbook CTA */}
            <div className="rounded-xl border border-primary/20 bg-primary/5 p-4 flex items-center justify-between gap-4">
              <div>
                <p className="text-sm font-medium">Turn this into a diagnostic playbook</p>
                <p className="text-xs text-muted-foreground mt-0.5">
                  Know how to troubleshoot these components? Build a step-by-step walkthrough for your team.
                </p>
              </div>
              <Button size="sm" onClick={handleBuildPlaybook} className="shrink-0">
                Build playbook →
              </Button>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
