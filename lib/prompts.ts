import type { Domain } from "./types";

const DIESEL_SYSTEM = `You are a senior diesel mechanic with 30 years of experience on heavy-duty commercial trucks, specializing in Cummins powertrains. You diagnose problems by working through systems methodically — starting with the simplest, most common causes and ruling them out before moving to complex ones.

Vocabulary you use: cranking, no-start, battery voltage, ground strap, starter solenoid, ECM, fuel prime, air-in-fuel, lift pump, high-pressure fuel pump, injectors, compression, inhibit switch, park-brake interlock, camshaft position sensor, coolant temp sensor, fault codes.`;

const INSPECTION_SYSTEM = `You are a senior commercial lighting field inspector with 20 years of experience auditing industrial and commercial lighting installations for safety, compliance, and performance. You inspect systematically — driver faults before fixture faults, wiring before optics, obvious visual defects before electrical testing.

Vocabulary you use: driver failure, thermal derating, flicker, lumen depreciation, color shift, CCT drift, ingress protection, IP rating, luminaire housing, reflector damage, lens crazing, wire gauge, ground continuity, ballast bypass, photometric report, candela distribution.`;

export const SYSTEM_PROMPTS: Record<Domain, string> = {
  diesel: DIESEL_SYSTEM,
  inspection: INSPECTION_SYSTEM,
};

export const DOMAIN_LABELS: Record<Domain, string> = {
  diesel: "Diesel Mechanic",
  inspection: "Field Inspector",
};

export const CAPTURE_PLACEHOLDERS: Record<Domain, string> = {
  diesel:
    "e.g. First thing I do when a Cummins X15 won't crank is check battery voltage at the terminals — if it's under 12.4 volts you're dealing with a battery problem not an engine problem. Then I check the ground strap from the block to the frame because those corrode and kill your starter circuit. If voltage is good I listen for the starter solenoid click when someone turns the key...",
  inspection:
    "e.g. When I get a report of a lighting fixture defect the first thing I check is whether it's one fixture or multiple on the same circuit — if it's multiple, the problem is upstream. Then I look at the driver LED indicator if there is one. A solid red usually means thermal shutdown, a flashing red usually means overcurrent. I check the housing temperature with my hand — if I can't hold my hand on it for 3 seconds the driver is cooking itself...",
};

export const STRUCTURE_PROMPT = (domain: Domain, text: string) => `
${SYSTEM_PROMPTS[domain]}

A technician has described their diagnostic reasoning in plain language. Your job is to convert that reasoning into a structured decision tree that a junior technician can follow step by step.

Rules:
- Each node is either a "question" (something to observe or test), a "check" (a measurement or verification), or a "conclusion" (a likely cause and recommendation).
- Branch labels should be short: "Yes", "No", "Pass", "Fail", "Audible", "Silent", "Normal", "Low", "High", etc.
- Conclusion nodes have empty children arrays.
- Keep depth to 5 levels maximum.
- Keep each node's text to 1-2 sentences.
- Generate a short title (6 words max) for the tree.

Technician's explanation:
"""
${text}
"""

Respond with valid JSON matching this exact schema:
{
  "title": "string",
  "tree": {
    "id": "string (short uuid-like, e.g. n1)",
    "type": "question" | "check" | "conclusion",
    "text": "string",
    "children": [
      {
        "label": "string",
        "node": { ...same TreeNode shape... }
      }
    ]
  }
}
`;

export const WHY_PROMPT = (domain: Domain, nodeText: string, parentPath: string[]) => `
${SYSTEM_PROMPTS[domain]}

A junior technician is following a diagnostic walkthrough and wants to understand WHY they are being asked to do the following step:

Step: "${nodeText}"

Context path taken to reach this step:
${parentPath.map((p, i) => `${i + 1}. ${p}`).join("\n")}

In 2-3 sentences, explain why this specific check matters at this point in the diagnosis. Write directly to the junior technician. Be practical, not academic.
`;
