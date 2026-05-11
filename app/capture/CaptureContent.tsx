"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft, Mic, MicOff, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { saveTree } from "@/lib/storage";
import type { SavedTree, TreeNode } from "@/lib/types";

const PLACEHOLDER = `e.g. When I get a report of a lighting fixture defect the first thing I check is whether it's one fixture or multiple on the same circuit — if it's multiple, the problem is upstream. Then I look at the driver LED indicator if there is one. A solid red usually means thermal shutdown, a flashing red usually means overcurrent. I check the housing temperature with my hand — if I can't hold my hand on it for 3 seconds the driver is cooking itself...`;

export function CaptureContent() {
  const router = useRouter();
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
      setError("Please describe your diagnostic process — a few sentences is enough.");
      return;
    }
    setError(null);
    setLoading(true);
    try {
      const res = await fetch("/api/structure", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ domain: "inspection", text }),
      });
      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error ?? "Failed to structure reasoning.");
      }
      const { title, tree } = (await res.json()) as { title: string; tree: TreeNode };
      const saved: SavedTree = {
        id: `tree-${Date.now()}`,
        domain: "inspection",
        title,
        rootText: text,
        root: tree,
        createdAt: new Date().toISOString(),
      };
      saveTree(saved);
      router.push(`/capture/tree/${saved.id}?domain=inspection`);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="flex flex-col min-h-screen">
      <header className="border-b border-border/40 px-8 py-5 flex items-center gap-4">
        <button
          onClick={() => router.push("/")}
          className="text-muted-foreground hover:text-foreground transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
        </button>
        <div className="flex items-center gap-3">
          <div className="w-6 h-6 rounded-md bg-primary/20 border border-primary/40 flex items-center justify-center">
            <div className="w-2 h-2 rounded-sm bg-primary" />
          </div>
          <span className="text-sm font-semibold tracking-tight text-muted-foreground">
            Mentor <span className="text-border mx-1">·</span> Build a Playbook
          </span>
        </div>
      </header>

      <main className="flex-1 flex flex-col items-center justify-center px-6 py-12">
        <div className="max-w-2xl w-full space-y-6">
          <div className="space-y-2">
            <h2 className="text-3xl font-bold tracking-tight">
              How do you diagnose this?
            </h2>
            <p className="text-muted-foreground text-sm leading-relaxed">
              Talk like you&apos;re explaining it to a junior on their first day. Don&apos;t worry about structure — just describe what you do and why. We&apos;ll handle the rest.
            </p>
          </div>

          <div className="relative">
            <Textarea
              value={text}
              onChange={(e) => setText(e.target.value)}
              placeholder={PLACEHOLDER}
              rows={10}
              className="resize-none text-sm leading-relaxed pr-12 bg-card border-border/60 focus:border-primary/60"
              disabled={loading}
            />
            <button
              onClick={toggleMic}
              title={listening ? "Stop recording" : "Start voice input"}
              className={`absolute top-3 right-3 p-1.5 rounded-md transition-colors ${
                listening
                  ? "text-red-400 bg-red-500/10 hover:bg-red-500/20"
                  : "text-muted-foreground hover:text-foreground hover:bg-muted"
              }`}
            >
              {listening ? <MicOff className="w-4 h-4" /> : <Mic className="w-4 h-4" />}
            </button>
          </div>

          {error && <p className="text-sm text-destructive">{error}</p>}

          {listening && (
            <p className="text-sm text-red-400 flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-red-400 animate-pulse" />
              Listening — speak now
            </p>
          )}

          <div className="flex justify-end">
            <Button onClick={handleSubmit} disabled={loading || !text.trim()} size="lg">
              {loading ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Structuring your reasoning…
                </>
              ) : (
                "Build the playbook →"
              )}
            </Button>
          </div>
        </div>
      </main>
    </div>
  );
}
