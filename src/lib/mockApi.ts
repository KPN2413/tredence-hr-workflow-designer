import type { AutomationAction, SimulationResult, WorkflowGraph } from "@/types/workflow";

export async function getAutomations(): Promise<AutomationAction[]> {
  const response = await fetch("/api/automations", { method: "GET" });
  if (!response.ok) throw new Error("Failed to load automation actions.");
  const payload = (await response.json()) as { data: AutomationAction[] };
  return payload.data;
}

export async function simulateWorkflow(workflow: WorkflowGraph): Promise<SimulationResult> {
  const response = await fetch("/api/simulate", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(workflow)
  });

  const payload = (await response.json()) as SimulationResult;
  if (!response.ok && !payload.errors?.length) {
    throw new Error("Workflow simulation failed.");
  }

  return payload;
}
