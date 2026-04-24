import type { WorkflowEdge, WorkflowGraph, WorkflowNode, ValidationResult } from "@/types/workflow";

function getIncoming(edges: WorkflowEdge[], nodeId: string) {
  return edges.filter((edge) => edge.target === nodeId);
}

function getOutgoing(edges: WorkflowEdge[], nodeId: string) {
  return edges.filter((edge) => edge.source === nodeId);
}

function detectCycle(nodes: WorkflowNode[], edges: WorkflowEdge[]): boolean {
  const adjacency = new Map<string, string[]>();
  nodes.forEach((node) => adjacency.set(node.id, []));
  edges.forEach((edge) => adjacency.get(edge.source)?.push(edge.target));

  const visiting = new Set<string>();
  const visited = new Set<string>();

  const visit = (nodeId: string): boolean => {
    if (visiting.has(nodeId)) return true;
    if (visited.has(nodeId)) return false;

    visiting.add(nodeId);
    for (const next of adjacency.get(nodeId) ?? []) {
      if (visit(next)) return true;
    }
    visiting.delete(nodeId);
    visited.add(nodeId);
    return false;
  };

  return nodes.some((node) => visit(node.id));
}

function isReachableFromStart(startId: string, nodeId: string, edges: WorkflowEdge[]) {
  const queue = [startId];
  const seen = new Set<string>();

  while (queue.length) {
    const current = queue.shift()!;
    if (current === nodeId) return true;
    if (seen.has(current)) continue;
    seen.add(current);

    edges
      .filter((edge) => edge.source === current)
      .forEach((edge) => queue.push(edge.target));
  }

  return false;
}

export function validateWorkflow(graph: WorkflowGraph): ValidationResult {
  const { nodes, edges } = graph;
  const graphErrors: string[] = [];
  const nodeErrors: Record<string, string[]> = {};
  const addNodeError = (nodeId: string, message: string) => {
    nodeErrors[nodeId] = [...(nodeErrors[nodeId] ?? []), message];
  };

  if (nodes.length === 0) graphErrors.push("Workflow must contain at least one node.");

  const startNodes = nodes.filter((node) => node.data.kind === "start");
  const endNodes = nodes.filter((node) => node.data.kind === "end");

  if (startNodes.length !== 1) graphErrors.push("Workflow must have exactly one Start node.");
  if (endNodes.length < 1) graphErrors.push("Workflow must have at least one End node.");

  if (detectCycle(nodes, edges)) graphErrors.push("Workflow has a cycle. Remove cyclic connections before simulation.");

  nodes.forEach((node) => {
    const incoming = getIncoming(edges, node.id);
    const outgoing = getOutgoing(edges, node.id);

    if (node.data.kind === "start" && incoming.length > 0) {
      addNodeError(node.id, "Start node cannot have incoming connections.");
    }

    if (node.data.kind !== "start" && incoming.length === 0) {
      addNodeError(node.id, "Node is missing an incoming connection.");
    }

    if (node.data.kind !== "end" && outgoing.length === 0) {
      addNodeError(node.id, "Node is missing an outgoing connection.");
    }

    if (node.data.kind === "end" && outgoing.length > 0) {
      addNodeError(node.id, "End node cannot have outgoing connections.");
    }

    if (startNodes[0] && node.data.kind !== "start" && !isReachableFromStart(startNodes[0].id, node.id, edges)) {
      addNodeError(node.id, "Node is not reachable from Start.");
    }

    if (node.data.kind === "task") {
      const config = node.data.config;
      if ("title" in config && !config.title.trim()) addNodeError(node.id, "Task title is required.");
      if ("assignee" in config && !config.assignee.trim()) addNodeError(node.id, "Task assignee is required.");
    }

    if (node.data.kind === "approval") {
      const config = node.data.config;
      if ("autoApproveThreshold" in config && (config.autoApproveThreshold < 0 || config.autoApproveThreshold > 100)) {
        addNodeError(node.id, "Auto-approve threshold must be between 0 and 100.");
      }
    }

    if (node.data.kind === "automated") {
      const config = node.data.config;
      if ("actionId" in config && !config.actionId) addNodeError(node.id, "Automation action is required.");
    }
  });

  return { graphErrors, nodeErrors };
}

export function hasValidationErrors(result: ValidationResult) {
  return result.graphErrors.length > 0 || Object.values(result.nodeErrors).some((errors) => errors.length > 0);
}
