import type { Edge, Node } from "@xyflow/react";

export type WorkflowNodeType = "start" | "task" | "approval" | "automated" | "end";

export type KeyValuePair = {
  id: string;
  key: string;
  value: string;
};

export type StartConfig = {
  title: string;
  metadata: KeyValuePair[];
};

export type TaskConfig = {
  title: string;
  description: string;
  assignee: string;
  dueDate: string;
  customFields: KeyValuePair[];
};

export type ApprovalConfig = {
  title: string;
  approverRole: string;
  autoApproveThreshold: number;
};

export type AutomatedConfig = {
  title: string;
  actionId: string;
  params: Record<string, string>;
};

export type EndConfig = {
  message: string;
  showSummary: boolean;
};

export type WorkflowNodeConfig =
  | StartConfig
  | TaskConfig
  | ApprovalConfig
  | AutomatedConfig
  | EndConfig;

export type WorkflowNodeData = {
  kind: WorkflowNodeType;
  label: string;
  config: WorkflowNodeConfig;
  validationErrors?: string[];
};

export type WorkflowNode = Node<WorkflowNodeData, WorkflowNodeType>;
export type WorkflowEdge = Edge;

export type WorkflowGraph = {
  nodes: WorkflowNode[];
  edges: WorkflowEdge[];
};

export type AutomationAction = {
  id: string;
  label: string;
  description: string;
  params: string[];
};

export type SimulationStep = {
  nodeId: string;
  nodeType: WorkflowNodeType;
  title: string;
  status: "success" | "warning" | "error";
  message: string;
};

export type SimulationResult = {
  ok: boolean;
  errors: string[];
  steps: SimulationStep[];
  serializedWorkflow: WorkflowGraph;
};

export type ValidationResult = {
  graphErrors: string[];
  nodeErrors: Record<string, string[]>;
};
