import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { generateText } from "@/lib/gemini";
import { WHY_PROMPT } from "@/lib/prompts";

const RequestSchema = z.object({
  domain: z.enum(["diesel", "inspection"]),
  currentNode: z.string(),
  parentPath: z.array(z.string()),
});

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { domain, currentNode, parentPath } = RequestSchema.parse(body);
    const prompt = WHY_PROMPT(domain, currentNode, parentPath);
    const explanation = await generateText(prompt);
    return NextResponse.json({ explanation });
  } catch (err) {
    console.error("/api/why error:", err);
    return NextResponse.json(
      { error: "Could not generate explanation." },
      { status: 500 }
    );
  }
}
