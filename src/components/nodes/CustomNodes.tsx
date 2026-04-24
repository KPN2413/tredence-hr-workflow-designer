"use client";

import type { NodeProps } from "@xyflow/react";
import { BaseNode } from "@/components/nodes/BaseNode";
import type {
  ApprovalConfig,
  AutomatedConfig,
  EndConfig,
  StartConfig,
  TaskConfig,
  WorkflowNode,
  WorkflowNodeData
} from "@/types/workflow";

function subtitleFor(data: WorkflowNodeData) {
  const config = data.config;

  switch (data.kind) {
    case "start":
      return `${(config as StartConfig).metadata.length} metadata fields`;
    case "task": {
      const task = config as TaskConfig;
      return `${task.assignee || "Unassigned"} · ${task.description || "No description"}`;
    }
    case "approval": {
      const approval = config as ApprovalConfig;
      return `${approval.approverRole} · threshold ${approval.autoApproveThreshold}`;
    }
    case "automated": {
      const automated = config as AutomatedConfig;
      return `${automated.actionId || "No action"} · ${Object.keys(automated.params).length} params`;
    }
    case "end": {
      const end = config as EndConfig;
      return end.showSummary ? "Summary enabled" : "Summary disabled";
    }
  }
}

function titleFor(data: WorkflowNodeData) {
  const config = data.config;
  if (data.kind === "end" && "message" in config) return config.message;
  if ("title" in config) return config.title;
  return data.label;
}

export function StartNode(props: NodeProps<WorkflowNode>) {
  return <BaseNode kind="start" title={titleFor(props.data)} subtitle={subtitleFor(props.data)} selected={props.selected} hasErrors={Boolean(props.data.validationErrors?.length)} />;
}

export function TaskNode(props: NodeProps<WorkflowNode>) {
  return <BaseNode kind="task" title={titleFor(props.data)} subtitle={subtitleFor(props.data)} selected={props.selected} hasErrors={Boolean(props.data.validationErrors?.length)} />;
}

export function ApprovalNode(props: NodeProps<WorkflowNode>) {
  return <BaseNode kind="approval" title={titleFor(props.data)} subtitle={subtitleFor(props.data)} selected={props.selected} hasErrors={Boolean(props.data.validationErrors?.length)} />;
}

export function AutomatedNode(props: NodeProps<WorkflowNode>) {
  return <BaseNode kind="automated" title={titleFor(props.data)} subtitle={subtitleFor(props.data)} selected={props.selected} hasErrors={Boolean(props.data.validationErrors?.length)} />;
}

export function EndNode(props: NodeProps<WorkflowNode>) {
  return <BaseNode kind="end" title={titleFor(props.data)} subtitle={subtitleFor(props.data)} selected={props.selected} hasErrors={Boolean(props.data.validationErrors?.length)} />;
}
