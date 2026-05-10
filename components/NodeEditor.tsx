"use client";

import { useState, useEffect } from "react";
import { Plus, Trash2, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import type { TreeNode, NodeType } from "@/lib/types";

const TYPE_OPTIONS: { value: NodeType; label: string }[] = [
  { value: "question", label: "Question" },
  { value: "check", label: "Check" },
  { value: "conclusion", label: "Conclusion" },
];

interface Props {
  node: TreeNode;
  onUpdate: (patch: Partial<TreeNode>) => void;
  onDelete: () => void;
  onAddChild: (label: string) => void;
  onClose: () => void;
  isRoot: boolean;
}

export function NodeEditor({ node, onUpdate, onDelete, onAddChild, onClose, isRoot }: Props) {
  const [text, setText] = useState(node.text);
  const [newLabel, setNewLabel] = useState("");

  useEffect(() => {
    setText(node.text);
  }, [node.id, node.text]);

  function handleTextBlur() {
    if (text !== node.text) onUpdate({ text });
  }

  function handleAddChild() {
    const label = newLabel.trim() || "Yes";
    onAddChild(label);
    setNewLabel("");
  }

  return (
    <Card className="h-full rounded-none border-l border-t-0 border-b-0 border-r-0 overflow-auto">
      <CardHeader className="pb-3 border-b">
        <div className="flex items-center justify-between">
          <CardTitle className="text-sm font-semibold">Edit Node</CardTitle>
          <button onClick={onClose} className="text-muted-foreground hover:text-foreground">
            <X className="w-4 h-4" />
          </button>
        </div>
      </CardHeader>

      <CardContent className="space-y-4 pt-4">
        {/* Type selector */}
        <div>
          <label className="text-xs font-medium text-muted-foreground block mb-1.5">
            Node type
          </label>
          <div className="flex gap-1.5">
            {TYPE_OPTIONS.map((opt) => (
              <button
                key={opt.value}
                onClick={() => onUpdate({ type: opt.value, children: opt.value === "conclusion" ? [] : node.children })}
                className={`px-2.5 py-1 rounded text-xs font-medium border transition-all ${
                  node.type === opt.value
                    ? "bg-primary text-primary-foreground border-primary"
                    : "border-border hover:border-primary/50"
                }`}
              >
                {opt.label}
              </button>
            ))}
          </div>
        </div>

        {/* Text editor */}
        <div>
          <label className="text-xs font-medium text-muted-foreground block mb-1.5">
            Text
          </label>
          <Textarea
            value={text}
            onChange={(e) => setText(e.target.value)}
            onBlur={handleTextBlur}
            rows={4}
            className="text-sm resize-none"
          />
        </div>

        {/* Children */}
        {node.type !== "conclusion" && (
          <div>
            <label className="text-xs font-medium text-muted-foreground block mb-1.5">
              Branches
            </label>
            <div className="space-y-1.5 mb-2">
              {node.children.map((b) => (
                <div key={b.node.id} className="flex items-center gap-1.5">
                  <Badge variant="outline" className="text-xs">
                    {b.label}
                  </Badge>
                  <span className="text-xs text-muted-foreground truncate flex-1">
                    → {b.node.text.slice(0, 40)}…
                  </span>
                </div>
              ))}
            </div>
            <div className="flex gap-1.5">
              <input
                type="text"
                value={newLabel}
                onChange={(e) => setNewLabel(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleAddChild()}
                placeholder="Branch label (e.g. Yes)"
                className="flex-1 text-sm border border-border rounded px-2.5 py-1.5 focus:outline-none focus:ring-1 focus:ring-ring bg-background"
              />
              <Button size="sm" variant="outline" onClick={handleAddChild}>
                <Plus className="w-3.5 h-3.5" />
              </Button>
            </div>
          </div>
        )}

        {/* Delete */}
        {!isRoot && (
          <div className="pt-2 border-t">
            <Button
              variant="destructive"
              size="sm"
              className="w-full"
              onClick={onDelete}
            >
              <Trash2 className="w-3.5 h-3.5 mr-1.5" />
              Delete node
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
