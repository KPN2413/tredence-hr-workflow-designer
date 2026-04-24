"use client";

import type { WorkflowGraph } from "@/types/workflow";

export function exportWorkflowJson(workflow: WorkflowGraph) {
  const blob = new Blob([JSON.stringify(workflow, null, 2)], { type: "application/json" });
  const url = URL.createObjectURL(blob);
  const anchor = document.createElement("a");
  anchor.href = url;
  anchor.download = "hr-workflow.json";
  anchor.click();
  URL.revokeObjectURL(url);
}

export function readWorkflowJson(file: File): Promise<WorkflowGraph> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => {
      try {
        resolve(JSON.parse(String(reader.result)) as WorkflowGraph);
      } catch {
        reject(new Error("Invalid workflow JSON file."));
      }
    };
    reader.onerror = () => reject(new Error("Unable to read workflow JSON file."));
    reader.readAsText(file);
  });
}
