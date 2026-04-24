import type {
  ApprovalConfig,
  AutomatedConfig,
  EndConfig,
  StartConfig,
  TaskConfig,
  WorkflowEdge,
  WorkflowNode,
  WorkflowNodeConfig,
  WorkflowNodeType
} from "@/types/workflow";

export const NODE_LABELS: Record<WorkflowNodeType, string> = {
  start: "Start Node",
  task: "Task Node",
  approval: "Approval Node",
  automated: "Automated Step",
  end: "End Node"
};

export const NODE_DESCRIPTIONS: Record<WorkflowNodeType, string> = {
  start: "Workflow entry point",
  task: "Human task step",
  approval: "Manager or HR approval",
  automated: "System-triggered action",
  end: "Workflow completion"
};

export function createDefaultConfig(type: WorkflowNodeType): WorkflowNodeConfig {
  switch (type) {
    case "start":
      return { title: "New HR Workflow", metadata: [] } satisfies StartConfig;
    case "task":
      return {
        title: "Collect Documents",
        description: "Ask employee to upload required onboarding documents.",
        assignee: "HR Executive",
        dueDate: "",
        customFields: []
      } satisfies TaskConfig;
    case "approval":
      return {
        title: "Manager Approval",
        approverRole: "Manager",
        autoApproveThreshold: 80
      } satisfies ApprovalConfig;
    case "automated":
      return {
        title: "Send Notification",
        actionId: "send_email",
        params: { to: "employee@company.com", subject: "Onboarding update" }
      } satisfies AutomatedConfig;
    case "end":
      return { message: "Workflow completed successfully", showSummary: true } satisfies EndConfig;
  }
}

export function titleFromConfig(type: WorkflowNodeType, config: WorkflowNodeConfig): string {
  if (type === "end") return (config as EndConfig).message || NODE_LABELS[type];
  return "title" in config && config.title ? config.title : NODE_LABELS[type];
}

export function createWorkflowNode(
  type: WorkflowNodeType,
  position: { x: number; y: number },
  id = `${type}-${crypto.randomUUID()}`
): WorkflowNode {
  const config = createDefaultConfig(type);
  return {
    id,
    type,
    position,
    data: {
      kind: type,
      label: titleFromConfig(type, config),
      config
    }
  };
}

export const initialNodes: WorkflowNode[] = [
  createWorkflowNode("start", { x: 80, y: 120 }, "start-1"),
  createWorkflowNode("task", { x: 360, y: 120 }, "task-1"),
  createWorkflowNode("approval", { x: 660, y: 120 }, "approval-1"),
  createWorkflowNode("automated", { x: 960, y: 120 }, "automated-1"),
  createWorkflowNode("end", { x: 1250, y: 120 }, "end-1")
];

export const initialEdges: WorkflowEdge[] = [
  { id: "start-1-task-1", source: "start-1", target: "task-1", type: "smoothstep", animated: true },
  { id: "task-1-approval-1", source: "task-1", target: "approval-1", type: "smoothstep", animated: true },
  { id: "approval-1-automated-1", source: "approval-1", target: "automated-1", type: "smoothstep", animated: true },
  { id: "automated-1-end-1", source: "automated-1", target: "end-1", type: "smoothstep", animated: true }
];
