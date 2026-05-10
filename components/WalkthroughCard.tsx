"use client";

import { useState } from "react";
import { ChevronDown, ChevronRight, ArrowLeft, HelpCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import type { TreeNode, Branch, Domain } from "@/lib/types";

interface Props {
  node: TreeNode;
  domain: Domain;
  stepNumber: number;
  totalSteps: number;
  pathTexts: string[];
  onAnswer: (branch: Branch) => void;
  onBack: () => void;
  canGoBack: boolean;
  onStartOver: () => void;
  onGoDeeper: (path: string[]) => void;
}

const NODE_TYPE_COLORS = {
  question: "bg-blue-500/10 text-blue-600 border-blue-200",
  check: "bg-amber-500/10 text-amber-600 border-amber-200",
  conclusion: "bg-green-500/10 text-green-600 border-green-200",
};

export function WalkthroughCard({
  node,
  domain,
  stepNumber,
  totalSteps,
  pathTexts,
  onAnswer,
  onBack,
  canGoBack,
  onStartOver,
  onGoDeeper,
}: Props) {
  const [whyOpen, setWhyOpen] = useState(false);
  const [whyText, setWhyText] = useState<string | null>(null);
  const [whyLoading, setWhyLoading] = useState(false);

  async function handleWhyToggle() {
    if (whyOpen) {
      setWhyOpen(false);
      return;
    }
    setWhyOpen(true);
    if (whyText) return;
    setWhyLoading(true);
    try {
      const res = await fetch("/api/why", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          domain,
          currentNode: node.text,
          parentPath: pathTexts,
        }),
      });
      const data = await res.json();
      setWhyText(data.explanation ?? "No explanation available.");
    } catch {
      setWhyText("Could not load explanation.");
    } finally {
      setWhyLoading(false);
    }
  }

  const isConclusion = node.type === "conclusion";

  return (
    <div className="w-full max-w-2xl mx-auto">
      {/* Progress */}
      <div className="flex items-center justify-between mb-4">
        <button
          onClick={onBack}
          disabled={!canGoBack}
          className="flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          Back
        </button>
        <span className="text-xs text-muted-foreground">
          Step {stepNumber} of ~{totalSteps}
        </span>
      </div>

      <Card className="shadow-md border-border/60">
        <CardHeader className="pb-3">
          <div className="flex items-start justify-between gap-3">
            <Badge
              variant="outline"
              className={`text-xs capitalize ${NODE_TYPE_COLORS[node.type]}`}
            >
              {node.type}
            </Badge>
            {!isConclusion && (
              <button
                onClick={handleWhyToggle}
                className="flex items-center gap-1 text-xs text-muted-foreground hover:text-foreground transition-colors shrink-0"
              >
                <HelpCircle className="w-3.5 h-3.5" />
                Why this step?
                {whyOpen ? (
                  <ChevronDown className="w-3 h-3" />
                ) : (
                  <ChevronRight className="w-3 h-3" />
                )}
              </button>
            )}
          </div>
        </CardHeader>

        <CardContent className="space-y-4">
          {isConclusion ? (
            <div className="space-y-3">
              <p className="text-xs font-semibold uppercase tracking-wide text-green-600">
                Likely cause identified
              </p>
              <p className="text-base leading-relaxed">{node.text}</p>
            </div>
          ) : (
            <p className="text-lg font-medium leading-snug">{node.text}</p>
          )}

          {whyOpen && (
            <div className="rounded-lg bg-muted/60 p-3 text-sm text-muted-foreground leading-relaxed">
              {whyLoading ? (
                <span className="animate-pulse">Loading explanation...</span>
              ) : (
                whyText
              )}
            </div>
          )}
        </CardContent>

        <CardFooter className="flex flex-col gap-2 pt-2">
          {isConclusion ? (
            <div className="w-full flex flex-col gap-2">
              <Button className="w-full" onClick={onStartOver}>
                Diagnosed — Start Over
              </Button>
              <Button
                variant="outline"
                className="w-full"
                onClick={() => onGoDeeper(pathTexts)}
              >
                Still stuck — go deeper
              </Button>
            </div>
          ) : (
            <div className="w-full flex flex-col gap-2">
              {node.children.map((branch) => (
                <Button
                  key={branch.label}
                  variant="outline"
                  className="w-full justify-start text-left h-auto py-3"
                  onClick={() => onAnswer(branch)}
                >
                  {branch.label}
                </Button>
              ))}
            </div>
          )}
        </CardFooter>
      </Card>
    </div>
  );
}
