"use client";

import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { ArrowLeft, Clock, Play } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { DomainSelector } from "@/components/DomainSelector";
import { getTreesByDomain } from "@/lib/storage";
import { countNodes } from "@/lib/tree";
import { DOMAIN_LABELS } from "@/lib/prompts";
import type { Domain, SavedTree } from "@/lib/types";

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

export function ApprenticeContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const domain = (searchParams.get("domain") as Domain) ?? "diesel";
  const [trees, setTrees] = useState<SavedTree[]>([]);

  useEffect(() => {
    setTrees(getTreesByDomain(domain));
  }, [domain]);

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
            <p className="text-xs text-muted-foreground">Apprentice Mode</p>
          </div>
        </div>
        <DomainSelector value={domain} />
      </header>

      <main className="flex-1 px-6 py-10 max-w-2xl mx-auto w-full">
        <div className="space-y-6">
          <div>
            <h2 className="text-2xl font-bold tracking-tight">Choose a tree to walk</h2>
            <p className="text-sm text-muted-foreground mt-1">
              {DOMAIN_LABELS[domain]} · {trees.length} diagnostic tree{trees.length !== 1 ? "s" : ""} available
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
                  className="hover:border-primary/50 hover:shadow-sm transition-all cursor-pointer"
                  onClick={() =>
                    router.push(`/apprentice/walk/${tree.id}?domain=${domain}`)
                  }
                >
                  <CardContent className="flex items-center justify-between py-4">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <span className="font-medium text-sm">{tree.title}</span>
                        {isSeed && (
                          <Badge variant="secondary" className="text-xs">
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
                    <Button size="sm" variant="outline">
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
