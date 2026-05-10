import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { generateJSON } from "@/lib/gemini";
import { STRUCTURE_PROMPT } from "@/lib/prompts";
import type { TreeNode } from "@/lib/types";

const RequestSchema = z.object({
  domain: z.enum(["diesel", "inspection"]),
  text: z.string().min(10),
});

function ensureUniqueIds(node: TreeNode, counter = { n: 0 }): TreeNode {
  counter.n += 1;
  return {
    ...node,
    id: `n${counter.n}`,
    children: node.children.map((b) => ({
      ...b,
      node: ensureUniqueIds(b.node, counter),
    })),
  };
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { domain, text } = RequestSchema.parse(body);
    const prompt = STRUCTURE_PROMPT(domain, text);

    const result = await generateJSON<{ title: string; tree: TreeNode }>(prompt);

    const tree = ensureUniqueIds(result.tree);
    return NextResponse.json({ title: result.title, tree });
  } catch (err) {
    console.error("/api/structure error:", err);
    return NextResponse.json(
      { error: "Failed to structure reasoning. Please try again." },
      { status: 500 }
    );
  }
}
