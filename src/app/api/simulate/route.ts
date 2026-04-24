import { NextRequest, NextResponse } from "next/server";
import { simulateWorkflowGraph } from "@/lib/simulator";
import type { WorkflowGraph } from "@/types/workflow";

export async function POST(request: NextRequest) {
  try {
    const body = (await request.json()) as WorkflowGraph;
    const result = await simulateWorkflowGraph(body);
    return NextResponse.json(result, { status: result.ok ? 200 : 422 });
  } catch {
    return NextResponse.json(
      {
        ok: false,
        errors: ["Invalid workflow payload."],
        steps: [],
        serializedWorkflow: { nodes: [], edges: [] }
      },
      { status: 400 }
    );
  }
}
