"use client";

import { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import { ArrowLeft, Save, Play } from "lucide-react";
import { Button } from "@/components/ui/button";
import { TreeCanvas } from "@/components/TreeCanvas";
import { NodeEditor } from "@/components/NodeEditor";
import { getTree, saveTree } from "@/lib/storage";
import { updateNode, deleteNode, addChild, findNode } from "@/lib/tree";
import type { SavedTree, TreeNode, Branch } from "@/lib/types";

export function TreeEditorContent() {
  const router = useRouter();
  const params = useParams();
  const id = params.id as string;

  const [tree, setTree] = useState<SavedTree | null>(null);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [saved, setSaved] = useState(true);

  useEffect(() => {
    const t = getTree(id);
    if (!t) {
      router.push("/apprentice");
      return;
    }
    setTree(t);
  }, [id, router]);

  if (!tree) {
    return (
      <div className="flex items-center justify-center min-h-screen text-muted-foreground">
        Loading…
      </div>
    );
  }

  const selectedNode = selectedId ? findNode(tree.root, selectedId) : null;

  function mutateRoot(newRoot: TreeNode) {
    setTree((prev) => prev ? { ...prev, root: newRoot } : prev);
    setSaved(false);
  }

  function handleSave() {
    if (!tree) return;
    saveTree(tree);
    setSaved(true);
  }

  function handleUpdate(patch: Partial<TreeNode>) {
    if (!selectedId || !tree) return;
    mutateRoot(updateNode(tree.root, selectedId, patch));
  }

  function handleDelete() {
    if (!selectedId || !tree) return;
    mutateRoot(deleteNode(tree.root, selectedId));
    setSelectedId(null);
  }

  function handleAddChild(label: string) {
    if (!selectedId || !tree) return;
    const newChild: TreeNode = {
      id: `n-${Date.now()}`,
      type: "question",
      text: "New step — click to edit",
      children: [],
    };
    const branch: Branch = { label, node: newChild };
    mutateRoot(addChild(tree.root, selectedId, branch));
    setSelectedId(newChild.id);
  }

  return (
    <div className="flex flex-col h-screen">
      <header className="border-b border-border/40 px-8 py-4 flex items-center justify-between shrink-0 z-10 bg-background">
        <div className="flex items-center gap-4">
          <button
            onClick={() => router.push("/capture")}
            className="text-muted-foreground hover:text-foreground transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
          </button>
          <div className="flex items-center gap-3">
            <div className="w-6 h-6 rounded-md bg-primary/20 border border-primary/40 flex items-center justify-center">
              <div className="w-2 h-2 rounded-sm bg-primary" />
            </div>
            <span className="text-sm font-semibold">{tree.title}</span>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={handleSave}
            className="border-border/60 text-muted-foreground hover:text-foreground"
          >
            <Save className="w-3.5 h-3.5 mr-1.5" />
            {saved ? "Saved" : "Save"}
          </Button>
          <Button
            size="sm"
            onClick={() => {
              if (!saved) handleSave();
              router.push(`/apprentice/walk/${tree.id}`);
            }}
          >
            <Play className="w-3.5 h-3.5 mr-1.5" />
            Preview
          </Button>
        </div>
      </header>

      <div className="flex flex-1 overflow-hidden">
        <div className="flex-1 overflow-hidden">
          <TreeCanvas
            root={tree.root}
            selectedId={selectedId ?? undefined}
            onSelectNode={setSelectedId}
          />
        </div>

        {selectedNode && (
          <div className="w-72 shrink-0 overflow-auto border-l border-border/40">
            <NodeEditor
              node={selectedNode}
              onUpdate={handleUpdate}
              onDelete={handleDelete}
              onAddChild={handleAddChild}
              onClose={() => setSelectedId(null)}
              isRoot={selectedId === tree.root.id}
            />
          </div>
        )}
      </div>

      {!selectedNode && (
        <div className="absolute bottom-6 left-1/2 -translate-x-1/2 bg-background/90 backdrop-blur-sm border border-border/60 rounded-full px-4 py-2 text-xs text-muted-foreground shadow-sm pointer-events-none">
          Click any node to edit it
        </div>
      )}
    </div>
  );
}
