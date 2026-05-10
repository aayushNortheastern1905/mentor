"use client";

import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { ArrowLeft, Mic, MicOff, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { DomainSelector } from "@/components/DomainSelector";
import { CAPTURE_PLACEHOLDERS, DOMAIN_LABELS } from "@/lib/prompts";
import { saveTree } from "@/lib/storage";
import type { Domain, SavedTree, TreeNode } from "@/lib/types";

export function CaptureContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const domain = (searchParams.get("domain") as Domain) ?? "diesel";

  const [text, setText] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [listening, setListening] = useState(false);

  function toggleMic() {
    if (typeof window === "undefined") return;
    const SpeechRecognition =
      (window as unknown as { SpeechRecognition?: unknown; webkitSpeechRecognition?: unknown })
        .SpeechRecognition ??
      (window as unknown as { webkitSpeechRecognition?: unknown }).webkitSpeechRecognition;

    if (!SpeechRecognition) {
      alert("Speech recognition is not supported in this browser.");
      return;
    }

    if (listening) {
      setListening(false);
      return;
    }

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const recognition = new (SpeechRecognition as any)();
    recognition.lang = "en-US";
    recognition.continuous = true;
    recognition.interimResults = false;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    recognition.onresult = (e: any) => {
      const transcript = Array.from(e.results as Iterable<{ 0: { transcript: string } }>)
        .map((r) => r[0].transcript)
        .join(" ");
      setText((prev) => (prev ? prev + " " + transcript : transcript));
    };
    recognition.onerror = () => setListening(false);
    recognition.onend = () => setListening(false);
    recognition.start();
    setListening(true);
  }

  async function handleSubmit() {
    if (!text.trim() || text.trim().length < 10) {
      setError("Please describe your diagnostic process (at least a few sentences).");
      return;
    }
    setError(null);
    setLoading(true);
    try {
      const res = await fetch("/api/structure", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ domain, text }),
      });
      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error ?? "Failed to structure reasoning.");
      }
      const { title, tree } = (await res.json()) as { title: string; tree: TreeNode };
      const saved: SavedTree = {
        id: `tree-${Date.now()}`,
        domain,
        title,
        rootText: text,
        root: tree,
        createdAt: new Date().toISOString(),
      };
      saveTree(saved);
      router.push(`/capture/tree/${saved.id}?domain=${domain}`);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="flex flex-col min-h-screen">
      <header className="border-b border-border/40 px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <button
            onClick={() => router.push(`/?domain=${domain}`)}
            className="text-muted-foreground hover:text-foreground transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
          </button>
          <div>
            <h1 className="text-xl font-semibold tracking-tight">Mentor</h1>
            <p className="text-xs text-muted-foreground">Capture Mode</p>
          </div>
        </div>
        <DomainSelector value={domain} />
      </header>

      <main className="flex-1 flex flex-col items-center justify-center px-6 py-12">
        <div className="max-w-2xl w-full space-y-6">
          <div className="space-y-1">
            <h2 className="text-2xl font-bold tracking-tight">Tell us how you diagnose this.</h2>
            <p className="text-muted-foreground text-sm">
              Talk like you&apos;re explaining it to your apprentice. Don&apos;t worry about
              structure — just describe what you do and why.
            </p>
          </div>

          <div className="relative">
            <Textarea
              value={text}
              onChange={(e) => setText(e.target.value)}
              placeholder={CAPTURE_PLACEHOLDERS[domain]}
              rows={10}
              className="resize-none text-sm leading-relaxed pr-12"
              disabled={loading}
            />
            <button
              onClick={toggleMic}
              title={listening ? "Stop recording" : "Start voice input"}
              className={`absolute top-3 right-3 p-1.5 rounded-md transition-colors ${
                listening
                  ? "text-red-500 bg-red-50 hover:bg-red-100"
                  : "text-muted-foreground hover:text-foreground hover:bg-muted"
              }`}
            >
              {listening ? <MicOff className="w-4 h-4" /> : <Mic className="w-4 h-4" />}
            </button>
          </div>

          {error && <p className="text-sm text-destructive">{error}</p>}

          {listening && (
            <p className="text-sm text-red-500 flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
              Listening... speak now
            </p>
          )}

          <div className="flex items-center justify-between">
            <p className="text-xs text-muted-foreground">
              Domain: <span className="font-medium">{DOMAIN_LABELS[domain]}</span>
            </p>
            <Button onClick={handleSubmit} disabled={loading || !text.trim()} size="lg">
              {loading ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Reading your reasoning…
                </>
              ) : (
                "Structure my reasoning →"
              )}
            </Button>
          </div>
        </div>
      </main>
    </div>
  );
}
