import { ApprovalNode, AutomatedNode, EndNode, StartNode, TaskNode } from "@/components/nodes/CustomNodes";

export const nodeTypes = {
  start: StartNode,
  task: TaskNode,
  approval: ApprovalNode,
  automated: AutomatedNode,
  end: EndNode
};
