"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft, Clock, Play } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { getTreesByDomain } from "@/lib/storage";
import { countNodes } from "@/lib/tree";
import type { SavedTree } from "@/lib/types";

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

export function ApprenticeContent() {
  const router = useRouter();
  const [trees, setTrees] = useState<SavedTree[]>([]);

  useEffect(() => {
    setTrees(getTreesByDomain("inspection"));
  }, []);

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
          <div className="w-6 h-6 rounded-md bg-indigo-500/20 border border-indigo-500/40 flex items-center justify-center">
            <div className="w-2 h-2 rounded-sm bg-indigo-400" />
          </div>
          <span className="text-sm font-semibold tracking-tight text-muted-foreground">
            Mentor <span className="text-border mx-1">·</span> Run a Playbook
          </span>
        </div>
      </header>

      <main className="flex-1 px-6 py-10 max-w-2xl mx-auto w-full">
        <div className="space-y-6">
          <div>
            <h2 className="text-2xl font-bold tracking-tight">Choose a playbook</h2>
            <p className="text-sm text-muted-foreground mt-1">
              {trees.length} playbook{trees.length !== 1 ? "s" : ""} available
            </p>
          </div>

          <div className="space-y-3">
            {trees.map((tree) => {
              const nodeCount = countNodes(tree.root);
              const isSeed =
                tree.id === "seed-diesel-1" || tree.id === "seed-inspection-1";
              return (
                <Card
                  key={tree.id}
                  className="hover:border-primary/40 hover:bg-primary/5 transition-all cursor-pointer border-border/60"
                  onClick={() => router.push(`/apprentice/walk/${tree.id}?domain=inspection`)}
                >
                  <CardContent className="flex items-center justify-between py-4">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <span className="font-medium text-sm">{tree.title}</span>
                        {isSeed && (
                          <Badge variant="secondary" className="text-xs bg-primary/10 text-primary border-primary/20">
                            Sample
                          </Badge>
                        )}
                      </div>
                      <div className="flex items-center gap-3 text-xs text-muted-foreground">
                        <span className="flex items-center gap-1">
                          <Clock className="w-3 h-3" />
                          {formatDate(tree.createdAt)}
                        </span>
                        <span>{nodeCount} steps</span>
                      </div>
                    </div>
                    <Button size="sm" variant="outline" className="border-border/60 hover:border-primary/60 hover:text-primary">
                      <Play className="w-3.5 h-3.5 mr-1.5" />
                      Start
                    </Button>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>
      </main>
    </div>
  );
}
