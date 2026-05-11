import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { generateJSON } from "@/lib/llm";

const RequestSchema = z.object({
  description: z.string().min(5),
});

const BOM_PROMPT = (description: string) => `
You are a senior industrial equipment specialist with deep knowledge of heavy industry components, commercial lighting systems, HVAC, and mechanical systems.

A technician or engineer has described a piece of equipment. Your job is to generate a structured Bill of Materials (BOM) — a list of all the key components, assemblies, and consumables that make up this equipment.

Rules:
- List 6 to 14 items. More for complex equipment, fewer for simple.
- Each item has: component name, category, typical part number format (if applicable), quantity, and a short note about its role or common failure mode.
- Categories: Electrical, Mechanical, Structural, Consumable, Control, Optical, Fluid, Safety
- Be specific and domain-accurate. Use real industry terminology.
- Generate a short title for the equipment (4-6 words max).

Equipment description:
"""
${description}
"""

Respond with valid JSON in this exact shape:
{
  "title": "string",
  "equipment": "string (one line summary of what this is)",
  "items": [
    {
      "component": "string",
      "category": "string",
      "partNumber": "string (typical format, e.g. HLG-100H-24A or leave empty string if not applicable)",
      "quantity": "string (e.g. '1', '4', 'As required')",
      "notes": "string (role or common failure mode, 1 sentence)"
    }
  ]
}
`;

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { description } = RequestSchema.parse(body);
    const result = await generateJSON<{
      title: string;
      equipment: string;
      items: {
        component: string;
        category: string;
        partNumber: string;
        quantity: string;
        notes: string;
      }[];
    }>(BOM_PROMPT(description));
    return NextResponse.json(result);
  } catch (err) {
    console.error("/api/bom error:", err);
    return NextResponse.json({ error: "Failed to generate BOM." }, { status: 500 });
  }
}
