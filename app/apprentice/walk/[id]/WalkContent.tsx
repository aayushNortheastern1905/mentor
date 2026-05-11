"use client";

import { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { WalkthroughCard } from "@/components/WalkthroughCard";
import { getTree } from "@/lib/storage";
import { countNodes } from "@/lib/tree";
import type { SavedTree, TreeNode, Branch } from "@/lib/types";

interface Step {
  node: TreeNode;
  pathTexts: string[];
}

export function WalkContent() {
  const router = useRouter();
  const params = useParams();
  const id = params.id as string;

  const [tree, setTree] = useState<SavedTree | null>(null);
  const [history, setHistory] = useState<Step[]>([]);

  useEffect(() => {
    const t = getTree(id);
    if (!t) {
      router.push("/apprentice");
      return;
    }
    setTree(t);
    setHistory([{ node: t.root, pathTexts: [] }]);
  }, [id, router]);

  if (!tree || history.length === 0) {
    return (
      <div className="flex items-center justify-center min-h-screen text-muted-foreground">
        Loading…
      </div>
    );
  }

  const current = history[history.length - 1];
  const totalSteps = countNodes(tree.root);

  function handleAnswer(branch: Branch) {
    setHistory((prev) => [
      ...prev,
      {
        node: branch.node,
        pathTexts: [...current.pathTexts, current.node.text],
      },
    ]);
  }

  function handleBack() {
    if (history.length <= 1) return;
    setHistory((prev) => prev.slice(0, -1));
  }

  function handleStartOver() {
    setHistory([{ node: tree!.root, pathTexts: [] }]);
  }

  function handleGoDeeper(pathTexts: string[]) {
    router.push(`/capture?context=${encodeURIComponent(pathTexts.join(" → "))}`);
  }

  return (
    <div className="flex flex-col min-h-screen">
      <header className="border-b border-border/40 px-8 py-5 flex items-center gap-4">
        <button
          onClick={() => router.push("/apprentice")}
          className="text-muted-foreground hover:text-foreground transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
        </button>
        <div className="flex items-center gap-3">
          <div className="w-6 h-6 rounded-md bg-indigo-500/20 border border-indigo-500/40 flex items-center justify-center">
            <div className="w-2 h-2 rounded-sm bg-indigo-400" />
          </div>
          <span className="text-sm font-semibold tracking-tight text-muted-foreground">
            {tree.title}
          </span>
        </div>
      </header>

      <main className="flex-1 flex flex-col items-center justify-center px-6 py-10">
        <WalkthroughCard
          node={current.node}
          domain="inspection"
          stepNumber={history.length}
          totalSteps={totalSteps}
          pathTexts={current.pathTexts}
          onAnswer={handleAnswer}
          onBack={handleBack}
          canGoBack={history.length > 1}
          onStartOver={handleStartOver}
          onGoDeeper={handleGoDeeper}
        />
      </main>
    </div>
  );
}
