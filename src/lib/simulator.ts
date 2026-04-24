import { automationActions } from "@/lib/mockData";
import { hasValidationErrors, validateWorkflow } from "@/lib/validation";
import type { AutomatedConfig, SimulationResult, WorkflowGraph, WorkflowNode } from "@/types/workflow";

function nodeTitle(node: WorkflowNode) {
  const config = node.data.config;
  if (node.data.kind === "end" && "message" in config) return config.message;
  if ("title" in config) return config.title;
  return node.data.label;
}

function linearizeFromStart(graph: WorkflowGraph): WorkflowNode[] {
  const start = graph.nodes.find((node) => node.data.kind === "start");
  if (!start) return [];

  const byId = new Map(graph.nodes.map((node) => [node.id, node]));
  const ordered: WorkflowNode[] = [];
  const seen = new Set<string>();
  const queue = [start.id];

  while (queue.length) {
    const currentId = queue.shift()!;
    if (seen.has(currentId)) continue;
    seen.add(currentId);

    const node = byId.get(currentId);
    if (node) ordered.push(node);

    graph.edges
      .filter((edge) => edge.source === currentId)
      .forEach((edge) => queue.push(edge.target));
  }

  return ordered;
}

export async function simulateWorkflowGraph(graph: WorkflowGraph): Promise<SimulationResult> {
  const validation = validateWorkflow(graph);

  if (hasValidationErrors(validation)) {
    return {
      ok: false,
      errors: [...validation.graphErrors, ...Object.values(validation.nodeErrors).flat()],
      steps: [],
      serializedWorkflow: graph
    };
  }

  const orderedNodes = linearizeFromStart(graph);
  const steps = orderedNodes.map((node, index) => {
    let message = `Step ${index + 1}: ${node.data.kind} executed.`;

    if (node.data.kind === "automated") {
      const config = node.data.config as AutomatedConfig;
      const action = automationActions.find((item) => item.id === config.actionId);
      message = `Automation executed: ${action?.label ?? config.actionId}.`;
    }

    if (node.data.kind === "approval") {
      message = "Approval check completed using configured approver role and threshold.";
    }

    return {
      nodeId: node.id,
      nodeType: node.data.kind,
      title: nodeTitle(node),
      status: "success" as const,
      message
    };
  });

  return {
    ok: true,
    errors: [],
    steps,
    serializedWorkflow: graph
  };
}
